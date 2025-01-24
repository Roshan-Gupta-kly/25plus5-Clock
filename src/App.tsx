import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

type TimerType = 'break' | 'session';

function App(): JSX.Element {
  const [breakLength, setBreakLength] = useState<number>(5);
  const [sessionLength, setSessionLength] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSession, setIsSession] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLengthChange = (type: TimerType, amount: number): void => {
    if (isRunning) return;
    
    if (type === 'break') {
      const newLength = breakLength + amount;
      if (newLength >= 1 && newLength <= 60) {
        setBreakLength(newLength);
      }
    } else {
      const newLength = sessionLength + amount;
      if (newLength >= 1 && newLength <= 60) {
        setSessionLength(newLength);
        if (isSession) {
          setTimeLeft(newLength * 60);
        }
      }
    }
  };

  const handleStartStop = (): void => {
    setIsRunning(!isRunning);
  };

  const handleReset = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsSession(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            if (audioRef.current) {
              audioRef.current.play();
            }
            setIsSession((prev) => !prev);
            return (isSession ? breakLength : sessionLength) * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isSession, breakLength, sessionLength]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold text-center mb-8">25 + 5 Clock</h1>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <h2 id="break-label" className="text-xl mb-4">Break Length</h2>
            <div className="flex items-center justify-center gap-4">
              <button
                id="break-decrement"
                onClick={() => handleLengthChange('break', -1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Decrease break length"
              >
                <ChevronDown size={24} />
              </button>
              <span id="break-length" className="text-2xl font-bold min-w-[3ch]">
                {breakLength}
              </span>
              <button
                id="break-increment"
                onClick={() => handleLengthChange('break', 1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Increase break length"
              >
                <ChevronUp size={24} />
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <h2 id="session-label" className="text-xl mb-4">Session Length</h2>
            <div className="flex items-center justify-center gap-4">
              <button
                id="session-decrement"
                onClick={() => handleLengthChange('session', -1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Decrease session length"
              >
                <ChevronDown size={24} />
              </button>
              <span id="session-length" className="text-2xl font-bold min-w-[3ch]">
                {sessionLength}
              </span>
              <button
                id="session-increment"
                onClick={() => handleLengthChange('session', 1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Increase session length"
              >
                <ChevronUp size={24} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 id="timer-label" className="text-2xl mb-4">
            {isSession ? 'Session' : 'Break'}
          </h2>
          <div
            id="time-left"
            className="text-6xl font-bold mb-6 font-mono"
          >
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              id="start_stop"
              onClick={handleStartStop}
              className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-colors"
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              id="reset"
              onClick={handleReset}
              className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-colors"
              aria-label="Reset timer"
            >
              <RefreshCw size={24} />
            </button>
          </div>
        </div>
        
        <audio
          id="beep"
          ref={audioRef}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    </div>
  );
}

export default App;