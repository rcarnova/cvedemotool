-- ============================================================================
-- Talent Track — Schema Supabase
-- ============================================================================

-- ─── Teams ──────────────────────────────────────────────────────────────────
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── People ─────────────────────────────────────────────────────────────────
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  is_manager BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Behaviors ──────────────────────────────────────────────────────────────
CREATE TABLE behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('dna', 'team')),
  type TEXT NOT NULL DEFAULT 'core' CHECK (type IN ('core', 'team')),
  description TEXT,
  indicators TEXT[] DEFAULT '{}',
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Evaluations (upsert su person_id + behavior_id) ────────────────────────
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  behavior_id UUID NOT NULL REFERENCES behaviors(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('training', 'on_track', 'example')),
  evaluated_by UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (person_id, behavior_id)
);

-- ─── Behavior Notes ─────────────────────────────────────────────────────────
CREATE TABLE behavior_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  behavior_id UUID NOT NULL REFERENCES behaviors(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('training', 'on_track', 'example')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Feature Flags ──────────────────────────────────────────────────────────
CREATE TABLE feature_flags (
  id TEXT PRIMARY KEY,
  enabled BOOLEAN DEFAULT false,
  description TEXT
);

-- ─── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_people_team ON people(team_id);
CREATE INDEX idx_evaluations_person ON evaluations(person_id);
CREATE INDEX idx_evaluations_behavior ON evaluations(behavior_id);
CREATE INDEX idx_behavior_notes_person ON behavior_notes(person_id);
CREATE INDEX idx_behavior_notes_behavior ON behavior_notes(behavior_id);
CREATE INDEX idx_behavior_notes_created ON behavior_notes(created_at DESC);

-- ─── RLS (Row Level Security) ───────────────────────────────────────────────
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Policy: accesso pubblico in lettura (anon key) per il demo
CREATE POLICY "Public read" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read" ON people FOR SELECT USING (true);
CREATE POLICY "Public read" ON behaviors FOR SELECT USING (true);
CREATE POLICY "Public read" ON evaluations FOR SELECT USING (true);
CREATE POLICY "Public read" ON behavior_notes FOR SELECT USING (true);
CREATE POLICY "Public read" ON feature_flags FOR SELECT USING (true);

-- Policy: scrittura pubblica per il demo (da restringere con auth in prod)
CREATE POLICY "Public insert" ON evaluations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON evaluations FOR UPDATE USING (true);
CREATE POLICY "Public insert" ON behavior_notes FOR INSERT WITH CHECK (true);

-- ─── RPC: get_company_overview ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_company_overview()
RETURNS TABLE (
  team_name TEXT,
  manager_name TEXT,
  behavior_name TEXT,
  training_count BIGINT,
  on_track_count BIGINT,
  example_count BIGINT,
  total_evaluated BIGINT
) LANGUAGE sql STABLE AS $$
  SELECT
    t.name AS team_name,
    m.name AS manager_name,
    b.name AS behavior_name,
    COUNT(*) FILTER (WHERE e.level = 'training') AS training_count,
    COUNT(*) FILTER (WHERE e.level = 'on_track') AS on_track_count,
    COUNT(*) FILTER (WHERE e.level = 'example') AS example_count,
    COUNT(*) AS total_evaluated
  FROM evaluations e
  JOIN people p ON p.id = e.person_id
  JOIN teams t ON t.id = p.team_id
  JOIN people m ON m.id = e.evaluated_by
  JOIN behaviors b ON b.id = e.behavior_id
  GROUP BY t.name, m.name, b.name
  ORDER BY t.name, b.name;
$$;

-- ─── RPC: get_team_comparison ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_team_comparison()
RETURNS TABLE (
  team_name TEXT,
  manager_name TEXT,
  avg_score NUMERIC,
  total_evaluations BIGINT,
  strongest_behavior TEXT,
  weakest_behavior TEXT
) LANGUAGE sql STABLE AS $$
  WITH scored AS (
    SELECT
      t.name AS team_name,
      m.name AS manager_name,
      b.name AS behavior_name,
      e.level,
      CASE e.level
        WHEN 'training' THEN 1
        WHEN 'on_track' THEN 2
        WHEN 'example' THEN 3
      END AS score
    FROM evaluations e
    JOIN people p ON p.id = e.person_id
    JOIN teams t ON t.id = p.team_id
    JOIN people m ON m.id = e.evaluated_by
    JOIN behaviors b ON b.id = e.behavior_id
  ),
  team_stats AS (
    SELECT
      team_name,
      manager_name,
      ROUND(AVG(score), 2) AS avg_score,
      COUNT(*) AS total_evaluations
    FROM scored
    GROUP BY team_name, manager_name
  ),
  behavior_avg AS (
    SELECT
      team_name,
      behavior_name,
      AVG(score) AS behavior_score
    FROM scored
    GROUP BY team_name, behavior_name
  ),
  strongest AS (
    SELECT DISTINCT ON (team_name) team_name, behavior_name
    FROM behavior_avg
    ORDER BY team_name, behavior_score DESC
  ),
  weakest AS (
    SELECT DISTINCT ON (team_name) team_name, behavior_name
    FROM behavior_avg
    ORDER BY team_name, behavior_score ASC
  )
  SELECT
    ts.team_name,
    ts.manager_name,
    ts.avg_score,
    ts.total_evaluations,
    s.behavior_name AS strongest_behavior,
    w.behavior_name AS weakest_behavior
  FROM team_stats ts
  LEFT JOIN strongest s ON s.team_name = ts.team_name
  LEFT JOIN weakest w ON w.team_name = ts.team_name
  ORDER BY ts.avg_score DESC;
$$;

-- ─── Seed Data ──────────────────────────────────────────────────────────────

-- Team
INSERT INTO teams (id, name) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Amministrazione');

-- People (manager)
INSERT INTO people (id, name, initials, role, department, team_id, is_manager) VALUES
  ('11111111-1111-1111-1111-000000000001', 'Laura Bianchi', 'LB', 'Team Manager', 'Amministrazione', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', true);

-- People (team members)
INSERT INTO people (id, name, initials, role, department, team_id) VALUES
  ('22222222-2222-2222-2222-000000000001', 'Chiara Bonfanti', 'CB', 'Payroll Specialist', 'Amministrazione', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'),
  ('22222222-2222-2222-2222-000000000002', 'Elena Marchetti', 'EM', 'Accounts Payable', 'Amministrazione', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'),
  ('22222222-2222-2222-2222-000000000003', 'Francesca Colombo', 'FC', 'Accounts Receivable', 'Amministrazione', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'),
  ('22222222-2222-2222-2222-000000000004', 'Giulia Moretti', 'GM', 'Supplier Relations', 'Amministrazione', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'),
  ('22222222-2222-2222-2222-000000000005', 'Sofia Santoro', 'SS', 'Administrative Coordinator', 'Amministrazione', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001');

-- Behaviors
INSERT INTO behaviors (id, name, category, type, description, indicators, display_order) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000001', 'Comportamento 1', 'dna', 'core', 'Questo comportamento sarà definito insieme durante la sessione di codesign con il team CVE.', ARRAY['Da definire', 'Da definire', 'Da definire'], 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000002', 'Comportamento 2', 'dna', 'core', 'Questo comportamento sarà definito insieme durante la sessione di codesign con il team CVE.', ARRAY['Da definire', 'Da definire', 'Da definire'], 2),
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000003', 'Comportamento 3', 'team', 'team', 'Questo comportamento sarà definito insieme durante la sessione di codesign con il team CVE.', ARRAY['Da definire', 'Da definire', 'Da definire'], 3),
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000004', 'Comportamento 4', 'team', 'team', 'Questo comportamento sarà definito insieme durante la sessione di codesign con il team CVE.', ARRAY['Da definire', 'Da definire', 'Da definire'], 4);

-- Feature Flags
INSERT INTO feature_flags (id, enabled, description) VALUES
  ('peer_notes', false, 'Abilita note tra colleghi'),
  ('employee_self_notes', true, 'Abilita prospettiva employee'),
  ('ai_insights', true, 'Mostra insight AI nella dashboard'),
  ('ceo_dashboard', false, 'Abilita dashboard CEO');
