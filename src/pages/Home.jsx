import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestCanvas from '../components/TestCanvas';
import ResultCard from '../components/ResultCard';
import HowItWorksModal from '../components/HowItWorksModal';
import IllusionTest from './IllusionTest';
import { saveAttempt } from '../lib/supabaseClient';
import { useSessionId, useClientInfo } from '../hooks/useAnimationLoop';
import { Link } from 'react-router-dom';

/**
 * Home Component
 * Main page with the perception test
 */
export default function Home() {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState('perception'); // perception | illusion | complete
  const [testResult, setTestResult] = useState(null);
  const [illusionResult, setIllusionResult] = useState(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userDemographics, setUserDemographics] = useState(null);
  
  const sessionId = useSessionId();
  const clientInfo = useClientInfo();

  // Check if user has filled demographics
  useEffect(() => {
    const demographics = localStorage.getItem('userDemographics');
    if (!demographics) {
      // Redirect to landing page if no demographics
      navigate('/');
    } else {
      setUserDemographics(JSON.parse(demographics));
    }
  }, [navigate]);

  const handleTestComplete = async (result) => {
    setTestResult(result);
    
    // Auto-save result
    setIsSaving(true);
    await saveResult(result);
    setIsSaving(false);
  };

  const saveResult = async (result) => {
    const attemptData = {
      session_id: sessionId,
      visible_duration_ms: result.visibleDuration,
      speed_px_per_s: result.speed,
      hide_time: result.hideTime ? new Date(result.hideTime).toISOString() : null,
      stop_time: result.stopTime ? new Date(result.stopTime).toISOString() : null,
      collision_time: result.collisionTime ? new Date(result.collisionTime).toISOString() : null,
      position_at_stop: result.positionAtStop,
      distance_to_obstacle: result.distanceToObstacle,
      reaction_latency_ms: result.reactionLatency,
      outcome: result.outcome,
      client_info: {
        ...clientInfo,
        demographics: userDemographics
      }
    };

    const { error } = await saveAttempt(attemptData);
    
    if (error) {
      console.error('Failed to save attempt:', error);
    }
  };

  const handleRetry = () => {
    setTestResult(null);
  };

  const handleTestStart = () => {
    setTestResult(null);
  };

  const handleContinueToIllusion = () => {
    setCurrentTest('illusion');
  };

  const handleIllusionComplete = async (result) => {
    setIllusionResult(result);
    
    // Save illusion test result
    setIsSaving(true);
    await saveIllusionResult(result);
    setIsSaving(false);
    
    setCurrentTest('complete');
  };

  const saveIllusionResult = async (result) => {
    // For now, log the result - you can add a separate table or extend the current one
    console.log('Illusion test result:', result);
    
    // You could save this to a separate table or combine with perception test data
    const illusionData = {
      session_id: sessionId,
      test_type: 'illusion_of_control',
      mode: result.mode,
      action: result.action,
      reaction_time_ms: result.reactionTime,
      outcome: result.result,
      description: result.description,
      system_attribution: result.systemAttribution,
      user_attribution: result.userAttribution,
      client_info: {
        ...clientInfo,
        demographics: userDemographics
      }
    };

    console.log('Illusion data to save:', illusionData);
    // When you're ready to save to database, uncomment:
    // const { error } = await saveAttempt(illusionData);
  };

  if (!userDemographics) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Perception Test */}
      {currentTest === 'perception' && (
        <>
          {/* Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    🚗 Driving Licence Perception Test
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Candidate: <strong>{userDemographics.name}</strong> | App No: <strong>{userDemographics.applicationNumber}</strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowHowItWorks(true)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    ℹ️ How it Works
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    📊 Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {!testResult ? (
              <div>
                <TestCanvas
                  onTestComplete={handleTestComplete}
                  onTestStart={handleTestStart}
                />
                
                {isSaving && (
                  <div className="mt-4 text-center text-sm text-gray-600">
                    💾 Saving result...
                  </div>
                )}
              </div>
            ) : (
              <>
                <ResultCard result={testResult} onRetry={handleRetry} />
                
                {/* Continue to Illusion Test */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handleContinueToIllusion}
                    className="px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105"
                  >
                    Continue to Next Test →
                  </button>
                </div>
              </>
            )}

            {/* Info Section */}
            {!testResult && (
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    About This Test
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      This perception test evaluates your ability to judge speed, distance, and timing—critical 
                      skills for safe driving. You'll need to stop a moving car before it hits an obstacle, 
                      even when the car becomes invisible.
                    </p>
                    <p>
                      <strong>Test Duration:</strong> The car is visible for 5 seconds, then continues moving 
                      invisibly. You must press STOP at the right moment to avoid collision.
                    </p>
                    <p>
                      <strong>Key Skills Tested:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Visual perception and spatial awareness</li>
                      <li>Speed and distance estimation</li>
                      <li>Reaction time under pressure</li>
                      <li>Decision-making with incomplete information</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-16 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-sm text-gray-500">
                Perception Test MVP - Driving Licence Assessment System
              </p>
              <p className="text-center text-xs text-gray-400 mt-2">
                Results are automatically saved for analysis. No personal data is collected.
              </p>
            </div>
          </footer>

          {/* Modal */}
          <HowItWorksModal
            isOpen={showHowItWorks}
            onClose={() => setShowHowItWorks(false)}
          />
        </>
      )}

      {/* Illusion of Control Test */}
      {currentTest === 'illusion' && (
        <IllusionTest onComplete={handleIllusionComplete} />
      )}

      {/* Complete */}
      {currentTest === 'complete' && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Tests Complete!
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Thank you for completing the driving assessment. Your results have been recorded.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/dashboard"
                className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
