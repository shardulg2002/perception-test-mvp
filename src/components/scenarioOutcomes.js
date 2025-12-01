// Scenario outcome configurations for Experiment 3

export const SCENARIO_OUTCOMES = {
  1: { // High-Speed Highway Merge - Sudden merge scenario
    manual: {
      null: { result: 'crash', description: 'No Intervention: High likelihood of side collision. The merging vehicle suddenly cut into your lane and you took no action. A collision occurred.', attribution: 'Self' },
      brake: { result: 'safe-pass', description: 'Brake: Safest choice. You applied brakes, increasing space for the merging vehicle to enter. Despite the sudden merge, you created enough distance. Safe Pass.', attribution: 'Self' },
      accelerate: { result: 'near-miss', description: 'Accelerate: Increases conflict risk. You sped up attempting to avoid the merge zone, resulting in a very close call. Near-Miss.', attribution: 'Self' },
      left: { result: 'near-miss', description: 'Steer Left: Could avoid merge conflict but risk of fast lane vehicle. You swerved left and narrowly avoided the merging car, but entered the fast lane. Near-Miss.', attribution: 'Self' },
      right: { result: 'crash', description: 'Steer Right: Dangerous; leads toward merging vehicle. You steered directly into the path of the merging car. Collision occurred.', attribution: 'Self' }
    },
    assist: {
      null: { result: 'safe-pass', description: 'No Intervention: System adjusts speed and positioning. The driver-assist detected the sudden merge and automatically adjusted your vehicle\'s position and speed. Safe Pass.', attribution: 'Driver-Assist' },
      brake: { result: 'safe-pass', description: 'Brake: Smooth deceleration to let the merging vehicle enter. The system coordinated with your braking input to create smooth, controlled deceleration. Safe Pass.', attribution: 'Self/Driver-Assist' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: Limited; system maintains gap. The system prevented excessive acceleration and maintained a safe following distance from the merging vehicle. Safe Pass.', attribution: 'Driver-Assist' },
      left: { result: 'safe-pass', description: 'Steer Left: Allowed only if lane free; system assists controlled shift. The fast lane was clear, and the system assisted a smooth, controlled lane change to avoid the merge. Safe Pass.', attribution: 'Driver-Assist' },
      right: { result: 'near-miss', description: 'Steer Right: System resists; merging vehicle present. You attempted to steer right, but the system resisted as it detected the merging vehicle. The conflict caused a brief hesitation. Near-Miss.', attribution: 'System Conflict' }
    }
  },
  
  2: { // Residential Street with Sharp Curve - Child's ball
    manual: {
      null: { result: 'crash', description: 'No Intervention: Near-certain collision. You took no action as the child ran into the street. Collision occurred.', attribution: 'Self' },
      brake: { result: 'safe-pass', description: 'Brake: Best manual action; reduces harm. The vehicle stops smoothly due to low speed and your quick braking. Safe Pass.', attribution: 'Self' },
      accelerate: { result: 'crash', description: 'Accelerate: Highly unsafe; collision likely. You accelerated through the curve and struck the child. Collision occurred.', attribution: 'Self' },
      left: { result: 'near-miss', description: 'Steer Left: May avoid child but risks overcorrection. You swerved into the opposite lane narrowly avoiding both the child and oncoming traffic. Near-Miss.', attribution: 'Self' },
      right: { result: 'near-miss', description: 'Steer Right: May avoid but risk of entering opposite lane or hitting parked vehicles. You swerved toward parked cars but avoided the child. Near-Miss.', attribution: 'Self' }
    },
    assist: {
      null: { result: 'safe-pass', description: 'No Intervention: Automatic emergency stop. System detected the child and applied full emergency braking. Safe Pass.', attribution: 'Driver-Assist' },
      brake: { result: 'safe-pass', description: 'Brake: System maximizes braking force. Combined emergency braking stopped the vehicle safely. Safe Pass.', attribution: 'Driver-Assist' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: Prevented; system brakes aggressively. System overrode your acceleration and applied full emergency braking. Safe Pass.', attribution: 'Driver-Assist/Self Conflict' },
      left: { result: 'safe-pass', description: 'Steer Left: System performs controlled swerve + brake. Assisted emergency maneuver avoided the child safely. Safe Pass.', attribution: 'Driver-Assist' },
      right: { result: 'safe-pass', description: 'Steer Right: System prefers lane-centered avoidance but assists your input with emergency braking. Safe Pass.', attribution: 'Driver-Assist' }
    }
  },
  
  3: { // Overpass in Rainy Conditions - Pothole
    manual: {
      null: { result: 'near-miss', description: 'No Intervention: You drive directly into the hidden pothole, causing a strong jolt and potential tire or suspension damage. Near-Miss (Vehicle shudder/possible damage).', attribution: 'Environment' },
      brake: { result: 'near-miss', description: 'Brake: Hard braking may cause skidding; does not prevent impact. Near-Miss (Loud thud, minor skid).', attribution: 'Environment' },
      accelerate: { result: 'near-miss', description: 'Accelerate: Increases hydroplaning risk and intensifies impact. Near-Miss (Hard jolt, increased damage risk).', attribution: 'Environment/Self' },
      left: { result: 'near-miss', description: 'Steer Left: Avoidance is possible, but you risk drifting into the adjacent lane on a wet surface. Near-Miss (Edge hit/drift).', attribution: 'Self' },
      right: { result: 'near-miss', description: 'Steer Right: Avoidance attempted, but overcorrection causes loss of traction. Near-Miss (Slight swerve/edge hit).', attribution: 'Self' }
    },
    assist: {
      null: { result: 'safe-pass', description: 'No Intervention: Drive Assist auto-detects water depth and subtly steers around the pothole. Safe Pass (Minor bump).', attribution: 'Driver-Assist' },
      brake: { result: 'safe-pass', description: 'Brake: Applies controlled, anti-lock braking while steering around pothole. Safe Pass (Controlled avoidance).', attribution: 'Driver-Assist' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: Not permitted—system suppresses acceleration and navigates around hazard. Safe Pass.', attribution: 'Driver-Assist' },
      left: { result: 'safe-pass', description: 'Steer Left: System gently adjusts trajectory to bypass the pothole, avoiding wheel damage. Safe Pass (Smooth avoidance).', attribution: 'Driver-Assist' },
      right: { result: 'safe-pass', description: 'Steer Right: Moves vehicle away from the flooded patch while preventing oversteer on wet surface. Safe Pass (Controlled maneuver).', attribution: 'Driver-Assist' }
    }
  },
  
  4: { // Traffic Light Turned Red - System error
    manual: {
      null: { result: 'safe-pass', description: 'No Intervention: You slow naturally and stop smoothly at the red light. Safe Pass (Comfortable stop).', attribution: 'Self' },
      brake: { result: 'safe-pass', description: 'Brake: You apply controlled braking and stop comfortably. Safe Pass (Smooth stop).', attribution: 'Self' },
      accelerate: { result: 'crash', description: 'Accelerate: You attempt to beat the light but it\'s too late. Guaranteed collision with crossing traffic.', attribution: 'Self' },
      left: { result: 'safe-pass', description: 'Steer Left: Lane change successful if timed well while slowing. Safe Pass (Lane change to turn lane).', attribution: 'Self' },
      right: { result: 'safe-pass', description: 'Steer Right: Lane change while slowing, adjusted position safely. Safe Pass.', attribution: 'Self' }
    },
    assist: {
      null: { result: 'safe-pass', description: 'No Intervention: Automatic braking prevents crash but system over-brakes, leading to a sudden, uncomfortable stop. Safe Pass (Very unpleasant).', attribution: 'Driver-Assist' },
      brake: { result: 'safe-pass', description: 'Brake: Reinforced by collision-avoidance braking. System over-brakes even more with your input. Very sudden stop. Safe Pass (Unpleasant).', attribution: 'Driver-Assist' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: Overridden completely; system brakes hard. Causes an awkward lurch and uncomfortable stop. Safe Pass.', attribution: 'Driver-Assist/Self Conflict' },
      left: { result: 'safe-pass', description: 'Steer Left: Allowed only if lane clear but system still applies hard brake. Counteracted steering with jerky stop. Safe Pass (Jerky stop).', attribution: 'Driver-Assist' },
      right: { result: 'safe-pass', description: 'Steer Right: System corrections applied while hard braking. Counteracted steering input with harsh stop. Safe Pass (Jerky stop).', attribution: 'Driver-Assist' }
    }
  },
  
  5: { // Late Lane Merge at Construction Zone
    manual: {
      null: { result: 'near-miss', description: 'No Intervention: You reach the lane-end too late and are forced into a dangerous squeeze with high crash potential. Near-Miss (Loud horn/forced stop).', attribution: 'Self' },
      brake: { result: 'near-miss', description: 'Brake: May cause the car behind to brake suddenly; you lose your chance to merge safely. Near-Miss (Frustration/Delay/Horn).', attribution: 'Self' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: Makes the merge more aggressive but successful. You speed up to slip into the gap, successfully completing the merge. Safe Pass with high perceived competence.', attribution: 'Self' },
      left: { result: 'safe-pass', description: 'Steer Left: You force a merge successfully. Your aggressive, manually controlled maneuver works perfectly, and other drivers yield. Safe Pass with high perceived competence.', attribution: 'Self' },
      right: { result: 'near-miss', description: 'Steer Right: Moves you deeper into the closing lane, increasing the chance of hitting the barrier. Near-Miss (Barrier scrape).', attribution: 'Self' }
    },
    assist: {
      null: { result: 'safe-pass', description: 'No Intervention: Drive Assist automatically slows and positions the vehicle for a safe, cooperative merge. Safe Pass (Smooth merge).', attribution: 'Driver-Assist' },
      brake: { result: 'safe-pass', description: 'Brake: Applies controlled deceleration to create a safe merging gap. System finds a safe window. Safe Pass (Delayed merge).', attribution: 'Driver-Assist' },
      accelerate: { result: 'safe-pass', description: 'Accelerate: Suppressed initially but then allowed—system limits acceleration to avoid cutting too close. Merge successful. Safe Pass.', attribution: 'Driver-Assist/Self' },
      left: { result: 'safe-pass', description: 'Steer Left: System smoothly integrates you into the adjacent lane by adjusting speed and spacing. Safe Pass (Controlled merge).', attribution: 'Driver-Assist' },
      right: { result: 'safe-pass', description: 'Steer Right: Drive Assist prevents veering back toward the closing lane or construction barrier. Corrects and completes merge. Safe Pass.', attribution: 'Driver-Assist' }
    }
  }
};
