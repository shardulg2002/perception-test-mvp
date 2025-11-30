-- Perception Test Database Schema for Supabase
-- Updated to support all 3 experiments

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create test_sessions table for storing complete session data
CREATE TABLE IF NOT EXISTS test_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Demographics
    candidate_name TEXT,
    application_number TEXT,
    age INTEGER,
    gender TEXT,
    driving_experience TEXT,
    
    -- Experiment Results (stored as JSONB for flexibility)
    perception_results JSONB,
    fuel_pump_result JSONB,
    illusion_result JSONB,
    
    -- Client Information
    client_info JSONB,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create perception_attempts table (for backward compatibility)
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
CREATE INDEX IF NOT EXISTS idx_test_sessions_session_id ON test_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_timestamp ON test_sessions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_test_sessions_candidate_name ON test_sessions(candidate_name);
CREATE INDEX IF NOT EXISTS idx_test_sessions_application_number ON test_sessions(application_number);
CREATE INDEX IF NOT EXISTS idx_perception_attempts_created_at 
  ON perception_attempts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_perception_attempts_outcome 
  ON perception_attempts(outcome);

CREATE INDEX IF NOT EXISTS idx_perception_attempts_session_id 
  ON perception_attempts(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for test_sessions
DROP TRIGGER IF EXISTS update_test_sessions_updated_at ON test_sessions;
CREATE TRIGGER update_test_sessions_updated_at
    BEFORE UPDATE ON test_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE perception_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (guest mode)
CREATE POLICY "Allow public inserts on test_sessions" 
  ON test_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public reads on test_sessions" 
  ON test_sessions
  FOR SELECT
  TO public
  USING (true);

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
