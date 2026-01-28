
import React from 'react';
import { PillarType, WorkflowStage, Programme } from './types';
import { 
  TrendingUp, 
  Users, 
  Leaf, 
  ShieldCheck, 
  LayoutDashboard, 
  Map as MapIcon, 
  GitPullRequest, 
  FileText, 
  Settings,
  Database
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'programmes', label: 'Programmes & KPIs', icon: <Database size={20} /> },
  { id: 'pipelines', label: 'Workflow & Pipeline', icon: <GitPullRequest size={20} /> },
  { id: 'geospatial', label: 'Geo-Spatial Analysis', icon: <MapIcon size={20} /> },
  { id: 'reporting', label: 'Reporting & Export', icon: <FileText size={20} /> },
  { id: 'governance', label: 'Security & Governance', icon: <ShieldCheck size={20} /> },
  { id: 'settings', label: 'System Configuration', icon: <Settings size={20} /> },
];

export const PILLAR_META = {
  [PillarType.ECONOMIC]: { color: 'text-blue-600', bg: 'bg-blue-100', icon: <TrendingUp size={24} /> },
  [PillarType.SOCIAL]: { color: 'text-purple-600', bg: 'bg-purple-100', icon: <Users size={24} /> },
  [PillarType.ENVIRONMENTAL]: { color: 'text-green-600', bg: 'bg-green-100', icon: <Leaf size={24} /> },
  [PillarType.INSTITUTIONAL]: { color: 'text-amber-600', bg: 'bg-amber-100', icon: <ShieldCheck size={24} /> },
};

export const MOCK_PROGRAMMES: Programme[] = [
  {
    id: 'prog-001',
    name: 'Commercialisation Programme',
    description: 'Transforming small-scale growers into commercial entities.',
    budget: 25000000,
    projects: [
      {
        id: 'proj-001',
        name: 'Western Cape Fruit Hub',
        programme: 'Commercialisation Programme',
        stage: WorkflowStage.IMPLEMENTATION,
        riskLevel: 'Low',
        location: { lat: -33.9249, lng: 18.4241, region: 'Western Cape' },
        lastSync: '2023-11-20T10:00:00Z',
        kpis: [
          { id: 'kpi-1', name: 'Revenue Growth', pillar: PillarType.ECONOMIC, unit: 'ZAR', baseline: 1000000, target: 5000000, current: 3200000, history: [{year: 2021, value: 1.2}, {year: 2022, value: 2.1}, {year: 2023, value: 3.2}] },
          { id: 'kpi-2', name: 'Jobs Created', pillar: PillarType.SOCIAL, unit: 'Count', baseline: 10, target: 50, current: 42, history: [{year: 2021, value: 12}, {year: 2022, value: 25}, {year: 2023, value: 42}] },
          { id: 'kpi-3', name: 'Water Efficiency', pillar: PillarType.ENVIRONMENTAL, unit: '%', baseline: 60, target: 90, current: 82, history: [{year: 2021, value: 65}, {year: 2022, value: 75}, {year: 2023, value: 82}] }
        ]
      },
      {
        id: 'proj-002',
        name: 'Limpopo Citrus Expansion',
        programme: 'Commercialisation Programme',
        stage: WorkflowStage.DUE_DILIGENCE,
        riskLevel: 'Medium',
        location: { lat: -23.8962, lng: 29.4486, region: 'Limpopo' },
        lastSync: '2023-11-18T08:00:00Z',
        kpis: [
          { id: 'kpi-4', name: 'Export Volume', pillar: PillarType.ECONOMIC, unit: 'Tons', baseline: 500, target: 2000, current: 850, history: [{year: 2021, value: 450}, {year: 2022, value: 600}, {year: 2023, value: 850}] }
        ]
      }
    ]
  },
  {
    id: 'prog-002',
    name: 'Skills Accelerator',
    description: 'Technical and management capacity development for industry participants.',
    budget: 12000000,
    projects: []
  }
];
