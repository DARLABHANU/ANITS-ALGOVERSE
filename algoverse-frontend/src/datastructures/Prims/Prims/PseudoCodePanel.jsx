import React, { useEffect, useState, useRef } from 'react';

const primsPseudoCode = [
  { lineNumber: 1, code: "void primMST(Graph g) {", action: "function_start" },
  { lineNumber: 2, code: "  Set visited;", action: "init_visited" },
  { lineNumber: 3, code: "  visited.add(start);", action: "add_start_node" },
  { lineNumber: 4, code: "  while (visited.size < g.nodes) {", action: "while_condition" },
  { lineNumber: 5, code: "    Edge minEdge = findMinEdge();", action: "find_min_edge" },
  { lineNumber: 6, code: "    if (minEdge connects to unvisited) {", action: "check_unvisited" },
  { lineNumber: 7, code: "      MST.add(minEdge);", action: "add_to_mst" },
  { lineNumber: 8, code: "      visited.add(minEdge.node);", action: "mark_visited" },
  { lineNumber: 9, code: "    }", action: "end_if" },
  { lineNumber: 10, code: "  }", action: "end_while" },
  { lineNumber: 11, code: "}", action: "function_end" }
];

const PseudoCodePanel = ({ className }) => {
  const [currentStepData, setCurrentStepData] = useState(null);
  const [variables, setVariables] = useState({});
  const [highlightedVars, setHighlightedVars] = useState({});
  const [stepNumber, setStepNumber] = useState(0);
  const [isAlgorithmComplete, setIsAlgorithmComplete] = useState(false);

  const prevVarsRef = useRef({});
  const prevLineIndexRef = useRef(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      const getCurrentStepData = window.getCurrentStepData;
      if (typeof getCurrentStepData === 'function') {
        const stepData = getCurrentStepData();
        const newVars = stepData.variables || {};
        const stepInfo = stepData.step || {};

        const changed = {};
        Object.entries(newVars).forEach(([key, val]) => {
          if (prevVarsRef.current[key] !== val) {
            changed[key] = true;
          }
        });

        setHighlightedVars(changed);
        prevVarsRef.current = { ...newVars };
        setVariables(newVars);

        const algorithmComplete = stepInfo.action === 'function_end' || newVars.algorithm === 'completed';
        setIsAlgorithmComplete(algorithmComplete);

        if (stepInfo.codeLineIndex !== prevLineIndexRef.current) {
          setCurrentStepData(stepInfo);
          setStepNumber((s) => s + 1);
          prevLineIndexRef.current = stepInfo.codeLineIndex;
        }

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

  const getDisplayVariables = () => {
    if (isAlgorithmComplete) {
      const mstVars = {};
      if (variables['MST.size']) mstVars['MST.size'] = variables['MST.size'];
      if (variables['MST.weight']) mstVars['MST.weight'] = variables['MST.weight'];
      if (variables['algorithm']) mstVars['algorithm'] = variables['algorithm'];
      return mstVars;
    }
    return variables;
  };

  const displayVariables = getDisplayVariables();

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-lg ${className}`}>
      <div className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 px-6 py-4 border-b border-gray-600/40 rounded-t-xl flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <h3 className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Prim's Algorithm Pseudocode
        </h3>

      </div>

      <div className="p-2 max-h-[600px] overflow-auto">
        {primsPseudoCode.map((step, index) => (
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
        <div className="flex items-center justify-between">
          <div>
            <span className="text-blue-400">Step:</span> {stepNumber} –{" "}
            {currentStepData?.action?.replace(/_/g, " ") ?? "Processing..."}
          </div>
   
        </div>

        {displayVariables && Object.keys(displayVariables).length > 0 && (
          <div className="mt-2 text-xs">
            {Object.entries(displayVariables).map(([key, value]) => (
              <span
                key={key}
                className={`mr-3 ${
                  highlightedVars[key] ? "text-yellow-400 font-bold" : ""
                } ${
                  isAlgorithmComplete && (key === 'MST.size' || key === 'MST.weight')
                    ? "text-green-400 font-bold text-base"
                    : ""
                }`}
              >
                {key} = {value}<br/>
              </span>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default PseudoCodePanel;
