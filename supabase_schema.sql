-- Perception Test Database Schema for Supabase

-- Create the perception_attempts table
CREATE TABLE IF NOT EXISTS perception_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Test configuration
  visible_duration_ms INTEGER NOT NULL,
  speed_px_per_s NUMERIC NOT NULL,
  
  -- Timing data
  hide_time TIMESTAMPTZ,
  stop_time TIMESTAMPTZ,
  collision_time TIMESTAMPTZ,
  
  -- Position data
  position_at_stop NUMERIC,
  distance_to_obstacle NUMERIC,
  
  -- Results
  reaction_latency_ms INTEGER,
  outcome TEXT CHECK (outcome IN ('success', 'fail')),
  
  -- Client metadata
  client_info JSONB
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_perception_attempts_created_at 
  ON perception_attempts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_perception_attempts_outcome 
  ON perception_attempts(outcome);

CREATE INDEX IF NOT EXISTS idx_perception_attempts_session_id 
  ON perception_attempts(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE perception_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (guest mode)
CREATE POLICY "Allow public inserts" 
  ON perception_attempts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow public reads (for dashboard)
CREATE POLICY "Allow public reads" 
  ON perception_attempts
  FOR SELECT
  TO public
  USING (true);

-- Optional: Create policy to prevent updates/deletes (data integrity)
-- Users can only insert, not modify existing attempts
CREATE POLICY "Prevent updates" 
  ON perception_attempts
  FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "Prevent deletes" 
  ON perception_attempts
  FOR DELETE
  TO public
  USING (false);

-- Add comments for documentation
COMMENT ON TABLE perception_attempts IS 'Stores perception test attempts with timing and outcome data';
COMMENT ON COLUMN perception_attempts.visible_duration_ms IS 'Duration the car was visible before hiding (milliseconds)';
COMMENT ON COLUMN perception_attempts.speed_px_per_s IS 'Speed of the car in pixels per second';
COMMENT ON COLUMN perception_attempts.reaction_latency_ms IS 'Time from car hiding to stop button press (milliseconds)';
COMMENT ON COLUMN perception_attempts.outcome IS 'Test outcome: success (stopped before collision) or fail (collision occurred)';
COMMENT ON COLUMN perception_attempts.client_info IS 'JSON object containing user agent, viewport size, device type, etc.';
