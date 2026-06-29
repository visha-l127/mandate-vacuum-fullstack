// complaintAnalysisAPI.ts

export async function analyzeComplaint(complaint: {
  category: string,
  description: string,
  ward?: string
}) {
  
  // Look up category data
  const categoryData = {
    "Electrical": { entropy: 0.98, halfLife: 33.9, owner: "Electrical Dept" },
    "Drain": { entropy: 0.91, halfLife: 28.9, owner: "Drainage Dept" },
    "Garbage": { entropy: 0.99, halfLife: 34.1, owner: "Sanitation Dept" }
  }
  
  const data = categoryData[complaint.category];
  
  // Calculate risk
  const risk = data.entropy > 0.7 ? "HIGH" : data.entropy > 0.4 ? "MEDIUM" : "LOW";
  
  // Predict time
  const baseTime = data.halfLife;
  const escalatedTime = Math.round(baseTime * 0.45);
  
  return {
    risk,
    baseTime: Math.round(baseTime),
    escalatedTime,
    department: data.owner,
    entropy: data.entropy
  };
}
