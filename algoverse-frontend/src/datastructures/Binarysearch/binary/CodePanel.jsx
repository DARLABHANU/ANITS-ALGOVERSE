import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Plus, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const binarySearchCode = [
  { lineNumber: 1, code: "int binarySearch(int arr[], int x) {", phase: 'search', action: 'function_start' },
  { lineNumber: 2, code: "  int l = 0, r = arr.length - 1;", phase: 'search', action: 'init_bounds' },
  { lineNumber: 3, code: "  while (l <= r) {", phase: 'search', action: 'while_check' },
  { lineNumber: 4, code: "    int m = l + (r - l) / 2;", phase: 'search', action: 'calc_mid' },
  { lineNumber: 5, code: "    if (arr[m] == x)", phase: 'search', action: 'check_equal' },
  { lineNumber: 6, code: "      return m;", phase: 'search', action: 'return_index' },
  { lineNumber: 7, code: "    if (arr[m] < x)", phase: 'search', action: 'check_less' },
  { lineNumber: 8, code: "      l = m + 1;", phase: 'search', action: 'move_right' },
  { lineNumber: 9, code: "    else", phase: 'search', action: 'check_greater' },
  { lineNumber: 10, code: "      r = m - 1;", phase: 'search', action: 'move_left' },
  { lineNumber: 11, code: "  }", phase: 'search', action: 'end_while' },
  { lineNumber: 12, code: "  return -1;", phase: 'search', action: 'not_found' },
  { lineNumber: 13, code: "}", phase: 'search', action: 'function_end' }
];

const CodePanel = ({
  currentStep,
  isPlaying,
  onPlay,
  onPause,
  onRestart,
  playbackSpeed,
  onSpeedChange,
  onExampleSubmit,
  isFullScreen,
  onFullScreenToggle,
  isAnimationComplete,
  className
}) => {
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleCreateSubmit = () => {
    if (inputValue.trim()) {
      onExampleSubmit(inputValue.trim());
      setInputValue('');
      setShowCreateInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateSubmit();
    } else if (e.key === 'Escape') {
      setShowCreateInput(false);
      setInputValue('');
    }
  };

  const getLineClass = (index) => {
    const base = "flex items-start px-3 py-1.5 transition-all duration-200 border-l-2 text-sm font-mono";

    if (index === currentStep) {
      return `${base} bg-blue-500/20 border-l-blue-400`;
    } else if (index < currentStep) {
      return `${base} bg-green-500/10 border-l-green-400/50`;
    } else {
      return `${base} bg-transparent border-l-transparent`;
    }
  };

 return (
  <div
    className={`bg-gray-800/50 rounded-lg border border-gray-600/50 flex flex-col ${
      className || ''
    }`}
    style={{ height: isFullScreen ? '90vh' : '500px' }} // 🔧 Total component height
  >
    {/* Header */}
    <div className="bg-gray-700/50 px-4 py-3 border-b border-gray-600/50 rounded-t-lg flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
        <h3 className="text-sm font-semibold text-white">Binary Search Java Code</h3>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button onClick={onRestart} variant="outline" size="sm" className="border-gray-600 text-gray-300 w-8 h-8 p-0 rounded-full">
          <RotateCcw size={14} />
        </Button>
        <Button onClick={isPlaying ? onPause : onPlay} size="sm" className="bg-blue-600 hover:bg-blue-500 w-10 h-10 p-0 rounded-full">
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </Button>

        <div className="flex items-center gap-2 bg-gray-700/50 rounded-full px-3 py-1">
          <span className="text-xs text-gray-300">Speed:</span>
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-1.5 py-0.5 rounded text-xs ${
                speed === playbackSpeed ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Create Input */}
        <div className="relative group">
          <Button
            onMouseEnter={() => setShowCreateInput(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles size={14} className="mr-2" />
            Create
          </Button>

          {showCreateInput && (
            <div
              className="absolute top-full right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600/50 shadow-2xl p-4 z-50"
              onMouseLeave={() => {
                if (!inputValue) setShowCreateInput(false);
              }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <h4 className="text-sm font-semibold text-white">Create Sorted Array</h4>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="e.g., 1,3,5,7,9,11"
                    className="flex-1 bg-gray-700/50 border-gray-600/50 text-white text-sm"
                    autoFocus
                  />
                  <Button
                    onClick={handleCreateSubmit}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3"
                  >
                    ✓
                  </Button>
                </div>
                <p className="text-xs text-gray-400">Sorted input for binary search</p>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen toggle */}
        <Button
          onClick={onFullScreenToggle}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 w-8 h-8 p-0 rounded-full"
        >
          {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </Button>
      </div>
    </div>

    {/* Code Body */}
    <div className="overflow-y-auto flex-1 p-2">
      {binarySearchCode.map((step, index) => (
        <div key={index} className={getLineClass(index)}>
          <div className="w-8 text-gray-500 text-right mr-3 text-xs pt-0.5">{step.lineNumber}</div>
          <div className="text-gray-200 text-xs flex-1 leading-relaxed">{step.code}</div>
          {index === currentStep && (
            <div className="ml-2 pt-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Footer */}
    {binarySearchCode[currentStep] && (
      <div className="px-4 py-3 border-t border-gray-600/50 bg-gray-800/30 shrink-0">
        <p className="text-xs text-gray-300">
          <span className="text-blue-400 font-semibold">Line {binarySearchCode[currentStep].lineNumber}:</span>{' '}
          {binarySearchCode[currentStep].action.replace(/_/g, ' ')}
        </p>
      </div>
    )}
  </div>
);
}

export default CodePanel;
