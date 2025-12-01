# Experiment 3: Detailed Scenario Specifications

## Overview
All 5 scenarios have been updated with comprehensive specifications based on detailed user requirements. Each scenario tests different aspects of driver decision-making, system interaction, and attribution.

---

## Scenario 1: High-Speed Highway Merge

### Context
You are approaching a high-speed highway merge where another car suddenly enters the lane ahead of you. The situation unfolds quickly, and both you and the system (if enabled) may react at slightly different times.

### Intervention Context
A car is entering the highway suddenly, forcing the system to react. Because of the timing mismatch between your reaction and the system's response, outcomes vary based on your chosen action.

### Outcomes

#### Manual Mode
- **Brake**: ✅ **Safe-Pass** (safest choice - increases space for merging vehicle)
- **Accelerate**: ⚠️ Near-Miss (increased conflict risk)
- **Steer Left**: ⚠️ Near-Miss (avoided merge but created fast lane risk)
- **Steer Right**: 💥 Crash (dangerous maneuver toward merging vehicle)
- **No Intervention**: 💥 Crash (high likelihood of side collision)

#### Driver-Assist Mode
- **Brake**: 💥 Crash (system/user sync conflict - minor scrape)
- **Accelerate**: ⚠️ Near-Miss (system overrides, maintains safe gap)
- **Steer Left**: ⚠️ Near-Miss (assisted controlled lane shift, loud horn)
- **Steer Right**: ⚠️ Near-Miss (system resisted input, swerve)
- **No Intervention**: ⚠️ Near-Miss (system handles it, fast braking, close distance)

### Attribution Type: A (Assign Responsibility)
**Question**: "Who was more at fault for the outcome?"
**Options**: Self | Other Driver | Driver-Assist System | System Conflict

---

## Scenario 2: Residential Street with Child Chasing Ball

### Context
You are driving in a residential area at low-moderate speed when a child suddenly runs into the street chasing a ball. The event occurs quickly and unexpectedly, giving almost no reaction time.

### Intervention Context
Scene: A child's ball rolls into the road just before the curve. When Drive Assist is ON, the system prioritizes full emergency braking, restricts unsafe swerving, and blocks acceleration entirely. In Manual Mode, braking is the safest and most controlled response.

### Outcomes

#### Manual Mode
- **Brake**: ✅ **Safe-Pass** (best manual action - quick stop at low speed)
- **Accelerate**: 💥 Crash (highly unsafe - struck the child)
- **Steer Left**: ⚠️ Near-Miss (risks overcorrection into opposite lane)
- **Steer Right**: ⚠️ Near-Miss (risks hitting parked vehicles)
- **No Intervention**: 💥 Crash (near-certain collision)

#### Driver-Assist Mode
- **Brake**: ✅ **Safe-Pass** (system maximizes braking force)
- **Accelerate**: ✅ **Safe-Pass** (system prevents acceleration, full emergency brake)
- **Steer Left**: ✅ **Safe-Pass** (controlled swerve + brake)
- **Steer Right**: ✅ **Safe-Pass** (lane-centered avoidance + emergency brake)
- **No Intervention**: ✅ **Safe-Pass** (automatic emergency stop)

### Attribution Type: B (Choose Consequence)
**Question**: "Which party pays a small repair fee (if applicable)?"
**Options**: I pay | Other pays | Shared

### Animation
Shows child chasing red ball into residential street with houses in background.

---

## Scenario 3: Overpass in Rainy Conditions with Hidden Pothole

### Context
You are driving across an overpass in steady rain. The road is slick, visibility is moderately reduced, and shallow water pools along the lane. Ahead lies a large, deep pothole completely hidden under standing water.

### Intervention Context
Your vehicle is traveling at a moderate speed when you suddenly approach the concealed hazard. If Drive Assist is ON, it attempts to detect water depth and subtly steer around the pothole. In Manual Mode, hard braking may cause skidding.

### Outcomes

#### Manual Mode
- **Brake**: ⚠️ Near-Miss (hard braking causes minor skid, loud thud)
- **Accelerate**: ⚠️ Near-Miss (increases hydroplaning risk, hard jolt)
- **Steer Left**: ⚠️ Near-Miss (risks drifting into adjacent lane)
- **Steer Right**: ⚠️ Near-Miss (overcorrection causes loss of traction)
- **No Intervention**: ⚠️ Near-Miss (direct hit, strong jolt, possible damage)

#### Driver-Assist Mode
- **Brake**: ✅ **Safe-Pass** (controlled anti-lock braking + steering around)
- **Accelerate**: ✅ **Safe-Pass** (system suppresses acceleration, navigates around)
- **Steer Left**: ✅ **Safe-Pass** (system adjusts trajectory to bypass pothole)
- **Steer Right**: ✅ **Safe-Pass** (controlled maneuver prevents oversteer)
- **No Intervention**: ✅ **Safe-Pass** (auto-detects water depth, steers around)

### Attribution Type: C (Future Behaviour)
**Question**: "Choose how you will act next time in this situation."
**Options**: Drive more cautiously | Same | Drive more aggressively

### Animation
Shows rainy conditions with animated rain, dark sky, water puddle obscuring pothole.

---

## Scenario 4: Traffic Light System Error

### Context
You are approaching a traffic light that has just turned red. You are already slowing down at a normal rate. Suddenly, the driver-assist system (if active) misinterprets the situation and applies an overly forceful automatic brake.

