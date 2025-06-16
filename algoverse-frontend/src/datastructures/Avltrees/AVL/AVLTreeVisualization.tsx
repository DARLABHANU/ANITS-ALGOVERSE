
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, RotateCw, Play, Pause, SkipForward, Maximize, Minimize, AlertTriangle } from 'lucide-react';
import FullScreenButton from './FullScreenButton';

interface AVLNode {
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
  x: number;
  y: number;
  id: string;
}

interface RotationStep {
  type: 'LL' | 'RR' | 'LR' | 'RL';
  z: AVLNode;
  y: AVLNode;
  x: AVLNode;
  description: string;
  detailedExplanation: string;
  isActive: boolean;
  phase: 'identifying' | 'rotating' | 'completed';
}

interface VisualizationState {
  isInserting: boolean;
  isDeleting: boolean;
  currentStep: number;
  steps: Array<{
    message: string;
    type: 'info' | 'warning' | 'success' | 'rotation' | 'insertion' | 'deletion';
    nodeIds?: string[];
    timestamp: number;
  }>;
  rotationSteps: RotationStep[];
  highlightedNodes: Set<string>;
  pathNodes: Set<string>;
  rotationNodes: Set<string>;
}

const AVLTreeVisualization = () => {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedNode, setSelectedNode] = useState<AVLNode | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [nodeCount, setNodeCount] = useState(0);
  const MAX_NODES = 12;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [visualizationState, setVisualizationState] = useState<VisualizationState>({
    isInserting: false,
    isDeleting: false,
    currentStep: 0,
    steps: [],
    rotationSteps: [],
    highlightedNodes: new Set(),
    pathNodes: new Set(),
    rotationNodes: new Set()
  });
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  const NODE_RADIUS = 25;
  const LEVEL_HEIGHT = 80;
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 600;
  const MARGIN = 50;

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleFullScreenToggle = () => {
    if (!isFullScreen) {
      // Enter fullscreen
      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Helper functions for AVL operations
  const getHeight = (node: AVLNode | null): number => {
    return node ? node.height : 0;
  };

  const getBalance = (node: AVLNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  const updateHeight = (node: AVLNode): void => {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const createNode = (value: number): AVLNode => {
    return {
      value,
      left: null,
      right: null,
      height: 1,
      x: SVG_WIDTH / 2,
      y: 60,
      id: generateId()
    };
  };

  // Count nodes in tree
  const countNodes = (node: AVLNode | null): number => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  // Calculate minimum width needed for subtree
  const calculateSubtreeWidth = (node: AVLNode | null): number => {
    if (!node) return 0;
    if (!node.left && !node.right) return NODE_RADIUS * 3;
    
    const leftWidth = calculateSubtreeWidth(node.left);
    const rightWidth = calculateSubtreeWidth(node.right);
    return leftWidth + rightWidth + NODE_RADIUS * 2;
  };

  // In-order traversal to assign X positions
  const assignXPositions = (node: AVLNode | null, positions: { current: number }): void => {
    if (!node) return;
    
    assignXPositions(node.left, positions);
    node.x = positions.current;
    positions.current += NODE_RADIUS * 3;
    assignXPositions(node.right, positions);
  };

  // Assign Y positions based on level
  const assignYPositions = (node: AVLNode | null, level: number): void => {
    if (!node) return;
    
    node.y = 60 + level * LEVEL_HEIGHT;
    assignYPositions(node.left, level + 1);
    assignYPositions(node.right, level + 1);
  };

  // Center the entire tree within the container
  const centerTree = (node: AVLNode | null): void => {
    if (!node) return;
    
    const bounds = { minX: Infinity, maxX: -Infinity };
    
    const findBounds = (n: AVLNode | null) => {
      if (!n) return;
      bounds.minX = Math.min(bounds.minX, n.x);
      bounds.maxX = Math.max(bounds.maxX, n.x);
      findBounds(n.left);
      findBounds(n.right);
    };
    
    findBounds(node);
    
    const centerOffset = (SVG_WIDTH / 2) - ((bounds.minX + bounds.maxX) / 2);
    
    const applyOffset = (n: AVLNode | null) => {
      if (!n) return;
      n.x += centerOffset;
      n.x = Math.max(MARGIN + NODE_RADIUS, Math.min(SVG_WIDTH - MARGIN - NODE_RADIUS, n.x));
      applyOffset(n.left);
      applyOffset(n.right);
    };
    
    applyOffset(node);
  };

  // Main positioning function
  const updateTreePositions = (rootNode: AVLNode | null) => {
    if (!rootNode) return;
    
    const positions = { current: NODE_RADIUS * 2 };
    assignXPositions(rootNode, positions);
    assignYPositions(rootNode, 0);
    centerTree(rootNode);
  };

  // Enhanced step tracking with chronological order
  const addVisualizationStep = (
    message: string, 
    type: 'info' | 'warning' | 'success' | 'rotation' | 'insertion' | 'deletion' = 'info',
    nodeIds: string[] = []
  ) => {
    setVisualizationState(prev => ({
      ...prev,
      steps: [...prev.steps, { message, type, nodeIds, timestamp: Date.now() }]
    }));
  };

  const highlightNodes = (nodeIds: string[], pathIds: string[] = [], rotationIds: string[] = []) => {
    setVisualizationState(prev => ({
      ...prev,
      highlightedNodes: new Set(nodeIds),
      pathNodes: new Set(pathIds),
      rotationNodes: new Set(rotationIds)
    }));
  };

  // Clear highlights after operation
  const clearHighlights = () => {
    setVisualizationState(prev => ({
      ...prev,
      highlightedNodes: new Set(),
      pathNodes: new Set(),
      rotationNodes: new Set(),
      rotationSteps: []
    }));
  };

  // Enhanced rotation functions with detailed tracking
  const rightRotate = async (z: AVLNode, y: AVLNode, x: AVLNode): Promise<AVLNode> => {
    addVisualizationStep(
      `Right Rotation (RR): ${y.value} becomes new root`,
      'rotation',
      [z.id, y.id, x.id]
    );
    
    highlightNodes([z.id, y.id, x.id], [], [z.id, y.id, x.id]);
    
    const rotationStep: RotationStep = {
      type: 'LL',
      z, y, x,
      description: 'Single Right Rotation to fix Left-Left imbalance',
      detailedExplanation: `Right Rotation: Node ${y.value} becomes new root`,
      isActive: true,
      phase: 'rotating'
    };
    
    setVisualizationState(prev => ({
      ...prev,
      rotationSteps: [rotationStep]
    }));

    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    const newRoot = y;
    const T2 = y.right;

    y.right = z;
    z.left = T2;

    updateHeight(z);
    updateHeight(y);
    
    clearHighlights();
    return newRoot;
  };

  const leftRotate = async (z: AVLNode, y: AVLNode, x: AVLNode): Promise<AVLNode> => {
    addVisualizationStep(
      `Left Rotation (LR): ${y.value} becomes new root`,
      'rotation',
      [z.id, y.id, x.id]
    );
    
    highlightNodes([z.id, y.id, x.id], [], [z.id, y.id, x.id]);
    
    const rotationStep: RotationStep = {
      type: 'RR',
      z, y, x,
      description: 'Single Left Rotation to fix Right-Right imbalance',
      detailedExplanation: `Left Rotation: Node ${y.value} becomes new root`,
      isActive: true,
      phase: 'rotating'
    };
    
    setVisualizationState(prev => ({
      ...prev,
      rotationSteps: [rotationStep]
    }));

    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    const newRoot = y;
    const T2 = y.left;

    y.left = z;
    z.right = T2;

    updateHeight(z);
    updateHeight(y);
    
    clearHighlights();
    return newRoot;
  };

  // Enhanced insert function with better error handling
  const insertNodeWithVisualization = async (node: AVLNode | null, value: number, path: AVLNode[] = []): Promise<AVLNode> => {
    if (!node) {
      const newNode = createNode(value);
      addVisualizationStep(`Inserted node: ${value}`, 'insertion', [newNode.id]);
      
      if (path.length > 0) {
        highlightNodes([newNode.id], path.map(n => n.id));
        await new Promise(resolve => setTimeout(resolve, animationSpeed / 3));
      }
      
      return newNode;
    }

    const currentPath = [...path, node];
    
    if (value < node.value) {
      highlightNodes([node.id], currentPath.map(n => n.id));
      await new Promise(resolve => setTimeout(resolve, animationSpeed / 4));
      node.left = await insertNodeWithVisualization(node.left, value, currentPath);
    } else if (value > node.value) {
      highlightNodes([node.id], currentPath.map(n => n.id));
      await new Promise(resolve => setTimeout(resolve, animationSpeed / 4));
      node.right = await insertNodeWithVisualization(node.right, value, currentPath);
    } else {
      addVisualizationStep(`Node ${value} already exists`, 'warning');
      return node;
    }

    updateHeight(node);
    const balance = getBalance(node);

    if (Math.abs(balance) > 1) {
      const z = node;
      let y: AVLNode, x: AVLNode;

      if (balance > 1) {
        y = node.left!;
        if (value < y.value) {
          // Left Left Case
          x = y.left!;
          return await rightRotate(z, y, x);
        } else {
          // Left Right Case
          x = y.right!;
          addVisualizationStep(`Left-Right Rotation (LR)`, 'rotation');
          node.left = await leftRotate(y, x, x.right!);
          return await rightRotate(z, node.left, node.left.left!);
        }
      } else {
        y = node.right!;
        if (value > y.value) {
          // Right Right Case
          x = y.right!;
          return await leftRotate(z, y, x);
        } else {
          // Right Left Case
          x = y.left!;
          addVisualizationStep(`Right-Left Rotation (RL)`, 'rotation');
          node.right = await rightRotate(y, x, x.left!);
          return await leftRotate(z, node.right, node.right.right!);
        }
      }
    }

    return node;
  };

  // Handle insert with proper state management
  const handleInsertWithVisualization = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      return;
    }

    // Check if node already exists
    const nodeExists = (node: AVLNode | null, val: number): boolean => {
      if (!node) return false;
      if (node.value === val) return true;
      return nodeExists(node.left, val) || nodeExists(node.right, val);
    };

    if (nodeExists(root, value)) {
      return;
    }

    // Check node count limit
    if (nodeCount >= MAX_NODES) {
      return;
    }

    try {
      setVisualizationState(prev => ({
        ...prev,
        isInserting: true,
        currentStep: 0
      }));
      
      const newRoot = await insertNodeWithVisualization(root, value);
      setRoot(newRoot);
      updateTreePositions(newRoot);
      setNodeCount(countNodes(newRoot));
      
      setInputValue('');
    } catch (error) {
      console.error('Insert error:', error);
    } finally {
      setVisualizationState(prev => ({
        ...prev,
        isInserting: false
      }));
      clearHighlights();
    }
  };

  // Find minimum value node
  const findMin = (node: AVLNode): AVLNode => {
    while (node.left) {
      node = node.left;
    }
    return node;
  };

  // Enhanced delete function
  const deleteNodeWithVisualization = async (node: AVLNode | null, value: number): Promise<AVLNode | null> => {
    if (!node) {
      addVisualizationStep(`Node ${value} not found`, 'warning');
      return null;
    }

    if (value < node.value) {
      node.left = await deleteNodeWithVisualization(node.left, value);
    } else if (value > node.value) {
      node.right = await deleteNodeWithVisualization(node.right, value);
    } else {
      addVisualizationStep(`Deleted node: ${value}`, 'deletion', [node.id]);
      
      if (!node.left || !node.right) {
        const temp = node.left || node.right;
        return temp;
      } else {
        const temp = findMin(node.right);
        node.value = temp.value;
        node.right = await deleteNodeWithVisualization(node.right, temp.value);
      }
    }

    updateHeight(node);
    const balance = getBalance(node);

    // Rotation logic for deletions
    if (Math.abs(balance) > 1) {
      const z = node;
      let y: AVLNode, x: AVLNode;

      if (balance > 1) {
        y = node.left!;
        const leftBalance = getBalance(y);
        if (leftBalance >= 0) {
          // Left Left Case
          x = y.left!;
          return await rightRotate(z, y, x);
        } else {
          // Left Right Case
          x = y.right!;
          addVisualizationStep(`Left-Right Rotation (LR)`, 'rotation');
          node.left = await leftRotate(y, x, x.right!);
          return await rightRotate(z, node.left, node.left.left!);
        }
      } else {
        y = node.right!;
        const rightBalance = getBalance(y);
        if (rightBalance <= 0) {
          // Right Right Case
          x = y.right!;
          return await leftRotate(z, y, x);
        } else {
          // Right Left Case
          x = y.left!;
          addVisualizationStep(`Right-Left Rotation (RL)`, 'rotation');
          node.right = await rightRotate(y, x, x.left!);
          return await leftRotate(z, node.right, node.right.right!);
        }
      }
    }

    return node;
  };

  // Handle delete with proper state management
  const handleDeleteWithVisualization = async () => {
    if (!selectedNode) return;

    try {
      setVisualizationState(prev => ({
        ...prev,
        isDeleting: true
      }));
      
      const newRoot = await deleteNodeWithVisualization(root, selectedNode.value);
      setRoot(newRoot);
      if (newRoot) {
        updateTreePositions(newRoot);
        setNodeCount(countNodes(newRoot));
      } else {
        setNodeCount(0);
      }
      
      setSelectedNode(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setVisualizationState(prev => ({
        ...prev,
        isDeleting: false
      }));
      clearHighlights();
    }
  };

  // Update positions when tree changes
  useEffect(() => {
    if (root) {
      updateTreePositions(root);
      setRoot(prevRoot => {
        if (!prevRoot) return prevRoot;
        return { ...prevRoot };
      });
    }
  }, [root?.height, root?.value]);

  // Update node count when root changes
  useEffect(() => {
    setNodeCount(countNodes(root));
  }, [root]);

  // Get node color based on state
  const getNodeColor = (node: AVLNode): string => {
    const balance = getBalance(node);
    
    if (visualizationState.rotationNodes.has(node.id)) return '#f97316'; // Orange for rotation nodes
    if (visualizationState.highlightedNodes.has(node.id)) return '#3b82f6'; // Blue for highlighted
    if (visualizationState.pathNodes.has(node.id)) return '#fbbf24'; // Yellow for path
    if (selectedNode?.id === node.id) return '#8b5cf6'; // Purple for selected
    if (Math.abs(balance) > 1) return '#ef4444'; // Red for unbalanced
    if (Math.abs(balance) === 1) return '#f59e0b'; // Amber for slightly unbalanced
    return '#10b981'; // Green for balanced
  };

  // Render tree recursively
  const renderTree = (node: AVLNode | null): JSX.Element[] => {
    if (!node) return [];

    const elements: JSX.Element[] = [];

    if (node.left) {
      elements.push(
        <line
          key={`edge-${node.id}-${node.left.id}`}
          x1={node.x}
          y1={node.y + NODE_RADIUS}
          x2={node.left.x}
          y2={node.left.y - NODE_RADIUS}
          stroke="rgba(148, 163, 184, 0.8)"
          strokeWidth="3"
          className="transition-all duration-500"
        />
      );
      elements.push(...renderTree(node.left));
    }

    if (node.right) {
      elements.push(
        <line
          key={`edge-${node.id}-${node.right.id}`}
          x1={node.x}
          y1={node.y + NODE_RADIUS}
          x2={node.right.x}
          y2={node.right.y - NODE_RADIUS}
          stroke="rgba(148, 163, 184, 0.8)"
          strokeWidth="3"
          className="transition-all duration-500"
        />
      );
      elements.push(...renderTree(node.right));
    }

    const balance = getBalance(node);
    elements.push(
      <g key={`node-${node.id}`} className="transition-all duration-500">
        <circle
          cx={node.x}
          cy={node.y}
          r={NODE_RADIUS}
          fill={getNodeColor(node)}
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="3"
          className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-4"
          onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
          filter="url(#glow)"
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
          className="pointer-events-none select-none"
        >
          {node.value}
        </text>
        <text
          x={node.x}
          y={node.y - NODE_RADIUS - 8}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="12"
          fontWeight="bold"
          className="pointer-events-none select-none"
        >
          {balance}
        </text>
      </g>
    );

    return elements;
  };

  return (
<div 
  ref={containerRef}
  className={`w-full h-full bg-slate-900 p-6 rounded-2xl ${
    isFullScreen ? 'fixed inset-0 z-50 rounded-none' : ''
  }`}
>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Enhanced Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AVL Tree Controls
              </h3>
              <FullScreenButton 
                isFullScreen={isFullScreen} 
                onClick={handleFullScreenToggle}
              />
            </div>
            
            {/* Node Count Display */}
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-300">Nodes:</span>
                <span className={`text-lg font-bold ${nodeCount >= MAX_NODES ? 'text-red-400' : 'text-green-400'}`}>
                  {nodeCount}/{MAX_NODES}
                </span>
              </div>
              {nodeCount >= MAX_NODES && (
                <div className="flex items-center gap-1 mt-1">
                  
                  
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value..."
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  disabled={visualizationState.isInserting || visualizationState.isDeleting || nodeCount >= MAX_NODES}
                  onKeyDown={(e) => e.key === 'Enter' && !visualizationState.isInserting && nodeCount < MAX_NODES && handleInsertWithVisualization()}
                />
                <Button
                  onClick={handleInsertWithVisualization}
                  disabled={visualizationState.isInserting || visualizationState.isDeleting || nodeCount >= MAX_NODES}
                  className={`${nodeCount >= MAX_NODES 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  }`}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleDeleteWithVisualization}
                disabled={!selectedNode || visualizationState.isInserting || visualizationState.isDeleting}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedNode?.value || 'None'})
              </Button>



              <Button
                onClick={() => {
                  setRoot(null);
                  setSelectedNode(null);
                  setNodeCount(0);
                  setVisualizationState({
                    isInserting: false,
                    isDeleting: false,
                    currentStep: 0,
                    steps: [],
                    rotationSteps: [],
                    highlightedNodes: new Set(),
                    pathNodes: new Set(),
                    rotationNodes: new Set()
                  });
                }}
                variant="outline"
                className="w-full bg-gray-900 border border-gray-700 text-gray-100 hover:bg-gray-700"

                disabled={visualizationState.isInserting || visualizationState.isDeleting}
              >
                Clear Tree
              </Button>
            </div>
          </Card>

          {/* Enhanced Algorithm Steps Panel */}
          <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50 p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <Play className="h-4 w-4" />
              Algorithm Steps
            </h4>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {visualizationState.steps
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((step, index) => (
                <div 
                  key={index} 
                  className={`text-xs p-2 rounded border-l-2 ${
                    step.type === 'insertion' ? 'text-green-300 bg-green-900/20 border-green-500/50' :
                    step.type === 'deletion' ? 'text-red-300 bg-red-900/20 border-red-500/50' :
                    step.type === 'rotation' ? 'text-orange-300 bg-orange-900/20 border-orange-500/50' :
                    step.type === 'warning' ? 'text-yellow-300 bg-yellow-900/20 border-yellow-500/50' :
                    'text-gray-300 bg-gray-800/30 border-blue-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {step.type === 'insertion' && <span className="text-green-400">+</span>}
                    {step.type === 'deletion' && <span className="text-red-400">-</span>}
                    {step.type === 'rotation' && <RotateCw className="h-3 w-3 text-orange-400" />}
                    <span>{step.message}</span>
                  </div>
                </div>
              ))}
              {visualizationState.steps.length === 0 && (
                <div className="text-xs text-gray-500 italic">
                  Perform operations to see algorithm steps
                </div>
              )}
            </div>
          </Card>

          {/* Current Rotation Info */}
          {visualizationState.rotationSteps.length > 0 && (
            <Card className="bg-orange-900/30 backdrop-blur-sm border-orange-500/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <RotateCw className="h-5 w-5 text-orange-400 animate-spin" />
                <span className="text-orange-300 font-medium">
                  {visualizationState.rotationSteps[0].type} Rotation
                </span>
              </div>
              <div className="text-sm text-orange-200 mb-2">
                {visualizationState.rotationSteps[0].description}
              </div>
              <div className="text-xs text-orange-300 bg-orange-900/40 p-2 rounded">
                {visualizationState.rotationSteps[0].detailedExplanation}
              </div>
            </Card>
          )}
        </div>

        {/* Tree Visualization */}
        <div className="lg:col-span-3">
          <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50 p-4 h-full">
            <div className="w-full h-full min-h-96">
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="border border-gray-700/30 rounded-lg bg-gradient-to-br from-gray-900/50 to-purple-900/20"
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {root && renderTree(root)}
                
                {/* Compact Legend */}
               <g transform="translate(15, 15)">
                  <rect x="0" y="0" width="140" height="140" fill="rgba(0,0,0,0.8)" rx="6" stroke="rgba(255,255,255,0.2)" />
                   
                   <text x="6" y="16" fill="white" fontSize="10" fontWeight="bold">Legend:</text>
                   
                   <circle cx="10" cy="32" r="4" fill="#10b981" />
                   <text x="20" y="35" fill="white" fontSize="8" fontWeight="bold">Balanced</text>
                   
                   <circle cx="10" cy="48" r="4" fill="#f59e0b" />
                   <text x="20" y="51" fill="white" fontSize="8" fontWeight="bold">Unbalanced</text>
                   
                   <circle cx="10" cy="64" r="4" fill="#ef4444" />
                   <text x="20" y="67" fill="white" fontSize="8" fontWeight="bold">Critical</text>
                   
                   <circle cx="10" cy="80" r="4" fill="#f97316" />
                   <text x="20" y="83" fill="white" fontSize="8" fontWeight="bold">Rotation</text>
                   
                   <circle cx="10" cy="96" r="4" fill="#3b82f6" />
                   <text x="20" y="99" fill="white" fontSize="8" fontWeight="bold">Highlighted</text>
                   
                   <circle cx="10" cy="112" r="4" fill="#8b5cf6" />
                   <text x="20" y="115" fill="white" fontSize="8" fontWeight="bold">Selected</text>
                   
                   <text x="6" y="132" fill="white" fontSize="8" fontWeight="bold">Numbers = Balance Factor</text>
                 </g>

              </svg>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AVLTreeVisualization;
