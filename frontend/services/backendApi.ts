const API_BASE_URL = "http://localhost:8081/api";

export interface CategoryMetric {
  categoryCode: string;
  categoryName: string;
  departmentName: string;
  entropyScore: number;
  halfLifeDays: number;
  avgResolutionDays: number;
  normalResolutionDays: number;
  escalatedResolutionDays: number;
  riskLevel: string;
  expectedImprovementPct: number;
}

export interface CitizenAnalyzeRequest {
  categoryCode: string;
  description: string;
  language: string;
}

export interface CitizenAnalyzeResponse {
  categoryCode: string;
  categoryName: string;
  riskLevel: string;
  entropyScore: number;
  halfLifeDays: number;
  normalResolutionDays: number;
  escalatedResolutionDays: number;
  expectedImprovementPct: number;
  recommendedDepartment: string;
  reason: string;
  savedToDatabase: boolean;
}

export interface RecentCitizenRequest {
  requestId: number;
  categoryName: string;
  description: string;
  riskLevel: string;
  recommendedDepartment: string;
  normalResolutionDays: number;
  escalatedResolutionDays: number;
  createdAt: string;
}

export async function getAllMetrics(): Promise<CategoryMetric[]> {
  const response = await fetch(`${API_BASE_URL}/metrics`);

  if (!response.ok) {
    throw new Error("Failed to fetch metrics from backend");
  }

  return response.json();
}

export async function getMetricByCategory(categoryCode: string): Promise<CategoryMetric> {
  const response = await fetch(`${API_BASE_URL}/metrics/${categoryCode}`);

  if (!response.ok) {
    throw new Error("Failed to fetch metric for category");
  }

  return response.json();
}

export async function analyzeCitizenComplaint(
  request: CitizenAnalyzeRequest
): Promise<CitizenAnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/citizen/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze citizen complaint");
  }

  return response.json();
}

export async function getRecentCitizenRequests(): Promise<RecentCitizenRequest[]> {
  const response = await fetch(`${API_BASE_URL}/citizen/requests`);

  if (!response.ok) {
    throw new Error("Failed to fetch recent citizen requests");
  }

  return response.json();
}