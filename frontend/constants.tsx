
import { ResponsibilityJourney, Ward, SanitationAsset } from './types';

export const COMPLAINT_JOURNEYS: ResponsibilityJourney[] = [
  {
    ticketId: "MDU-TRAJ-1024",
    category: "Drain-Adjacent Mixed Waste",
    status: "Bouncing",
    ward: "Ward 45 (Karisalkulam)",
    pathway: [
      { timestamp: "Oct 12, 09:00", fromEntity: "Citizen Portal", toEntity: "Sanitation Dept", actionTaken: "Initial Intake", idleTimeHours: 2 },
      { timestamp: "Oct 14, 11:00", fromEntity: "Sanitation Dept", toEntity: "Drainage Dept", actionTaken: "Transfer: Silt content > 20%", idleTimeHours: 48 },
      { timestamp: "Oct 18, 14:00", fromEntity: "Drainage Dept", toEntity: "Sanitation Dept", actionTaken: "Rejection: Primary waste is organic litter", idleTimeHours: 96 },
      { timestamp: "Oct 21, 09:00", fromEntity: "Sanitation Dept", toEntity: "Commissioner Office", actionTaken: "Escalation: Circular Handoff", idleTimeHours: 64 }
    ],
    metrics: {
      handoffCount: 4,
      totalDurationHours: 210
    }
  },
  {
    ticketId: "MDU-TRAJ-882",
    category: "Public Toilet Structure",
    status: "Stalled",
    ward: "Ward 12 (Ellis Nagar North)",
    pathway: [
      { timestamp: "Oct 22, 08:00", fromEntity: "Sanitation Dept", toEntity: "Health Office", actionTaken: "Logged as 'Repair Required'", idleTimeHours: 0 },
      { timestamp: "Oct 25, 14:00", fromEntity: "Health Office", toEntity: "Public Works (PWD)", actionTaken: "Transfer: Structural Maintenance Mandate", idleTimeHours: 78 },
      { timestamp: "Nov 12, 10:00", fromEntity: "Public Works (PWD)", toEntity: "Health Office", actionTaken: "Hold: Tender Cycle required for tile replacement", idleTimeHours: 420 }
    ],
    metrics: {
      handoffCount: 3,
      totalDurationHours: 498
    }
  },
  {
    ticketId: "MDU-TRAJ-441",
    category: "Sidewalk Debris",
    status: "Unresolved",
    ward: "Ward 1 (Simmakkal)",
    pathway: [
      { timestamp: "Nov 01, 09:00", fromEntity: "Citizen Portal", toEntity: "Sanitation Dept", actionTaken: "Initial Intake", idleTimeHours: 0 },
      { timestamp: "Nov 03, 11:00", fromEntity: "Sanitation Dept", toEntity: "Encroachment Cell", actionTaken: "Transfer: Structure involved", idleTimeHours: 48 },
      { timestamp: "Nov 08, 14:00", fromEntity: "Encroachment Cell", toEntity: "Sanitation Dept", actionTaken: "Rejection: Abandoned waste; no 'active' encroachment", idleTimeHours: 120 }
    ],
    metrics: {
      handoffCount: 3,
      totalDurationHours: 168
    }
  }
];

export const MADURAI_WARDS: Ward[] = [
  { id: '1', name: 'Ward 1 (Simmakkal)', area: 'Simmakkal', zone: '1' },
  { id: '3', name: 'Ward 3 (Anaiyur)', area: 'Anaiyur', zone: '1' },
  { id: '8', name: 'Ward 8 (Sellur)', area: 'Sellur', zone: '1' },
  { id: '12', name: 'Ward 12 (Ellis Nagar North)', area: 'Ellis Nagar North', zone: '2' },
  { id: '15', name: 'Ward 15 (Goripalayam)', area: 'Goripalayam', zone: '2' },
  { id: '23', name: 'Ward 23 (KK Nagar)', area: 'KK Nagar', zone: '3' },
  { id: '45', name: 'Ward 45 (Karisalkulam)', area: 'Karisalkulam', zone: '2' },
  { id: '74', name: 'Ward 74 (Villapuram)', area: 'Villapuram', zone: '5' },
  { id: '84', name: 'Ward 84 (Airport Area)', area: 'Airport Area', zone: '5' },
  { id: '90', name: 'Ward 90 (Vilangudi)', area: 'Vilangudi', zone: '4' },
  { id: '100', name: 'Ward 100 (Kulamangalam)', area: 'Kulamangalam', zone: '4' }
];

export const SFRAS_ASSETS: SanitationAsset[] = [
  { id: 'ASSET-MDU-001', locationName: 'Mattuthavani Market South', type: 'Market' },
  { id: 'ASSET-MDU-002', locationName: 'Madurai Medical College Perimeter', type: 'Hospital' },
  { id: 'ASSET-MDU-003', locationName: 'St. Marys School Road', type: 'School' },
  { id: 'ASSET-MDU-004', locationName: 'Meenakshi Temple East Gate', type: 'Generic' }
];

export const MOCK_FRICTION_DATA = {
  overallBureaucraticInertia: 2.4,
  bureaucraticWasteScore: 42,
  mandateCollisionMatrix: [
    { deptA: 'Sanitation', deptB: 'Drainage', collisionCount: 142 },
    { deptA: 'Health', deptB: 'PWD', collisionCount: 89 },
    { deptA: 'Encroachment', deptB: 'Sanitation', collisionCount: 64 }
  ],
  categoryInertia: [
    { category: 'Mixed Silt Waste', tar: 3.8 },
    { category: 'Public Toilet Repair', tar: 4.1 },
    { category: 'Encroachment Debris', tar: 2.9 }
  ]
};
