import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import CarIcon from './CarIcon';

// Test configuration constants
const CONFIG = {
  VISIBLE_DURATION: 5000, // 5 seconds car is visible
  HIDDEN_DURATION: 3500, // 3.5 seconds hidden before collision (if not stopped)
  LANE_WIDTH: 800,
  LANE_HEIGHT: 150,
  CAR_START_X: 50,
  OBSTACLE_X: 700,
  CAR_WIDTH: 60,
  CAR_HEIGHT: 30
};

// Calculate speed so car reaches obstacle in total time
const TOTAL_DURATION = CONFIG.VISIBLE_DURATION + CONFIG.HIDDEN_DURATION;
const TOTAL_DISTANCE = CONFIG.OBSTACLE_X - CONFIG.CAR_START_X - CONFIG.CAR_WIDTH;
const CALCULATED_SPEED = (TOTAL_DISTANCE / TOTAL_DURATION) * 1000; // pixels per second

export default function TestCanvas({ onTestComplete, onTestStart }) {
  const [testState, setTestState] = useState('idle');
  
  // Sync testState to ref for event handlers
  useEffect(() => {
    testStateRef.current = testState;
  }, [testState]);
  const [countdown, setCountdown] = useState(3);
  const [carPosition, setCarPosition] = useState(CONFIG.CAR_START_X);
  const [isCarVisible, setIsCarVisible] = useState(true);
  const [showCollision, setShowCollision] = useState(false);
  
  const animationRef = useRef(null);
  const carPositionRef = useRef(CONFIG.CAR_START_X); // Track position in ref
  const testStateRef = useRef('idle'); // Track test state in ref for event handlers
  const timingRef = useRef({
    startTime: null,
    hideTime: null,
    stopTime: null,
    collisionTime: null
  });

  // Debug render log
  console.log(`🔄 RENDER: state=${testState}, carPos=${carPosition.toFixed(1)}, visible=${isCarVisible}`);

  /**
   * Start the actual test
   */
  const startTest = () => {
    console.log('🚗 START TEST - Setting state to running');
    setTestState('running');
    setCarPosition(CONFIG.CAR_START_X);
    carPositionRef.current = CONFIG.CAR_START_X;
    setIsCarVisible(true);
    setShowCollision(false);
    
    const startTime = performance.now();
    timingRef.current = {
      startTime,
      hideTime: null,
      stopTime: null,
      collisionTime: null
    };

    if (onTestStart) onTestStart();
    
    // Animation loop
    const animateLoop = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const distance = (CALCULATED_SPEED * elapsed) / 1000;
      const newPosition = CONFIG.CAR_START_X + distance;
      
      console.log(`🎬 Frame: elapsed=${elapsed.toFixed(0)}ms, pos=${newPosition.toFixed(1)}px, state=${testState}`);
      
      // Update ref immediately
      carPositionRef.current = newPosition;
      // Force synchronous update for immediate rendering
      flushSync(() => {
        setCarPosition(newPosition);
      });

      // Check if car should be hidden
      if (elapsed >= CONFIG.VISIBLE_DURATION && timingRef.current.hideTime === null) {
        console.log('🙈 HIDING CAR at', elapsed.toFixed(0), 'ms');
        flushSync(() => {
          setIsCarVisible(false);
          setTestState('hidden');
        });
        timingRef.current.hideTime = currentTime;
      }

      // Check for collision
      if (newPosition + CONFIG.CAR_WIDTH >= CONFIG.OBSTACLE_X) {
        console.log('💥 COLLISION DETECTED');
        timingRef.current.collisionTime = currentTime;
        flushSync(() => {
          setShowCollision(true);
          setTestState('finished');
        });
        
        const result = {
          outcome: 'fail',
          visibleDuration: CONFIG.VISIBLE_DURATION,
          speed: CALCULATED_SPEED,
          hideTime: timingRef.current.hideTime,
          stopTime: null,
          collisionTime: currentTime,
          positionAtStop: newPosition,
          distanceToObstacle: CONFIG.OBSTACLE_X - newPosition - CONFIG.CAR_WIDTH,
          reactionLatency: null
        };

        setTimeout(() => {
          if (onTestComplete) onTestComplete(result);
        }, 500);
        return; // Stop animation
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(animateLoop);
    };
    
    console.log('🎬 STARTING ANIMATION LOOP');
    animationRef.current = requestAnimationFrame(animateLoop);
  };

  /**
   * Handle stop button press
   */
  const handleStop = () => {
    console.log('🛑 STOP pressed! Current state:', testStateRef.current);
    if (testStateRef.current !== 'running' && testStateRef.current !== 'hidden') {
      console.log('⚠️ Ignoring STOP - test not active');
      return;
    }
    
    console.log('✅ STOP accepted - stopping car');

    const currentTime = performance.now();
    const elapsed = currentTime - timingRef.current.startTime;
    const distance = (CALCULATED_SPEED * elapsed) / 1000;
    const position = CONFIG.CAR_START_X + distance;
    
    timingRef.current.stopTime = currentTime;
    testStateRef.current = 'finished'; // Update ref immediately
    setTestState('finished');
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const distanceToObstacle = CONFIG.OBSTACLE_X - (position + CONFIG.CAR_WIDTH);
    const reactionLatency = timingRef.current.hideTime 
      ? currentTime - timingRef.current.hideTime 
      : null;

    const result = {
      outcome: distanceToObstacle >= 0 ? 'success' : 'fail',
      visibleDuration: CONFIG.VISIBLE_DURATION,
      speed: CALCULATED_SPEED,
      hideTime: timingRef.current.hideTime,
      stopTime: currentTime,
      collisionTime: null,
      positionAtStop: position,
      distanceToObstacle: distanceToObstacle,
      reactionLatency: reactionLatency
    };

    if (onTestComplete) onTestComplete(result);
  };

  /**
   * Start countdown before test
   */
  const startCountdown = () => {
    console.log('⏱️ STARTING COUNTDOWN');
    setTestState('countdown');
    setCountdown(3);
    
    let count = 3;
    const countdownInterval = setInterval(() => {
      count -= 1;
      console.log('⏱️ Countdown:', count);
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(countdownInterval);
        console.log('⏱️ Countdown finished, calling startTest()');
        startTest();
      }
    }, 1000);
  };

  /**
   * Keyboard event handler
   */
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  /**
   * Cleanup animation on unmount
   */
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* SVG Canvas */}
      <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden border-4 border-gray-300">
        <svg
          viewBox={`0 0 ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT}`}
          className="w-full h-auto"
          style={{ maxHeight: '300px' }}
        >
          {/* Road/Lane */}
          <rect
            x="0"
            y="60"
            width={CONFIG.LANE_WIDTH}
            height="80"
            fill="#374151"
          />
          
          {/* Lane markings */}
          <line
            x1="0"
            y1="100"
            x2={CONFIG.LANE_WIDTH}
            y2="100"
            stroke="#FCD34D"
            strokeWidth="2"
            strokeDasharray="20,10"
          />

          {/* Obstacle (Wall/Barrier) */}
          <rect
            x={CONFIG.OBSTACLE_X}
            y="50"
            width="15"
            height="90"
            fill="#EF4444"
            rx="2"
          />
          
          {/* Obstacle stripes */}
          <rect x={CONFIG.OBSTACLE_X + 2} y="55" width="11" height="15" fill="#FEE2E2" />
          <rect x={CONFIG.OBSTACLE_X + 2} y="75" width="11" height="15" fill="#FEE2E2" />
          <rect x={CONFIG.OBSTACLE_X + 2} y="95" width="11" height="15" fill="#FEE2E2" />
          <rect x={CONFIG.OBSTACLE_X + 2} y="115" width="11" height="15" fill="#FEE2E2" />

          {/* Car (SVG embedded) */}
          {(testState === 'running' || testState === 'hidden' || testState === 'finished') && (
            <g
              transform={`translate(${carPosition}, 70)`}
              opacity={isCarVisible ? 1 : 0}
            >
              <CarIcon width={CONFIG.CAR_WIDTH} height={CONFIG.CAR_HEIGHT} />
            </g>
          )}

          {/* Collision indicator */}
          {showCollision && (
            <g transform={`translate(${CONFIG.OBSTACLE_X - 20}, 80)`}>
              <circle cx="10" cy="10" r="15" fill="#FCA5A5" opacity="0.7" />
              <text x="10" y="15" textAnchor="middle" fontSize="20" fill="#7F1D1D">💥</text>
            </g>
          )}

          {/* Countdown display */}
          {testState === 'countdown' && (
            <text
              x={CONFIG.LANE_WIDTH / 2}
              y={CONFIG.LANE_HEIGHT / 2}
              textAnchor="middle"
              fontSize="48"
              fontWeight="bold"
              fill="#1F2937"
            >
              {countdown}
            </text>
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-6 text-center">
        {testState === 'idle' && (
          <button
            onClick={startCountdown}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg"
          >
            Start Test
          </button>
        )}

        {(testState === 'running' || testState === 'hidden') && (
          <button
            onClick={handleStop}
            className="px-12 py-6 bg-red-600 text-white font-bold rounded-lg shadow-xl hover:bg-red-700 transition-all text-2xl transform hover:scale-105"
            aria-label="Stop the car"
          >
            STOP
          </button>
        )}

        {(testState === 'running' || testState === 'hidden') && (
          <p className="mt-3 text-sm text-gray-600">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded">Space</kbd> or click STOP button
          </p>
        )}
      </div>
    </div>
  );
}
