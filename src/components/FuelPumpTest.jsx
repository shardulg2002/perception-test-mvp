import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const CONFIG = {
  MIN_BLAST_TIME: 1000, // 1 second minimum
  MAX_BLAST_TIME: 10000, // 10 seconds maximum
  TOTAL_TRIALS: 3,
  POINTS_PER_PUMP: 1
};

export default function FuelPumpTest({ onComplete }) {
  const [currentTrial, setCurrentTrial] = useState(1);
  const [trialState, setTrialState] = useState('ready'); // ready | pumping | stopped | exploded
  const [pumpCount, setPumpCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [trialPoints, setTrialPoints] = useState(0);
  const [fuelLevel, setFuelLevel] = useState(0); // 0-100%
  const [showExplosion, setShowExplosion] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const trialStateRef = useRef('ready');
  const startTimeRef = useRef(null);
  const blastTimeRef = useRef(null);
  const animationRef = useRef(null);
  const pumpCountRef = useRef(0);
  const firstPumpRef = useRef(false);
  
  const trialResults = useRef([]);

  // Sync state to ref
  useEffect(() => {
    trialStateRef.current = trialState;
  }, [trialState]);

  // Generate random blast time for new trial
  const startNewTrial = () => {
    const randomBlastTime = Math.floor(
      Math.random() * (CONFIG.MAX_BLAST_TIME - CONFIG.MIN_BLAST_TIME + 1) + CONFIG.MIN_BLAST_TIME
    );
    
    console.log(`🎮 Trial ${currentTrial} - Blast time: ${randomBlastTime}ms (${(randomBlastTime/1000).toFixed(1)}s)`);
    
    blastTimeRef.current = randomBlastTime;
    startTimeRef.current = null;
    firstPumpRef.current = false;
    pumpCountRef.current = 0;
    
    setPumpCount(0);
    setTrialPoints(0);
    setFuelLevel(0);
    setElapsedTime(0);
    setShowExplosion(false);
    setTrialState('ready');
  };

  // Initialize first trial
  useEffect(() => {
    startNewTrial();
  }, []);

  // Handle pump action
  const handlePump = () => {
    console.log('⛽ PUMP! State:', trialStateRef.current, '| First pump:', !firstPumpRef.current);
    
    if (trialStateRef.current !== 'ready' && trialStateRef.current !== 'pumping') {
      console.log('⚠️ Ignoring pump - trial not active');
      return;
    }

    // Start timer on first pump
    if (!firstPumpRef.current) {
      console.log('🏁 Starting timer on first pump');
      firstPumpRef.current = true;
      startTimeRef.current = performance.now();
      setTrialState('pumping');
      trialStateRef.current = 'pumping';
      startAnimation();
    }

    // Increment pump count
    pumpCountRef.current += 1;
    const newPumpCount = pumpCountRef.current;
    const newPoints = newPumpCount * CONFIG.POINTS_PER_PUMP;
    
    flushSync(() => {
      setPumpCount(newPumpCount);
      setTrialPoints(newPoints);
    });
    
    console.log(`💰 Pumps: ${newPumpCount} | Trial Points: ${newPoints}`);
  };

  // Animation loop to check for explosion
  const startAnimation = () => {
    const animate = () => {
      if (!startTimeRef.current || !blastTimeRef.current) return;
      
      const currentTime = performance.now();
      const elapsed = currentTime - startTimeRef.current;
      const progress = (elapsed / blastTimeRef.current) * 100;
      
      flushSync(() => {
        setElapsedTime(elapsed);
        setFuelLevel(Math.min(progress, 100));
      });

      // Check for explosion
      if (elapsed >= blastTimeRef.current) {
        console.log('💥 EXPLOSION! Time exceeded');
        handleExplosion();
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle stop button
  const handleStop = () => {
    console.log('🛑 STOP pressed! State:', trialStateRef.current);
    
    if (trialStateRef.current !== 'pumping') {
      console.log('⚠️ Ignoring STOP - not pumping');
      return;
    }

    console.log('✅ Points secured:', trialPoints);
    
    // Cancel animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Add trial points to total
    const newTotal = totalPoints + trialPoints;
    setTotalPoints(newTotal);
    setTrialState('stopped');
    
    // Record trial result
    trialResults.current.push({
      trial: currentTrial,
      outcome: 'success',
      pumps: pumpCount,
      points: trialPoints,
      timeElapsed: elapsedTime,
      blastTime: blastTimeRef.current
    });

    console.log(`📊 Trial ${currentTrial} complete - Points: ${trialPoints} | Total: ${newTotal}`);
  };

  // Handle explosion
  const handleExplosion = () => {
    console.log('💥 EXPLOSION! Points lost for this trial');
    
    // Cancel animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    flushSync(() => {
      setShowExplosion(true);
      setTrialState('exploded');
    });
    
    // Record trial result
    trialResults.current.push({
      trial: currentTrial,
      outcome: 'explosion',
      pumps: pumpCount,
      points: 0, // Lost all points
      timeElapsed: elapsedTime,
      blastTime: blastTimeRef.current
    });

    console.log(`📊 Trial ${currentTrial} exploded - Points lost: ${trialPoints}`);
  };

  // Handle next trial or completion
  const handleNextTrial = () => {
    if (currentTrial < CONFIG.TOTAL_TRIALS) {
      console.log(`➡️ Moving to Trial ${currentTrial + 1}`);
      setCurrentTrial(currentTrial + 1);
      startNewTrial();
    } else {
      console.log('🏁 All trials complete! Final score:', totalPoints);
      onComplete({
        totalPoints,
        trials: trialResults.current
      });
    }
  };

  // Keyboard handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              ⛽ Fuel Pump Risk Task
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Trial {currentTrial} of {CONFIG.TOTAL_TRIALS}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">
              {totalPoints}
            </div>
            <div className="text-xs text-gray-500">Total Points</div>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="bg-gradient-to-b from-sky-200 to-gray-100 rounded-lg shadow-lg overflow-hidden border-4 border-gray-300 p-8">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-auto"
        >
          {/* Ground */}
          <rect x="0" y="300" width="600" height="100" fill="#374151" />
          <line x1="0" y1="300" x2="600" y2="300" stroke="#FCD34D" strokeWidth="3" />

          {/* Gas Station */}
          <rect x="400" y="150" width="150" height="150" fill="#DC2626" />
          <rect x="415" y="165" width="120" height="30" fill="#FFFFFF" />
          <text x="475" y="185" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#DC2626">
            GAS
          </text>
          
          {/* Pump Machine */}
          <rect x="340" y="220" width="50" height="80" fill="#1F2937" rx="5" />
          <circle cx="365" cy="250" r="15" fill="#10B981" opacity={trialState === 'pumping' ? 1 : 0.3} />
          
          {/* Fuel Hose */}
          <path
            d="M 365 260 Q 320 270, 280 260"
            stroke="#1F2937"
            strokeWidth="8"
            fill="none"
          />

          {/* Car */}
          <g transform="translate(150, 230)">
            {/* Car body */}
            <rect x="0" y="20" width="120" height="40" fill="#3B82F6" rx="8" />
            <rect x="10" y="5" width="100" height="20" fill="#E0F2FE" rx="5" />
            
            {/* Wheels */}
            <circle cx="25" cy="65" r="12" fill="#1F2937" />
            <circle cx="95" cy="65" r="12" fill="#1F2937" />
            
            {/* Fuel Tank (visual fill) */}
            <rect x="85" y="25" width="30" height="30" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" rx="3" />
            <rect 
              x="87" 
              y={55 - (fuelLevel * 0.26)} 
              width="26" 
              height={fuelLevel * 0.26} 
              fill="#EF4444" 
              opacity="0.8"
            />
            
            {/* Fuel cap */}
            <circle cx="100" cy="40" r="5" fill="#DC2626" />
          </g>

          {/* Explosion Effect */}
          {showExplosion && (
            <>
              <circle cx="210" cy="250" r="60" fill="#FCA5A5" opacity="0.7">
                <animate attributeName="r" from="60" to="100" dur="0.5s" repeatCount="1" />
                <animate attributeName="opacity" from="0.7" to="0" dur="0.5s" repeatCount="1" />
              </circle>
              <text x="210" y="260" textAnchor="middle" fontSize="48" fill="#DC2626">💥</text>
            </>
          )}

          {/* Points Display */}
          <g transform="translate(30, 50)">
            <rect x="0" y="0" width="180" height="80" fill="white" opacity="0.9" rx="10" />
            <text x="90" y="30" textAnchor="middle" fontSize="14" fill="#6B7280">Trial Points</text>
            <text x="90" y="60" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#059669">
              {trialPoints}
            </text>
          </g>

          {/* Pump Counter */}
          <g transform="translate(30, 150)">
            <rect x="0" y="0" width="180" height="60" fill="white" opacity="0.9" rx="10" />
            <text x="90" y="25" textAnchor="middle" fontSize="14" fill="#6B7280">Pumps</text>
            <text x="90" y="50" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#3B82F6">
              {pumpCount}
            </text>
          </g>

          {/* Ready State Message */}
          {trialState === 'ready' && (
            <text x="300" y="370" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1F2937">
              Press SPACEBAR to pump fuel
            </text>
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-center gap-4">
        {trialState === 'pumping' && (
          <button
            onClick={handleStop}
            className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-700 transition-all transform hover:scale-105"
          >
            🛑 STOP & SECURE POINTS
          </button>
        )}

        {(trialState === 'stopped' || trialState === 'exploded') && (
          <div className="text-center">
            <div className="mb-4">
              {trialState === 'stopped' ? (
                <div className="text-green-600 text-2xl font-bold">
                  ✅ Points Secured: +{trialPoints}
                </div>
              ) : (
                <div className="text-red-600 text-2xl font-bold">
                  💥 Explosion! Points Lost: {trialPoints}
                </div>
              )}
              <div className="text-gray-700 text-lg mt-2">
                Total Points: {totalPoints}
              </div>
            </div>
            <button
              onClick={handleNextTrial}
              className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              {currentTrial < CONFIG.TOTAL_TRIALS ? `Next Trial (${currentTrial + 1}/${CONFIG.TOTAL_TRIALS})` : 'Complete Test'}
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <h3 className="font-bold text-blue-900 mb-2">How to Play:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Press <kbd className="px-2 py-1 bg-white rounded border">SPACEBAR</kbd> to pump fuel (+1 point per pump)</li>
          <li>• The car will explode after a random time (1-10 seconds)</li>
          <li>• Click <strong>STOP</strong> before explosion to secure your points</li>
          <li>• If the car explodes, you lose all points for that trial</li>
          <li>• Successfully secured points carry forward to the next trial</li>
        </ul>
      </div>
    </div>
  );
}
