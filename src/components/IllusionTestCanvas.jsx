import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const CONFIG = {
  SCENARIO_DURATION: 2000, // 2 seconds to react
  LANE_WIDTH: 800,
  LANE_HEIGHT: 400,
  HAZARD_START_X: 700,
  HAZARD_SPEED: 200, // pixels per second
};

export default function IllusionTestCanvas({ mode, onComplete }) {
  const [scenarioState, setScenarioState] = useState('playing'); // playing | finished
  const [userAction, setUserAction] = useState(null); // left, right, accelerate, brake, none
  const [hazardPosition, setHazardPosition] = useState(CONFIG.HAZARD_START_X);
  const [playerLane, setPlayerLane] = useState(1); // 0=left, 1=center, 2=right
  const [showFeedback, setShowFeedback] = useState(false);
  
  const animationRef = useRef(null);
  const hazardPositionRef = useRef(CONFIG.HAZARD_START_X);
  const userActionRef = useRef(null); // Track if action already taken
  const timingRef = useRef({
    startTime: null,
    actionTime: null
  });

  /**
   * Calculate outcome based on mode and action
   */
  const calculateOutcome = (action, mode) => {
    if (mode === 'assist' && action === null) {
      // No intervention - system handles it
      return {
        result: 'near-miss',
        description: 'System handles it, but just barely. Near-Miss (Fast braking, close distance).',
        attribution: 'Other Driver'
      };
    }

    if (mode === 'manual' && action === null) {
      // No action in manual mode
      return {
        result: 'crash',
        description: 'No intervention taken. Collision occurred.',
        attribution: 'Self'
      };
    }

    // User took action
    const outcomes = {
      brake: {
        manual: {
          result: 'near-miss',
          description: 'Quick brake! You managed to slow down just in time. Near-Miss.',
          attribution: 'Self'
        },
        assist: {
          result: 'crash',
          description: 'Brake: System\'s automatic braking and your manual brake are out of sync, leading to a Minor Collision (scrape).',
          attribution: 'System Conflict'
        }
      },
      accelerate: {
        manual: {
          result: 'near-miss',
          description: 'You accelerated past the hazard. Close call but safe. Near-Miss.',
          attribution: 'Self'
        },
        assist: {
          result: 'near-miss',
          description: 'Accelerate: System overrides your acceleration to prevent collision, leading to a sudden, but safe, Near-Miss.',
          attribution: 'Driver-Assist'
        }
      },
      left: {
        manual: {
          result: 'near-miss',
          description: 'Steered left into the adjacent lane. Close but avoided collision. Near-Miss.',
          attribution: 'Self'
        },
        assist: {
          result: 'near-miss',
          description: 'Steer Left: System attempts to keep lane; resulting conflict leads to a Near-Miss (Loud Horn/Swerve).',
          attribution: 'Self/Driver-Assist Conflict'
        }
      },
      right: {
        manual: {
          result: 'near-miss',
          description: 'Steered right into the adjacent lane. Narrowly avoided the hazard. Near-Miss.',
          attribution: 'Self'
        },
        assist: {
          result: 'near-miss',
          description: 'Steer Right: System attempts to keep lane; resulting conflict leads to a Near-Miss (Loud Horn/Swerve).',
          attribution: 'Self/Driver-Assist Conflict'
        }
      }
    };

    return outcomes[action][mode];
  };

  /**
   * Handle keyboard input
   */
  const handleKeyPress = (e) => {
    console.log('🎮 Key pressed:', e.key, '| Current state:', scenarioState, '| Current action:', userAction);
    
    if (scenarioState !== 'playing') {
      console.log('⚠️ Ignoring key - scenario not playing');
      return;
    }

    let action = null;

    // Arrow keys
    if (e.key === 'ArrowLeft') action = 'left';
    if (e.key === 'ArrowRight') action = 'right';
    if (e.key === 'ArrowUp') action = 'accelerate';
    if (e.key === 'ArrowDown') action = 'brake';

    // WASD keys (case-insensitive)
    const keyLower = e.key.toLowerCase();
    if (keyLower === 'a') action = 'left';
    if (keyLower === 'd') action = 'right';
    if (keyLower === 'w') action = 'accelerate';
    if (keyLower === 's') action = 'brake';

    if (action) {
      e.preventDefault();
      console.log('✅ Action registered:', action);
      
      // Only record first action - use ref for immediate check
      if (userActionRef.current === null) {
        userActionRef.current = action; // Set ref immediately
        setUserAction(action);
        timingRef.current.actionTime = performance.now();
        console.log('📝 First action recorded:', action, 'at', timingRef.current.actionTime);
      } else {
        console.log('⚠️ Action already recorded (' + userActionRef.current + '), ignoring:', action);
        return; // Early return to prevent any further processing
      }
      
      setShowFeedback(true);

      // Visual feedback for steering
      if (action === 'left' && playerLane > 0) {
        setPlayerLane(prev => prev - 1);
      }
      if (action === 'right' && playerLane < 2) {
        setPlayerLane(prev => prev + 1);
      }
    } else {
      console.log('❌ Unknown key, no action');
    }
  };

  /**
   * Animation loop
   */
  useEffect(() => {
    if (scenarioState !== 'playing') return;

    console.log('🚙 ILLUSION TEST - Starting animation');
    const startTime = performance.now();
    timingRef.current.startTime = startTime;
    userActionRef.current = null; // Reset action ref for new scenario
    let localUserAction = null; // Track user action locally

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;

      // Move hazard car toward player
      const distance = (CONFIG.HAZARD_SPEED * elapsed) / 1000;
      const newPosition = CONFIG.HAZARD_START_X - distance;
      console.log(`🎬 Hazard: elapsed=${elapsed.toFixed(0)}ms, pos=${newPosition.toFixed(1)}px`);
      
      // Update ref immediately
      hazardPositionRef.current = newPosition;
      // Force synchronous update for immediate rendering
      flushSync(() => {
        setHazardPosition(newPosition);
      });

      // Check if time is up
      if (elapsed >= CONFIG.SCENARIO_DURATION) {
        console.log('⏱️ ILLUSION TEST - Time up, scenario finished');
        flushSync(() => {
          setScenarioState('finished');
        });
        
        // Read latest userAction from state at the end
        setUserAction(prevAction => {
          localUserAction = prevAction;
          return prevAction;
        });
        
        setTimeout(() => {
          const outcome = calculateOutcome(localUserAction, mode);
          if (onComplete) {
            onComplete({
              mode,
              action: localUserAction,
              reactionTime: timingRef.current.actionTime 
                ? timingRef.current.actionTime - startTime 
                : null,
              ...outcome
            });
          }
        }, 500);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scenarioState]); // Only depend on scenarioState

  /**
   * Keyboard listeners
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getLaneY = (lane) => {
    return 250 + (lane * 60); // Center is lane 1
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* SVG Canvas */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border-4 border-gray-600">
        <svg
          viewBox={`0 0 ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT}`}
          className="w-full h-auto"
        >
          {/* Sky */}
          <rect x="0" y="0" width={CONFIG.LANE_WIDTH} height="200" fill="#87CEEB" />
          
          {/* Road - perspective view */}
          <path
            d={`M 300 200 L 0 ${CONFIG.LANE_HEIGHT} L ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT} L 500 200 Z`}
            fill="#374151"
          />

          {/* Lane markings - left */}
          <line x1="250" y1="200" x2="100" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />
          {/* Lane markings - center left */}
          <line x1="350" y1="200" x2="250" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />
          {/* Lane markings - center right */}
          <line x1="450" y1="200" x2="550" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />
          {/* Lane markings - right */}
          <line x1="550" y1="200" x2="700" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />

          {/* Hazard car (merging from right side) */}
          {hazardPosition > 300 && (
            <g transform={`translate(${hazardPosition}, 180)`}>
              <rect x="-30" y="0" width="60" height="40" fill="#DC2626" rx="5" />
              <rect x="-25" y="5" width="20" height="15" fill="#FEE2E2" />
              <rect x="5" y="5" width="20" height="15" fill="#FEE2E2" />
              <circle cx="-20" cy="40" r="5" fill="#1F2937" />
              <circle cx="20" cy="40" r="5" fill="#1F2937" />
            </g>
          )}

          {/* Player car (bottom - driver's perspective) */}
          <g transform={`translate(${380 + (playerLane - 1) * 100}, ${getLaneY(1)})`}>
            {/* Car body */}
            <rect x="-40" y="0" width="80" height="120" fill="#3B82F6" rx="8" />
            
            {/* Windshield */}
            <rect x="-35" y="10" width="70" height="40" fill="#E0F2FE" opacity="0.7" rx="4" />
            
            {/* Side mirrors */}
            <rect x="-50" y="40" width="10" height="15" fill="#1F2937" rx="2" />
            <rect x="40" y="40" width="10" height="15" fill="#1F2937" rx="2" />
            
            {/* Brake lights (show if braking) */}
            {showFeedback && userAction === 'brake' && (
              <>
                <circle cx="-30" cy="115" r="6" fill="#EF4444" opacity="0.9" />
                <circle cx="30" cy="115" r="6" fill="#EF4444" opacity="0.9" />
              </>
            )}
            
            {/* Headlights (show if accelerating) */}
            {showFeedback && userAction === 'accelerate' && (
              <>
                <circle cx="-25" cy="5" r="4" fill="#FEF08A" opacity="0.95" />
                <circle cx="25" cy="5" r="4" fill="#FEF08A" opacity="0.95" />
                <ellipse cx="-25" cy="-10" rx="8" ry="15" fill="#FEF08A" opacity="0.4" />
                <ellipse cx="25" cy="-10" rx="8" ry="15" fill="#FEF08A" opacity="0.4" />
              </>
            )}
          </g>

          {/* Driver Assist indicator */}
          {mode === 'assist' && (
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="150" height="30" fill="#10B981" rx="5" opacity="0.9" />
              <text x="75" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                🤖 ASSIST ON
              </text>
            </g>
          )}

          {/* Action feedback */}
          {showFeedback && userAction && (
            <g transform="translate(400, 100)">
              <text x="0" y="0" textAnchor="middle" fill="#FCD34D" fontSize="24" fontWeight="bold">
                {userAction.toUpperCase()}!
              </text>
            </g>
          )}

          {/* Timer bar */}
          <rect 
            x="200" 
            y="10" 
            width="400" 
            height="10" 
            fill="#374151" 
            rx="5" 
          />
          <rect 
            x="200" 
            y="10" 
            width={(hazardPosition / CONFIG.HAZARD_START_X) * 400} 
            height="10" 
            fill="#EF4444" 
            rx="5" 
          />
        </svg>
      </div>

      {/* Controls instruction */}
      <div className="mt-4 text-center">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {mode === 'assist' ? '🤖 Driver Assist is Active - You can intervene if needed' : '🚗 Manual Control - You are in control'}
          </p>
          
          {/* Show current action status */}
          {userAction && (
            <div className="mb-3 p-2 bg-yellow-100 border border-yellow-400 rounded">
              <p className="text-sm font-bold text-yellow-800">
                Action Recorded: {userAction.toUpperCase()} 
                {timingRef.current.actionTime && timingRef.current.startTime && 
                  ` (${((timingRef.current.actionTime - timingRef.current.startTime) / 1000).toFixed(2)}s)`
                }
              </p>
            </div>
          )}
          
          <div className="flex justify-center gap-8 text-xs text-gray-600">
            <div>
              <kbd className="px-2 py-1 bg-gray-200 rounded">←</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded">A</kbd> Left
            </div>
            <div>
              <kbd className="px-2 py-1 bg-gray-200 rounded">→</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded">D</kbd> Right
            </div>
            <div>
              <kbd className="px-2 py-1 bg-gray-200 rounded">↑</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded">W</kbd> Accelerate
            </div>
            <div>
              <kbd className="px-2 py-1 bg-gray-200 rounded">↓</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded">S</kbd> Brake
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
