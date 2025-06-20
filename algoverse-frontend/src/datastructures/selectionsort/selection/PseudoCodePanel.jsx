import React, { useEffect, useState, useRef } from 'react';

const selectionSortCode = [
  { lineNumber: 1, code: "void selectionSort(int arr[], int n) {", action: "function_start" },
  { lineNumber: 2, code: "  for (int i = 0; i < n - 1; i++) {", action: "outer_loop" },
  { lineNumber: 3, code: "    int min_idx = i;", action: "init_min" },
  { lineNumber: 4, code: "    for (int j = i + 1; j < n; j++) {", action: "inner_loop" },
  { lineNumber: 5, code: "      if (arr[j] < arr[min_idx]) {", action: "compare" },
  { lineNumber: 6, code: "        min_idx = j;", action: "update_min" },
  { lineNumber: 7, code: "      }", action: "end_if" },
  { lineNumber: 8, code: "    }", action: "end_inner_loop" },
  { lineNumber: 9, code: "    swap(arr[i], arr[min_idx]);", action: "swap" },
  { lineNumber: 10, code: "  }", action: "end_outer_loop" },
  { lineNumber: 11, code: "}", action: "function_end" }
];

const PseudoCodePanel = ({ className }) => {
  const [currentStepData, setCurrentStepData] = useState(null);
  const [variables, setVariables] = useState({});
  const [highlightedVars, setHighlightedVars] = useState({});
  const [stepNumber, setStepNumber] = useState(0);

  const prevVarsRef = useRef({});
  const prevLineIndexRef = useRef(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      const getCurrentStepData = window.getCurrentStepData;
      if (typeof getCurrentStepData === 'function') {
        const stepData = getCurrentStepData();
        const newVars = stepData.variables || {};
        const stepInfo = stepData.step || {};

        // Detect variable changes
        const changed = {};
        Object.entries(newVars).forEach(([key, val]) => {
          if (prevVarsRef.current[key] !== val) {
            changed[key] = true;
          }
        });

        setHighlightedVars(changed);
        prevVarsRef.current = { ...newVars };
        setVariables(newVars);

        // Update current line only if changed
        if (stepInfo.codeLineIndex !== prevLineIndexRef.current) {
          setCurrentStepData(stepInfo);
          setStepNumber((s) => s + 1);
          prevLineIndexRef.current = stepInfo.codeLineIndex;
        }

        // Remove highlights after 1s
        setTimeout(() => setHighlightedVars({}), 1000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const highlightedLineIndex = currentStepData?.codeLineIndex ?? -1;

  const substituteVariables = (code, vars) => {
    let result = code;
    for (const [key, value] of Object.entries(vars)) {
      const escapedKey = key.replace(/[\[\]]/g, '\\$&');
      result = result.replace(new RegExp(`\\b${escapedKey}\\b`, 'g'), String(value));
    }
    return result;
  };

  const getLineClass = (index) => {
    const base = "flex items-start px-4 py-2 border-l-4 text-sm font-mono transition-all group";
    if (index === highlightedLineIndex)
      return `${base} bg-yellow-100/10 border-yellow-400 animate-pulse scale-[1.01]`;
    if (highlightedLineIndex !== -1 && index < highlightedLineIndex)
      return `${base} bg-green-100/10 border-green-400`;
    return `${base} border-gray-600 hover:bg-gray-700/20`;
  };

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-lg ${className}`}>
      <div className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 px-6 py-4 border-b border-gray-600/40 rounded-t-xl flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <h3 className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Selection Sort Pseudocode
        </h3>
      </div>

      <div className="p-2 max-h-[600px] overflow-auto">
        {selectionSortCode.map((step, index) => (
          <div key={index} className={getLineClass(index)}>
            <div className="w-10 text-gray-500 mr-4 select-none text-xs">
              {step.lineNumber}
            </div>
            <div className="text-white flex-1">
              {highlightedLineIndex === index
                ? substituteVariables(step.code, variables)
                : step.code}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-700 text-gray-300 text-sm">
        <div>
          <span className="text-blue-400">Step:</span> {stepNumber} –{" "}
          {currentStepData?.action?.replace(/_/g, " ") ?? "Processing..."}
        </div>
        {variables && (
          <div className="mt-2 text-xs">
            {Object.entries(variables).map(([key, value]) => (
              <span
                key={key}
                className={`mr-3 ${
                  highlightedVars[key] ? "text-yellow-400 font-bold" : ""
                }`}
              >
                {key} = {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PseudoCodePanel;
