import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './bubble.css';

const BubbleSortVisualizer = forwardRef(({
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
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepData, setCurrentStepData] = useState(null);

  const originalArrayRef = useRef([]);
  const stepRef = useRef({ i: 0, j: 0, swapped: false });
  const intervalRef = useRef(null);

  const resetState = () => {
    clearInterval(intervalRef.current);
    stepRef.current = { i: 0, j: 0, swapped: false };
    setArray([...originalArrayRef.current]);
    setHighlight([]);
    setSortedIndex([]);
    setCurrentStep(0);
    setCurrentStepData(null);
    onPlayingChange(false);
  };

  useImperativeHandle(ref, () => ({
    reset: resetState,
  }));

  const initializeArray = () => {
    const values = userInput
      ? userInput.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v)).slice(0, 7)
      : Array.from({ length: 7  }, () => Math.floor(Math.random() * 100));
    originalArrayRef.current = [...values];
    setArray([...values]);
    setHighlight([]);
    setSortedIndex([]);
    stepRef.current = { i: 0, j: 0, swapped: false };
    setCurrentStep(0);
    setCurrentStepData(null);
    onPlayingChange(false);
  };

  useEffect(() => {
    initializeArray();
  }, []);

  useEffect(() => {
    if (userInput) initializeArray();
  }, [userInput]);

useEffect(() => {
  if (!isPlaying || array.length === 0) return;

  let { i, j, swapped } = stepRef.current;
  let arr = [...array];

  intervalRef.current = setInterval(() => {
    const n = arr.length;

    if (i >= n - 1) {
      setSortedIndex([...Array(n).keys()]);
      setHighlight([]);
      clearInterval(intervalRef.current);
      onPlayingChange(false);
      onAnimationComplete();

      window.getCurrentStepData = () => ({
        step: { codeLineIndex: 6, action: 'done' },
        variables: {},
      });
      return;
    }

    const currentVal = arr[j];
    const nextVal = arr[j + 1];
    const isSwap = currentVal > nextVal;

    const stepData = {
      codeLineIndex: isSwap ? 3 : 2,
      action: isSwap ? 'swap' : 'compare',
      variables: {
        i,
        j,
        [`arr[${j}]`]: currentVal,
        [`arr[${j + 1}]`]: nextVal,
      },
    };

    // Highlight values
    setHighlight([j, j + 1]);

    // Update step globally for pseudocode
    window.getCurrentStepData = () => ({
      step: stepData,
      variables: stepData.variables,
    });

    // Perform swap
    if (isSwap) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      swapped = true;
    }

    setArray([...arr]);

    // End of pass
    if (j === arr.length - i - 2) {
      if (!swapped) {
        setSortedIndex([...Array(n).keys()]);
        setHighlight([]);
        clearInterval(intervalRef.current);
        onPlayingChange(false);
        onAnimationComplete();
        return;
      }
      setSortedIndex(prev => [...prev, n - i]);
      i++;
      j = 0;
      swapped = false;
    } else {
      j++;
    }

    stepRef.current = { i, j, swapped };
  }, 1000 / playbackSpeed);

  return () => clearInterval(intervalRef.current);
}, [isPlaying, playbackSpeed, array]);



  return (
    <>
            {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-gray-800/40 mx-4 rounded-lg">

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Sorted</span>
          </div>
        </div>
    <div className={`visualizer mt-12 ${className}`}>
      <div className="array-container">
        {array.map((value, index) => (
          <div className="array-element" key={index}>
            <div
              className={`element-value ${
                sortedIndex.includes(index)
                  ? 'sorted'
                  : highlight[0] === index
                  ? 'highlight-start'
                  : highlight[1] === index
                  ? 'highlight-end'
                  : ''
              }`}
            >
              {value}
            </div>
            <div className="element-index">{index}</div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
});

export default BubbleSortVisualizer;
