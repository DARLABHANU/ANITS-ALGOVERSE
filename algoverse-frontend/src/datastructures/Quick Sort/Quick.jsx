import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import '@/assets/quick.css';

const quickSortCode = [
  { lineNumber: 1, code: "void quickSort(int arr[], int low, int high) {", action: "function_start" },
  { lineNumber: 2, code: "  if (low < high) {", action: "check_bounds" },
  { lineNumber: 3, code: "    int pi = partition(arr, low, high);", action: "partition_call" },
  { lineNumber: 4, code: "    quickSort(arr, low, pi - 1);", action: "recurse_left" },
  { lineNumber: 5, code: "    quickSort(arr, pi + 1, high);", action: "recurse_right" },
  { lineNumber: 6, code: "  }", action: "end_if" },
  { lineNumber: 7, code: "}", action: "function_end" },
  { lineNumber: 8, code: "int partition(int arr[], int low, int high) {", action: "partition_start" },
  { lineNumber: 9, code: "  int pivot = arr[high];", action: "select_pivot" },
  { lineNumber: 10, code: "  int i = (low - 1);", action: "init_i" },
  { lineNumber: 11, code: "  for (int j = low; j <= high - 1; j++) {", action: "loop_j" },
  { lineNumber: 12, code: "    if (arr[j] < pivot) {", action: "compare" },
  { lineNumber: 13, code: "      i++;", action: "inc_i" },
  { lineNumber: 14, code: "      swap(arr[i], arr[j]);", action: "swap_i_j" },
  { lineNumber: 15, code: "    }", action: "end_if" },
  { lineNumber: 16, code: "  }", action: "end_loop" },
  { lineNumber: 17, code: "  swap(arr[i + 1], arr[high]);", action: "swap_with_pivot" },
  { lineNumber: 18, code: "  return (i + 1);", action: "return_pi" },
  { lineNumber: 19, code: "}", action: "partition_end" }
];

const QuickSortVisualizer = forwardRef(
  ({ userInput = '', isPlaying, playbackSpeed, onPlayingChange, onAnimationComplete, className = '' }, ref) => {
    const [array, setArray] = useState([]);
    const [highlight, setHighlight] = useState([]);
    const [pivotIndex, setPivotIndex] = useState(null);
    const [sorted, setSorted] = useState([]);
    const [swapping, setSwapping] = useState([]);
    const [currentStepData, setCurrentStepData] = useState(null);

    const originalArrayRef = useRef([]);
    const timeoutRef = useRef([]);

    const resetState = () => {
      timeoutRef.current.forEach(clearTimeout);
      timeoutRef.current = [];
      setHighlight([]);
      setPivotIndex(null);
      setSorted([]);
      setSwapping([]);
      setArray([...originalArrayRef.current]);
      setCurrentStepData(null);
      onPlayingChange(false);
    };

    useImperativeHandle(ref, () => ({
      reset: resetState,
    }));

const initializeArray = () => {
  const values = userInput
    ? userInput
        .split(',')
        .map((v) => parseInt(v.trim(), 10))
        .filter((v) => !isNaN(v))
        .slice(0, 7)  // limit to 7 elements from user input
    : Array.from({ length: 7 }, () =>  // always generate exactly 7 random elements
        Math.floor(Math.random() * 100)
      );
  originalArrayRef.current = [...values];
  setArray([...values]);
  resetState();
};


    useEffect(() => { initializeArray(); }, []);
    useEffect(() => { if (userInput) initializeArray(); }, [userInput]);

    const updateStepByAction = (action, variables = {}) => {
      const codeLineIndex = quickSortCode.findIndex(line => line.action === action);
      if (codeLineIndex !== -1) {
        const stepData = {
          codeLineIndex,
          action,
          variables
        };
        setCurrentStepData(stepData);
        window.getCurrentStepData = () => ({
          step: stepData,
          variables
        });
      }
    };

    useEffect(() => {
      if (!isPlaying || array.length === 0) return;

      const sleep = (ms) =>
        new Promise((resolve) => {
          const id = setTimeout(resolve, ms);
          timeoutRef.current.push(id);
        });

      const swap = (arr, i, j) => {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      };

      const partition = async (arr, low, high) => {
        const pivot = arr[high];
        let i = low - 1;

        setPivotIndex(high);
        updateStepByAction('select_pivot', { low, high, pivot });
        await sleep(1000 / playbackSpeed);

        for (let j = low; j <= high - 1; j++) {
          setHighlight([j]);
          updateStepByAction('compare', { j, arr_j: arr[j], pivot, i });
          await sleep(1000 / playbackSpeed);

          if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
            setSwapping([i, j]);
            setArray([...arr]);
            updateStepByAction('swap_i_j', {
              i, j,
              [`arr[${i}]`]: arr[i],
              [`arr[${j}]`]: arr[j],
              pivot
            });
            await sleep(1000 / playbackSpeed);
            setSwapping([]);
          }
        }

        swap(arr, i + 1, high);
        setSwapping([i + 1, high]);
        setArray([...arr]);
        updateStepByAction('swap_with_pivot', {
          i: i + 1,
          high,
          [`arr[${i + 1}]`]: arr[i + 1],
          [`arr[${high}]`]: arr[high],
        });
        await sleep(1000 / playbackSpeed);
        setSwapping([]);
        setPivotIndex(null);
        setSorted((prev) => [...new Set([...prev, i + 1])]);
        setHighlight([]);
        return i + 1;
      };

      const quickSort = async (arr, low, high) => {
        if (low < high) {
          updateStepByAction('check_bounds', { low, high });
          const pi = await partition(arr, low, high);
          updateStepByAction('partition_call', { low, high, pi });
          await sleep(1000 / playbackSpeed);
          updateStepByAction('recurse_left', { low, high: pi - 1 });
          await quickSort(arr, low, pi - 1);
          updateStepByAction('recurse_right', { low: pi + 1, high });
          await quickSort(arr, pi + 1, high);
        } else if (low === high) {
          setSorted((prev) => [...new Set([...prev, low])]);
          updateStepByAction('check_bounds', { index: low, value: arr[low] });
        }
      };

      const runSort = async () => {
        const arrCopy = [...array];
        await quickSort(arrCopy, 0, arrCopy.length - 1);
        setSorted([...Array(arrCopy.length).keys()]);
        onPlayingChange(false);
        onAnimationComplete();
        updateStepByAction('function_end');
      };

      runSort();

      return () => timeoutRef.current.forEach(clearTimeout);
    }, [isPlaying, playbackSpeed]);

    return (
      <>
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-gray-800/40 mx-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Pivotal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
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
                  className={`element-value
                    ${pivotIndex === index ? 'pivot' : ''}
                    ${highlight.includes(index) ? 'highlight' : ''}
                    ${swapping.includes(index) ? 'swapping' : ''}
                    ${sorted.includes(index) ? 'sorted' : ''}
                  `}
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
  }
);

export default QuickSortVisualizer;
