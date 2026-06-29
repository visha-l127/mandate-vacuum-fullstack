import React, { useEffect, useState } from "react";
import { getAllMetrics, CategoryMetric } from "../services/backendApi";
import { translations } from "../data/translations";
import { Language } from "../types";

interface Props {
  language: Language;
}

const MandateVacuumIdentifier: React.FC<Props> = ({ language }) => {
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
      console.error("Failed to load metrics from backend:", error);

      setErrorMessage(
        language === "ta"
          ? "Backend API-இலிருந்து தரவை பெற முடியவில்லை. Spring Boot server இயங்குகிறதா என்று சரிபார்க்கவும்."
          : "Could not load metrics from backend. Check whether Spring Boot server is running."
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

  const getRiskLabel = (risk: string) => {
    const riskMap = t.risk as Record<string, string>;
    return riskMap?.[risk] || risk;
  };

  const getDepartmentLabel = (department: string) => {
    const departmentMap = t.departments as Record<string, string>;
    return departmentMap?.[department] || department;
  };

  const getRiskStyle = (risk: string) => {
    if (risk === "HIGH") {
      return "bg-red-50 text-red-800 border-red-200";
    }

    if (risk === "MEDIUM") {
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    }

    return "bg-green-50 text-green-800 border-green-200";
  };

  const highestEntropyCategory = metrics.length
    ? [...metrics].sort((a, b) => b.entropyScore - a.entropyScore)[0]
    : null;

  const averageEntropy =
    metrics.length > 0
      ? metrics.reduce((sum, metric) => sum + metric.entropyScore, 0) /
        metrics.length
      : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-[#1F1F1F] rounded-[3rem] p-10 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-black text-[#F4D38A] tracking-[0.25em] uppercase mb-3">
              {language === "ta"
                ? "பொறுப்பு சிதறல் பகுப்பாய்வு"
                : "OWNERSHIP FRAGMENTATION ANALYSIS"}
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-normal">
              {language === "ta"
                ? "கட்டமைப்பு பொறுப்பு வெற்றிடங்கள்"
                : "Mandate Vacuum Identifier"}
            </h2>

            <p className="mt-4 text-white/70 font-bold max-w-3xl leading-relaxed">
              {language === "ta"
                ? "புகார் வகைகளில் எந்த துறைக்கு தெளிவான பொறுப்பு இல்லை என்பதை இந்த பகுதி காட்டுகிறது."
                : "This section identifies complaint categories where responsibility is fragmented across departments."}
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
          {t.pageExplanations.vacuums}
        </p>
      </div>

      {/* Backend Error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
          <p className="text-red-800 font-black">{errorMessage}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-[3rem] p-10 border border-[#9C7A3C]/10 shadow-sm">
          <p className="text-[#3B2A18] font-black">
            {language === "ta"
              ? "Oracle தரவுத்தளத்திலிருந்து தரவு ஏற்றுகிறது..."
              : "Loading data from Oracle database..."}
          </p>
        </div>
      )}

      {!loading && metrics.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "மொத்த வகைகள்" : "Total Categories"}
              </p>

              <p className="text-5xl font-black text-[#1F1F1F] mt-3">
                {metrics.length}
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta"
                  ? "Oracle-இலிருந்து பெறப்பட்டது"
                  : "Fetched from Oracle"}
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "சராசரி சிதறல்" : "Average Entropy"}
              </p>

              <p className="text-5xl font-black text-[#8B2F2F] mt-3">
                {averageEntropy.toFixed(2)}
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta"
                  ? "பொறுப்பு சிதறல் அளவு"
                  : "Ownership fragmentation level"}
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta"
                  ? "அதிக சிதறல் வகை"
                  : "Highest Fragmentation"}
              </p>

              <p className="text-3xl font-black text-[#1F1F1F] mt-3">
                {highestEntropyCategory
                  ? getCategoryLabel(highestEntropyCategory.categoryName)
                  : "-"}
              </p>

              <p className="font-bold text-[#8B2F2F] mt-2">
                {highestEntropyCategory
                  ? `Entropy ${highestEntropyCategory.entropyScore}`
                  : ""}
              </p>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.categoryCode}
                className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div>
                    <p className="text-xs font-black text-[#9C7A3C] tracking-[0.2em] uppercase">
                      {metric.categoryCode}
                    </p>

                    <h3 className="text-3xl font-black text-[#1F1F1F] mt-2">
                      {getCategoryLabel(metric.categoryName)}
                    </h3>

                    <p className="font-bold text-gray-500 mt-2">
                      {getDepartmentLabel(metric.departmentName)}
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full border text-sm font-black w-fit ${getRiskStyle(
                      metric.riskLevel
                    )}`}
                  >
                    {getRiskLabel(metric.riskLevel)}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-[#F8F6F0] rounded-2xl p-5">
                    <p className="text-xs font-black text-gray-500">
                      {language === "ta" ? "சிதறல் மதிப்பெண்" : "Entropy Score"}
                    </p>

                    <p className="text-3xl font-black text-[#8B2F2F] mt-2">
                      {metric.entropyScore}
                    </p>
                  </div>

                  <div className="bg-[#F8F6F0] rounded-2xl p-5">
                    <p className="text-xs font-black text-gray-500">
                      {language === "ta" ? "சராசரி நாட்கள்" : "Avg Days"}
                    </p>

                    <p className="text-3xl font-black text-[#1F1F1F] mt-2">
                      {metric.avgResolutionDays}
                    </p>
                  </div>

                  <div className="bg-[#F8F6F0] rounded-2xl p-5">
                    <p className="text-xs font-black text-gray-500">
                      {language === "ta" ? "அரை ஆயுள்" : "Half-Life"}
                    </p>

                    <p className="text-3xl font-black text-[#9C7A3C] mt-2">
                      {metric.halfLifeDays}
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-[#1F1F1F] rounded-3xl p-6 border border-[#9C7A3C]/30">
                  <p className="text-sm font-black text-[#F4D38A] mb-3">
                    {language === "ta"
                      ? "கட்டமைப்பு பரிந்துரை"
                      : "STRUCTURAL RECOMMENDATION"}
                  </p>

                  <p className="font-bold text-white leading-relaxed">
                    {language === "ta"
                      ? `${getCategoryLabel(
                          metric.categoryName
                        )} புகார்களுக்கு தெளிவான முதன்மை பொறுப்பு தேவை. தற்போதைய entropy மதிப்பு அதிக பொறுப்பு சிதறலை காட்டுகிறது.`
                      : `${metric.categoryName} complaints need clearer primary ownership. The current entropy score indicates severe mandate fragmentation.`}
                  </p>

                  <p className="font-black text-[#F4D38A] mt-4">
                    {language === "ta"
                      ? `${metric.expectedImprovementPct}% வேகமான தீர்வு சாத்தியம்`
                      : `${metric.expectedImprovementPct}% faster resolution possible`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MandateVacuumIdentifier;