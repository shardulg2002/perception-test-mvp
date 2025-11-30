import { useState } from 'react';

/**
 * HowItWorksModal Component
 * Explains the perception test to users
 */
export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">How the Perception Test Works</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl font-bold leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Overview</h3>
            <p className="text-gray-700">
              This test measures your visual perception and reaction time under pressure. 
              You'll need to stop a moving car before it collides with an obstacle, even when the car becomes invisible.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Test Procedure</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click <strong>"Start Test"</strong> to begin</li>
              <li>Watch the countdown (3, 2, 1)</li>
              <li>A car will appear and move toward a red obstacle</li>
              <li>The car will be <strong>visible for 5 seconds</strong></li>
              <li>After 5 seconds, the car <strong>disappears</strong> but continues moving</li>
              <li>Press the <strong>STOP button</strong> (or <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Space</kbd>) before collision</li>
              <li>You must estimate when to stop, even though the car is invisible</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ Success Criteria</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Stop the car <strong>before</strong> it reaches the red obstacle</li>
              <li>Faster reaction times indicate better perception skills</li>
              <li>You'll see your reaction time and distance to obstacle after each attempt</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Pay attention to the car's speed during the visible phase</li>
              <li>Estimate the remaining distance when the car disappears</li>
              <li>It's better to stop early than to collide</li>
              <li>You can retry the test as many times as needed</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Note:</strong> Use keyboard (spacebar) or mouse/touch to stop. 
              Results are automatically saved for analysis.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
