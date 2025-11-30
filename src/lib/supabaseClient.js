import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Running in offline mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Save a perception test attempt to Supabase
 * @param {Object} attemptData - The attempt data to save
 * @returns {Promise<Object>} - The saved attempt or error
 */
export async function saveAttempt(attemptData) {
  if (!supabase) {
    console.warn('Supabase not configured. Attempt not saved:', attemptData);
    return { error: 'Supabase not configured', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('perception_attempts')
      .insert([attemptData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving attempt:', error);
    return { data: null, error };
  }
}

/**
 * Fetch all perception test attempts
 * @param {number} limit - Maximum number of attempts to fetch
 * @returns {Promise<Array>} - Array of attempts
 */
export async function fetchAttempts(limit = 100) {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot fetch attempts.');
    return { data: [], error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('perception_attempts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return { data: [], error };
  }
}

/**
 * Export attempts to CSV format
 * @param {Array} attempts - Array of attempt objects
 * @returns {string} - CSV formatted string
 */
export function exportToCSV(attempts) {
  if (!attempts || attempts.length === 0) return '';

  const headers = [
    'ID',
    'Created At',
    'Visible Duration (ms)',
    'Speed (px/s)',
    'Hide Time',
    'Stop Time',
    'Collision Time',
    'Position at Stop',
    'Distance to Obstacle',
    'Reaction Latency (ms)',
    'Outcome',
    'User Agent',
    'Viewport'
  ];

  const rows = attempts.map(attempt => [
    attempt.id,
    attempt.created_at,
    attempt.visible_duration_ms,
    attempt.speed_px_per_s,
    attempt.hide_time,
    attempt.stop_time,
    attempt.collision_time,
    attempt.position_at_stop,
    attempt.distance_to_obstacle,
    attempt.reaction_latency_ms,
    attempt.outcome,
    attempt.client_info?.ua || '',
    attempt.client_info?.viewport || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of the file to download
 */
export function downloadCSV(csvContent, filename = 'perception_attempts.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
