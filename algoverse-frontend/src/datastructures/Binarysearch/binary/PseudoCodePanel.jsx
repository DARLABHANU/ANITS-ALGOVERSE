import React, { useEffect, useState, useRef } from 'react';

const binarySearchCode = [
  { lineNumber: 1, code: "int binarySearch(int arr[], int n, int target) {", phase: 'search', action: 'function_start' },
  { lineNumber: 2, code: "  int low = 0, high = n - 1;", phase: 'search', action: 'init_bounds' },
  { lineNumber: 3, code: "  while (low <= high) {", phase: 'search', action: 'check_bounds' },
  { lineNumber: 4, code: "    int mid = (low + high) / 2;", phase: 'search', action: 'calculate_mid' },
  { lineNumber: 5, code: "    if (arr[mid] == target) {", phase: 'search', action: 'compare_equal' },
  { lineNumber: 6, code: "      return mid;", phase: 'search', action: 'found' },
  { lineNumber: 7, code: "    } else if (arr[mid] < target) {", phase: 'search', action: 'move_right' },
  { lineNumber: 8, code: "      low = mid + 1;", phase: 'search', action: 'update_low' },
  { lineNumber: 9, code: "    } else {", phase: 'search', action: 'move_left' },
  { lineNumber: 10, code: "      high = mid - 1;", phase: 'search', action: 'update_high' },
  { lineNumber: 11, code: "    }", phase: 'search', action: 'end_if' },
  { lineNumber: 12, code: "  }", phase: 'search', action: 'end_loop' },
  { lineNumber: 13, code: "  return -1;", phase: 'search', action: 'not_found' },
  { lineNumber: 14, code: "}", phase: 'search', action: 'function_end' }
];
// Assumes you're passed `stepData.steps` array
const animateCodeSteps = (steps, index = 0) => {
  if (index >= steps.length) return;

  const { codeLineIndex } = steps[index];

  setHighlightedLine(codeLineIndex); // update your highlighted state

  setTimeout(() => {
    animateCodeSteps(steps, index + 1);
  }, 500); // or use `playbackSpeed`
};

const PseudoCodePanel = ({ currentStep, className }) => {
  const [currentStepData, setCurrentStepData] = useState(null);
  const [variables, setVariables] = useState({});
  const [highlightedVars, setHighlightedVars] = useState({});
  const prevVarsRef = useRef({});

  useEffect(() => {
    const getCurrentStepData = window.getCurrentStepData;
    if (getCurrentStepData) {
      const stepData = getCurrentStepData();
      const newVars = stepData.variables || {};
      const changedVars = {};

      // Detect changes in tracked vars and highlight
      for (const key in newVars) {
        if (newVars[key] !== prevVarsRef.current[key]) {
          changedVars[key] = true;
        }
      }

      if (Object.keys(changedVars).length > 0) {
        setHighlightedVars(changedVars);
        setTimeout(() => setHighlightedVars({}), 1000);
      }

      prevVarsRef.current = { ...newVars };
      setCurrentStepData(stepData.step);
      setVariables(newVars);
    }
  }, [currentStep]);

  const getCurrentHighlightedLine = () => {
    if (!currentStepData) return -1;
    return currentStepData.codeLineIndex;
  };

  const highlightedLineIndex = getCurrentHighlightedLine();

  const substituteVariables = (code, vars) => {
    let substituted = code;

    Object.entries(vars).forEach(([key, value]) => {
      const escapedKey = key.replace(/[\[\]]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKey}\\b`, 'g');
      substituted = substituted.replace(regex, String(value));
    });

    return substituted;
  };

  const getLineClass = (index) => {
    const baseClass =
      "flex items-start px-4 py-2 transition-all duration-300 border-l-4 text-sm font-mono group hover:bg-gray-700/30";

    if (index === highlightedLineIndex) {
      return `${baseClass} bg-gradient-to-r from-yellow-500/40 to-orange-500/30 border-l-yellow-400 shadow-lg scale-[1.02] transform animate-pulse`;
    } else if (index < highlightedLineIndex) {
      return `${baseClass} bg-gradient-to-r from-green-500/15 to-emerald-500/10 border-l-green-400/70`;
    } else {
      return `${baseClass} bg-transparent border-l-gray-600/30 hover:border-l-gray-500/50`;
    }
  };

  const getDisplayCode = (step, index) => {
    if (index === highlightedLineIndex && variables) {
      return substituteVariables(step.code, variables);
    }
    return step.code;
  };

  return (
    <div
      className={`bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-600/40 shadow-2xl ${className}`}
    >
      <div className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 px-6 py-4 border-b border-gray-600/40 rounded-t-xl flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <h3 className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Binary Search Pseudocode
        </h3>
      </div>

      <div className="overflow-auto max-h-[500px] p-2">
        {binarySearchCode.map((step, index) => (
          <div key={index} className={getLineClass(index)}>
            <div className="w-10 text-gray-500 text-right mr-4 select-none text-xs pt-1 font-medium">
              {step.lineNumber || ''}
            </div>
            <div className="text-gray-200 flex-1 leading-relaxed text-sm group-hover:text-white transition-colors duration-200">
              {getDisplayCode(step, index)}
            </div>
            {index === highlightedLineIndex && (
              <div className="ml-3 pt-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-600/40 bg-gradient-to-r from-gray-800/40 to-gray-900/60">
        <p className="text-sm text-gray-300">
          <span className="text-emerald-400 font-semibold">Step:</span>{' '}
          {currentStep + 1} -{' '}
          {currentStepData
            ? currentStepData.action.replace(/_/g, ' ')
            : 'Processing...'}
        </p>
        {variables && Object.keys(variables).length > 0 && (
          <div className="mt-2 text-xs text-gray-400">
            <span className="text-blue-400 font-semibold">Variables:</span>{' '}
            {Object.entries(variables).map(([key, value]) => (
              <span
                key={key}
                className={`mr-3 transition-all duration-300 ${
                  highlightedVars[key]
                    ? 'text-yellow-400 font-bold animate-pulse'
                    : ''
                }`}
              >
                {key}={String(value)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PseudoCodePanel;
