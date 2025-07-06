
import React, { useEffect, useState } from 'react';
import { TreeNode } from '@/types/TreeTypes';
import { Fullscreen, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TreeRendererProps {
  root: TreeNode;
  isAnimating: boolean;
  maxDegree: number;
}

interface NodePosition {
  x: number;
  y: number;
}

const TreeRenderer: React.FC<TreeRendererProps> = ({ root, isAnimating, maxDegree }) => {
  const [nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(new Map());
  const [svgDimensions, setSvgDimensions] = useState({ width: 1200, height: 600 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const positions = new Map<string, NodePosition>();
    const levelCounts = calculateLevelCounts(root);
    const maxLevelWidth = Math.max(...levelCounts);
    const nodeWidth = 100 + (maxDegree - 3) * 20;
    const levelHeight = 120;
    
    const totalWidth = Math.max(1200, maxLevelWidth * nodeWidth * 1.5);
    const totalHeight = Math.max(600, levelCounts.length * levelHeight + 100);
    
    setSvgDimensions({ width: totalWidth, height: totalHeight });
    
    calculatePositions(root, 0, totalWidth / 2, 80, positions, levelCounts, totalWidth);
    setNodePositions(positions);
  }, [root, maxDegree]);

  const calculateLevelCounts = (node: TreeNode | null, level: number = 0, counts: number[] = []): number[] => {
    if (!node) return counts;
    
    if (counts.length <= level) {
      counts[level] = 0;
    }
    counts[level]++;
    
    node.children.forEach(child => calculateLevelCounts(child, level + 1, counts));
    return counts;
  };

  const calculatePositions = (
    node: TreeNode,
    level: number,
    x: number,
    y: number,
    positions: Map<string, NodePosition>,
    levelCounts: number[],
    totalWidth: number
  ) => {
    positions.set(node.id, { x, y });
    
    if (node.children.length > 0) {
      const childWidth = totalWidth / (levelCounts[level + 1] || 1);
      const spacing = Math.max(150, childWidth * 0.8);
      const startX = x - ((node.children.length - 1) * spacing) / 2;
      
      node.children.forEach((child, index) => {
        const childX = startX + index * spacing;
        const childY = y + 120;
        calculatePositions(child, level + 1, childX, childY, positions, levelCounts, totalWidth);
      });
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const renderNode = (node: TreeNode) => {
    const position = nodePositions.get(node.id);
    if (!position) return null;

    const isLeaf = node.children.length === 0;
    const nodeWidth = 80 + node.values.length * 40;
    const nodeHeight = 50;

    return (
      <g key={node.id} className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}>
        <rect
          x={position.x - nodeWidth / 2}
          y={position.y - nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          rx={8}
          fill={isLeaf ? "url(#leafGradient)" : "url(#internalGradient)"}
          stroke={node.isHighlighted ? "#fbbf24" : "#64748b"}
          strokeWidth={node.isHighlighted ? "3" : "2"}
          className="drop-shadow-lg"
        />
        
        {node.values.map((value, index) => (
          <g key={index}>
            <text
              x={position.x + (node.values.length === 1 ? 0 : (index - 0.5) * 35)}
              y={position.y + 6}
              textAnchor="middle"
              className="fill-white text-sm font-bold"
            >
              {value}
            </text>
            {index < node.values.length - 1 && (
              <line
                x1={position.x + (index - 0.5) * 35 + 18}
                y1={position.y - nodeHeight / 2 + 10}
                x2={position.x + (index - 0.5) * 35 + 18}
                y2={position.y + nodeHeight / 2 - 10}
                stroke="#94a3b8"
                strokeWidth="1"
              />
            )}
          </g>
        ))}
      </g>
    );
  };

  const renderEdges = (node: TreeNode) => {
    const position = nodePositions.get(node.id);
    if (!position || node.children.length === 0) return null;

    return node.children.map((child, index) => {
      const childPosition = nodePositions.get(child.id);
      if (!childPosition) return null;

      return (
        <line
          key={`edge-${node.id}-${child.id}`}
          x1={position.x}
          y1={position.y + 25}
          x2={childPosition.x}
          y2={childPosition.y - 25}
          stroke="#64748b"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
      );
    });
  };

  const renderAllNodes = (node: TreeNode): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    
    elements.push(renderEdges(node));
    elements.push(renderNode(node));
    
    node.children.forEach(child => {
      elements.push(...renderAllNodes(child));
    });
    
    return elements;
  };

  return (
    <div className={`relative w-full h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : ''}`}>
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Fullscreen className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className="w-full h-full overflow-auto">
        <svg
          width={svgDimensions.width}
          height={svgDimensions.height}
          viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
          className="min-w-full min-h-full"
        >
          <defs>
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#047857" stopOpacity="1" />
            </linearGradient>
            
            <linearGradient id="internalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {renderAllNodes(root)}
        </svg>
      </div>
    </div>
  );
};

export default TreeRenderer;
