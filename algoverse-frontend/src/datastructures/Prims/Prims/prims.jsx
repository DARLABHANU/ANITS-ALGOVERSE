import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

const PrimsVisualizer = forwardRef(({
  isPlaying,
  playbackSpeed,
  onPlayingChange,
  onAnimationComplete,
  onStepChange,
  currentStep,
  userInput = '',
  userWeights = '',
  className = '',
}, ref) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [highlightedEdge, setHighlightedEdge] = useState(null);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Pseudo code integration state
  const [currentCodeLineIndex, setCurrentCodeLineIndex] = useState(-1);
  const [variables, setVariables] = useState({});
  const [currentAction, setCurrentAction] = useState('');

  // Animation control refs
  const visitedRef = useRef(new Set());
  const isRunningRef = useRef(false);
  const pauseRef = useRef(false);
  const animationStateRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  
  // Store initial graph state for reset functionality
  const initialGraphRef = useRef({ nodes: [], edges: [] });

  // Expose step data to global scope for PseudoCodePanel
  useEffect(() => {
    window.getCurrentStepData = () => ({
      step: {
        codeLineIndex: currentCodeLineIndex,
        action: currentAction,
      },
      variables: variables,
    });
  }, [currentCodeLineIndex, variables, currentAction]);

  const updatePseudoCodeState = (lineIndex, action, vars = {}) => {
    setCurrentCodeLineIndex(lineIndex);
    setCurrentAction(action);
    setVariables(prevVars => ({
      ...prevVars,
      ...vars,
    }));
  };

  const reset = () => {
    // Force stop any running animation immediately
    isRunningRef.current = false;
    pauseRef.current = true;
    
    // Clear any pending timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    // Clear all animation states immediately
    visitedRef.current = new Set();
    animationStateRef.current = null;
    
    // Reset all visual states immediately - no delays
    setHighlightedEdge(null);
    setSelectedEdges([]);
    setStepIndex(0);
    setCurrentCodeLineIndex(-1);
    setVariables({});
    setCurrentAction('');
    setIsPaused(false);
    
    // Notify parent components immediately
    if (onStepChange) onStepChange(0);
    if (onPlayingChange) onPlayingChange(false);
    
    // Reset to the initial graph state (don't generate new)
    pauseRef.current = false;
    restoreInitialGraph();
  };

  const pause = () => {
    pauseRef.current = true;
    setIsPaused(true);
    if (onPlayingChange) onPlayingChange(false);
  };

  const resume = () => {
    pauseRef.current = false;
    setIsPaused(false);
    // Don't call onPlayingChange here - let the parent handle it
    // The useEffect will detect the isPlaying change and call continueAnimation
  };

  useImperativeHandle(ref, () => ({
    reset,
    pause,
    resume,
  }));

  // Enhanced sleep function that respects pause state and can be interrupted
  const sleep = async (ms) => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const duration = ms / (playbackSpeed || 1); // Prevent division by zero
      
      const checkLoop = () => {
        if (!isRunningRef.current || pauseRef.current) {
          resolve(false); // Animation stopped or paused
          return;
        }
        
        if (Date.now() - startTime >= duration) {
          resolve(true); // Sleep completed normally
          return;
        }
        
        animationTimeoutRef.current = setTimeout(checkLoop, 50);
      };
      
      checkLoop();
    });
  };

  const generateRandomGraph = () => {
    const numNodes = Math.floor(Math.random() * 4) + 3;
    const minDistance = 220;
    const canvasWidth = 1000;
    const canvasHeight = 700;
    const padding = 100;
    const maxAttempts = 300;
    
    const genNodes = [];
    
    const getDistance = (x1, y1, x2, y2) => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };
    
    const isValidPosition = (x, y, existingNodes) => {
      if (x < padding || x > canvasWidth - padding || y < padding || y > canvasHeight - padding) {
        return false;
      }
      
      for (const node of existingNodes) {
        const distance = getDistance(x, y, node.x, node.y);
        if (distance < minDistance) {
          return false;
        }
      }
      
      const cornerBuffer = 200;
      if ((x < cornerBuffer && y < cornerBuffer) || 
          (x > canvasWidth - cornerBuffer && y < cornerBuffer) ||
          (x < cornerBuffer && y > canvasHeight - cornerBuffer) ||
          (x > canvasWidth - cornerBuffer && y > canvasHeight - cornerBuffer)) {
        for (const node of existingNodes) {
          if (getDistance(x, y, node.x, node.y) < minDistance * 1.5) {
            return false;
          }
        }
      }
      
      return true;
    };
    
    // Generate nodes with proper spacing
    for (let i = 0; i < numNodes; i++) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * (canvasWidth - 2 * padding)) + padding;
        const y = Math.floor(Math.random() * (canvasHeight - 2 * padding)) + padding;
        
        if (isValidPosition(x, y, genNodes)) {
          genNodes.push({
            id: i + 1,
            x: x,
            y: y,
          });
          placed = true;
        }
        attempts++;
      }
      
      if (!placed) {
        const gridSpacing = 280;
        const fallbackX = padding + (i % 3) * gridSpacing;
        const fallbackY = padding + Math.floor(i / 3) * gridSpacing;
        
        const adjustedX = Math.min(fallbackX, canvasWidth - padding);
        const adjustedY = Math.min(fallbackY, canvasHeight - padding);
        
        genNodes.push({
          id: i + 1,
          x: adjustedX,
          y: adjustedY,
        });
      }
    }

    // Parse user weights if provided
    const userWeightsList = userWeights ? userWeights.split(',').map(w => parseInt(w.trim(), 10)).filter(w => !isNaN(w)) : [];
    let weightIndex = 0;

    const genEdges = [];
    const usedWeights = new Set();
    
    const getNextWeight = () => {
      if (userWeightsList.length > 0 && weightIndex < userWeightsList.length) {
        return userWeightsList[weightIndex++];
      } else {
        let weight;
        let attempts = 0;
        do {
          weight = Math.floor(Math.random() * 25) + 1;
          attempts++;
        } while (usedWeights.has(weight) && attempts < 50);
        
        if (attempts >= 50) {
          weight = 1;
          while (usedWeights.has(weight)) {
            weight++;
          }
        }
        
        usedWeights.add(weight);
        return weight;
      }
    };
    
    const checkWeightLabelCollision = (edge1, edge2, nodes) => {
      const node1a = nodes.find(n => n.id === edge1.from);
      const node1b = nodes.find(n => n.id === edge1.to);
      const node2a = nodes.find(n => n.id === edge2.from);
      const node2b = nodes.find(n => n.id === edge2.to);
      
      const x1 = (node1a.x + node1b.x) / 2;
      const y1 = (node1a.y + node1b.y) / 2;
      const x2 = (node2a.x + node2b.x) / 2;
      const y2 = (node2a.y + node2b.y) / 2;
      
      const distance = getDistance(x1, y1, x2, y2);
      return distance < 60;
    };
    
    const getConnectionCount = (nodeId, edges) => {
      return edges.filter(edge => edge.from === nodeId || edge.to === nodeId).length;
    };
    
    const getConnectedComponents = (nodes, edges) => {
      const visited = new Set();
      const components = [];
      
      const dfs = (nodeId, component) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        component.push(nodeId);
        
        edges.forEach(edge => {
          if (edge.from === nodeId && !visited.has(edge.to)) {
            dfs(edge.to, component);
          } else if (edge.to === nodeId && !visited.has(edge.from)) {
            dfs(edge.from, component);
          }
        });
      };
      
      nodes.forEach(node => {
        if (!visited.has(node.id)) {
          const component = [];
          dfs(node.id, component);
          components.push(component);
        }
      });
      
      return components;
    };
    
    // Generate initial edges with higher probability
    const potentialEdges = [];
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        const distance = getDistance(genNodes[i].x, genNodes[i].y, genNodes[j].x, genNodes[j].y);
        potentialEdges.push({
          from: genNodes[i].id,
          to: genNodes[j].id,
          distance: distance,
          nodes: [genNodes[i], genNodes[j]]
        });
      }
    }
    
    // Shuffle potential edges
    for (let i = potentialEdges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [potentialEdges[i], potentialEdges[j]] = [potentialEdges[j], potentialEdges[i]];
    }
    
    // Add edges with higher probability (0.7 instead of 0.65)
    for (const potentialEdge of potentialEdges) {
      if (Math.random() < 0.7) {
        const newEdge = {
          from: potentialEdge.from,
          to: potentialEdge.to,
          weight: getNextWeight(),
        };
        
        let hasCollision = false;
        for (const existingEdge of genEdges) {
          if (checkWeightLabelCollision(newEdge, existingEdge, genNodes)) {
            hasCollision = true;
            break;
          }
        }
        
        if (!hasCollision) {
          genEdges.push(newEdge);
        }
      }
    }
    
    // Ensure each node has at least 2 connections (if possible)
    genNodes.forEach(node => {
      const connectionCount = getConnectionCount(node.id, genEdges);
      if (connectionCount < 2) {
        // Find nodes this node is not connected to
        const connectedNodes = new Set();
        genEdges.forEach(edge => {
          if (edge.from === node.id) connectedNodes.add(edge.to);
          if (edge.to === node.id) connectedNodes.add(edge.from);
        });
        
        const unconnectedNodes = genNodes.filter(n => 
          n.id !== node.id && !connectedNodes.has(n.id)
        );
        
        // Add connections to reach at least 2 connections
        const connectionsNeeded = Math.min(2 - connectionCount, unconnectedNodes.length);
        
        // Sort by distance to prefer closer nodes
        unconnectedNodes.sort((a, b) => {
          const distA = getDistance(node.x, node.y, a.x, a.y);
          const distB = getDistance(node.x, node.y, b.x, b.y);
          return distA - distB;
        });
        
        for (let i = 0; i < connectionsNeeded; i++) {
          const targetNode = unconnectedNodes[i];
          const newEdge = {
            from: node.id,
            to: targetNode.id,
            weight: getNextWeight(),
          };
          
          // Check for collision before adding
          let hasCollision = false;
          for (const existingEdge of genEdges) {
            if (checkWeightLabelCollision(newEdge, existingEdge, genNodes)) {
              hasCollision = true;
              break;
            }
          }
          
          if (!hasCollision) {
            genEdges.push(newEdge);
          }
        }
      }
    });
    
    // Ensure graph connectivity
    let components = getConnectedComponents(genNodes, genEdges);
    while (components.length > 1) {
      const sortedComponents = components.sort((a, b) => b.length - a.length);
      const largestComponent = sortedComponents[0];
      const smallestComponent = sortedComponents[sortedComponents.length - 1];
      
      const node1 = genNodes.find(n => n.id === largestComponent[0]);
      const node2 = genNodes.find(n => n.id === smallestComponent[0]);
      
      genEdges.push({
        from: node1.id,
        to: node2.id,
        weight: getNextWeight(),
      });
      
      components = getConnectedComponents(genNodes, genEdges);
    }

    setNodes(genNodes);
    setEdges(genEdges);
    
    // Store the initial graph state for reset functionality
    initialGraphRef.current = {
      nodes: [...genNodes],
      edges: [...genEdges]
    };
  };

  const parseUserInput = () => {
    try {
      const [nodePart, edgePart] = userInput.split('|');
      const parsedNodes = nodePart.split(';').map((n, i) => {
        const [x, y] = n.split(',').map(Number);
        return { id: i + 1, x, y };
      });

      const parsedEdges = edgePart.split(',').map(e => {
        const [fromTo, weight] = e.split('-');
        const [from, to] = fromTo.split('_').map(Number);
        return { from, to, weight: parseInt(weight, 10) };
      });

      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } catch (err) {
      console.warn('Invalid user input, generating random graph instead.');
      generateRandomGraph();
    }
  };

  const initializeGraph = () => {
    if (userInput) {
      parseUserInput();
    } else {
      generateRandomGraph();
    }
  };

  // Enhanced animation continuation function
  const continueAnimation = async () => {
    if (animationStateRef.current && !pauseRef.current) {
      await runPrims(animationStateRef.current);
    }
  };

  // Enhanced Prim's algorithm with pause/resume support
  const runPrims = async (resumeState = null) => {
    if (isRunningRef.current && !resumeState) return;
    
    isRunningRef.current = true;
    pauseRef.current = false;

    let visited, mstEdges, totalWeight, stepCount;
    
    if (resumeState) {
      // Resume from saved state
      visited = new Set(resumeState.visited);
      mstEdges = [...resumeState.mstEdges];
      totalWeight = resumeState.totalWeight;
      stepCount = resumeState.stepCount;
      setSelectedEdges([...resumeState.selectedEdges]);
      visitedRef.current = visited; // Update the ref too
    } else {
      // Start fresh
      visited = new Set();
      mstEdges = [];
      totalWeight = 0;
      stepCount = 0;
      visitedRef.current = visited;
      
      // Clear any existing highlights before starting
      setHighlightedEdge(null);
      setSelectedEdges([]);
      
      // Line 0: Function start
      updatePseudoCodeState(0, 'function_start', {});
      if (!(await sleep(500))) {
        isRunningRef.current = false;
        return;
      }

      // Line 1: Initialize visited set
      updatePseudoCodeState(1, 'init_visited', {
        'visited.size': visited.size,
        'MST.size': mstEdges.length
      });
      if (!(await sleep(500))) {
        isRunningRef.current = false;
        return;
      }

      // Line 2: Add start node
      if (nodes.length > 0) {
        visited.add(nodes[0]?.id);
        visitedRef.current = visited;
        updatePseudoCodeState(2, 'add_start_node', {
          'visited.size': visited.size,
          'start': nodes[0]?.id,
          'MST.size': mstEdges.length
        });
        if (onStepChange) onStepChange(1);
        setStepIndex(1);
        if (!(await sleep(500))) {
          isRunningRef.current = false;
          return;
        }
      }
    }

    while (visited.size < nodes.length && isRunningRef.current && !pauseRef.current) {
      // Save state before each major step
      animationStateRef.current = {
        visited: Array.from(visited),
        mstEdges: [...mstEdges],
        totalWeight,
        stepCount,
        selectedEdges: [...selectedEdges]
      };

      // Line 3: While condition check
      updatePseudoCodeState(3, 'while_condition', {
        'visited.size': visited.size,
        'g.nodes': nodes.length,
        'MST.size': mstEdges.length
      });
      if (!(await sleep(500))) {
        isRunningRef.current = false;
        return;
      }

      const candidates = edges.filter(
        e =>
          (visited.has(e.from) && !visited.has(e.to)) ||
          (visited.has(e.to) && !visited.has(e.from))
      );

      let minEdge = null;

      // Line 4: Find minimum edge
      updatePseudoCodeState(4, 'find_min_edge', {
        'visited.size': visited.size,
        'candidates': candidates.length,
        'MST.size': mstEdges.length
      });
      if (!(await sleep(500))) {
        isRunningRef.current = false;
        return;
      }

      for (const edge of candidates) {
        if (!isRunningRef.current || pauseRef.current) {
          isRunningRef.current = false;
          return;
        }
        
        const edgeKey = `${edge.from}-${edge.to}`;
        setHighlightedEdge(edgeKey);
        
        updatePseudoCodeState(4, 'examining_edge', {
          'visited.size': visited.size,
          'current_edge': `${edge.from}-${edge.to}`,
          'current_weight': edge.weight,
          'min_weight': minEdge ? minEdge.weight : 'none',
          'MST.size': mstEdges.length
        });
        
        if (onStepChange) onStepChange(prev => prev + 1);
        setStepIndex(prev => prev + 1);
        if (!(await sleep(1000))) {
          isRunningRef.current = false;
          return;
        }

        if (!minEdge || edge.weight < minEdge.weight) {
          minEdge = edge;
        }
      }

      if (minEdge && isRunningRef.current && !pauseRef.current) {
        // Line 5: Check if connects to unvisited
        updatePseudoCodeState(5, 'check_unvisited', {
          'visited.size': visited.size,
          'minEdge': `${minEdge.from}-${minEdge.to}`,
          'minEdge.weight': minEdge.weight,
          'MST.size': mstEdges.length
        });
        if (!(await sleep(500))) {
          isRunningRef.current = false;
          return;
        }

        const newKey = `${minEdge.from}-${minEdge.to}`;
        mstEdges.push(minEdge);
        totalWeight += minEdge.weight;
        setSelectedEdges(prev => [...prev, newKey]);

        // Line 6: Add to MST
        updatePseudoCodeState(6, 'add_to_mst', {
          'visited.size': visited.size,
          'added_edge': `${minEdge.from}-${minEdge.to}`,
          'MST.size': mstEdges.length,
          'MST.weight': totalWeight
        });
        if (!(await sleep(500))) {
          isRunningRef.current = false;
          return;
        }

        visited.add(minEdge.from);
        visited.add(minEdge.to);
        visitedRef.current = visited;
        setHighlightedEdge(null);

        // Line 7: Mark as visited
        updatePseudoCodeState(7, 'mark_visited', {
          'visited.size': visited.size,
          'new_node': visited.has(minEdge.from) && visited.has(minEdge.to) ? 
            (visitedRef.current.has(minEdge.from) ? minEdge.to : minEdge.from) : 'both',
          'MST.size': mstEdges.length,
          'MST.weight': totalWeight
        });
        
        if (onStepChange) onStepChange(prev => prev + 1);
        setStepIndex(prev => prev + 1);
        if (!(await sleep(1000))) {
          isRunningRef.current = false;
          return;
        }
      } else {
        break;
      }
    }

    // Only complete if animation wasn't stopped
    if (isRunningRef.current && !pauseRef.current) {
      // Line 9: End while
      updatePseudoCodeState(9, 'end_while', {
        'visited.size': visited.size,
        'MST.size': mstEdges.length,
        'total_nodes': nodes.length,
        'MST.weight': totalWeight
      });
      if (!(await sleep(500))) {
        isRunningRef.current = false;
        return;
      }

      // Line 10: Function end
      updatePseudoCodeState(10, 'function_end', {
        'MST.weight': totalWeight,
        'algorithm': 'completed'
      });

      // Clear animation state on completion
      animationStateRef.current = null;
      setIsPaused(false);
      if (onPlayingChange) onPlayingChange(false);
      if (onAnimationComplete) onAnimationComplete();
    }
    
    isRunningRef.current = false;
  };

  // Handle play/pause state changes
  useEffect(() => {
    if (isPlaying && nodes.length > 0) {
      if (isPaused && animationStateRef.current) {
        // Resume from paused state
        pauseRef.current = false;
        setIsPaused(false);
        continueAnimation();
      } else if (!isRunningRef.current && !isPaused) {
        // Start fresh animation
        runPrims();
      }
    } else if (!isPlaying && isRunningRef.current && !pauseRef.current) {
      // Only pause if not already pausing
      pause();
    }
  }, [isPlaying, nodes]);

  // Initialize graph on mount and input changes
  useEffect(() => {
    // Clear any running animations before reinitializing
    if (isRunningRef.current) {
      isRunningRef.current = false;
      pauseRef.current = true;
    }
    
    // Clear timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    // Reset visual states
    setHighlightedEdge(null);
    setSelectedEdges([]);
    setStepIndex(0);
    setCurrentCodeLineIndex(-1);
    setVariables({});
    setCurrentAction('');
    setIsPaused(false);
    
    // Reset refs
    visitedRef.current = new Set();
    animationStateRef.current = null;
    
    // Initialize after a brief delay to ensure state is cleared
    const timeoutId = setTimeout(() => {
      pauseRef.current = false;
      initializeGraph();
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [userInput, userWeights]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      isRunningRef.current = false;
      pauseRef.current = true;
    };
  }, []);

  return (
    <div className={`relative w-full h-[700px] border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 ${className}`}>
      {/* Render edges first so they appear behind nodes */}
      {edges.map((edge, idx) => {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);
        
        if (!fromNode || !toNode) return null;
        
        const nodeRadius = 40;
        const x1 = fromNode.x + nodeRadius;
        const y1 = fromNode.y + nodeRadius;
        const x2 = toNode.x + nodeRadius;
        const y2 = toNode.y + nodeRadius;
        
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        const edgeKey = `${edge.from}-${edge.to}`;
        
        let edgeStyles = 'absolute origin-left transition-all duration-300 ';
        if (selectedEdges.includes(edgeKey)) {
          edgeStyles += 'bg-green-500 h-2 shadow-lg';
        } else if (highlightedEdge === edgeKey) {
          edgeStyles += 'bg-yellow-400 h-2 shadow-md animate-pulse';
        } else {
          edgeStyles += 'bg-gray-400 h-1';
        }

        return (
          <React.Fragment key={idx}>
            <div
              className={edgeStyles}
              style={{
                width: length,
                left: x1,
                top: y1,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 50%',
              }}
            />
            <div
              className="absolute bg-white border-2 border-gray-600 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-gray-800 shadow-lg z-10"
              style={{
                left: (x1 + x2) / 2 - 20,
                top: (y1 + y2) / 2 - 20,
              }}
            >
              {edge.weight}
            </div>
          </React.Fragment>
        );
      })}
      
      {/* Render nodes on top of edges */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute w-20 h-20 bg-blue-500 border-4 border-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl transition-all duration-300 hover:bg-blue-600 z-20"
          style={{ 
            left: node.x - 4,
            top: node.y - 4
          }}
        >
          {node.id}
        </div>
      ))}
    </div>
  );
});

export default PrimsVisualizer;