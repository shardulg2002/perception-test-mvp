/**
 * ResultCard Component
 * Displays test results with metrics and retry option
 */
export default function ResultCard({ result, onRetry }) {
  if (!result) return null;

  const isSuccess = result.outcome === 'success';
  const reactionTime = result.reactionLatency ? Math.round(result.reactionLatency) : 'N/A';
  const distance = result.distanceToObstacle ? Math.round(result.distanceToObstacle) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-xl overflow-hidden border-2 border-gray-200">
      {/* Header */}
      <div className={`p-6 text-center ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="text-6xl mb-3">
          {isSuccess ? '✅' : '❌'}
        </div>
        <h2 className={`text-3xl font-bold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
          {isSuccess ? 'Test Passed!' : 'Test Failed'}
        </h2>
        <p className="mt-2 text-gray-700">
          {isSuccess 
            ? 'You stopped before the obstacle. Well done!' 
            : 'You collided with the obstacle. Try again!'}
        </p>
      </div>

      {/* Metrics */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">Outcome</div>
          <div className={`text-2xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {isSuccess ? 'SUCCESS' : 'FAIL'}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">Reaction Time</div>
          <div className="text-2xl font-bold text-blue-600">
            {reactionTime !== 'N/A' ? `${reactionTime} ms` : reactionTime}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">Distance to Obstacle</div>
          <div className={`text-2xl font-bold ${distance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(distance)} px {distance >= 0 ? 'before' : 'past'}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">Visible Duration</div>
          <div className="text-2xl font-bold text-gray-700">
            {(result.visibleDuration / 1000).toFixed(1)} sec
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="px-6 pb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Test Details</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Speed:</strong> {result.speed} px/s</p>
            <p><strong>Position at Stop:</strong> {Math.round(result.positionAtStop)} px</p>
            {result.hideTime && (
              <p><strong>Car Hidden At:</strong> {new Date(result.hideTime).toLocaleTimeString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 bg-gray-50 flex gap-4 justify-center">
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>

      {/* Interpretation Guide */}
      <div className="px-6 pb-6">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 font-medium hover:text-gray-900">
            Understanding Your Results
          </summary>
          <div className="mt-3 text-gray-700 space-y-2 text-xs">
            <p>
              <strong>Reaction Time:</strong> The time between when the car disappeared and when you pressed STOP. 
              Faster reaction times (under 300ms) indicate good perception skills.
            </p>
            <p>
              <strong>Distance to Obstacle:</strong> How far the car was from the obstacle when you stopped. 
              Positive values mean you stopped safely; negative values indicate a collision.
            </p>
            <p>
              <strong>Success Criteria:</strong> To pass, you must stop the car before it reaches the obstacle, 
              even though it becomes invisible during the test.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
