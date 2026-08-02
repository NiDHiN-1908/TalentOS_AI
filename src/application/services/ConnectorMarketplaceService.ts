export type ConnectorCategory = 'JOB_BOARD' | 'ENTERPRISE_ERP' | 'ATS_SYNC' | 'ASSESSMENT';
export type ConnectorHealthStatus = 'HEALTHY' | 'WARNING' | 'ERROR' | 'UNINSTALLED';

export interface ConnectorPermissions {
  readCandidates: boolean;
  writeJobs: boolean;
  exportPayrollData: boolean;
  webhookEvents: boolean;
}

export interface ConnectorPluginMeta {
  id: string;
  name: string;
  provider: string;
  version: string;
  category: ConnectorCategory;
  description: string;
  isEnterpriseFuture: boolean;
  health: ConnectorHealthStatus;
  installed: boolean;
  permissions: ConnectorPermissions;
  settings: Record<string, string>;
  documentationUrl: string;
  lastSyncTimestamp?: string;
  logs: Array<{ timestamp: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }>;
}

export class ConnectorMarketplaceService {
  private static registry: ConnectorPluginMeta[] = [
    {
      id: 'conn-free-career-portal',
      name: 'Company Career Portal',
      provider: 'TalentOS AI Core',
      version: '1.0.0',
      category: 'JOB_BOARD',
      description: 'Auto-generated responsive career website with SEO friendly URLs and candidate login.',
      isEnterpriseFuture: false,
      health: 'HEALTHY',
      installed: true,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: false, webhookEvents: true },
      settings: { portalDomain: 'careers.acme.corp', themeColor: '#10b981' },
      documentationUrl: 'https://docs.talentos.ai/connectors/career-portal',
      lastSyncTimestamp: '2026-08-02 12:00:00',
      logs: [{ timestamp: '2026-08-02 12:00', level: 'INFO', message: 'Career portal active. 14 open jobs indexed.' }]
    },
    {
      id: 'conn-free-google-jobs',
      name: 'Google Jobs SEO Indexer',
      provider: 'TalentOS AI Core',
      version: '1.0.0',
      category: 'JOB_BOARD',
      description: 'Automated Schema.org/JobPosting JSON-LD structured data generator for Google Search.',
      isEnterpriseFuture: false,
      health: 'HEALTHY',
      installed: true,
      permissions: { readCandidates: false, writeJobs: true, exportPayrollData: false, webhookEvents: false },
      settings: { jsonLdAutoPublish: 'true', sitemapUrl: 'https://careers.acme.corp/sitemap.xml' },
      documentationUrl: 'https://docs.talentos.ai/connectors/google-jobs',
      lastSyncTimestamp: '2026-08-02 11:45:00',
      logs: [{ timestamp: '2026-08-02 11:45', level: 'INFO', message: 'Schema.org JSON-LD updated for 14 requisitions.' }]
    },
    {
      id: 'conn-linkedin',
      name: 'LinkedIn Recruiter Connector',
      provider: 'LinkedIn Corporation',
      version: '2.4.0',
      category: 'JOB_BOARD',
      description: 'Bi-directional job publishing & candidate sync via LinkedIn Talent API.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: false, webhookEvents: true },
      settings: { clientId: 'YOUR_LINKEDIN_CLIENT_ID', clientSecret: '••••••••' },
      documentationUrl: 'https://docs.talentos.ai/connectors/linkedin',
      logs: []
    },
    {
      id: 'conn-indeed',
      name: 'Indeed Job Feed Sync',
      provider: 'Indeed Inc.',
      version: '1.8.0',
      category: 'JOB_BOARD',
      description: 'Auto-publish vacancies to Indeed XML feeds and collect candidate applications.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: false, webhookEvents: false },
      settings: { xmlFeedUrl: 'https://acme.corp/feeds/indeed.xml' },
      documentationUrl: 'https://docs.talentos.ai/connectors/indeed',
      logs: []
    },
    {
      id: 'conn-naukri',
      name: 'Naukri.com Integration',
      provider: 'Info Edge',
      version: '2.0.0',
      category: 'JOB_BOARD',
      description: 'Recruitment portal sync for India region talent pool and CV database search.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: false, webhookEvents: true },
      settings: { key: 'NAUKRI_API_KEY' },
      documentationUrl: 'https://docs.talentos.ai/connectors/naukri',
      logs: []
    },
    {
      id: 'conn-foundit',
      name: 'Foundit (Monster) Sync',
      provider: 'Foundit International',
      version: '1.2.0',
      category: 'JOB_BOARD',
      description: 'Automated job posting and applicant ingestion for Foundit talent network.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: false, webhookEvents: false },
      settings: {},
      documentationUrl: 'https://docs.talentos.ai/connectors/foundit',
      logs: []
    },
    {
      id: 'conn-workday',
      name: 'Workday HCM Integration',
      provider: 'Workday Inc.',
      version: '3.1.0',
      category: 'ENTERPRISE_ERP',
      description: 'Enterprise HR requisition, employee SSOT, and compensation sync with Workday.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: true, webhookEvents: true },
      settings: { tenantName: 'acme_workday_prod', apiEndpoint: 'https://wd2-services.workday.com' },
      documentationUrl: 'https://docs.talentos.ai/connectors/workday',
      logs: []
    },
    {
      id: 'conn-sap',
      name: 'SAP SuccessFactors Sync',
      provider: 'SAP SE',
      version: '4.0.0',
      category: 'ENTERPRISE_ERP',
      description: 'Global SAP recruitment module & OData API candidate synchronization.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: true, webhookEvents: true },
      settings: { odataEndpoint: 'https://api.successfactors.com/odata/v2' },
      documentationUrl: 'https://docs.talentos.ai/connectors/sap',
      logs: []
    },
    {
      id: 'conn-oracle',
      name: 'Oracle HCM Cloud Connector',
      provider: 'Oracle Corporation',
      version: '2.5.0',
      category: 'ENTERPRISE_ERP',
      description: 'Bi-directional employee lifecycle and recruitment sync with Oracle HCM Cloud.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: true, webhookEvents: true },
      settings: {},
      documentationUrl: 'https://docs.talentos.ai/connectors/oracle-hcm',
      logs: []
    },
    {
      id: 'conn-greenhouse',
      name: 'Greenhouse Enterprise Connector',
      provider: 'Greenhouse Software',
      version: '2.1.0',
      category: 'ATS_SYNC',
      description: 'Bi-directional candidate stage sync & interview scorecard ingestion.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: false, webhookEvents: true },
      settings: { harvestApiKey: 'GREENHOUSE_HARVEST_KEY' },
      documentationUrl: 'https://docs.talentos.ai/connectors/greenhouse',
      logs: []
    },
    {
      id: 'conn-lever',
      name: 'Lever ATS Connector',
      provider: 'Lever Inc.',
      version: '1.9.0',
      category: 'ATS_SYNC',
      description: 'Seamless candidate pipeline sync with Lever Hire & Lever Nurture.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: false, webhookEvents: true },
      settings: {},
      documentationUrl: 'https://docs.talentos.ai/connectors/lever',
      logs: []
    },
    {
      id: 'conn-workable',
      name: 'Workable ATS Sync',
      provider: 'Workable Software',
      version: '1.4.0',
      category: 'ATS_SYNC',
      description: 'Recruitment workflow and candidate profile synchronization with Workable.',
      isEnterpriseFuture: true,
      health: 'UNINSTALLED',
      installed: false,
      permissions: { readCandidates: true, writeJobs: true, exportPayrollData: false, webhookEvents: false },
      settings: {},
      documentationUrl: 'https://docs.talentos.ai/connectors/workable',
      logs: []
    }
  ];

  public static getRegistry(): ConnectorPluginMeta[] {
    return this.registry;
  }

  public static getConnectorById(id: string): ConnectorPluginMeta | undefined {
    return this.registry.find(c => c.id === id);
  }

  public static installConnector(id: string): boolean {
    const conn = this.getConnectorById(id);
    if (conn) {
      conn.installed = true;
      conn.health = 'HEALTHY';
      conn.lastSyncTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      conn.logs.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        level: 'INFO',
        message: `Connector ${conn.name} (v${conn.version}) successfully installed into registry.`
      });
      return true;
    }
    return false;
  }
}
