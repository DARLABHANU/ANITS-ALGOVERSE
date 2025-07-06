
export interface TreeNode {
  id: string;
  values: number[];
  children: TreeNode[];
  parent: TreeNode | null;
  x?: number;
  y?: number;
  isHighlighted?: boolean;
  isAnimating?: boolean;
  isSplitting?: boolean;
  isMerging?: boolean;
}

export interface TreeOperation {
  type: 'insert' | 'delete' | 'search';
  value: number;
  step: number;
  description: string;
  highlightedNodes: string[];
}

export interface TreeState {
  root: TreeNode | null;
  operation: TreeOperation | null;
  isAnimating: boolean;
  maxDegree: number;
  keyCount: number;
  maxKeys: number;
}
