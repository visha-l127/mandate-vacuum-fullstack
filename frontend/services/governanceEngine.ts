import { getComplaintCategoriesAnalysis } from './dataProcessor';

export interface ComplaintAnalysisResult {
  category: string;
  entropy: number;
  risk: string;
  avgResolutionDays: number;
  escalatedResolutionDays: number;
  primaryDepartment: string;
  explanation: string;
}

export async function analyzeComplaint(
  category: string,
  csvText: string
): Promise<ComplaintAnalysisResult | null> {

  const analysis = getComplaintCategoriesAnalysis(csvText);

  const match = analysis.find(
    a => a.category.toLowerCase() === category.toLowerCase()
  );

  if (!match) return null;

  let risk = "LOW";

  if (match.entropy >= 0.7) {
    risk = "HIGH";
  } else if (match.entropy >= 0.4) {
    risk = "MEDIUM";
  }

  const escalatedDays =
    Math.round(match.avgResolutionDays * 0.45);

  return {
    category: match.category,
    entropy: match.entropy,
    risk,
    avgResolutionDays: match.avgResolutionDays,
    escalatedResolutionDays: escalatedDays,

    primaryDepartment:
      match.departmentDistribution?.[0]?.department
      ?? "Unknown",

    explanation:
      `${match.category} complaints show ${
        risk.toLowerCase()
      } ownership fragmentation due to multi-department handling.`
  };
}
