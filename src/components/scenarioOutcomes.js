// Scenario outcome configurations for Experiment 3

export const SCENARIO_OUTCOMES = {
  1: { // High-Speed Highway Merge
    manual: {
      null: { result: 'crash', description: 'No intervention taken. Collision occurred.', attribution: 'Self' },
      brake: { result: 'near-miss', description: 'Quick brake! You managed to slow down just in time. Near-Miss.', attribution: 'Self' },
      accelerate: { result: 'near-miss', description: 'You accelerated past the hazard. Close call but safe. Near-Miss.', attribution: 'Self' },
      left: { result: 'near-miss', description: 'Steered left into the adjacent lane. Close but avoided collision. Near-Miss.', attribution: 'Self' },
      right: { result: 'near-miss', description: 'Steered right into the adjacent lane. Narrowly avoided the hazard. Near-Miss.', attribution: 'Self' }
    },
    assist: {
      null: { result: 'near-miss', description: 'System handles it, but just barely. Near-Miss (Fast braking, close distance).', attribution: 'Other Driver' },
      brake: { result: 'crash', description: 'Brake: System\'s automatic braking and your manual brake are out of sync, leading to a Minor Collision (scrape).', attribution: 'System Conflict' },
      accelerate: { result: 'near-miss', description: 'Accelerate: System overrides your acceleration to prevent collision, leading to a sudden, but safe, Near-Miss.', attribution: 'Driver-Assist' },
      left: { result: 'near-miss', description: 'Steer Left: System attempts to keep lane; resulting conflict leads to a Near-Miss (Loud Horn/Swerve).', attribution: 'Self/Driver-Assist Conflict' },
      right: { result: 'near-miss', description: 'Steer Right: System attempts to keep lane; resulting conflict leads to a Near-Miss (Loud Horn/Swerve).', attribution: 'Self/Driver-Assist Conflict' }
    }
  },
  
  2: { // Residential Street with Sharp Curve - Child's ball
    manual: {
      null: { result: 'safe-pass', description: 'No Intervention: Your naturally slower, self-controlled speed allows the car to slow naturally without incident. Safe Pass.', attribution: 'Self/Environment' },
      brake: { result: 'safe-pass', description: 'Brake: Highly effective. The vehicle stops smoothly due to low speed. Safe Pass.', attribution: 'Self' },
      accelerate: { result: 'near-miss', description: 'Accelerate: You rush the curve and hit the ball (no damage, but unsettling). Near-Miss.', attribution: 'Self' },
      left: { result: 'safe-pass', description: 'Steer Left: You smoothly steer around the hazard. Safe Pass.', attribution: 'Self' },
      right: { result: 'safe-pass', description: 'Steer Right: You smoothly steer around the hazard. Safe Pass.', attribution: 'Self' }
    },
    assist: {
      null: { result: 'safe-pass', description: 'No Intervention: Driver-Assist system automatically reduces speed approaching the curve. Safe Pass.', attribution: 'Driver-Assist' },
      brake: { result: 'safe-pass', description: 'Brake: Combined with system assist, provides optimal stopping. Safe Pass.', attribution: 'Self/Driver-Assist' },
      accelerate: { result: 'near-miss', description: 'Accelerate: System overrides but response is delayed. You still clip the ball. Near-Miss.', attribution: 'Self/Driver-Assist Conflict' },
      left: { result: 'safe-pass', description: 'Steer Left: System assists with smooth lane adjustment. Safe Pass.', attribution: 'Driver-Assist' },
      right: { result: 'safe-pass', description: 'Steer Right: System assists with smooth lane adjustment. Safe Pass.', attribution: 'Driver-Assist' }
    }
  },
  
  3: { // Overpass in Rainy Conditions - Pothole
    manual: {
      null: { result: 'near-miss', description: 'No Intervention: You hit the pothole dead-on, causing a sudden, hard jolt. Near-Miss (Vehicle shudder/possible damage).', attribution: 'Environment' },
      brake: { result: 'near-miss', description: 'Brake: Does not significantly alter impact velocity due to late realization. Near-Miss (Loud thud, but no flat tire).', attribution: 'Environment' },
      accelerate: { result: 'near-miss', description: 'Accelerate: Does not significantly alter impact velocity due to late realization. Near-Miss (Loud thud, but no flat tire).', attribution: 'Environment' },
      left: { result: 'safe-pass', description: 'Steer Left: You successfully swerve enough to hit only the edge of the hole. Safe Pass (Minor bump).', attribution: 'Self' },
      right: { result: 'safe-pass', description: 'Steer Right: You successfully swerve enough to hit only the edge of the hole. Safe Pass (Minor bump).', attribution: 'Self' }
    },
    assist: {
      null: { result: 'near-miss', description: 'No Intervention: System cannot detect water-obscured pothole. Direct hit. Near-Miss (Hard impact).', attribution: 'Environment' },
      brake: { result: 'near-miss', description: 'Brake: System and your braking combined, but too late. Near-Miss (Loud thud).', attribution: 'Environment' },
      accelerate: { result: 'near-miss', description: 'Accelerate: System prevents acceleration increase but cannot avoid pothole. Near-Miss.', attribution: 'Environment' },
      left: { result: 'safe-pass', description: 'Steer Left: Manual override successful, edge hit only. Safe Pass (Minor bump).', attribution: 'Self' },
      right: { result: 'safe-pass', description: 'Steer Right: Manual override successful, edge hit only. Safe Pass (Minor bump).', attribution: 'Self' }
    }
  },
  
  4: { // Traffic Light Turned Red - System error
    manual: {
      null: { result: 'safe-pass', description: 'No Intervention: You slow naturally and stop smoothly at the red light. Safe Pass (Comfortable stop).', attribution: 'Self' },
      brake: { result: 'safe-pass', description: 'Brake: You apply controlled braking and stop comfortably. Safe Pass.', attribution: 'Self' },
      accelerate: { result: 'near-miss', description: 'Accelerate: You attempt to beat the light but realize it\'s too late and brake hard. Near-Miss (Uncomfortable stop).', attribution: 'Self' },
      left: { result: 'safe-pass', description: 'Steer Left: While slowing, you position for the turn lane. Safe Pass.', attribution: 'Self' },
      right: { result: 'safe-pass', description: 'Steer Right: While slowing, you adjust lane position. Safe Pass.', attribution: 'Self' }
    },
    assist: {
      null: { result: 'safe-pass', description: 'Brake/No Intervention: System over-brakes, leading to a sudden, uncomfortable stop. Safe Pass (but very unpleasant).', attribution: 'Driver-Assist' },
      brake: { result: 'safe-pass', description: 'Brake: System over-brakes even more with your input. Very sudden stop. Safe Pass (Unpleasant).', attribution: 'Driver-Assist' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: System immediately overrides your acceleration due to the red light. Causes an awkward lurch and uncomfortable stop. Safe Pass.', attribution: 'Driver-Assist/Self Conflict' },
      left: { result: 'safe-pass', description: 'Steer Left: System keeps you in the lane, counteracting your steering input, but still completes the hard stop. Safe Pass (Jerky stop).', attribution: 'Driver-Assist' },
      right: { result: 'safe-pass', description: 'Steer Right: System keeps you in the lane, counteracting your steering input, but still completes the hard stop. Safe Pass (Jerky stop).', attribution: 'Driver-Assist' }
    }
  },
  
  5: { // Late Lane Merge
    manual: {
      null: { result: 'near-miss', description: 'Brake/No Intervention: You miss the merging window, forcing a sudden stop and a long wait. Near-Miss (Loud horn/Frustration).', attribution: 'Other Driver/Self-Inaction' },
      brake: { result: 'near-miss', description: 'Brake: You brake too early, missing the window entirely. Near-Miss (Frustration/Delay).', attribution: 'Self' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: You speed up to slip into the gap, successfully completing the merge. Safe Pass with high perceived competence.', attribution: 'Self' },
      left: { result: 'safe-pass', description: 'Steer Left: Your aggressive, manually controlled maneuver works perfectly, and other drivers yield. Safe Pass with high perceived competence.', attribution: 'Self' },
      right: { result: 'safe-pass', description: 'Steer Right: Your aggressive, manually controlled maneuver works perfectly, and other drivers yield. Safe Pass with high perceived competence.', attribution: 'Self' }
    },
    assist: {
      null: { result: 'near-miss', description: 'No Intervention: System is too conservative, causing you to miss the merge window. Near-Miss (Delay/Horn).', attribution: 'Driver-Assist' },
      brake: { result: 'near-miss', description: 'Brake: Combined with system caution, you completely miss the opportunity. Near-Miss (Long delay).', attribution: 'Driver-Assist/Self' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: System initially resists but allows acceleration. Merge successful but delayed. Safe Pass.', attribution: 'Self/Driver-Assist' },
      left: { result: 'safe-pass', description: 'Steer Left: System assists but with slight hesitation. Merge successful. Safe Pass.', attribution: 'Driver-Assist' },
      right: { result: 'safe-pass', description: 'Steer Right: System assists but with slight hesitation. Merge successful. Safe Pass.', attribution: 'Driver-Assist' }
    }
  }
};
