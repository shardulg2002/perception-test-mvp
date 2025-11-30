import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [allSessions, setAllSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filterExperiment, setFilterExperiment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [aggregateStats, setAggregateStats] = useState(null);

  useEffect(() => {
    // Check admin authentication
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    loadAllSessions();
  }, [navigate]);

  const loadAllSessions = () => {
    const sessions = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key.startsWith('session_')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          sessions.push({
            id: key.replace('session_', ''),
            ...sessionData
          });
        } catch (error) {
          console.error('Error parsing session:', error);
        }
      }
    }

    // Sort by timestamp (most recent first)
    sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setAllSessions(sessions);
    calculateAggregateStats(sessions);
    
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0]);
    }
  };

  const calculateAggregateStats = (sessions) => {
    const stats = {
      totalSessions: sessions.length,
      totalCandidates: sessions.length,
      
      // Experiment 1 Stats
      exp1: {
        totalTrials: 0,
        successCount: 0,
        failCount: 0,
        avgReactionTime: 0,
        avgSuccessRate: 0
      },
      
      // Experiment 2 Stats
      exp2: {
        totalTrials: 0,
        totalPoints: 0,
        avgPoints: 0,
        explosionCount: 0,
        avgPumps: 0
      },
      
      // Experiment 3 Stats
      exp3: {
        totalScenarios: 0,
        manualModeCount: 0,
        assistModeCount: 0,
        crashCount: 0,
        nearMissCount: 0,
        safePassCount: 0
      }
    };

    let reactionTimes = [];
    let successRates = [];
    let totalPumps = [];

    sessions.forEach(session => {
      // Experiment 1
      if (session.perceptionResults) {
        const trials = session.perceptionResults;
        stats.exp1.totalTrials += trials.length;
        const successes = trials.filter(t => t.outcome === 'success').length;
        stats.exp1.successCount += successes;
        stats.exp1.failCount += trials.filter(t => t.outcome === 'collision').length;
        
        if (trials.length > 0) {
          successRates.push((successes / trials.length) * 100);
        }
        
        trials.forEach(t => {
          if (t.reactionLatency) reactionTimes.push(t.reactionLatency);
        });
      }

      // Experiment 2
      if (session.fuelPumpResult) {
        const fp = session.fuelPumpResult;
        stats.exp2.totalPoints += fp.totalPoints || 0;
        
        if (fp.trials) {
          stats.exp2.totalTrials += fp.trials.length;
          stats.exp2.explosionCount += fp.trials.filter(t => t.exploded).length;
          
          fp.trials.forEach(t => {
            totalPumps.push(t.pumps);
          });
        }
      }

      // Experiment 3
      if (session.illusionResult?.scenarios) {
        const scenarios = session.illusionResult.scenarios;
        stats.exp3.totalScenarios += scenarios.length;
        stats.exp3.manualModeCount += scenarios.filter(s => s.mode === 'manual').length;
        stats.exp3.assistModeCount += scenarios.filter(s => s.mode === 'assist').length;
        stats.exp3.crashCount += scenarios.filter(s => s.result === 'crash').length;
        stats.exp3.nearMissCount += scenarios.filter(s => s.result === 'near-miss').length;
        stats.exp3.safePassCount += scenarios.filter(s => s.result === 'safe-pass').length;
      }
    });

    // Calculate averages
    stats.exp1.avgReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;
    
    stats.exp1.avgSuccessRate = successRates.length > 0
      ? successRates.reduce((a, b) => a + b, 0) / successRates.length
      : 0;

    stats.exp2.avgPoints = sessions.length > 0
      ? stats.exp2.totalPoints / sessions.length
      : 0;

    stats.exp2.avgPumps = totalPumps.length > 0
      ? totalPumps.reduce((a, b) => a + b, 0) / totalPumps.length
      : 0;

    setAggregateStats(stats);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminLoginTime');
    navigate('/admin/login');
  };

  const exportAllData = () => {
    const dataStr = JSON.stringify(allSessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin_all_sessions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const exportCSV = () => {
    let csv = 'Session ID,Name,App Number,Timestamp,';
    csv += 'Perception Trials,Perception Success,Perception Fails,Avg Reaction Time,';
    csv += 'Fuel Pump Points,Fuel Pump Trials,Explosions,';
    csv += 'Illusion Scenarios,Manual Mode,Assist Mode,Crashes,Near-Miss,Safe Pass\n';

    allSessions.forEach(session => {
      const p = session.perceptionResults || [];
      const f = session.fuelPumpResult || {};
      const i = session.illusionResult?.scenarios || [];
      
      const pSuccess = p.filter(t => t.outcome === 'success').length;
      const pFail = p.filter(t => t.outcome === 'collision').length;
      const pReactionTimes = p.filter(t => t.reactionLatency).map(t => t.reactionLatency);
      const avgReaction = pReactionTimes.length > 0 
        ? (pReactionTimes.reduce((a,b) => a+b, 0) / pReactionTimes.length).toFixed(0)
        : 'N/A';

      csv += `${session.id},`;
      csv += `"${session.demographics?.name || 'N/A'}",`;
      csv += `${session.demographics?.applicationNumber || 'N/A'},`;
      csv += `${session.timestamp || 'N/A'},`;
      csv += `${p.length},${pSuccess},${pFail},${avgReaction},`;
      csv += `${f.totalPoints || 0},${f.trials?.length || 0},${f.trials?.filter(t => t.exploded).length || 0},`;
      csv += `${i.length},`;
      csv += `${i.filter(s => s.mode === 'manual').length},`;
      csv += `${i.filter(s => s.mode === 'assist').length},`;
      csv += `${i.filter(s => s.result === 'crash').length},`;
      csv += `${i.filter(s => s.result === 'near-miss').length},`;
      csv += `${i.filter(s => s.result === 'safe-pass').length}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin_sessions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const deleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      localStorage.removeItem(`session_${sessionId}`);
      loadAllSessions();
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
    }
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL session data. Are you absolutely sure?')) {
      if (window.confirm('This is your final confirmation. Type will be permanently deleted.')) {
        allSessions.forEach(session => {
          localStorage.removeItem(`session_${session.id}`);
        });
        loadAllSessions();
        setSelectedSession(null);
        alert('All session data has been cleared.');
      }
    }
  };

  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.demographics?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.demographics?.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🔐 Admin Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">
                Comprehensive Analytics & Data Management
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                📊 Export CSV
              </button>
              <button
                onClick={exportAllData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                📥 Export JSON
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aggregate Statistics */}
        {aggregateStats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Aggregate Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Sessions</div>
                <div className="text-3xl font-bold text-blue-600">{aggregateStats.totalSessions}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Candidates</div>
                <div className="text-3xl font-bold text-purple-600">{aggregateStats.totalCandidates}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Avg Success Rate</div>
                <div className="text-3xl font-bold text-green-600">
                  {aggregateStats.exp1.avgSuccessRate.toFixed(1)}%
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Avg Reaction Time</div>
                <div className="text-3xl font-bold text-orange-600">
                  {aggregateStats.exp1.avgReactionTime.toFixed(0)} ms
                </div>
              </div>
            </div>

            {/* Experiment-wise Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Experiment 1 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-blue-600 mb-3">🚗 Experiment 1: Perception</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Trials:</span>
                    <span className="font-semibold">{aggregateStats.exp1.totalTrials}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Successes:</span>
                    <span className="font-semibold text-green-600">{aggregateStats.exp1.successCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failures:</span>
                    <span className="font-semibold text-red-600">{aggregateStats.exp1.failCount}</span>
                  </div>
                </div>
              </div>

              {/* Experiment 2 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-yellow-600 mb-3">⛽ Experiment 2: Fuel Pump</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Points:</span>
                    <span className="font-semibold">{aggregateStats.exp2.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Points/Session:</span>
                    <span className="font-semibold">{aggregateStats.exp2.avgPoints.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Explosions:</span>
                    <span className="font-semibold text-red-600">{aggregateStats.exp2.explosionCount}</span>
                  </div>
                </div>
              </div>

              {/* Experiment 3 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-purple-600 mb-3">🎮 Experiment 3: Illusion</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Scenarios:</span>
                    <span className="font-semibold">{aggregateStats.exp3.totalScenarios}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crashes:</span>
                    <span className="font-semibold text-red-600">{aggregateStats.exp3.crashCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Safe Pass:</span>
                    <span className="font-semibold text-green-600">{aggregateStats.exp3.safePassCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session List and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-gray-900">Sessions ({filteredSessions.length})</h2>
                  <button
                    onClick={clearAllData}
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    🗑️ Clear All
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, app no, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {filteredSessions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No sessions found
                  </div>
                ) : (
                  filteredSessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`p-4 border-b cursor-pointer transition-colors ${
                        selectedSession?.id === session.id
                          ? 'bg-blue-50 border-l-4 border-l-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {session.demographics?.name || 'Anonymous'}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            App No: {session.demographics?.applicationNumber || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {session.timestamp ? new Date(session.timestamp).toLocaleString() : 'Unknown'}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Selected Session Details */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="bg-white rounded-lg shadow">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
                  <h2 className="text-xl font-bold">Session Details</h2>
                  <div className="text-sm mt-1 opacity-90">
                    {selectedSession.demographics?.name} - {selectedSession.demographics?.applicationNumber}
                  </div>
                </div>

                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {/* Experiment 1 */}
                  {selectedSession.perceptionResults && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-blue-600 mb-3">🚗 Experiment 1</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left">Trial</th>
                              <th className="px-3 py-2 text-left">Outcome</th>
                              <th className="px-3 py-2 text-left">Reaction</th>
                              <th className="px-3 py-2 text-left">Distance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedSession.perceptionResults.map((trial, idx) => (
                              <tr key={idx} className={trial.outcome === 'success' ? 'bg-green-50' : 'bg-red-50'}>
                                <td className="px-3 py-2">{idx + 1}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
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

                  {/* Experiment 2 */}
                  {selectedSession.fuelPumpResult && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-yellow-600 mb-3">⛽ Experiment 2</h3>
                      <div className="mb-3 text-sm">
                        <span className="font-semibold">Total Points:</span> {selectedSession.fuelPumpResult.totalPoints}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left">Trial</th>
                              <th className="px-3 py-2 text-left">Pumps</th>
                              <th className="px-3 py-2 text-left">Points</th>
                              <th className="px-3 py-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedSession.fuelPumpResult.trials?.map((trial, idx) => (
                              <tr key={idx} className={trial.exploded ? 'bg-red-50' : 'bg-green-50'}>
                                <td className="px-3 py-2">{idx + 1}</td>
                                <td className="px-3 py-2">{trial.pumps}</td>
                                <td className="px-3 py-2">{trial.pointsEarned}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
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

                  {/* Experiment 3 */}
                  {selectedSession.illusionResult?.scenarios && (
                    <div>
                      <h3 className="text-lg font-bold text-purple-600 mb-3">🎮 Experiment 3</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left">Scenario</th>
                              <th className="px-3 py-2 text-left">Mode</th>
                              <th className="px-3 py-2 text-left">Action</th>
                              <th className="px-3 py-2 text-left">Result</th>
                              <th className="px-3 py-2 text-left">Attribution</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedSession.illusionResult.scenarios.map((scenario, idx) => (
                              <tr key={idx}>
                                <td className="px-3 py-2">#{scenario.scenarioId}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    scenario.mode === 'manual' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                                  }`}>
                                    {scenario.mode === 'manual' ? '🚗' : '🤖'}
                                  </span>
                                </td>
                                <td className="px-3 py-2">{scenario.action || 'None'}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
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
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <p className="text-gray-500">Select a session to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
