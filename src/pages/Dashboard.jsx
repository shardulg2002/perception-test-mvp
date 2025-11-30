import { useState, useEffect } from 'react';
import { fetchAttempts, exportToCSV, downloadCSV } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

/**
 * Dashboard Component
 * Displays comprehensive data from all experiments
 */
export default function Dashboard() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | perception | fuelPump | illusion
  const [sessionData, setSessionData] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    fail: 0,
    avgReactionTime: 0
  });

  useEffect(() => {
    loadAttempts();
    loadLocalSessionData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [attempts]);

  const loadLocalSessionData = () => {
    // Load data from current session (localStorage)
    const sessionId = sessionStorage.getItem('sessionId');
    if (sessionId) {
      const sessionKey = `session_${sessionId}`;
      const data = localStorage.getItem(sessionKey);
      if (data) {
        try {
          setSessionData(JSON.parse(data));
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
    }
  };

  const loadAttempts = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await fetchAttempts(100);

    if (fetchError) {
      setError(fetchError.message || 'Failed to load attempts');
      setLoading(false);
      return;
    }

    setAttempts(data || []);
    setLoading(false);
  };

  const calculateStats = () => {
    if (!attempts.length) {
      setStats({ total: 0, success: 0, fail: 0, avgReactionTime: 0 });
      return;
    }

    const success = attempts.filter(a => a.outcome === 'success').length;
    const fail = attempts.filter(a => a.outcome === 'fail').length;
    
    const reactionTimes = attempts
      .filter(a => a.reaction_latency_ms !== null)
      .map(a => a.reaction_latency_ms);
    
    const avgReactionTime = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length)
      : 0;

    setStats({
      total: attempts.length,
      success,
      fail,
      avgReactionTime
    });
  };

  const handleExport = () => {
    const csvContent = exportToCSV(filteredAttempts);
    downloadCSV(csvContent, `perception_attempts_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const filteredAttempts = attempts.filter(attempt => {
    if (filter === 'all') return true;
    return attempt.outcome === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attempts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure Supabase is configured correctly in your .env file
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Test
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Perception Test Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and analyze test attempts
              </p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Test
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Total Attempts</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Success Rate</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Failed Attempts</div>
            <div className="mt-2 text-3xl font-bold text-red-600">{stats.fail}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Avg Reaction Time</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {stats.avgReactionTime} <span className="text-lg">ms</span>
            </div>
          </div>
        </div>

        {/* Current Session Data - All 3 Experiments */}
        {sessionData && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">📋 Current Session - All Experiments</h2>
              <p className="text-sm mt-1 opacity-90">
                Candidate: {sessionData.demographics?.name} | App No: {sessionData.demographics?.applicationNumber}
              </p>
            </div>

            {/* Experiment 1: Perception Test */}
            {sessionData.perceptionResults && sessionData.perceptionResults.length > 0 && (
              <div className="bg-white p-6 border-x border-b">
                <h3 className="text-xl font-bold text-blue-600 mb-4">🚗 Experiment 1: Perception Test</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Trials</div>
                    <div className="text-2xl font-bold text-blue-600">{sessionData.perceptionResults.length}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Success</div>
                    <div className="text-2xl font-bold text-green-600">
                      {sessionData.perceptionResults.filter(r => r.outcome === 'success').length}
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Collisions</div>
                    <div className="text-2xl font-bold text-red-600">
                      {sessionData.perceptionResults.filter(r => r.outcome === 'collision').length}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Success Rate</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((sessionData.perceptionResults.filter(r => r.outcome === 'success').length / sessionData.perceptionResults.length) * 100)}%
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trial</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Outcome</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Reaction Time</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Distance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessionData.perceptionResults.map((trial, idx) => (
                        <tr key={idx} className={trial.outcome === 'success' ? 'bg-green-50' : 'bg-red-50'}>
                          <td className="px-3 py-2">{trial.trial || idx + 1}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              trial.outcome === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                            }`}>
                              {trial.outcome === 'success' ? '✅' : '💥'}
                            </span>
                          </td>
                          <td className="px-3 py-2">{trial.reactionLatency?.toFixed(0) || 'N/A'} ms</td>
                          <td className="px-3 py-2">{trial.distanceToObstacle?.toFixed(1) || 'N/A'} px</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Experiment 2: Fuel Pump */}
            {sessionData.fuelPumpResult && (
              <div className="bg-white p-6 border-x border-b">
                <h3 className="text-xl font-bold text-yellow-600 mb-4">⛽ Experiment 2: Fuel Pump Risk Task</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Total Points</div>
                    <div className="text-2xl font-bold text-yellow-600">{sessionData.fuelPumpResult.totalPoints}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Trials</div>
                    <div className="text-2xl font-bold text-blue-600">{sessionData.fuelPumpResult.trials?.length || 0}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Explosions</div>
                    <div className="text-2xl font-bold text-red-600">
                      {sessionData.fuelPumpResult.trials?.filter(t => t.exploded).length || 0}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Avg Pumps</div>
                    <div className="text-2xl font-bold text-green-600">
                      {sessionData.fuelPumpResult.trials && sessionData.fuelPumpResult.trials.length > 0
                        ? (sessionData.fuelPumpResult.trials.reduce((sum, t) => sum + t.pumps, 0) / sessionData.fuelPumpResult.trials.length).toFixed(1)
                        : '0'}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trial</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Pumps</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Points</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessionData.fuelPumpResult.trials?.map((trial, idx) => (
                        <tr key={idx} className={trial.exploded ? 'bg-red-50' : 'bg-green-50'}>
                          <td className="px-3 py-2">{idx + 1}</td>
                          <td className="px-3 py-2">{trial.pumps}</td>
                          <td className="px-3 py-2">{trial.pointsEarned}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              trial.exploded ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                            }`}>
                              {trial.exploded ? '💥' : '✅'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Experiment 3: Illusion of Control */}
            {sessionData.illusionResult && sessionData.illusionResult.scenarios && (
              <div className="bg-white p-6 border-x border-b rounded-b-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-4">🎮 Experiment 3: Illusion of Control</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Scenarios</div>
                    <div className="text-2xl font-bold text-purple-600">{sessionData.illusionResult.scenarios.length}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Manual</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {sessionData.illusionResult.scenarios.filter(s => s.mode === 'manual').length}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Safe Pass</div>
                    <div className="text-2xl font-bold text-green-600">
                      {sessionData.illusionResult.scenarios.filter(s => s.result === 'safe-pass').length}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Near-Miss</div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {sessionData.illusionResult.scenarios.filter(s => s.result === 'near-miss').length}
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Crashes</div>
                    <div className="text-2xl font-bold text-red-600">
                      {sessionData.illusionResult.scenarios.filter(s => s.result === 'crash').length}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Scenario</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Mode</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Result</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Attribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessionData.illusionResult.scenarios.map((scenario, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">#{scenario.scenarioId}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              scenario.mode === 'manual' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                            }`}>
                              {scenario.mode === 'manual' ? '🚗' : '🤖'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs">{scenario.action || 'None'}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              scenario.result === 'crash' ? 'bg-red-200 text-red-800' :
                              scenario.result === 'near-miss' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-green-200 text-green-800'
                            }`}>
                              {scenario.result === 'crash' ? '💥' :
                               scenario.result === 'near-miss' ? '⚠️' : '✅'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs">{scenario.attributionAnswer || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('success')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Success ({stats.success})
              </button>
              <button
                onClick={() => setFilter('fail')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'fail'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Failed ({stats.fail})
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={loadAttempts}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleExport}
                disabled={filteredAttempts.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📥 Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Attempts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredAttempts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No attempts found</p>
              <Link
                to="/"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Take the Test
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outcome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reaction Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance to Obstacle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(attempt.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            attempt.outcome === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {attempt.outcome === 'success' ? '✅ Success' : '❌ Fail'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attempt.reaction_latency_ms !== null
                          ? `${attempt.reaction_latency_ms} ms`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attempt.distance_to_obstacle !== null
                          ? `${Math.round(attempt.distance_to_obstacle)} px`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attempt.speed_px_per_s} px/s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attempt.client_info?.deviceType || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
