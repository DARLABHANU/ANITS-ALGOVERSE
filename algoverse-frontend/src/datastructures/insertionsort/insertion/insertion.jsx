import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './insertion.css';

const InsertionSortVisualizer = forwardRef(({
  userInput = '',
  isPlaying,
  playbackSpeed,
  onPlayingChange,
  onAnimationComplete,
  className = '',
}, ref) => {
  const [array, setArray] = useState([]);
  const [highlight, setHighlight] = useState([]);
  const [sortedIndex, setSortedIndex] = useState([]);
  const [currentStepData, setCurrentStepData] = useState(null);

  const originalArrayRef = useRef([]);
  const stepRef = useRef({ i: 1, j: 0, key: null, phase: 'start' });
  const intervalRef = useRef(null);

  const resetState = () => {
    clearInterval(intervalRef.current);
    stepRef.current = { i: 1, j: 0, key: null, phase: 'start' };
    setArray([...originalArrayRef.current]);
    setHighlight([]);
    setSortedIndex([]);
    setCurrentStepData(null);
    onPlayingChange(false);
  };

  useImperativeHandle(ref, () => ({
    reset: resetState,
  }));

  const initializeArray = () => {
    const values = userInput
      ? userInput.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v)).slice(0, 7)
      : Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
    originalArrayRef.current = [...values];
    setArray([...values]);
    setHighlight([]);
    setSortedIndex([]);
    stepRef.current = { i: 1, j: 0, key: null, phase: 'start' };
    setCurrentStepData(null);
    onPlayingChange(false);
  };

  useEffect(() => {
    initializeArray();
  }, []);

  useEffect(() => {
    if (userInput && !isPlaying) {
      initializeArray();
    }
  }, [userInput, isPlaying]);

useEffect(() => {
  if (!isPlaying || array.length === 0) return;

  let arr = [...array];
  let { i, j, key, phase } = stepRef.current;

  const emitStepData = (line, action) => {
    const vars = {
      i, j, key,
      [`arr[${j}]`]: arr[j],
      [`arr[${j + 1}]`]: arr[j + 1],
      [`arr[${i}]`]: arr[i],
    };
    const stepData = {
      codeLineIndex: line,
      action,
      variables: vars,
    };
    window.getCurrentStepData = () => ({ step: stepData, variables: vars });
  };

  intervalRef.current = setInterval(() => {
    if (i >= arr.length) {
      setSortedIndex([...Array(arr.length).keys()]);
      setHighlight([]);
      clearInterval(intervalRef.current);
      onPlayingChange(false);
      onAnimationComplete();
      window.getCurrentStepData = () => ({
        step: { codeLineIndex: 11, action: 'done' },
        variables: {},
      });
      return;
    }

if (phase === 'start') {
  key = arr[i];
  j = i - 1;
  setHighlight([i]);
  emitStepData(3, 'init_key');
  phase = 'compare';

} else if (phase === 'compare') {
  emitStepData(5, 'compare');
  if (j >= 0 && arr[j] > key) {
    phase = 'shift';
  } else {
    phase = 'end_while';
  }

} else if (phase === 'shift') {
  // Just shift, no swap!
  const temp=arr[j+1];
  arr[j + 1] = arr[j]; 
  arr[j]=temp;
  setArray([...arr]);
  setHighlight([j + 1, j]);
  emitStepData(6, 'shift');
  phase = 'decrement_j';

} else if (phase === 'decrement_j') {
  j--;
  emitStepData(7, 'decrement_j');
  phase = 'compare';

} else if (phase === 'end_while') {
  emitStepData(8, 'end_while');
  phase = 'insert';

} else if (phase === 'insert') {
  arr[j + 1] = key;
  setArray([...arr]);
  setHighlight([j + 1]);
  setSortedIndex(prev => [...new Set([...prev, i])]);
  emitStepData(9, 'insert');
  i++;
  phase = 'start';
}


    stepRef.current = { i, j, key, phase };
  }, 1000 / playbackSpeed);

  return () => clearInterval(intervalRef.current);
}, [isPlaying, playbackSpeed, array]);


  return (
    <>
            {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-gray-800/40 mx-4 rounded-lg">

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Comparing</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Sorted</span>
          </div>
        </div>
   <div className={`visualizer mt-12 ${className}`}>
  <div className="array-container">
    {array.map((value, index) => {
      const isAllSorted = sortedIndex.length === array.length;
      return (
        <div className="array-element" key={index}>
          <div
            className={`element-value ${
              isAllSorted
                ? 'sorted' // Only apply 'sorted' if the entire array is sorted
                : highlight.includes(index)
                ? 'highlight'
                : ''
            }`}
          >
            {value}
          </div>
          <div className="element-index">{index}</div>
        </div>
      );
    })}
 
  </div>
</div>
</>
  );
});

export default InsertionSortVisualizer;
