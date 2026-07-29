import React, { useState } from 'react';
import { Laptop, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';
import { EnterpriseModulesService } from '../../application/services/EnterpriseModulesService';
import { AssetRecord, CompliancePolicy } from '../../domain/types/enterpriseModules';

export const AssetsComplianceView: React.FC = () => {
  const [assets, setAssets] = useState<AssetRecord[]>(EnterpriseModulesService.getAssets());
  const [policies] = useState<CompliancePolicy[]>(EnterpriseModulesService.getPolicies());

  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<AssetRecord['category']>('Laptop');
  const [employeeName, setEmployeeName] = useState('Elena Rostova');

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    EnterpriseModulesService.allocateAsset(assetName, assetCategory, employeeName);
    setAssets([...EnterpriseModulesService.getAssets()]);
    setAssetName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Laptop size={22} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Asset Management & SOC2 Compliance</h2>
            <span className="badge badge-emerald">IT Hardware & Security Policies</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Hardware serial number tracking, employee asset allocations, and SOC2/HIPAA/GDPR policy acknowledgments.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        
        {/* Assets & Compliance Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* IT Assets Table */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Allocated IT Assets</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {assets.map((ast) => (
                <div key={ast.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{ast.assetName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      Serial: {ast.serialNumber} • Category: {ast.category}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-purple">{ast.status}</span>
                    <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>Assigned: {ast.assignedEmployeeName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Policies */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#a855f7" /> Mandatory Compliance Policies
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {policies.map((pol) => (
                <div key={pol.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{pol.policyName} ({pol.version})</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Category: {pol.category} • Effective: {pol.effectiveDate}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-emerald">{pol.acknowledgedCount} / {pol.totalEmployees} Signed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Allocate Asset Form */}
        <div className="glass-card" style={{ padding: '20px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Allocate New IT Asset</h3>
          <form onSubmit={handleAllocate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Asset Name</label>
              <input type="text" value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="e.g. MacBook Pro M3 Max" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', color: '#fff' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Category</label>
              <select value={assetCategory} onChange={(e) => setAssetCategory(e.target.value as any)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', color: '#fff' }}>
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Mobile">Mobile Phone</option>
                <option value="Security Token">Security Token</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Assign to Employee</label>
              <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', color: '#fff' }} />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px' }}>
              <Plus size={16} /> Allocate Hardware
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
