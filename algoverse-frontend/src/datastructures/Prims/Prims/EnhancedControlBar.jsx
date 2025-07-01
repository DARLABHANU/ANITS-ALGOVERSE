import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PlaybackSpeed from './PlaybackSpeed';

const EnhancedControlBar = ({
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
  currentStep,
}) => {
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

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

  return (
    <div className="bg-gradient-to-r from-gray-800/95 to-gray-700/95 backdrop-blur-md border-b border-gray-600/50">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left side - Main controls */}
          <div className="flex items-center gap-6">
            {/* Play/Pause Button */}
            <Button
              onClick={isPlaying ? onPause : onPlay}
              className="relative group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full w-16 h-16 p-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-2 border-blue-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/30 group-hover:to-purple-400/30 rounded-full transition-all duration-300"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isPlaying ? (
                <Pause size={28} className="relative z-10" />
              ) : (
                <Play size={28} className="relative z-10 ml-1" />
              )}
            </Button>

            {/* Restart Button */}
            <Button
              onClick={onRestart}
              disabled={!isAnimationComplete && currentStep === 0}
              className="relative group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 border-2 border-orange-400/30 disabled:border-gray-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 to-red-400/0 group-hover:from-orange-400/30 group-hover:to-red-400/30 rounded-full transition-all duration-300"></div>
              <RotateCcw size={24} className="relative z-10" />
            </Button>


          </div>

          {/* Center - Speed Control */}
          <div className="flex-1 max-w-md mx-8">
            <PlaybackSpeed value={playbackSpeed} onChange={onSpeedChange} />
          </div>

          {/* Right side - Fullscreen */}
          <div className="flex items-center">
            <Button
              onClick={onFullScreenToggle}
              className="relative group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 to-indigo-400/0 group-hover:from-purple-400/30 group-hover:to-indigo-400/30 rounded-full transition-all duration-300"></div>
              {isFullScreen ? (
                <Minimize size={24} className="relative z-10" />
              ) : (
                <Maximize size={24} className="relative z-10" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedControlBar;
