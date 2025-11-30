import { useState } from 'react';
import IllusionTestCanvas from '../components/IllusionTestCanvas';

// Define all 5 scenarios
const SCENARIOS = [
  {
    id: 1,
    title: "High-Speed Highway Merge",
    description: "A car is entering the highway suddenly, forcing a quick reaction.",
    attributionType: "A", // Assign Responsibility
    attributionQuestion: "Who was more at fault for the collision?",
    attributionOptions: ["Self", "Other Driver", "Environment"]
  },
  {
    id: 2,
    title: "Residential Street with Sharp Curve",
    description: "A child's ball rolls into the road just before the curve.",
    attributionType: "B", // Choose Consequence
    attributionQuestion: "Which party pays a small repair fee (if applicable)?",
    attributionOptions: ["I pay", "Other pays", "Shared"]
  },
  {
    id: 3,
    title: "Overpass in Rainy Conditions",
    description: "You hit a large, deep pothole obscured by standing water.",
    attributionType: "C", // Future Behaviour
    attributionQuestion: "Choose how you will act next time in this situation.",
    attributionOptions: ["Drive more cautiously", "Same", "Drive more aggressively"]
  },
  {
    id: 4,
    title: "Traffic Light Turned Red",
    description: "You are slowing naturally, but the driver-assist system slams on the brakes unnecessarily hard.",
    attributionType: "A", // Assign Responsibility
    attributionQuestion: "Who was more responsible for the sudden stop?",
    attributionOptions: ["Self", "Driver-Assist", "Environment"]
  },
  {
    id: 5,
    title: "Late Lane Merge",
    description: "Traffic is heavy. You execute a late, aggressive merge maneuver.",
    attributionType: "B", // Choose Consequence
    attributionQuestion: "Which party pays a small repair fee (Hypothetical, as it was successful)?",
    attributionOptions: ["I pay", "Other pays", "Shared"]
  }
];

