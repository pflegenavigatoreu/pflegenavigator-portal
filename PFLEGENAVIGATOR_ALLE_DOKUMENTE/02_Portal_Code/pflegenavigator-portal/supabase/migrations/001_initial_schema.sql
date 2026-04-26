-- =============================================================================
-- SUPABASE SCHEMA - PflegeNavigator EU gUG
-- Datenbank: PostgreSQL (Supabase)
-- Zweck: Anonymisierte Speicherung von Pflegebewertungen
-- DSGVO-konform, keine personenbezogenen Daten
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. CORE TABLES
-- =============================================================================

-- Haupttabelle: Anonymisierte Fälle (Fallcodes PF-XXXX-XXXX)
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_code VARCHAR(12) UNIQUE NOT NULL, -- Format: PF-XXXX-XXXX
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, completed, archived
    
    -- Zeitstempel (automatisch)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Optionale anonymisierte Metadaten
    care_level_guess INTEGER, -- Geschätzter Pflegegrad (1-5)
    module_count INTEGER DEFAULT 0, -- Anzahl ausgefüllter Module
    
    -- Indizes
    CONSTRAINT valid_case_code CHECK (case_code ~ '^PF-[A-Z0-9]{4}-[A-Z0-9]{4}$')
);

-- Antworten zu den 10 Modulen
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    
    -- Modul-Identifikation (1-10)
    module_number INTEGER NOT NULL CHECK (module_number BETWEEN 1 AND 10),
    module_name VARCHAR(50) NOT NULL,
    
    -- JSON-Struktur für flexible Antworten
    answers JSONB NOT NULL DEFAULT '{}',
    
    -- Zeitstempel
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Jeder Fall kann jedes Modul nur einmal haben
    UNIQUE(case_id, module_number)
);

-- Feedback-Tabelle für Nutzer-Vorschläge
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Optional verknüpft mit Fall (anonym)
    case_code VARCHAR(12) REFERENCES cases(case_code),
    
    -- Feedback-Inhalt
    feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('bug', 'feature', 'improvement', 'praise')),
    message TEXT NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'new', -- new, in_review, resolved, dismissed
    
    -- Zeitstempel
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. SUPPORTING TABLES
-- =============================================================================

-- Modul-Definitionen (statische Daten)
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    module_number INTEGER UNIQUE NOT NULL CHECK (module_number BETWEEN 1 AND 10),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    estimated_duration_minutes INTEGER DEFAULT 15,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- SGB-Bereiche die dieses Modul abdeckt
    sgb_coverage VARCHAR(10)[] DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zahlungen (anonymisiert via Stripe)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    
    -- Stripe-Referenzen (keine sensiblen Kartendaten!)
    stripe_payment_intent_id VARCHAR(100),
    stripe_customer_id VARCHAR(100),
    
    -- Zahlungsdetails
    amount_cents INTEGER NOT NULL, -- z.B. 2900 für 29€
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'pending', -- pending, succeeded, failed, refunded
    
    -- Produkt-Info
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('beta_special', 'standard_monthly')),
    
    -- Zeitstempel
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dokumente (Uploads zu Fällen)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    
    -- Datei-Metadaten
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    
    -- Supabase Storage Referenz
    storage_path VARCHAR(500) NOT NULL,
    public_url TEXT,
    
    -- Dokument-Typ
    document_type VARCHAR(50) DEFAULT 'other', -- medical_report, care_assessment, insurance, other
    
    -- Zeitstempel
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Automatische Löschung nach 90 Tagen (DSGVO)
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days')
);

-- System-Logs (für Debugging, 30 Tage Aufbewahrung)
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error', 'critical')),
    source VARCHAR(50) NOT NULL, -- z.B. 'api', 'webhook', 'stripe'
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    
    -- Optional verknüpft
    case_code VARCHAR(12),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Automatische Löschung nach 30 Tagen
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- =============================================================================
-- 3. INDIZES (Performance)
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_cases_case_code ON cases(case_code);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);

CREATE INDEX IF NOT EXISTS idx_answers_case_id ON answers(case_id);
CREATE INDEX IF NOT EXISTS idx_answers_module_number ON answers(module_number);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(feedback_type);

CREATE INDEX IF NOT EXISTS idx_payments_case_id ON payments(case_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_documents_case_id ON documents(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_expires ON documents(expires_at);

CREATE INDEX IF NOT EXISTS idx_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_source ON system_logs(source);
CREATE INDEX IF NOT EXISTS idx_logs_expires ON system_logs(expires_at);

-- =============================================================================
-- 4. ROW LEVEL SECURITY (RLS) - Für zukünftige Nutzer-Auth
-- =============================================================================

-- Aktiviere RLS auf allen Tabellen
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Service-Role kann alles (für Server-seitige API-Calls)
CREATE POLICY service_all_access ON cases FOR ALL USING (true);
CREATE POLICY service_all_access ON answers FOR ALL USING (true);
CREATE POLICY service_all_access ON feedback FOR ALL USING (true);
CREATE POLICY service_all_access ON payments FOR ALL USING (true);
CREATE POLICY service_all_access ON documents FOR ALL USING (true);

-- =============================================================================
-- 5. TRIGGER (Automatische Updates)
-- =============================================================================

-- Trigger: updated_at automatisch aktualisieren
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: module_count in cases aktualisieren
CREATE OR REPLACE FUNCTION update_case_module_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cases 
    SET module_count = (
        SELECT COUNT(*) FROM answers 
        WHERE case_id = NEW.case_id
    )
    WHERE id = NEW.case_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_module_count 
    AFTER INSERT OR DELETE ON answers 
    FOR EACH ROW EXECUTE FUNCTION update_case_module_count();

-- =============================================================================
-- 6. INITIAL DATA
-- =============================================================================

-- Module 1-10 definieren
INSERT INTO modules (module_number, name, description, estimated_duration_minutes, sgb_coverage) VALUES
    (1, 'Pflegegrad-Bewertung', 'Grundlegende Pflegebedürftigkeit nach SGB XI', 15, ARRAY['SGB XI']),
    (2, 'Hilfebedarf im Alltag', 'Mobilität, Selbstversorgung, Haushaltsführung', 20, ARRAY['SGB XI']),
    (3, 'Kognitive Einschränkungen', 'Demenz, Orientierung, Gedächtnis', 15, ARRAY['SGB XI']),
    (4, 'Gesundheitliche Vorerkrankungen', 'Chronische Erkrankungen, Medikation', 10, ARRAY['SGB V']),
    (5, 'Wohnsituation', 'Wohnumfeld, barrierefreier Zugang', 10, ARRAY['SGB XI', 'SGB IX']),
    (6, 'Pflegende Angehörige', 'Entlastungsleistungen, Unterstützung', 15, ARRAY['SGB XI', 'SGB V']),
    (7, 'Leistungen der Krankenkasse', 'SGB V Leistungen, Verhinderungspflege', 15, ARRAY['SGB V']),
    (8, 'Soziales Umfeld', 'Ehrenamt, Nachbarschaftshilfe', 10, ARRAY['SGB XI']),
    (9, 'Finanzielle Situation', 'Entlastungsbetrag, Zuschüsse', 15, ARRAY['SGB XI', 'SGB VI']),
    (10, 'Rechtlicher Status', 'Vollmachten, Betreuung, Patientenverfügung', 15, ARRAY['SGB XI'])
ON CONFLICT (module_number) DO NOTHING;

-- =============================================================================
-- 7. FUNKTIONEN (Hilfsfunktionen)
-- =============================================================================

-- Funktion: Neuen Fallcode generieren
CREATE OR REPLACE FUNCTION generate_case_code()
RETURNS VARCHAR(12) AS $$
DECLARE
    code VARCHAR(12);
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generiere zufälligen Code: PF-XXXX-XXXX
        code := 'PF-' || 
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4)) || '-' ||
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
        
        -- Prüfe ob Code bereits existiert
        SELECT EXISTS(SELECT 1 FROM cases WHERE case_code = code) INTO exists;
        
        IF NOT exists THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ language 'plpgsql';

-- Funktion: Fall mit Code erstellen
CREATE OR REPLACE FUNCTION create_case()
RETURNS TABLE(id UUID, case_code VARCHAR) AS $$
DECLARE
    new_id UUID;
    new_code VARCHAR(12);
BEGIN
    new_code := generate_case_code();
    
    INSERT INTO cases (case_code) 
    VALUES (new_code) 
    RETURNING cases.id INTO new_id;
    
    RETURN QUERY SELECT new_id, new_code;
END;
$$ language 'plpgsql';

-- =============================================================================
-- FERTIG
-- =============================================================================

COMMENT ON TABLE cases IS 'Anonymisierte Pflegefälle mit Fallcode PF-XXXX-XXXX';
COMMENT ON TABLE answers IS 'Antworten zu den 10 Bewertungsmodulen (JSON-Struktur)';
COMMENT ON TABLE feedback IS 'Nutzer-Feedback und Verbesserungsvorschläge';
COMMENT ON TABLE payments IS 'Stripe-Zahlungsinformationen (keine Kartendaten!)';
COMMENT ON TABLE documents IS 'Hochgeladene Dokumente (90 Tage Aufbewahrung)';
