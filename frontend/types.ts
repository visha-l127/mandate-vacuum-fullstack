
export type Language = 'en' | 'ta';

export interface Handoff {
  timestamp: string;
  fromEntity: string;
  toEntity: string;
  actionTaken: string;
  idleTimeHours: number;
}

export interface ResponsibilityJourney {
  ticketId: string;
  category: string;
  status: 'Stalled' | 'Bouncing' | 'Escalated' | 'Unresolved';
  ward: string;
  pathway: Handoff[];
  metrics: {
    handoffCount: number;
    totalDurationHours: number;
  };
}

export interface GovernanceAuditBase {
  observedPattern: string;
  structuralInterpretation: string;
  mandateAccountabilityIssue: string;
  governanceRecommendation: string;
  confidenceLevel: number; // Numeric confidence (0.0 to 1.0)
  failureClassification: 'Structural Failure (High Confidence)' | 'Operational Delay (Low Confidence)';
  evidenceBasis: string[];
}

export interface MandateVacuum extends GovernanceAuditBase {
  category: string;
}

export interface AccountabilityDecay extends GovernanceAuditBase {
  decayPercentage: number;
  halfLifeDays: number;
}

export interface CounterfactualSimulation extends GovernanceAuditBase {
  actualOutcome: {
    totalHours: number;
    handoffs: number;
    finalStatus: string;
  };
  simulatedOutcome: {
    totalHours: number;
    handoffs: number;
    owningDepartment: string;
  };
  improvement: {
    timeReductionPercentage: number;
    handoffReduction: number;
  };
}

export interface ForensicAuditOutput {
  identifiedMandateConflict: string;
  structuralRootCause: string;
  policyRecommendation: string;
}

export interface GVPIncident {
  id: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  type: string;
  ward: string;
  lat: number;
  lng: number;
  location: string;
  volume: string;
  predictedFine: number;
  timestamp: string;
  sop?: string[];
}

export interface Ward {
  id: string;
  name: string;
  area: string;
  zone: string;
}

export interface SanitationAsset {
  id: string;
  locationName: string;
  type: 'Market' | 'Hospital' | 'School' | 'Generic';
}

export interface AIoTInsight {
  scenario: string;
  architecture: {
    perception: string;
    transmission: string;
    intelligence: string;
    action: string;
  };
  management: string[];
  risks: string[];
}

export interface PredictiveMetrics {
  predictedSurge: string;
  confidence: number;
  recommendedAction: string;
}

export interface SensorStatus {
  id: string;
  tier: 'Gateway' | 'Edge';
  device: 'Jetson Nano' | 'ESP32-CAM';
  status: 'Online' | 'Sleeping' | 'Offline';
  battery: number;
}

export interface Cluster {
  id: string;
  ward: string;
  count: number;
  incidents: GVPIncident[];
  top: number;
  left: number;
  maxSeverity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface WardRanking {
  id: number;
  name: string;
  score: number;
  trend: 'up' | 'stable' | 'down';
  gvpsDetected: number;
}

export interface AdvancedAnalytics {
  efficiencyScore: number;
  diversionRate: number;
  totalFinesCollected: number;
  carbonReduction: string;
  wardPerformance: {
    ward: string;
    efficiency: number;
  }[];
}

export interface SFRASAttribution {
  observedPattern: string;
  rootCause: string;
  operationalRecommendation: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface SFRAS_A_Analysis {
  insufficientData: boolean;
  evidenceStrength: string;
  assetId: string;
  observedPattern: string;
  rootCause: string;
  accountability: {
    category: string;
    owner: string;
  };
  operationalRecommendation: string;
}

export interface LeakageDiagnostic {
  observedPattern: string;
  ownershipScore: number;
  accountabilityBreakdown: string;
  operationalRecommendation: string;
}

export interface GovernanceMetrics {
  avgHandoffEfficiency: number;
  ownershipLeakageRate: number;
  bouncingHotspots: { entity: string; count: number }[];
  resolutionBottlenecks: string[];
}