export default function IllusionTest({ onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(1); // 1-5
  const [testPhase, setTestPhase] = useState('intro'); // intro | choice | scenario | outcome | attribution | finished
  const [selectedMode, setSelectedMode] = useState(null); // 'assist' | 'manual'
  const [scenarioResult, setScenarioResult] = useState(null);
  const [attributionChoice, setAttributionChoice] = useState(null);
  const [allResults, setAllResults] = useState([]);

  const currentScenarioData = SCENARIOS[currentScenario - 1];

  const handleModeChoice = (mode) => {
    setSelectedMode(mode);
    setTestPhase('scenario');
  };

  const handleScenarioComplete = (result) => {
    setScenarioResult(result);
    setTestPhase('outcome');
  };

  const handleOutcomeContinue = () => {
    setTestPhase('attribution');
  };

  const handleAttributionSubmit = (attribution) => {
    setAttributionChoice(attribution);
    
    // Store result for this scenario
    const completeResult = {
      scenario: currentScenario,
      scenarioTitle: currentScenarioData.title,
      mode: selectedMode,
      action: scenarioResult.action,
      reactionTime: scenarioResult.reactionTime,
      result: scenarioResult.result,
      description: scenarioResult.description,
      systemAttribution: scenarioResult.attribution,
      userAttribution: attribution,
      attributionType: currentScenarioData.attributionType
    };
    
    const updatedResults = [...allResults, completeResult];
    setAllResults(updatedResults);
    
    // Check if all scenarios complete
    if (currentScenario < SCENARIOS.length) {
      // Move to next scenario
      setCurrentScenario(currentScenario + 1);
      setTestPhase('choice');
      setSelectedMode(null);
      setScenarioResult(null);
      setAttributionChoice(null);
    } else {
      // All scenarios complete
      setTestPhase('finished');
      onComplete({
        totalScenarios: SCENARIOS.length,
        results: updatedResults
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Intro Phase */}
      {testPhase === 'intro' && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🚗 Experiment 3: Illusion of Control Task
            </h1>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Quick Instructions</h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>You will complete <strong>5 different driving scenarios</strong>.</li>
                <li>At the start of each scenario, you will choose whether to turn the Driver Assist feature ON or OFF.</li>
                <li>After your choice, you will complete a short driving scenario where hazards may appear.</li>
                <li>Your goal is to avoid crashes and drive safely.</li>
                <li>Driver Assist may or may not help — you will need to decide when to rely on it.</li>
                <li>Make your best judgment each round.</li>
              </ol>
            </div>

            <div className="text-center">
              <button
                onClick={() => setTestPhase('choice')}
                className="px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105"
              >
                START TEST
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Choice Phase */}
      {testPhase === 'choice' && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            {/* Scenario Progress */}
            <div className="mb-6 text-center">
              <span className="inline-block bg-purple-100 px-4 py-2 rounded-lg text-purple-800 font-semibold">
                Scenario {currentScenario} of {SCENARIOS.length}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {currentScenarioData.title}
            </h2>
            <p className="text-gray-700 text-center mb-8">
              {currentScenarioData.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Driver Assist Option */}
              <button
                onClick={() => handleModeChoice('assist')}
                className="group p-8 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-xl hover:border-green-500 transition-all transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-6xl mb-4 text-center">🤖</div>
                <h3 className="text-xl font-bold text-green-900 mb-3 text-center">
                  Enable Driver-Assist
                </h3>
                <p className="text-green-800 text-sm text-center">
                  The system will automatically handle the situation. You can intervene if needed.
                </p>
              </button>

              {/* Manual Control Option */}
              <button
                onClick={() => handleModeChoice('manual')}
                className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-xl hover:border-blue-500 transition-all transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-6xl mb-4 text-center">🚗</div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">
                  I Will Intervene
                </h3>
                <p className="text-blue-800 text-sm text-center">
                  You will take full manual control and handle the situation yourself.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Phase */}
      {testPhase === 'scenario' && (
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Scenario Header */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-purple-600">
                Scenario {currentScenario}/{SCENARIOS.length}: {currentScenarioData.title}
              </span>
              <span className="text-sm text-gray-600">
                Mode: {selectedMode === 'assist' ? '🤖 Driver Assist' : '🚗 Manual'}
              </span>
            </div>
          </div>
          
          <IllusionTestCanvas
            mode={selectedMode}
            scenarioId={currentScenario}
            onComplete={handleScenarioComplete}
          />
        </div>
      )}

      {/* Outcome Phase */}
      {testPhase === 'outcome' && scenarioResult && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className={`text-center mb-6 ${scenarioResult.result === 'crash' ? 'text-red-600' : 'text-yellow-600'}`}>
              <div className="text-7xl mb-4">
                {scenarioResult.result === 'crash' ? '💥' : '⚠️'}
              </div>
              <h2 className="text-3xl font-bold">
                {scenarioResult.result === 'crash' ? 'Collision!' : 'Near-Miss!'}
              </h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-800 text-lg leading-relaxed">
                {scenarioResult.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Control Mode</div>
                <div className="text-xl font-bold text-blue-900">
                  {selectedMode === 'assist' ? '🤖 Driver Assist' : '🚗 Manual'}
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Your Action</div>
                <div className="text-xl font-bold text-purple-900">
                  {scenarioResult.action ? scenarioResult.action.toUpperCase() : 'No Intervention'}
                </div>
              </div>

              {scenarioResult.reactionTime && (
                <div className="bg-green-50 p-4 rounded-lg col-span-2">
                  <div className="text-sm text-green-600 font-medium">Reaction Time</div>
                  <div className="text-xl font-bold text-green-900">
                    {Math.round(scenarioResult.reactionTime)} ms
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={handleOutcomeContinue}
                className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attribution Phase */}
      {testPhase === 'attribution' && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="mb-4 text-center">
              <span className="inline-block bg-purple-100 px-4 py-2 rounded-lg text-purple-800 font-semibold text-sm">
                Scenario {currentScenario} of {SCENARIOS.length}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {currentScenarioData.attributionType === 'A' && '📋 Assign Responsibility'}
              {currentScenarioData.attributionType === 'B' && '💰 Choose Consequence'}
              {currentScenarioData.attributionType === 'C' && '🔮 Future Behaviour Choice'}
            </h2>
            <p className="text-gray-700 text-center mb-8">
              {currentScenarioData.attributionQuestion}
            </p>

            <div className="space-y-4">
              {currentScenarioData.attributionOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAttributionSubmit(option)}
                  className={`w-full p-6 bg-gradient-to-r ${
                    index === 0 ? 'from-blue-50 to-blue-100 border-blue-300 hover:border-blue-500' :
                    index === 1 ? 'from-red-50 to-red-100 border-red-300 hover:border-red-500' :
                    'from-yellow-50 to-yellow-100 border-yellow-300 hover:border-yellow-500'
                  } border-2 rounded-lg transition-all text-left group`}
                >
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">
                      {index === 0 ? '👤' : index === 1 ? '🚗' : '🌍'}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        index === 0 ? 'text-blue-900' :
                        index === 1 ? 'text-red-900' :
                        'text-yellow-900'
                      }`}>{option}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finished Phase */}
      {testPhase === 'finished' && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Scenarios Complete!
            </h2>
            <p className="text-gray-700 mb-6">
              You've completed all {SCENARIOS.length} driving scenarios. Your responses have been recorded.
            </p>
            
            {/* Summary */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-purple-900 mb-2">Summary</h3>
              <p className="text-sm text-purple-800">
                Scenarios completed: {allResults.length}/{SCENARIOS.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
