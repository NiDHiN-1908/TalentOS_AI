package talentos.authz

default allow = false

# Rule 1: Allow Executives full access
allow {
    input.user_role == "CHIEF_EXECUTIVE_OFFICER"
}

# Rule 2: Allow Recruiter to view ATS candidates
allow {
    input.user_role == "RECRUITER"
    input.action == "read"
    input.resource == "ats_candidates"
}

# Rule 3: Enforce strict tenant isolation
allow {
    input.user_tenant_id == input.resource_tenant_id
    input.action == "read"
    input.resource != "payroll_salary"
}
