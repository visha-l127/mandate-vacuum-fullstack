import React, { useEffect, useState } from "react";
import { getAllMetrics, CategoryMetric } from "../services/backendApi";
import { translations } from "../data/translations";
import { Language } from "../types";

interface Props {
  language: Language;
}

const GovernanceInsights: React.FC<Props> = ({ language }) => {
  const [metrics, setMetrics] = useState<CategoryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const t = translations[language as keyof typeof translations];

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAllMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to load governance insights:", error);

      setErrorMessage(
        language === "ta"
          ? "Backend API-இலிருந்து தரவை பெற முடியவில்லை. Spring Boot server இயங்குகிறதா என்று சரிபார்க்கவும்."
          : "Could not load governance insights from backend. Check whether Spring Boot server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const getCategoryLabel = (category: string) => {
    const categoryMap = t.categories as Record<string, string>;
    return categoryMap?.[category] || category;
  };

  const getDepartmentLabel = (department: string) => {
    const departmentMap = t.departments as Record<string, string>;
    return departmentMap?.[department] || department;
  };

  const totalCategories = metrics.length;

  const highRiskCount = metrics.filter(
    (metric) => metric.riskLevel === "HIGH"
  ).length;

  const averageEntropy =
    metrics.length > 0
      ? metrics.reduce((sum, metric) => sum + metric.entropyScore, 0) /
        metrics.length
      : 0;

  const averageResolutionDays =
    metrics.length > 0
      ? metrics.reduce((sum, metric) => sum + metric.avgResolutionDays, 0) /
        metrics.length
      : 0;

  const averageImprovement =
    metrics.length > 0
      ? metrics.reduce(
          (sum, metric) => sum + metric.expectedImprovementPct,
          0
        ) / metrics.length
      : 0;

  const mostFragmentedCategory =
    metrics.length > 0
      ? [...metrics].sort((a, b) => b.entropyScore - a.entropyScore)[0]
      : null;

  const slowestCategory =
    metrics.length > 0
      ? [...metrics].sort(
          (a, b) => b.avgResolutionDays - a.avgResolutionDays
        )[0]
      : null;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-[#1F1F1F] rounded-[3rem] p-10 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-black text-[#F4D38A] tracking-[0.25em] uppercase mb-3">
              {language === "ta"
                ? "ஆட்சிமுறை நுண்ணறிவு"
                : "GOVERNANCE INTELLIGENCE SUMMARY"}
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-normal">
              {language === "ta"
                ? "ஆட்சிமுறை நுண்ணறிவுகள்"
                : "Governance Insights"}
            </h2>

            <p className="mt-4 text-white/70 font-bold max-w-3xl leading-relaxed">
              {language === "ta"
                ? "புகார் தரவின் அடிப்படையில் நகராட்சி பொறுப்பு சிதறல் மற்றும் கட்டமைப்பு சீர்திருத்த தேவையை இந்த பகுதி விளக்குகிறது."
                : "This section summarizes ownership fragmentation, delay risk, and the structural governance reform needed across complaint categories."}
            </p>
          </div>

          <button
            onClick={loadMetrics}
            disabled={loading}
            className="bg-[#F4D38A] hover:bg-[#E6C26F] disabled:opacity-60 text-[#1F1F1F] px-6 py-3 rounded-xl font-black transition"
          >
            {loading
              ? language === "ta"
                ? "தரவு ஏற்றுகிறது..."
                : "Loading..."
              : language === "ta"
              ? "புதுப்பிக்க"
              : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="bg-[#F8F6F0] rounded-[2rem] p-6 border border-[#9C7A3C]/20 shadow-sm">
        <p className="text-sm font-black text-[#9C7A3C] mb-3 tracking-normal">
          {t.common.whatThisPageShows}
        </p>

        <p className="text-[#3B2A18] font-bold leading-relaxed">
          {t.pageExplanations.insights}
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
          <p className="text-red-800 font-black">{errorMessage}</p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-[3rem] p-10 border border-[#9C7A3C]/10 shadow-sm">
          <p className="text-[#3B2A18] font-black">
            {language === "ta"
              ? "Oracle தரவுத்தளத்திலிருந்து governance insights ஏற்றுகிறது..."
              : "Loading governance insights from Oracle database..."}
          </p>
        </div>
      )}

      {!loading && metrics.length > 0 && (
        <>
          {/* Top Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "மொத்த புகார்கள்" : "Historical Complaints"}
              </p>

              <p className="text-5xl font-black text-[#1F1F1F] mt-3">
                3026
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta"
                  ? "BBMP தரவு ஆதாரம்"
                  : "BBMP dataset baseline"}
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "அதிக அபாய வகைகள்" : "High-Risk Categories"}
              </p>

              <p className="text-5xl font-black text-[#8B2F2F] mt-3">
                {highRiskCount}/{totalCategories}
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta"
                  ? "பொறுப்பு சிதறல் அதிகம்"
                  : "severe ownership fragmentation"}
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "சராசரி entropy" : "Average Entropy"}
              </p>

              <p className="text-5xl font-black text-[#8B2F2F] mt-3">
                {averageEntropy.toFixed(2)}
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta"
                  ? "0 முதல் 1 வரை சிதறல் அளவு"
                  : "fragmentation score from 0 to 1"}
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "சாத்தியமான மேம்பாடு" : "Average Improvement"}
              </p>

              <p className="text-5xl font-black text-[#9C7A3C] mt-3">
                {averageImprovement.toFixed(0)}%
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta"
                  ? "வேகமான தீர்வு சாத்தியம்"
                  : "faster resolution possible"}
              </p>
            </div>
          </div>

          {/* Main Insight */}
          <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
            <p className="text-sm font-black text-[#9C7A3C] mb-3 tracking-normal">
              {language === "ta" ? "முக்கிய கண்டறிதல்" : "KEY GOVERNANCE FINDING"}
            </p>

            <h3 className="text-3xl md:text-4xl font-black text-[#1F1F1F] leading-tight">
              {language === "ta"
                ? "பிரச்சனை செயல்பாட்டு தாமதம் மட்டும் அல்ல; அது கட்டமைப்பு பொறுப்பு சிதறல்."
                : "The issue is not only operational delay; it is structural ownership fragmentation."}
            </h3>

            <p className="mt-5 text-[#3B2A18] font-bold leading-relaxed text-lg">
              {language === "ta"
                ? `Oracle தரவுத்தளத்தில் இருந்து பெறப்பட்ட ${totalCategories} புகார் வகைகளில் ${highRiskCount} வகைகள் அதிக அபாயமாக உள்ளன. சராசரி entropy ${averageEntropy.toFixed(
                    2
                  )} ஆக உள்ளது. இது ஒரே தெளிவான துறை பொறுப்பு இல்லாததை காட்டுகிறது.`
                : `From the ${totalCategories} complaint categories fetched from Oracle, ${highRiskCount} are marked high risk. The average entropy score is ${averageEntropy.toFixed(
                    2
                  )}, showing that ownership is not clearly concentrated in one department.`}
            </p>
          </div>

          {/* Deep Insights */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[#1F1F1F] rounded-[3rem] p-8 border border-[#9C7A3C]/30 shadow-xl">
              <p className="text-sm font-black text-[#F4D38A] mb-3">
                {language === "ta"
                  ? "அதிக சிதறல் கொண்ட பகுதி"
                  : "MOST FRAGMENTED CATEGORY"}
              </p>

              <h3 className="text-4xl font-black text-white">
                {mostFragmentedCategory
                  ? getCategoryLabel(mostFragmentedCategory.categoryName)
                  : "-"}
              </h3>

              <p className="text-6xl font-black text-[#F4D38A] mt-6">
                {mostFragmentedCategory
                  ? mostFragmentedCategory.entropyScore
                  : "-"}
              </p>

              <p className="mt-4 font-bold text-white/70 leading-relaxed">
                {mostFragmentedCategory
                  ? language === "ta"
                    ? `${getCategoryLabel(
                        mostFragmentedCategory.categoryName
                      )} புகார்களுக்கு தெளிவான முதன்மை பொறுப்பு தேவை.`
                    : `${mostFragmentedCategory.categoryName} complaints need clearer primary ownership to reduce responsibility leakage.`
                  : ""}
              </p>
            </div>

            <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-[#9C7A3C] mb-3">
                {language === "ta"
                  ? "மிக மெதுவான தீர்வு பகுதி"
                  : "SLOWEST RESOLUTION CATEGORY"}
              </p>

              <h3 className="text-4xl font-black text-[#1F1F1F]">
                {slowestCategory
                  ? getCategoryLabel(slowestCategory.categoryName)
                  : "-"}
              </h3>

              <p className="text-6xl font-black text-[#8B2F2F] mt-6">
                {slowestCategory ? slowestCategory.avgResolutionDays : "-"}
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta" ? "சராசரி தீர்வு நாட்கள்" : "average resolution days"}
              </p>

              <p className="mt-4 font-bold text-[#3B2A18] leading-relaxed">
                {slowestCategory
                  ? language === "ta"
                    ? `${getCategoryLabel(
                        slowestCategory.categoryName
                      )} புகார்களில் தீர்வு தாமதம் அதிகமாக உள்ளது.`
                    : `${slowestCategory.categoryName} complaints show the highest average resolution delay.`
                  : ""}
              </p>
            </div>
          </div>

          {/* Category Insight Table */}
          <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-black text-[#9C7A3C] mb-2">
                {language === "ta"
                  ? "Oracle தரவிலிருந்து வகை வாரியான நிலை"
                  : "CATEGORY-WISE STATUS FROM ORACLE"}
              </p>

              <h3 className="text-3xl font-black text-[#1F1F1F]">
                {language === "ta"
                  ? "பொறுப்பு சிதறல் சுருக்கம்"
                  : "Ownership Fragmentation Summary"}
              </h3>
            </div>

            <div className="space-y-4">
              {metrics.map((metric) => (
                <div
                  key={metric.categoryCode}
                  className="grid lg:grid-cols-5 gap-4 items-center bg-[#F8F6F0] rounded-2xl p-5"
                >
                  <div>
                    <p className="text-xs font-black text-[#9C7A3C]">
                      {metric.categoryCode}
                    </p>

                    <p className="font-black text-[#1F1F1F]">
                      {getCategoryLabel(metric.categoryName)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black text-gray-500">
                      {language === "ta" ? "துறை" : "Department"}
                    </p>

                    <p className="font-bold text-[#3B2A18]">
                      {getDepartmentLabel(metric.departmentName)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black text-gray-500">
                      Entropy
                    </p>

                    <p className="font-black text-[#8B2F2F]">
                      {metric.entropyScore}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black text-gray-500">
                      {language === "ta" ? "தீர்வு நாட்கள்" : "Resolution Days"}
                    </p>

                    <p className="font-black text-[#1F1F1F]">
                      {metric.avgResolutionDays}
                    </p>
                  </div>

                  <div>
                    <span className="bg-red-50 text-red-800 px-4 py-2 rounded-full text-xs font-black">
                      {metric.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-[#1F1F1F] rounded-[3rem] p-8 border border-[#9C7A3C]/30 shadow-xl">
            <p className="text-sm font-black text-[#F4D38A] mb-3 tracking-normal">
              {language === "ta"
                ? "கட்டமைப்பு சீர்திருத்த பரிந்துரை"
                : "STRUCTURAL REFORM RECOMMENDATION"}
            </p>

            <h3 className="text-3xl font-black text-white">
              {language === "ta"
                ? "ஒவ்வொரு புகார் வகைக்கும் தெளிவான முதன்மை துறை பொறுப்பு தேவை."
                : "Each complaint category needs a clearly assigned primary owner."}
            </h3>

            <p className="mt-5 font-bold text-white/70 leading-relaxed text-lg">
              {language === "ta"
                ? `தற்போதைய தரவு ${averageEntropy.toFixed(
                    2
                  )} சராசரி entropy-ஐ காட்டுகிறது. இது அதிகாரிகளுக்கு பொறுப்பு எல்லைகளை தெளிவுபடுத்த வேண்டிய தேவை இருப்பதை காட்டுகிறது.`
                : `The current data shows an average entropy of ${averageEntropy.toFixed(
                    2
                  )}. This indicates that officials should clarify departmental boundaries, reduce inter-department handoffs, and define escalation ownership for high-risk categories.`}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default GovernanceInsights;