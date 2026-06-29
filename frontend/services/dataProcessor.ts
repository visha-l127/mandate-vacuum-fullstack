export interface ComplaintRecord {
  complaint_id: string;
  category: string;
  from_dept: string;
  to_dept: string;
  transfer_date: string;
  resolved: boolean;
  days_open: number;
}

export function calculateEntropyForCategory(complaints: ComplaintRecord[], category: string) {
  const categoryComplaints = complaints.filter(c => c.category === category);
  if (categoryComplaints.length === 0) return 0;

  // Count ownership distribution
  const deptCounts: Record<string, number> = {};
  categoryComplaints.forEach(c => {
    deptCounts[c.from_dept] = (deptCounts[c.from_dept] || 0) + 1;
  });

  // Shannon entropy: H(X) = -Σ p(x) * log2(p(x))
  let entropy = 0;
  const total = categoryComplaints.length;
  Object.values(deptCounts).forEach(count => {
    const p = count / total;
    entropy -= p * Math.log2(p);
  });

  // Normalize by max possible entropy
  const maxEntropy = Math.log2(Object.keys(deptCounts).length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}

export function calculateHalfLifeForCategory(complaints: ComplaintRecord[], category: string) {
  const categoryComplaints = complaints.filter(c => c.category === category && c.resolved);
  if (categoryComplaints.length === 0) return 0;

  const avgDays = categoryComplaints.reduce((sum, c) => sum + c.days_open, 0) / categoryComplaints.length;
  return avgDays / Math.LN2; // Convert to half-life
}

export function getComplaintCategoriesAnalysis(csvText: string) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split('\t');
  
  const complaints: ComplaintRecord[] = lines.slice(1).map(line => {
    const values = line.split('\t');
    return {
      complaint_id: values[0],
      category: values[1],
      from_dept: values[2],
      to_dept: values[3],
      transfer_date: values[4],
      resolved: values[5] === 'True',
      days_open: parseInt(values[6], 10)
    };
  });

  // Get unique categories
  const categories = [...new Set(complaints.map(c => c.category))];
  
  return categories.map(cat => ({
    category: cat,
    entropy: calculateEntropyForCategory(complaints, cat),
    halfLife: calculateHalfLifeForCategory(complaints, cat),
    totalComplaints: complaints.filter(c => c.category === cat).length,
    avgResolutionDays: complaints
      .filter(c => c.category === cat && c.resolved)
      .reduce((sum, c) => sum + c.days_open, 0) / 
      complaints.filter(c => c.category === cat && c.resolved).length || 0
  }));
}
