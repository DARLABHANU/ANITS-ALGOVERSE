import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './selection.css';

const SelectionSortVisualizer = forwardRef(({
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
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [preSwapIndices, setPreSwapIndices] = useState([]);
  const [currentStepData, setCurrentStepData] = useState(null);

  const originalArrayRef = useRef([]);
  const stepRef = useRef({ i: 0, j: 1, min_idx: 0 });
  const intervalRef = useRef(null);

  const resetState = () => {
    clearInterval(intervalRef.current);
    stepRef.current = { i: 0, j: 1, min_idx: 0 };
    setArray([...originalArrayRef.current]);
    setHighlight([]);
    setSortedIndex([]);
    setSwappingIndices([]);
    setPreSwapIndices([]);
    setCurrentStepData(null);
    onPlayingChange(false);
  };

  useImperativeHandle(ref, () => ({
    reset: resetState,
  }));

  const initializeArray = () => {
    const values = userInput
      ? userInput.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v)).slice(0, 7)
      : Array.from({length: 7 }, () => Math.floor(Math.random() * 100));
    originalArrayRef.current = [...values];
    setArray([...values]);
    setHighlight([]);
    setSortedIndex([]);
    setSwappingIndices([]);
    setPreSwapIndices([]);
    stepRef.current = { i: 0, j: 1, min_idx: 0 };
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

    let { i, j, min_idx } = stepRef.current;
    let arr = [...array];
    const n = arr.length;

    intervalRef.current = setInterval(() => {
      if (i >= n - 1) {
        setSortedIndex([...Array(n).keys()]);
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

      setHighlight(Array.from(new Set([i, j, min_idx])));
      setPreSwapIndices([]);

      let codeLineIndex = 4;
      let action = 'compare';

      if (j < n) {
        if (arr[j] < arr[min_idx]) {
          min_idx = j;
          codeLineIndex = 5;
          action = 'update_min';
        }
        j++;
      } else {
        setPreSwapIndices([i, min_idx]);

        setTimeout(() => {
          setSwappingIndices([i, min_idx]);

          setTimeout(() => {
            const temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;

            setArray([...arr]);
            setSortedIndex(prev => [...new Set([...prev, i-1])]);
            setSwappingIndices([]);
            setPreSwapIndices([]);

            const stepData = {
              codeLineIndex: 8,
              action: 'swap',
              variables: {
                i,
                j,
                min_idx,
                [`arr[${i}]`]: arr[i],
                [`arr[${j}]`]: arr[j],
                [`arr[${min_idx}]`]: arr[min_idx],
              }
            };

            setCurrentStepData(stepData);
            window.getCurrentStepData = () => ({
              step: stepData,
              variables: stepData.variables,
            });

            i++;
            j = i + 1;
            min_idx = i;
            stepRef.current = { i, j, min_idx };
          }, 300);
        }, 300);
      }

      stepRef.current = { i, j, min_idx };

      const stepData = {
        codeLineIndex,
        action,
        variables: {
          i,
          j,
          min_idx,
          [`arr[${i}]`]: arr[i],
          [`arr[${j}]`]: arr[j],
          [`arr[${min_idx}]`]: arr[min_idx],
        },
      };
      setCurrentStepData(stepData);
      window.getCurrentStepData = () => ({
        step: stepData,
        variables: stepData.variables,
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, playbackSpeed, array]);

  return (
    <>
            {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-gray-800/40 mx-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-300">min</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Swapping</span>
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
                preSwapIndices.includes(index)
                  ? 'pre-swap'
                  : sortedIndex.includes(index)
                  ? 'sorted'
                  : swappingIndices.includes(index)
                  ? 'swapping'
                  : highlight.includes(index)
                  ? index === highlight[0]
                    ? ''
                    : index === highlight[1]
                    ? 'highlight-compare'
                    : index === highlight[2]
                    ? 'highlight-min'
                    : ''
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

export default SelectionSortVisualizer;
