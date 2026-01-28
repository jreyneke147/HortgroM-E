
export enum PillarType {
  ECONOMIC = 'Economic',
  SOCIAL = 'Social',
  ENVIRONMENTAL = 'Environmental',
  INSTITUTIONAL = 'Institutional'
}

export enum WorkflowStage {
  PIPELINE = 'Pipeline',
  DUE_DILIGENCE = 'Due Diligence',
  APPROVAL = 'Approval',
  IMPLEMENTATION = 'Implementation',
  MONITORING = 'Monitoring',
  CLOSEOUT = 'Closeout'
}

export interface KPI {
  id: string;
  name: string;
  pillar: PillarType;
  unit: string;
  baseline: number;
  target: number;
  current: number;
  history: { year: number; value: number }[];
}

export interface Project {
  id: string;
  name: string;
  programme: string;
  stage: WorkflowStage;
  location: { lat: number; lng: number; region: string };
  kpis: KPI[];
  lastSync: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Programme {
  id: string;
  name: string;
  description: string;
  budget: number;
  projects: Project[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'ProgramManager' | 'FieldOfficer' | 'Evaluator';
  email: string;
}