### Intervention Context
Scene: You are slowing naturally, but the driver-assist system slams on the brakes unnecessarily hard (system error/miscalculation). If Drive Assist is ON, the system overrides your inputs and applies harsh braking.

### Outcomes

#### Manual Mode
- **Brake**: ✅ **Safe-Pass** (controlled braking, smooth stop)
- **Accelerate**: 💥 Crash (guaranteed collision with crossing traffic)
- **Steer Left**: ✅ **Safe-Pass** (lane change to turn lane while slowing)
- **Steer Right**: ✅ **Safe-Pass** (adjusted position safely)
- **No Intervention**: ✅ **Safe-Pass** (natural slowing, comfortable stop)

#### Driver-Assist Mode
- **Brake**: ✅ **Safe-Pass** (system over-brakes, very sudden/unpleasant stop)
- **Accelerate**: ✅ **Safe-Pass** (system overrides, awkward lurch, uncomfortable stop)
- **Steer Left**: ✅ **Safe-Pass** (system counteracts steering, jerky stop)
- **Steer Right**: ✅ **Safe-Pass** (system corrections with harsh stop)
- **No Intervention**: ✅ **Safe-Pass** (automatic hard braking, very unpleasant)

### Attribution Type: A (Assign Responsibility)
**Question**: "Who was more responsible for the sudden stop?"
**Options**: Self | Driver-Assist | Environment

### Animation
Shows traffic light turning red, city buildings, system applies harsh emergency brake.

---

## Scenario 5: Late Lane Merge at Construction Zone

### Context
You are driving in dense, slow-moving traffic approaching a construction zone where your lane is ending. Cars ahead are gradually merging, but you wait until the very last moment and attempt an assertive, late merge.

### Intervention Context
Vehicles around you are tightly packed, leaving little room for error. As you approach the taper point, you must act quickly. If Drive Assist is ON, it automatically slows and positions for a safe merge. In Manual Mode, aggressive actions may work but risk missing the window.

### Outcomes

#### Manual Mode
- **Brake**: ⚠️ Near-Miss (car behind brakes suddenly, lost merge opportunity)
- **Accelerate**: ✅ **Safe-Pass** (aggressive but successful merge, high competence)
- **Steer Left**: ✅ **Safe-Pass** (forced merge works, other drivers yield, high competence)
- **Steer Right**: ⚠️ Near-Miss (moves deeper into closing lane, barrier scrape)
- **No Intervention**: ⚠️ Near-Miss (forced into dangerous squeeze, loud horn)

#### Driver-Assist Mode
- **Brake**: ✅ **Safe-Pass** (controlled deceleration, finds safe window, delayed)
- **Accelerate**: ✅ **Safe-Pass** (system limits acceleration, safe merge)
- **Steer Left**: ✅ **Safe-Pass** (smooth integration, adjusted speed/spacing)
- **Steer Right**: ✅ **Safe-Pass** (prevents veering toward barrier, corrects)
- **No Intervention**: ✅ **Safe-Pass** (automatic positioning for cooperative merge)

### Attribution Type: B (Choose Consequence)
**Question**: "Which party pays a small repair fee (Hypothetical, as it was successful)?"
**Options**: I pay | Other pays | Shared

### Animation
Shows construction zone with orange cones, lane closure, heavy traffic with other vehicles.

---

## Key Design Principles

### 1. Mode Differentiation
- **Manual Mode**: Player has full control; outcomes vary based on action quality
- **Driver-Assist Mode**: System intervenes, sometimes helping, sometimes conflicting

### 2. Outcome Types
- ✅ **Safe-Pass**: Best outcome, no damage or minimal risk
- ⚠️ **Near-Miss**: Close call, uncomfortable but no collision
- 💥 **Crash**: Collision occurred (ranges from minor scrape to severe)

### 3. Attribution Testing
- **Type A**: Assign responsibility among parties
- **Type B**: Choose who pays for consequences
- **Type C**: Future behavior adjustment

### 4. Realistic Scenarios
Each scenario represents real-world driving challenges where:
- Timing matters
- Human-system interaction can conflict or cooperate
- Attribution is ambiguous and context-dependent
- Quick decisions are required under pressure

---

## Technical Implementation

### Files Updated
- `src/pages/IllusionTest.jsx` - Scenario descriptions and attribution questions
- `src/components/scenarioOutcomes.js` - Complete outcome matrix for all scenarios
- `src/components/IllusionTestCanvas.jsx` - Visual animations for each scenario

### Data Captured
For each scenario, the system records:
- Scenario ID and title
- Control mode (Manual/Driver-Assist)
- User action (brake/accelerate/steer left/steer right/none)
- Reaction time (milliseconds)
- Outcome result (safe-pass/near-miss/crash)
- System attribution (from outcome matrix)
- User attribution (from attribution question)
- Attribution type (A/B/C)

---

## Testing the Scenarios

To test all scenarios:
1. Run `npm run dev` to start the development server
2. Navigate to the test page
3. Complete Experiments 1 and 2
4. In Experiment 3, try different mode/action combinations
5. Verify outcomes match the specifications above
6. Check that animations display correctly for each scenario
7. Review captured data in the Dashboard or Admin Dashboard

---

**Last Updated**: December 1, 2025
**Status**: All scenarios implemented and tested ✅
