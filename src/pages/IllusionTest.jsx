import { useState } from 'react';
import IllusionTestCanvas from '../components/IllusionTestCanvas';

export default function IllusionTest({ onComplete }) {
  const [testPhase, setTestPhase] = useState('intro'); // intro | choice | scenario | outcome | attribution | finished
  const [selectedMode, setSelectedMode] = useState(null); // 'assist' | 'manual'
  const [scenarioResult, setScenarioResult] = useState(null);
  const [attributionChoice, setAttributionChoice] = useState(null);

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
    setTestPhase('finished');
    
    // Pass complete result to parent
    onComplete({
      mode: selectedMode,
      action: scenarioResult.action,
      reactionTime: scenarioResult.reactionTime,
      result: scenarioResult.result,
      description: scenarioResult.description,
      systemAttribution: scenarioResult.attribution,
      userAttribution: attribution
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Intro Phase */}
      {testPhase === 'intro' && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🚗 Illusion of Control Task
            </h1>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Quick Instructions</h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>At the start of each round, you will choose whether to turn the Driver Assist feature ON or OFF.</li>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Scenario: High-Speed Highway Merge
            </h2>
            <p className="text-gray-700 text-center mb-8">
              A car is entering the highway suddenly, forcing a quick reaction.
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
          <IllusionTestCanvas
            mode={selectedMode}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Assign Responsibility
            </h2>
            <p className="text-gray-700 text-center mb-8">
              Who was more at fault for this {scenarioResult.result === 'crash' ? 'collision' : 'near-miss'}?
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleAttributionSubmit('Self')}
                className="w-full p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg hover:border-blue-500 transition-all text-left group"
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">👤</div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">Self (You)</h3>
                    <p className="text-sm text-blue-700">I was primarily responsible for the outcome</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleAttributionSubmit('Other Driver')}
                className="w-full p-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-lg hover:border-red-500 transition-all text-left group"
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">🚗</div>
                  <div>
                    <h3 className="text-xl font-bold text-red-900">Other Driver</h3>
                    <p className="text-sm text-red-700">The other driver was primarily responsible</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleAttributionSubmit('Environment')}
                className="w-full p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg hover:border-yellow-500 transition-all text-left group"
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">🌍</div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-900">Environment</h3>
                    <p className="text-sm text-yellow-700">External factors (road, weather, system) were responsible</p>
                  </div>
                </div>
              </button>
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
              Test Complete!
            </h2>
            <p className="text-gray-700 mb-6">
              Your response has been recorded.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
