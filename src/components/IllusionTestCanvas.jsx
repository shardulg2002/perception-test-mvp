import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { SCENARIO_OUTCOMES } from './scenarioOutcomes';

const CONFIG = {
  SCENARIO_DURATION: 2000, // 2 seconds to react
  LANE_WIDTH: 800,
  LANE_HEIGHT: 400,
  HAZARD_START_X: 700,
  HAZARD_SPEED: 200, // pixels per second
};

export default function IllusionTestCanvas({ mode, scenarioId = 1, onComplete }) {
  const [scenarioState, setScenarioState] = useState('playing'); // playing | finished
  const [userAction, setUserAction] = useState(null); // left, right, accelerate, brake, none
  const [hazardPosition, setHazardPosition] = useState(CONFIG.HAZARD_START_X);
  const [playerLane, setPlayerLane] = useState(1); // 0=left, 1=center, 2=right
  const [showFeedback, setShowFeedback] = useState(false);
  const [mergingCarOffset, setMergingCarOffset] = useState(0); // For Scenario 1 merge animation
  
  const animationRef = useRef(null);
  const hazardPositionRef = useRef(CONFIG.HAZARD_START_X);
  const userActionRef = useRef(null); // Track if action already taken
  const timingRef = useRef({
    startTime: null,
    actionTime: null
  });

  /**
   * Calculate outcome based on mode and action using scenario-specific outcomes
   */
  const calculateOutcome = (action, mode) => {
    const scenarioOutcomes = SCENARIO_OUTCOMES[scenarioId];
    
    if (!scenarioOutcomes) {
      console.error('No outcomes found for scenario:', scenarioId);
      return {
        result: 'safe-pass',
        description: 'Scenario completed.',
        attribution: 'Unknown'
      };
    }

    // Get the outcome for the current mode
    const modeOutcomes = scenarioOutcomes[mode];
    
    // If no action taken, use null key
    const outcomeKey = action || null;
    
    return modeOutcomes[outcomeKey];
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

  // Render scenario-specific visuals
  const renderScenarioVisuals = () => {
    switch(scenarioId) {
      case 1: // Highway Merge - Sudden cut-in scenario
        // Calculate merge animation: slow drift initially, then sudden swerve
        const mergeProgress = (CONFIG.HAZARD_START_X - hazardPosition) / CONFIG.HAZARD_START_X;
        let carLateralOffset = 0;
        
        if (mergeProgress < 0.3) {
          // First 30% - car drifting slowly toward your lane
          carLateralOffset = mergeProgress * 60; // Slow drift
        } else if (mergeProgress < 0.5) {
          // 30-50% - SUDDEN SWERVE into your lane
          const swerveProgress = (mergeProgress - 0.3) / 0.2;
          carLateralOffset = 18 + (swerveProgress * 100); // Rapid movement
        } else {
          // After 50% - car continuing to merge into your lane
          carLateralOffset = 118;
        }

        // Determine if collision will occur based on user action
        // Use userActionRef for real-time access during animation
        const currentAction = userActionRef.current;
        const willCollide = (mode === 'manual' && (!currentAction || currentAction === 'right')) ||
                           (mode === 'assist' && currentAction === 'right');
        const showCollisionWarning = mergeProgress > 0.6 && willCollide;
        const showImpact = mergeProgress > 0.85 && willCollide;
        
        return (
          <>
            {/* Sky */}
            <rect x="0" y="0" width={CONFIG.LANE_WIDTH} height="200" fill="#87CEEB" />
            
            {/* Highway Road - perspective view */}
            <path
              d={`M 300 200 L 0 ${CONFIG.LANE_HEIGHT} L ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT} L 500 200 Z`}
              fill="#374151"
            />

            {/* Lane markings - 3 lanes */}
            <line x1="280" y1="200" x2="150" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />
            <line x1="400" y1="200" x2="400" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />
            <line x1="520" y1="200" x2="650" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />

            {/* Merging car - starts in right lane, suddenly swerves into player's center lane */}
            <g transform={`translate(${500 - carLateralOffset}, 230)`}>
              <rect x="-30" y="0" width="60" height="40" fill="#DC2626" rx="5" />
              <rect x="-25" y="5" width="20" height="15" fill="#FEE2E2" />
              <rect x="5" y="5" width="20" height="15" fill="#FEE2E2" />
              <circle cx="-20" cy="40" r="5" fill="#1F2937" />
              <circle cx="20" cy="40" r="5" fill="#1F2937" />
              
              {/* Turn signal (brief, may be missed) */}
              {mergeProgress < 0.35 && hazardPosition % 20 < 10 && (
                <circle cx="-30" cy="20" r="3" fill="#FCD34D" opacity="0.7" />
              )}
            </g>

            {/* Collision warning flash - only if crash outcome */}
            {showCollisionWarning && (
              <>
                <rect x="0" y="0" width={CONFIG.LANE_WIDTH} height={CONFIG.LANE_HEIGHT} fill="#EF4444" opacity="0.15" />
                <text x="400" y="150" textAnchor="middle" fill="#DC2626" fontSize="32" fontWeight="bold">
                  ⚠️ COLLISION IMMINENT
                </text>
              </>
            )}

            {/* Impact animation - only for crash outcomes */}
            {showImpact && (
              <g transform="translate(420, 280)">
                {/* Impact burst */}
                <circle cx="0" cy="0" r="20" fill="#FCD34D" opacity="0.6" />
                <circle cx="0" cy="0" r="15" fill="#FFFFFF" opacity="0.8" />
                <text x="0" y="10" textAnchor="middle" fontSize="28">💥</text>
              </g>
            )}
          </>
        );

      case 2: // Residential Curve with Ball and Child
        return (
          <>
            {/* Sky */}
            <rect x="0" y="0" width={CONFIG.LANE_WIDTH} height="200" fill="#B0D4F1" />
            
            {/* Residential area background - houses */}
            <rect x="50" y="120" width="80" height="70" fill="#D97706" />
            <path d="M 50 120 L 90 90 L 130 120 Z" fill="#991B1B" />
            <rect x="650" y="120" width="80" height="70" fill="#16A34A" />
            <path d="M 650 120 L 690 90 L 730 120 Z" fill="#991B1B" />
            
            {/* Curved residential road */}
            <path
              d={`M 200 200 Q 300 250 400 ${CONFIG.LANE_HEIGHT} L ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT} L 600 200 Z`}
              fill="#4B5563"
            />

            {/* Single lane marking (narrow street) */}
            <line x1="400" y1="200" x2="${CONFIG.LANE_WIDTH/2}" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="2" strokeDasharray="15,10" />

            {/* Child on sidewalk before hazard, then suddenly runs into street */}
            {hazardPosition < 400 ? (
              /* Child standing on right sidewalk with ball */
              <g transform="translate(680, 280)">
                {/* Ball at child's feet */}
                <circle cx="15" cy="10" r="10" fill="#EF4444" />
                <circle cx="12" cy="7" r="3" fill="#FFFFFF" />
                {/* Child standing */}
                <circle cx="0" cy="-25" r="8" fill="#FBBF24" />
                <rect x="-6" y="-17" width="12" height="18" fill="#3B82F6" rx="2" />
                <line x1="-6" y1="-12" x2="-10" y2="-5" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                <line x1="6" y1="-12" x2="10" y2="-5" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                <line x1="-3" y1="1" x2="-3" y2="12" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                <line x1="3" y1="1" x2="3" y2="12" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : (
              /* Ball rolls and child chases it into street */
              <g transform="translate(550, 300)">
                {/* Ball in middle of street */}
                <circle cx="0" cy="0" r="12" fill="#EF4444" />
                <circle cx="-3" cy="-3" r="3" fill="#FFFFFF" />
                <circle cx="5" cy="5" r="3" fill="#FFFFFF" />
                {/* Child running from right side toward ball */}
                <g transform="translate(50, 0)">
                  <circle cx="0" cy="-25" r="8" fill="#FBBF24" />
                  <rect x="-6" y="-17" width="12" height="18" fill="#3B82F6" rx="2" />
                  <line x1="-6" y1="-15" x2="-12" y2="-8" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                  <line x1="6" y1="-15" x2="12" y2="-8" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-3" y1="1" x2="-8" y2="10" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                  <line x1="3" y1="1" x2="8" y2="10" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                </g>
              </g>
            )}
          </>
        );

      case 3: // Rainy Pothole
        return (
          <>
            {/* Dark rainy sky */}
            <rect x="0" y="0" width={CONFIG.LANE_WIDTH} height="200" fill="#64748B" />
            
            {/* Rain effect */}
            {[...Array(20)].map((_, i) => (
              <line 
                key={i}
                x1={40 * i} 
                y1={(hazardPosition * 0.3 + i * 20) % 200} 
                x2={40 * i + 5} 
                y2={(hazardPosition * 0.3 + i * 20 + 15) % 200} 
                stroke="#94A3B8" 
                strokeWidth="1.5" 
                opacity="0.6"
              />
            ))}

            {/* Overpass road */}
            <path
              d={`M 300 200 L 0 ${CONFIG.LANE_HEIGHT} L ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT} L 500 200 Z`}
              fill="#1F2937"
            />

            {/* Lane markings */}
            <line x1="400" y1="200" x2="400" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" opacity="0.7" />

            {/* Stationary water puddle obscuring pothole on road ahead */}
            <g transform="translate(450, 280)">
              <ellipse cx="0" cy="0" rx="70" ry="35" fill="#3B82F6" opacity="0.6" />
              <ellipse cx="5" cy="5" rx="50" ry="25" fill="#60A5FA" opacity="0.4" />
              {/* Hidden pothole underneath water */}
              <ellipse cx="0" cy="0" rx="40" ry="20" fill="#000000" opacity="0.9" />
            </g>
          </>
        );

      case 4: // Red Light
        return (
          <>
            {/* Sky */}
            <rect x="0" y="0" width={CONFIG.LANE_WIDTH} height="200" fill="#93C5FD" />
            
            {/* City buildings */}
            <rect x="100" y="80" width="60" height="120" fill="#6B7280" />
            <rect x="600" y="100" width="80" height="100" fill="#6B7280" />
            
            {/* Road approaching intersection */}
            <path
              d={`M 300 200 L 0 ${CONFIG.LANE_HEIGHT} L ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT} L 500 200 Z`}
              fill="#374151"
            />

            {/* Center lane marking */}
            <line x1="400" y1="200" x2="400" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />

            {/* Stop line at intersection */}
            <line x1="350" y1="260" x2="450" y2="260" stroke="#FFFFFF" strokeWidth="4" />

            {/* Stationary traffic light at intersection ahead */}
            <g transform="translate(500, 180)">
              {/* Traffic light pole */}
              <rect x="-3" y="0" width="6" height="60" fill="#1F2937" />
              {/* Traffic light box */}
              <rect x="-15" y="-45" width="30" height="45" fill="#1F2937" rx="3" />
              {/* Red light ON (just turned red) */}
              <circle cx="0" cy="-35" r="8" fill="#EF4444" opacity="1">
                <animate attributeName="opacity" values="1;0.7;1" dur="1s" repeatCount="indefinite" />
              </circle>
              {/* Yellow light OFF */}
              <circle cx="0" cy="-22" r="8" fill="#FCD34D" opacity="0.2" />
              {/* Green light OFF */}
              <circle cx="0" cy="-9" r="8" fill="#10B981" opacity="0.2" />
            </g>

            {/* Crosswalk ahead */}
            <g transform="translate(400, 265)">
              <rect x="-40" y="0" width="10" height="3" fill="#FFFFFF" />
              <rect x="-25" y="0" width="10" height="3" fill="#FFFFFF" />
              <rect x="-10" y="0" width="10" height="3" fill="#FFFFFF" />
              <rect x="5" y="0" width="10" height="3" fill="#FFFFFF" />
              <rect x="20" y="0" width="10" height="3" fill="#FFFFFF" />
            </g>
          </>
        );

      case 5: // Late Lane Merge
        return (
          <>
            {/* Sky */}
            <rect x="0" y="0" width={CONFIG.LANE_WIDTH} height="200" fill="#87CEEB" />
            
            {/* Construction zone background */}
            <rect x="600" y="120" width="150" height="80" fill="#F59E0B" opacity="0.3" />
            
            {/* Highway with merging lanes */}
            <path
              d={`M 300 200 L 0 ${CONFIG.LANE_HEIGHT} L ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT} L 500 200 Z`}
              fill="#374151"
            />

            {/* Lane markings - merging pattern */}
            <line x1="250" y1="200" x2="100" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />
            <line x1="450" y1="200" x2="550" y2={CONFIG.LANE_HEIGHT} stroke="#FCD34D" strokeWidth="3" strokeDasharray="20,10" />
            
            {/* Stationary construction zone - multiple cones marking lane closure */}
            <g transform="translate(580, 240)">
              <polygon points="0,0 -6,15 6,15" fill="#F59E0B" />
              <polygon points="0,2 -4,10 4,10" fill="#FFFFFF" />
            </g>
            <g transform="translate(600, 250)">
              <polygon points="0,0 -6,15 6,15" fill="#F59E0B" />
              <polygon points="0,2 -4,10 4,10" fill="#FFFFFF" />
            </g>
            <g transform="translate(620, 260)">
              <polygon points="0,0 -6,15 6,15" fill="#F59E0B" />
              <polygon points="0,2 -4,10 4,10" fill="#FFFFFF" />
            </g>
            <g transform="translate(640, 270)">
              <polygon points="0,0 -6,15 6,15" fill="#F59E0B" />
              <polygon points="0,2 -4,10 4,10" fill="#FFFFFF" />
            </g>

            {/* Multiple cars in adjacent lane (dense traffic) - all stationary */}
            {/* Car 1 - directly beside merge point */}
            <g transform="translate(500, 230)">
              <rect x="-25" y="0" width="50" height="35" fill="#6B7280" rx="4" />
              <rect x="-20" y="5" width="15" height="12" fill="#E5E7EB" />
              <circle cx="-15" cy="35" r="4" fill="#1F2937" />
              <circle cx="15" cy="35" r="4" fill="#1F2937" />
            </g>
            
            {/* Car 2 - slightly behind */}
            <g transform="translate(420, 260)">
              <rect x="-25" y="0" width="50" height="35" fill="#3B82F6" rx="4" />
              <rect x="-20" y="5" width="15" height="12" fill="#DBEAFE" />
              <circle cx="-15" cy="35" r="4" fill="#1F2937" />
              <circle cx="15" cy="35" r="4" fill="#1F2937" />
            </g>
            
            {/* Car 3 - ahead in adjacent lane */}
            <g transform="translate(560, 210)">
              <rect x="-25" y="0" width="50" height="35" fill="#DC2626" rx="4" />
              <rect x="-20" y="5" width="15" height="12" fill="#FEE2E2" />
              <circle cx="-15" cy="35" r="4" fill="#1F2937" />
              <circle cx="15" cy="35" r="4" fill="#1F2937" />
            </g>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* SVG Canvas */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border-4 border-gray-600">
        <svg
          viewBox={`0 0 ${CONFIG.LANE_WIDTH} ${CONFIG.LANE_HEIGHT}`}
          className="w-full h-auto"
        >
          {/* Render scenario-specific background and hazards */}
          {renderScenarioVisuals()}

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
