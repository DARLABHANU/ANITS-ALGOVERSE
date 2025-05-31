import React, { useState, useEffect, useRef } from 'react';
import LinearSearchVisualizer from '../linear/linear.jsx';
import PseudoCodePanel from '@/datastructures/linear/PseudoCodePanel';
import EnhancedControlBar from '@/datastructures/linear/EnhancedControlBar';

const VisualizationPlayback = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const linearVisualizerRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsAnimationComplete(false);

    if (linearVisualizerRef.current?.reset) {
      linearVisualizerRef.current.reset();
    }
  };

  const handleExampleSubmit = (input) => {
    console.log('User submitted example:', input);
    setUserInput(input);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsAnimationComplete(false);
  };

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
    setIsPlaying(false);
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);

    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      className={`bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 ${
        isFullScreen
          ? 'fixed inset-0 z-50 max-w-none rounded-none border-none'
          : 'max-w-7xl mx-auto'
      }`}
    >
      <div className="flex flex-col h-full">
        <EnhancedControlBar
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onRestart={handleRestart}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          onExampleSubmit={handleExampleSubmit}
          isFullScreen={isFullScreen}
          onFullScreenToggle={handleFullScreenToggle}
          isAnimationComplete={isAnimationComplete}
          currentStep={currentStep}
        />

        <div className="flex-1 p-6 flex gap-6">
          <div className="flex-1">
            <LinearSearchVisualizer
              ref={linearVisualizerRef}
              userInput={userInput}
              currentStep={currentStep}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onStepChange={setCurrentStep}
              onPlayingChange={setIsPlaying}
              onAnimationComplete={handleAnimationComplete}
              isAnimationComplete={isAnimationComplete}
              className="h-full"
            />
          </div>

          <div className={`${isFullScreen ? 'w-96' : 'w-80'} transition-all duration-300`}>
            <PseudoCodePanel currentStep={currentStep} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPlayback;