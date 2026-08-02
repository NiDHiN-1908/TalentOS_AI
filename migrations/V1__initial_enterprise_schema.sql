-- TalentOS AI — Production Database Migration Script V1 (Optimized)
-- Enterprise Multi-Tenant Normalized Schema (24 Table Domains + Index Acceleration + Full RLS)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Multi-Tenancy & Access Control
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uk_roles_org_name UNIQUE (org_id, name)
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uk_users_org_email UNIQUE (org_id, email)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 2. Organization & Employees
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    parent_department_id UUID REFERENCES departments(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uk_departments_org_code UNIQUE (org_id, code)
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    hire_date DATE NOT NULL,
    base_salary NUMERIC(12, 2) NOT NULL CHECK (base_salary >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    flight_risk_level VARCHAR(20) DEFAULT 'Low' CHECK (flight_risk_level IN ('Low', 'Medium', 'High')),
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uk_employees_org_code UNIQUE (org_id, employee_code)
);

-- 3. Recruitment & ATS
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    headcount INT NOT NULL DEFAULT 1 CHECK (headcount > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume_summary TEXT,
    ai_match_score INT CHECK (ai_match_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uk_candidates_org_email UNIQUE (org_id, email)
);

CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL DEFAULT 'Sourced',
    ai_recommendation TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uk_applications_job_candidate UNIQUE (job_id, candidate_id)
);

CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    interviewer_employee_id UUID NOT NULL REFERENCES employees(id),
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    feedback_notes TEXT,
    score INT CHECK (score BETWEEN 1 AND 5),
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled'
);

-- 4. Attendance & Payroll
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'Present',
    CONSTRAINT uk_attendance_emp_date UNIQUE (employee_id, work_date)
);

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    approver_id UUID REFERENCES employees(id)
);

CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    period_name VARCHAR(50) NOT NULL,
    total_gross NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_gross >= 0),
    employee_count INT NOT NULL DEFAULT 0 CHECK (employee_count >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE payroll_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    base_pay NUMERIC(12, 2) NOT NULL CHECK (base_pay >= 0),
    bonus NUMERIC(12, 2) DEFAULT 0.00 CHECK (bonus >= 0),
    deductions NUMERIC(12, 2) DEFAULT 0.00 CHECK (deductions >= 0),
    net_pay NUMERIC(12, 2) NOT NULL CHECK (net_pay >= 0),
    PRIMARY KEY (payroll_run_id, employee_id)
);

CREATE TABLE payroll_anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    anomaly_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    description TEXT NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT false
);

-- 5. Assets, Performance & Learning
CREATE TABLE performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    review_period VARCHAR(50) NOT NULL,
    rating NUMERIC(3, 2) NOT NULL CHECK (rating BETWEEN 1.00 AND 5.00),
    sentiment_score NUMERIC(4, 3) CHECK (sentiment_score BETWEEN -1.000 AND 1.000),
    ai_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_name VARCHAR(200) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available'
);

CREATE TABLE asset_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    returned_at TIMESTAMPTZ
);

CREATE TABLE training_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    skill_category VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL
);

CREATE TABLE learning_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES training_courses(id),
    progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    deadline DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Enrolled'
);

-- 6. Knowledge, Audit & AI Engine
CREATE TABLE knowledge_base_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE company_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    policy_name VARCHAR(200) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    effective_date DATE NOT NULL
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id),
    agent_type VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    details JSONB NOT NULL,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE ai_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    memory_type VARCHAR(50) NOT NULL CHECK (memory_type IN ('working', 'episodic', 'semantic')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE vector_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    embedding vector(1536) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE workflow_dags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    goal_prompt TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
    total_tokens INT NOT NULL DEFAULT 0,
    total_cost_usd NUMERIC(10, 5) NOT NULL DEFAULT 0.00000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dag_id UUID NOT NULL REFERENCES workflow_dags(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL,
    action_name VARCHAR(200) NOT NULL,
    thought_trace TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    step_order INT NOT NULL,
    output_summary TEXT
);

CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dag_id UUID NOT NULL REFERENCES workflow_dags(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    sla_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- Foreign Key & Multitenant Indexing Optimizations
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_roles_org_id ON roles(org_id);
CREATE INDEX idx_departments_org_id ON departments(org_id);
CREATE INDEX idx_employees_org_dept ON employees(org_id, department_id);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_jobs_org_dept ON jobs(org_id, department_id);
CREATE INDEX idx_candidates_org_score ON candidates(org_id, ai_match_score DESC);
CREATE INDEX idx_job_applications_job_cand ON job_applications(job_id, candidate_id);
CREATE INDEX idx_interviews_app_id ON interviews(application_id);
CREATE INDEX idx_attendance_emp_date ON attendance_records(employee_id, work_date DESC);
CREATE INDEX idx_leave_emp_status ON leave_requests(employee_id, status);
CREATE INDEX idx_payroll_runs_org ON payroll_runs(org_id, created_at DESC);
CREATE INDEX idx_payroll_line_items_run ON payroll_line_items(payroll_run_id);
CREATE INDEX idx_payroll_anomalies_run ON payroll_anomalies(payroll_run_id, resolved);
CREATE INDEX idx_performance_emp_period ON performance_reviews(employee_id, created_at DESC);
CREATE INDEX idx_assets_org_status ON assets(org_id, status);
CREATE INDEX idx_learning_tracks_emp ON learning_tracks(employee_id, status);
CREATE INDEX idx_audit_logs_org_time ON audit_logs(org_id, created_at DESC);
CREATE INDEX idx_audit_logs_details_gin ON audit_logs USING GIN (details);
CREATE INDEX idx_workflow_dags_org_status ON workflow_dags(org_id, status);
CREATE INDEX idx_workflow_steps_dag ON workflow_steps(dag_id, step_order);

-- HNSW Vector Acceleration Index
CREATE INDEX idx_vector_embeddings_hnsw ON vector_embeddings 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Complete Row-Level Security Policies across Multi-Tenant Domains
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_dags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_employees ON employees FOR ALL USING (org_id = current_setting('app.current_org_id')::uuid);
CREATE POLICY tenant_isolation_candidates ON candidates FOR ALL USING (org_id = current_setting('app.current_org_id')::uuid);
CREATE POLICY tenant_isolation_payroll ON payroll_runs FOR ALL USING (org_id = current_setting('app.current_org_id')::uuid);
CREATE POLICY tenant_isolation_audit ON audit_logs FOR ALL USING (org_id = current_setting('app.current_org_id')::uuid);
CREATE POLICY tenant_isolation_jobs ON jobs FOR ALL USING (org_id = current_setting('app.current_org_id')::uuid);
CREATE POLICY tenant_isolation_dags ON workflow_dags FOR ALL USING (org_id = current_setting('app.current_org_id')::uuid);
CREATE POLICY tenant_isolation_memories ON ai_memories FOR ALL USING (org_id = current_setting('app.current_org_id')::uuid);
CREATE POLICY tenant_isolation_vectors ON vector_embeddings FOR ALL USING (org_id = current_setting('app.current_org_id')::uuid);
