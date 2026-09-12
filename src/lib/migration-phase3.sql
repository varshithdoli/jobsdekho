-- Phase 3 migration: job_alerts table
CREATE TABLE IF NOT EXISTS job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT,
  work_mode TEXT,
  state TEXT,
  keyword TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'instant')),
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON job_alerts(is_active) WHERE is_active = true;
