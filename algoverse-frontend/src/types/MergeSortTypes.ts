
export interface ArrayElement {
  value: number;
  id: string;
  isActive?: boolean;
  isComparing?: boolean;
  isSmaller?: boolean;
  isSorted?: boolean;
  isHighlighted?: boolean;
  subtreeType?: 'left' | 'right' | 'merged';
}

export interface MergeSortLevel {
  level: number;
  subarrays: ArrayElement[][];
  isActive: boolean;
  isComplete: boolean;
  isHidden?: boolean;
  subtreeType?: 'left' | 'right' | 'combined';
}

export interface MergeSortState {
  levels: MergeSortLevel[];
  currentLevel: number;
  isAnimating: boolean;
  isComplete: boolean;
  isPaused: boolean;
  originalArray: number[];
  iterations: number;
}

export interface ComparisonStep {
  leftIndex: number;
  rightIndex: number;
  leftValue: number;
  rightValue: number;
  chosenValue: number;
  chosenFromLeft: boolean;
  mergedArray: number[];
  step: number;
}

export interface VisualizationCallbacks {
  onLevelUpdate?: (levels: MergeSortLevel[]) => void;
  onComparison?: (step: ComparisonStep) => void;
  onComplete?: () => void;
  onPause?: () => void;
}
