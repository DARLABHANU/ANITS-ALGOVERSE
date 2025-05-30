import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import SearchValueInput from './SearchValueInput';
import './linear.css';

const LinearSearchVisualizer = forwardRef(({
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
  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const stepRef = useRef(0);
  const intervalRef = useRef(null);

  // Reset function
  const resetState = () => {
    clearInterval(intervalRef.current);
    stepRef.current = 0;
    setCurrentIndex(null);
    setFoundIndex(null);
    setNotFound(false);
    onStepChange(0);
    onPlayingChange(false);
  };

  // Expose reset method to parent
  useImperativeHandle(ref, () => ({
    reset: resetState,
  }));

  // Reset when userInput changes
  useEffect(() => {
    resetState();
  }, [userInput]);

  // Initialize array and search value
  useEffect(() => {
    if (userInput) {
      const values = userInput
        .split(',')
        .map(v => v.trim())
        .filter(v => !isNaN(v))
        .map(Number)
        .slice(0, 10);

      setArray(values);
      setSearchValue(values[Math.floor(Math.random() * values.length)] ?? '');
      resetState();
    } else {
      const length = Math.floor(Math.random() * 6) + 5;
      const values = Array.from({ length }, () => Math.floor(Math.random() * 100));
      setArray(values);
      setSearchValue(values[Math.floor(Math.random() * values.length)] ?? '');
      resetState();
    }
  }, [userInput]);

  // Animation / playback logic
  useEffect(() => {
    if (isPlaying && array.length > 0 && searchValue !== '') {
      if (stepRef.current >= array.length) {
        onPlayingChange(false);
        onAnimationComplete();
        return;
      }

      intervalRef.current = setInterval(() => {
        const i = stepRef.current;
        setCurrentIndex(i);

        if (array[i] === parseInt(searchValue, 10)) {
          setFoundIndex(i);
          onPlayingChange(false);
          onAnimationComplete();
          clearInterval(intervalRef.current);
        } else {
          stepRef.current += 1;
          onStepChange(stepRef.current);
        }

        if (stepRef.current >= array.length) {
          setNotFound(true);
          onPlayingChange(false);
          onAnimationComplete();
          clearInterval(intervalRef.current);
        }
      }, 1000 / playbackSpeed);

      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isPlaying, playbackSpeed, array, searchValue]);

  // Expose step and variable data for pseudocode panel
useEffect(() => {
  window.getCurrentStepData = () => {
    // Determine active index: foundIndex or currentIndex
    const activeIndex = foundIndex != null ? foundIndex : currentIndex;

    // Calculate iValue (next iteration index) except when found
    const iValue =
      foundIndex != null
        ? activeIndex // Keep found index as is
        : activeIndex != null && activeIndex + 1 < array.length
        ? activeIndex + 1
        : activeIndex != null
        ? activeIndex
        : 'i';

    return {
      step: {
        codeLineIndex:
          foundIndex != null
            ? 4 // "return i;" line should be 4 (not 3)
            : notFound
            ? 6 // "return -1;"
            : currentIndex != null
            ? 2 // "if (arr[i] == target)"
            : 1, // "for (int i = 0; i < n; i++)"
        action:
          foundIndex != null
            ? 'found'
            : notFound
            ? 'not_found'
            : 'compare',
      },
      variables: {
        i: iValue,
        target: searchValue,
        [`arr[${foundIndex != null ? activeIndex : iValue}]`]:
          foundIndex != null
            ? array[activeIndex]
            : iValue !== 'i' && iValue < array.length
            ? array[iValue]
            : 'arr[i]',
      },
    };
  };
}, [currentIndex, foundIndex, notFound, searchValue, array]);




  // Render
  return (
    <div className={`visualizer ${className}`}>
      <SearchValueInput searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="array-container">
        {array.map((value, index) => (
          <div className="array-element" key={index}>
            <div
             className={`element-value ${
                  notFound
                      ? 'not-found'
                      : index === foundIndex
                      ? 'found'
                      : index === currentIndex
                      ? 'highlight'
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
  );
});

export default LinearSearchVisualizer;