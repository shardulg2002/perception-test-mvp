import { useState, useEffect } from 'react';
import { fetchAttempts, exportToCSV, downloadCSV } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

/**
 * Dashboard Component
 * Displays all test attempts with filtering and export capabilities
 */
export default function Dashboard() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | success | fail
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    fail: 0,
    avgReactionTime: 0
  });

  useEffect(() => {
    loadAttempts();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [attempts]);

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
