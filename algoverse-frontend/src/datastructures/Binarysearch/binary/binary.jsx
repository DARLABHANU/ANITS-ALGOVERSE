import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import SearchValueInput from './SearchValueInput';
// import './binary.css';

const BinarySearchVisualizer = forwardRef(({
  userInput = '',
  currentStep,
  isPlaying,
  playbackSpeed,
  onStepChange,
  onPlayingChange,
  onAnimationComplete,
  isAnimationComplete,
  className = '',
}, ref) => {
  const [array, setArray] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [mid, setMid] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [highlightMap, setHighlightMap] = useState({});

  const stepRef = useRef(0);
  const timeoutRef = useRef(null);
  const removalTimeoutRef = useRef(null);

  const resetState = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(removalTimeoutRef.current);
    stepRef.current = 0;
    setLeft(0);
    setRight(array.length - 1);
    setMid(null);
    setFoundIndex(null);
    setNotFound(false);
    setHighlightMap({});
    onStepChange(0);
    onPlayingChange(false);
  };

  useImperativeHandle(ref, () => ({
    reset: resetState,
  }));

  useEffect(() => {
    const values = userInput
      ? userInput
          .split(',')
          .map(v => v.trim())
          .filter(v => !isNaN(v))
          .map(Number)
          .slice(0, 8)
      : Array.from({ length: 8 }, () =>
          Math.floor(Math.random() * 100)
        );

    values.sort((a, b) => a - b);

    setArray(values);
    setSearchValue(values[Math.floor(Math.random() * values.length)] ?? '');
    setLeft(0);
    setRight(values.length - 1);
    setMid(null);
    setFoundIndex(null);
    setNotFound(false);
    setHighlightMap({});
    stepRef.current = 0;
    onStepChange(0);
    onPlayingChange(false);
  }, [userInput]);

useEffect(() => {
  if (!isPlaying || array.length === 0 || searchValue === '') return;

  if (left > right) {
    setNotFound(true);
    onPlayingChange(false);
    onAnimationComplete();
    return;
  }

  const midIdx = Math.floor((left + right) / 2);
  const midValue = array[midIdx];
  const target = parseInt(searchValue, 10);
  setMid(midIdx);

  const tempMap = {};

  // Highlight left and right zones
  for (let i = left; i < midIdx; i++) tempMap[i] = 'blue';
  tempMap[midIdx] = 'yellow';
  for (let i = midIdx + 1; i <= right; i++) tempMap[i] = 'red';

  setHighlightMap(tempMap);

  timeoutRef.current = setTimeout(() => {
    if (midValue === target) {
      setFoundIndex(midIdx);
      setHighlightMap({});
      onPlayingChange(false);
      onAnimationComplete();
    } else {
      const toRemove = midValue < target
        ? [...Array(midIdx - left + 1).keys()].map(i => left + i)  // remove left..mid
        : [...Array(right - midIdx + 1).keys()].map(i => midIdx + i);  // remove mid..right

      let index = 0;

      const removeNext = () => {
        if (index < toRemove.length) {
          setHighlightMap(prev => ({
            ...prev,
            [toRemove[index]]: midValue < target ? 'red' : 'blue',
          }));
          index++;
          removalTimeoutRef.current = setTimeout(removeNext, 100);
        } else {
          setHighlightMap({});
          if (midValue < target) {
            setLeft(midIdx + 1);
          } else {
            setRight(midIdx - 1);
          }
          stepRef.current += 1;
          onStepChange(stepRef.current);
        }
      };

      removeNext();
    }
  }, 1000 / playbackSpeed);

  return () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(removalTimeoutRef.current);
  };
}, [isPlaying, left, right, array, searchValue, playbackSpeed]);
useEffect(() => {
  window.getCurrentStepData = () => {
    const target = parseInt(searchValue, 10);
    const midValue = mid != null ? array[mid] : null;

    let codeLineIndex = 2; // Default to: "int low = 0, high = n - 1;"
    let action = 'init_bounds';

    if (left > right || notFound) {
      codeLineIndex = 13; // "return -1;"
      action = 'not_found';
    } else if (foundIndex != null) {
      codeLineIndex = 6; // "return mid;"
      action = 'found';
    } else if (mid != null) {
      if (array[mid] === target) {
        codeLineIndex = 5; // "if (arr[mid] == target) {"
        action = 'compare_equal';
      } else if (array[mid] < target) {
        if (left === mid + 1) {
          codeLineIndex = 8; // "low = mid + 1;"
          action = 'update_low';
        } else {
          codeLineIndex = 7; // "else if (arr[mid] < target) {"
          action = 'move_right';
        }
      } else if (array[mid] > target) {
        if (right === mid - 1) {
          codeLineIndex = 10; // "high = mid - 1;"
          action = 'update_high';
        } else {
          codeLineIndex = 9; // "else {"
          action = 'move_left';
        }
      }
    }

    return {
      step: {
        codeLineIndex,
        action,
      },
      variables: {
        low: left,
        high: right,
        mid: mid != null ? mid : 'mid',
        target,
        [`arr[${mid}]`]: mid != null && array[mid] != null ? array[mid] : 'arr[mid]',
      },
    };
  };
}, [left, right, mid, foundIndex, notFound, array, searchValue]);


  return (
     <>
             {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-gray-800/40 mx-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Left</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Mid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Right</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Found</span>
          </div>
        </div>
       <div className={`visualizer mt-24 ${className}`}>
      <SearchValueInput searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="array-container" style={{ marginTop: '5rem' }}>

        {array.map((value, index) => {
          if (index < left || index > right) return null;

          const classNames = ['element-value'];

          if (foundIndex === index) classNames.push('found');
          else if (notFound) classNames.push('not-found');
          else if (highlightMap[index]) classNames.push(highlightMap[index]);

          return (
            <div className="array-element" key={index}>
              <div className={classNames.join(' ')}>{value}</div>
              <div className="element-index">{index}</div>
            </div>
          );
        })}
      </div>
    </div>

    </>
  );
});

export default BinarySearchVisualizer;
