export interface AgentTaxonomyNode {
  id: string;
  name: string;
  domain: string;
  category: 'ORCHESTRATION' | 'RECRUITMENT' | 'LIFECYCLE' | 'LEARNING' | 'OPERATIONS' | 'EXECUTIVE' | 'INTEGRATION' | 'AI_PLATFORM' | 'INFRASTRUCTURE' | 'FUTURE_EXPANSION';
  status: 'ACTIVE' | 'STANDBY' | 'FUTURE_EXPANSION';
  description: string;
}

export class AgentTaxonomyRegistryService {
  private static agents: AgentTaxonomyNode[] = [
    // 1. Orchestration Layer (Brain)
    { id: 'agt-sup', name: 'Supervisor Agent', domain: 'Brain', category: 'ORCHESTRATION', status: 'ACTIVE', description: 'LangGraph StateGraph intent router & top-level coordinator.' },
    { id: 'agt-plan', name: 'Planner Agent', domain: 'Brain', category: 'ORCHESTRATION', status: 'ACTIVE', description: 'Multi-turn task decomposition & state graph DAG generator.' },
    { id: 'agt-mem', name: 'Memory Agent', domain: 'Brain', category: 'ORCHESTRATION', status: 'ACTIVE', description: 'Context retention & working/episodic memory checkpointing.' },
    { id: 'agt-wf', name: 'Workflow Orchestrator', domain: 'Brain', category: 'ORCHESTRATION', status: 'ACTIVE', description: 'Cross-service workflow state transition validator.' },
    { id: 'agt-ctx', name: 'Context Manager', domain: 'Brain', category: 'ORCHESTRATION', status: 'ACTIVE', description: 'Tenant ID & session payload context isolation.' },
    { id: 'agt-pol', name: 'Policy Engine Agent', domain: 'Brain', category: 'ORCHESTRATION', status: 'ACTIVE', description: 'Open Policy Agent (OPA) ABAC/RBAC rule evaluator.' },
    { id: 'agt-appr', name: 'Approval Coordinator', domain: 'Brain', category: 'ORCHESTRATION', status: 'ACTIVE', description: 'Human-in-the-loop SLA approval request manager.' },
    { id: 'agt-audit', name: 'Audit Agent', domain: 'Brain', category: 'ORCHESTRATION', status: 'ACTIVE', description: 'SOC 2 immutable audit logging & SIEM telemetry logger.' },

    // 2. Recruitment Exchange
    { id: 'agt-jobpub', name: 'Job Publishing Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Auto-publishes vacancies to 6 free channels & Google Jobs SEO.' },
    { id: 'agt-rec', name: 'Recruitment Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Core candidate pipeline & requisition manager.' },
    { id: 'agt-resume', name: 'Resume Intelligence Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'PDF/Word OCR parser, skill extractor & career gap detector.' },
    { id: 'agt-screen', name: 'Candidate Screening Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: '5-bucket transparent screening classifier with reasoning.' },
    { id: 'agt-rank', name: 'Candidate Ranking Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'HNSW vector cosine match scorer & candidate ranker.' },
    { id: 'agt-dup', name: 'Duplicate Detection Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Multi-attribute duplicate matcher & auto-merger.' },
    { id: 'agt-interview', name: 'Interview Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Interviewer calendar scheduler & video assessment logger.' },
    { id: 'agt-assess', name: 'Assessment Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Technical coding test & quiz score evaluator.' },
    { id: 'agt-offer', name: 'Offer Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Digital offer letter generator & compensation band checker.' },
    { id: 'agt-rec-analytics', name: 'Recruitment Analytics Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Time-to-hire & candidate funnel metrics analyzer.' },
    { id: 'agt-pool', name: 'Talent Pool Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Silver medalist & past applicant rediscovery engine.' },
    { id: 'agt-comm', name: 'Candidate Communication Agent', domain: 'Recruitment Exchange', category: 'RECRUITMENT', status: 'ACTIVE', description: 'Automated candidate status email & SMS notifications.' },

    // 3. Employee Lifecycle
    { id: 'agt-onboard', name: 'Employee Onboarding Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: '11-step onboarding sequence & IT hardware ticket manager.' },
    { id: 'agt-prof', name: 'Employee Profile Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: 'Employee SSOT data manager.' },
    { id: 'agt-att', name: 'Attendance Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: 'Biometric timecard clocking & overtime calculator.' },
    { id: 'agt-leave', name: 'Leave Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: 'PTO balance & leave request approval workflow agent.' },
    { id: 'agt-pay', name: 'Payroll Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: 'Gross-to-net pay calculation & anomaly audit scanner.' },
    { id: 'agt-ben', name: 'Benefits Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: 'Health insurance & 401k/pension benefits enrollment.' },
    { id: 'agt-perf', name: 'Performance Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: '360 review sentiment synthesizer & OKR goal tracker.' },
    { id: 'agt-prom', name: 'Promotion Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: 'Career progression & salary band increase evaluator.' },
    { id: 'agt-succ', name: 'Succession Planning Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: 'Key executive succession benchmark analyzer.' },
    { id: 'agt-exit', name: 'Exit Management Agent', domain: 'Employee Lifecycle', category: 'LIFECYCLE', status: 'ACTIVE', description: 'Resignation sentiment, asset recovery & final settlement.' },

    // 4. Learning & Skills
    { id: 'agt-learn', name: 'Learning Agent', domain: 'Learning & Skills', category: 'LEARNING', status: 'ACTIVE', description: 'LMS course enrollments & progress tracking.' },
    { id: 'agt-skills', name: 'Skills Intelligence Agent', domain: 'Learning & Skills', category: 'LEARNING', status: 'ACTIVE', description: 'Department skill gap matrix analyzer.' },
    { id: 'agt-cert', name: 'Certification Agent', domain: 'Learning & Skills', category: 'LEARNING', status: 'ACTIVE', description: 'Compliance & technical certification validator.' },
    { id: 'agt-career', name: 'Career Path Agent', domain: 'Learning & Skills', category: 'LEARNING', status: 'ACTIVE', description: 'Employee career mobility pathway mapper.' },
    { id: 'agt-train', name: 'Training Recommendation Agent', domain: 'Learning & Skills', category: 'LEARNING', status: 'ACTIVE', description: 'AI personalized course recommendation engine.' },

    // 5. HR Operations
    { id: 'agt-policy', name: 'Policy Agent', domain: 'HR Operations', category: 'OPERATIONS', status: 'ACTIVE', description: 'Company policy RAG query & document search.' },
    { id: 'agt-comp', name: 'Compliance Agent', domain: 'HR Operations', category: 'OPERATIONS', status: 'ACTIVE', description: 'SOC 2, GDPR, HIPAA, and labor law compliance checker.' },
    { id: 'agt-doc', name: 'Document Intelligence Agent', domain: 'HR Operations', category: 'OPERATIONS', status: 'ACTIVE', description: 'Contract & tax document OCR reader.' },
    { id: 'agt-asset', name: 'Asset Agent', domain: 'HR Operations', category: 'OPERATIONS', status: 'ACTIVE', description: 'Serial hardware allocation & return tracking.' },
    { id: 'agt-help', name: 'Helpdesk Agent', domain: 'HR Operations', category: 'OPERATIONS', status: 'ACTIVE', description: 'AI-assisted HR support ticketing & SLA responder.' },
    { id: 'agt-op-wf', name: 'Workflow Agent', domain: 'HR Operations', category: 'OPERATIONS', status: 'ACTIVE', description: 'Automated HR operation task trigger engine.' },
    { id: 'agt-notif', name: 'Notification Agent', domain: 'HR Operations', category: 'OPERATIONS', status: 'ACTIVE', description: 'Multi-channel Slack, Teams, Email, and Push notifier.' },

    // 6. Executive Intelligence
    { id: 'agt-exec', name: 'Executive Agent', domain: 'Executive Intelligence', category: 'EXECUTIVE', status: 'ACTIVE', description: 'C-Suite real-time workforce health briefing agent.' },
    { id: 'agt-work-analytics', name: 'Workforce Analytics Agent', domain: 'Executive Intelligence', category: 'EXECUTIVE', status: 'ACTIVE', description: 'Headcount velocity & department distribution analyzer.' },
    { id: 'agt-attr', name: 'Attrition Prediction Agent', domain: 'Executive Intelligence', category: 'EXECUTIVE', status: 'ACTIVE', description: 'Predictive flight risk Machine Learning scorer.' },
    { id: 'agt-forecast', name: 'Hiring Forecast Agent', domain: 'Executive Intelligence', category: 'EXECUTIVE', status: 'ACTIVE', description: 'Capacity planning & headcount budget forecaster.' },
    { id: 'agt-sal-intel', name: 'Salary Intelligence Agent', domain: 'Executive Intelligence', category: 'EXECUTIVE', status: 'ACTIVE', description: 'Market compensation benchmark & parity auditor.' },
    { id: 'agt-org-health', name: 'Organizational Health Agent', domain: 'Executive Intelligence', category: 'EXECUTIVE', status: 'ACTIVE', description: 'Employee sentiment & retention health indexer.' },

    // 7. Integration Agents
    { id: 'agt-email', name: 'Email Agent', domain: 'Integrations', category: 'INTEGRATION', status: 'ACTIVE', description: 'IMAP/SMTP mailbox scanner & auto-responder.' },
    { id: 'agt-cal', name: 'Calendar Agent', domain: 'Integrations', category: 'INTEGRATION', status: 'ACTIVE', description: 'Google Calendar / Outlook interview slot checker.' },
    { id: 'agt-gws', name: 'Google Workspace Agent', domain: 'Integrations', category: 'INTEGRATION', status: 'ACTIVE', description: 'Google Docs, Sheets, and Forms integration driver.' },
    { id: 'agt-m365', name: 'Microsoft 365 Agent', domain: 'Integrations', category: 'INTEGRATION', status: 'ACTIVE', description: 'Teams, Outlook, and Sharepoint integration driver.' },
    { id: 'agt-cportal', name: 'Career Portal Agent', domain: 'Integrations', category: 'INTEGRATION', status: 'ACTIVE', description: 'Auto-generated career website publisher.' },
    { id: 'agt-gjobs', name: 'Google Jobs Agent', domain: 'Integrations', category: 'INTEGRATION', status: 'ACTIVE', description: 'Schema.org JSON-LD structured data generator.' },
    { id: 'agt-refportal', name: 'Referral Portal Agent', domain: 'Integrations', category: 'INTEGRATION', status: 'ACTIVE', description: 'Employee referral portal submitter.' },
    { id: 'agt-conn-mkt', name: 'Connector Marketplace Agent', domain: 'Integrations', category: 'INTEGRATION', status: 'ACTIVE', description: 'SDK registry manager for future enterprise connectors.' },

    // 8. AI Platform
    { id: 'agt-rag', name: 'RAG Agent', domain: 'AI Platform', category: 'AI_PLATFORM', status: 'ACTIVE', description: 'Hybrid sparse/dense vector retrieval & citation engine.' },
    { id: 'agt-know', name: 'Knowledge Agent', domain: 'AI Platform', category: 'AI_PLATFORM', status: 'ACTIVE', description: 'Knowledge base article chunker & indexer.' },
    { id: 'agt-search', name: 'Search Agent', domain: 'AI Platform', category: 'AI_PLATFORM', status: 'ACTIVE', description: 'Hybrid BM25 sparse + HNSW dense vector searcher.' },
    { id: 'agt-embed', name: 'Embedding Agent', domain: 'AI Platform', category: 'AI_PLATFORM', status: 'ACTIVE', description: '1536-dim text embedding vector generator.' },
    { id: 'agt-prompt-opt', name: 'Prompt Optimization Agent', domain: 'AI Platform', category: 'AI_PLATFORM', status: 'ACTIVE', description: 'Dynamic prompt template & system message tuner.' },
    { id: 'agt-model-router', name: 'Model Router Agent', domain: 'AI Platform', category: 'AI_PLATFORM', status: 'ACTIVE', description: 'Intelligent LLM fallback router (Gemini / Claude / GPT).' },
    { id: 'agt-cost-opt', name: 'Cost Optimization Agent', domain: 'AI Platform', category: 'AI_PLATFORM', status: 'ACTIVE', description: 'Token budgeting & LLM inference cost optimizer.' },
    { id: 'agt-ai-eval', name: 'AI Evaluation Agent', domain: 'AI Platform', category: 'AI_PLATFORM', status: 'ACTIVE', description: 'Accuracy benchmarking & hallucination scorer.' },

    // 9. Infrastructure
    { id: 'agt-mon', name: 'Monitoring Agent', domain: 'Infrastructure', category: 'INFRASTRUCTURE', status: 'ACTIVE', description: 'Prometheus & OpenTelemetry metric collector.' },
    { id: 'agt-sec', name: 'Security Agent', domain: 'Infrastructure', category: 'INFRASTRUCTURE', status: 'ACTIVE', description: 'AES-256 vault & Zero Trust shield evaluator.' },
    { id: 'agt-devops', name: 'DevOps Agent', domain: 'Infrastructure', category: 'INFRASTRUCTURE', status: 'ACTIVE', description: 'Docker Compose & Kubernetes health checker.' },
    { id: 'agt-backup', name: 'Backup Agent', domain: 'Infrastructure', category: 'INFRASTRUCTURE', status: 'ACTIVE', description: 'Automated PostgreSQL WAL log & S3 backup driver.' },
    { id: 'agt-dr', name: 'Disaster Recovery Agent', domain: 'Infrastructure', category: 'INFRASTRUCTURE', status: 'ACTIVE', description: 'Automated Route53 DNS & regional failover driver.' },
    { id: 'agt-health', name: 'Health Monitoring Agent', domain: 'Infrastructure', category: 'INFRASTRUCTURE', status: 'ACTIVE', description: 'System endpoint HTTP /health heartbeater.' },

    // 10. Future Expansion (Enterprise ERP & Beyond)
    { id: 'agt-fin', name: 'Finance Agent', domain: 'Future Expansion', category: 'FUTURE_EXPANSION', status: 'FUTURE_EXPANSION', description: 'General ledger & corporate treasury manager.' },
    { id: 'agt-proc', name: 'Procurement Agent', domain: 'Future Expansion', category: 'FUTURE_EXPANSION', status: 'FUTURE_EXPANSION', description: 'Vendor management & purchase order manager.' },
    { id: 'agt-crm', name: 'CRM Agent', domain: 'Future Expansion', category: 'FUTURE_EXPANSION', status: 'FUTURE_EXPANSION', description: 'Customer relationship & sales pipeline manager.' },
    { id: 'agt-erp', name: 'ERP Agent', domain: 'Future Expansion', category: 'FUTURE_EXPANSION', status: 'FUTURE_EXPANSION', description: 'Enterprise resource planning orchestrator.' },
    { id: 'agt-legal', name: 'Legal Agent', domain: 'Future Expansion', category: 'FUTURE_EXPANSION', status: 'FUTURE_EXPANSION', description: 'Contract management & legal risk auditor.' },
    { id: 'agt-ops', name: 'Operations Agent', domain: 'Future Expansion', category: 'FUTURE_EXPANSION', status: 'FUTURE_EXPANSION', description: 'Supply chain & facility logistics manager.' }
  ];

  public static getTaxonomy(): AgentTaxonomyNode[] {
    return this.agents;
  }
}
