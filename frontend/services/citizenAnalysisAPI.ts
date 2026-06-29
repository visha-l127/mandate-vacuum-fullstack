import { complaintMetrics } from '../data/complaintMetrics';

export function analyzeCitizenComplaint(category: string) {
  const data = complaintMetrics[category as keyof typeof complaintMetrics];

  if (!data) {
    return {
      error: `Unknown complaint category: ${category}`
    };
  }

  // Calculate risk dynamically from entropy
  let risk = "LOW";
  if (data.entropy >= 0.7) {
    risk = "HIGH";
  } else if (data.entropy >= 0.4) {
    risk = "MEDIUM";
  }

  const escalatedResolutionDays = Math.round(data.avg_resolution * 0.45);

  return {
    category,
    risk,
    riskReason: `${category} complaints are shared between multiple departments.`,
    baseResolutionDays: data.avg_resolution,
    escalatedResolutionDays,
    recommendedDept: data.primary_dept,
    entropyScore: data.entropy,
    improvement: "55%"
  };
}