import * as fs from 'fs';
import * as path from 'path';

describe('Enterprise Platform Engineering & DevOps Platform Suite', () => {
  test('should verify GitHub Actions CI/CD workflow file exists and contains security scan step', () => {
    const ciPath = path.join(__dirname, '../.github/workflows/ci_cd.yml');
    expect(fs.existsSync(ciPath)).toBe(true);

    const content = fs.readFileSync(ciPath, 'utf8');
    expect(content).toContain('Trivy Vulnerability Scanner');
    expect(content).toContain('pytest -v tests/');
  });

  test('should verify Kubernetes Helm values configuration file has production resource limits', () => {
    const helmPath = path.join(__dirname, '../helm/talentos-ai/values.yaml');
    expect(fs.existsSync(helmPath)).toBe(true);

    const content = fs.readFileSync(helmPath, 'utf8');
    expect(content).toContain('replicaCount: 3');
    expect(content).toContain('nginx.ingress.kubernetes.io/ssl-redirect');
    expect(content).toContain('maxReplicas: 20');
  });

  test('should verify Argo CD GitOps Application manifest contains automated self-healing sync policy', () => {
    const argoPath = path.join(__dirname, '../deploy/argo-application.yaml');
    expect(fs.existsSync(argoPath)).toBe(true);

    const content = fs.readFileSync(argoPath, 'utf8');
    expect(content).toContain('selfHeal: true');
    expect(content).toContain('namespace: talentos-production');
  });
});
