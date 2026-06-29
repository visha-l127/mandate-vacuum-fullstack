import React, { useEffect, useState } from "react";
import { getAllMetrics, CategoryMetric } from "../services/backendApi";
import { translations } from "../data/translations";
import { Language } from "../types";

interface Props {
  language: Language;
}

const CounterfactualSimulator: React.FC<Props> = ({ language }) => {
  const [metrics, setMetrics] = useState<CategoryMetric[]>([]);
  const [selectedCode, setSelectedCode] = useState("DRAIN");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const t = translations[language as keyof typeof translations];

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAllMetrics();
      setMetrics(data);

      if (data.length > 0 && !data.some((item) => item.categoryCode === selectedCode)) {
        setSelectedCode(data[0].categoryCode);
      }
    } catch (error) {
      console.error("Failed to load simulator metrics:", error);

      setErrorMessage(
        language === "ta"
          ? "Backend API-இலிருந்து தரவை பெற முடியவில்லை. Spring Boot server இயங்குகிறதா என்று சரிபார்க்கவும்."
          : "Could not load simulator data from backend. Check whether Spring Boot server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const selectedMetric =
    metrics.find((metric) => metric.categoryCode === selectedCode) || metrics[0];

  const getCategoryLabel = (category: string) => {
    const categoryMap = t.categories as Record<string, string>;
    return categoryMap?.[category] || category;
  };

  const getDepartmentLabel = (department: string) => {
    const departmentMap = t.departments as Record<string, string>;
    return departmentMap?.[department] || department;
  };

  const calculateSavedDays = (metric: CategoryMetric) => {
    return metric.normalResolutionDays - metric.escalatedResolutionDays;
  };

  const calculateImprovementText = (metric: CategoryMetric) => {
    return `${metric.expectedImprovementPct}%`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-[#1F1F1F] rounded-[3rem] p-10 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-black text-[#F4D38A] tracking-[0.25em] uppercase mb-3">
              {language === "ta"
                ? "மாற்று நிர்வாக மாதிரி"
                : "COUNTERFACTUAL GOVERNANCE SIMULATOR"}
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-normal">
              {language === "ta"
                ? "பொறுப்பு ஒருங்கிணைப்பு சிமுலேட்டர்"
                : "Counterfactual Simulator"}
            </h2>

            <p className="mt-4 text-white/70 font-bold max-w-3xl leading-relaxed">
              {language === "ta"
                ? "தற்போதைய சிதறிய பொறுப்பு அமைப்பையும், தெளிவான ஒரே துறை பொறுப்பு அமைப்பையும் ஒப்பிடுகிறது."
                : "Compare the current fragmented complaint system with a clearer ownership model."}
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
          {language === "ta" ? "இந்த பக்கம் என்ன காட்டுகிறது" : "WHAT THIS PAGE SHOWS"}
        </p>

        <p className="text-[#3B2A18] font-bold leading-relaxed">
          {t.pageExplanations.simulator}
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
              ? "Oracle தரவுத்தளத்திலிருந்து simulator தரவு ஏற்றுகிறது..."
              : "Loading simulator data from Oracle database..."}
          </p>
        </div>
      )}

      {!loading && selectedMetric && (
        <>
          {/* Category Selector */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((metric) => (
              <button
                key={metric.categoryCode}
                onClick={() => setSelectedCode(metric.categoryCode)}
                className={`rounded-2xl p-5 text-left border transition ${
                  selectedCode === metric.categoryCode
                    ? "bg-[#1F1F1F] border-[#F4D38A] text-white shadow-xl"
                    : "bg-white border-[#9C7A3C]/10 text-[#1F1F1F] hover:shadow-md"
                }`}
              >
                <p
                  className={`text-xs font-black mb-2 ${
                    selectedCode === metric.categoryCode
                      ? "text-[#F4D38A]"
                      : "text-[#9C7A3C]"
                  }`}
                >
                  {metric.categoryCode}
                </p>

                <p
                  className={`font-black leading-tight ${
                    selectedCode === metric.categoryCode
                      ? "text-white"
                      : "text-[#1F1F1F]"
                  }`}
                >
                  {getCategoryLabel(metric.categoryName)}
                </p>
              </button>
            ))}
          </div>

          {/* Main Comparison */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[3rem] p-8 border border-red-100 shadow-sm">
              <p className="text-sm font-black text-red-700 mb-3 tracking-normal">
                {language === "ta" ? "தற்போதைய அமைப்பு" : "CURRENT FRAGMENTED SYSTEM"}
              </p>

              <h3 className="text-3xl font-black text-[#1F1F1F]">
                {language === "ta" ? "சிதறிய பொறுப்பு" : "Fragmented Ownership"}
              </h3>

              <p className="mt-4 font-bold text-gray-600 leading-relaxed">
                {language === "ta"
                  ? `${getCategoryLabel(
                      selectedMetric.categoryName
                    )} புகார்கள் பல துறைகளில் சிதறுவதால் தீர்வு தாமதமாகிறது.`
                  : `${selectedMetric.categoryName} complaints are delayed because ownership is fragmented across departments.`}
              </p>

              <div className="mt-8 bg-red-50 rounded-3xl p-6">
                <p className="text-sm font-black text-red-800">
                  {language === "ta" ? "சாதாரண தீர்வு நேரம்" : "Normal Resolution Time"}
                </p>

                <p className="text-6xl font-black text-[#8B2F2F] mt-3">
                  {selectedMetric.normalResolutionDays}
                </p>

                <p className="font-bold text-red-800 mt-2">
                  {language === "ta" ? "நாட்கள்" : "days"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div className="bg-[#F8F6F0] rounded-2xl p-5">
                  <p className="text-xs font-black text-gray-500">
                    {language === "ta" ? "சிதறல் மதிப்பெண்" : "Entropy Score"}
                  </p>

                  <p className="text-3xl font-black text-[#8B2F2F] mt-2">
                    {selectedMetric.entropyScore}
                  </p>
                </div>

                <div className="bg-[#F8F6F0] rounded-2xl p-5">
                  <p className="text-xs font-black text-gray-500">
                    {language === "ta" ? "முதன்மை துறை" : "Primary Department"}
                  </p>

                  <p className="text-lg font-black text-[#1F1F1F] mt-2">
                    {getDepartmentLabel(selectedMetric.departmentName)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1F1F1F] rounded-[3rem] p-8 border border-[#9C7A3C]/30 shadow-xl">
              <p className="text-sm font-black text-[#F4D38A] mb-3 tracking-normal">
                {language === "ta" ? "பொறுப்பு ஒருங்கிணைப்பிற்குப் பிறகு" : "AFTER STRUCTURAL REFORM"}
              </p>

              <h3 className="text-3xl font-black text-white">
                {language === "ta" ? "தெளிவான ஒரே பொறுப்பு" : "Unified Ownership"}
              </h3>

              <p className="mt-4 font-bold text-white/70 leading-relaxed">
                {language === "ta"
                  ? "ஒரு தெளிவான முதன்மை துறை பொறுப்பேற்றால் தீர்வு நேரம் குறையலாம்."
                  : "If one department clearly owns the complaint category, resolution time can improve."}
              </p>

              <div className="mt-8 bg-[#F4D38A] rounded-3xl p-6">
                <p className="text-sm font-black text-[#3B2A18]">
                  {language === "ta" ? "மேம்பட்ட தீர்வு நேரம்" : "Escalated Resolution Time"}
                </p>

                <p className="text-6xl font-black text-[#1F1F1F] mt-3">
                  {selectedMetric.escalatedResolutionDays}
                </p>

                <p className="font-bold text-[#3B2A18] mt-2">
                  {language === "ta" ? "நாட்கள்" : "days"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                  <p className="text-xs font-black text-[#F4D38A]">
                    {language === "ta" ? "சேமிக்கப்படும் நாட்கள்" : "Days Saved"}
                  </p>

                  <p className="text-3xl font-black text-white mt-2">
                    {calculateSavedDays(selectedMetric)}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                  <p className="text-xs font-black text-[#F4D38A]">
                    {language === "ta" ? "சாத்தியமான மேம்பாடு" : "Possible Improvement"}
                  </p>

                  <p className="text-3xl font-black text-white mt-2">
                    {calculateImprovementText(selectedMetric)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <p className="text-sm font-black text-[#9C7A3C] mb-3">
                  {language === "ta" ? "சிமுலேஷன் முடிவு" : "SIMULATION RESULT"}
                </p>

                <h3 className="text-3xl font-black text-[#1F1F1F]">
                  {language === "ta"
                    ? `${getCategoryLabel(
                        selectedMetric.categoryName
                      )} புகார்களுக்கு தெளிவான பொறுப்பு தேவை`
                    : `${selectedMetric.categoryName} complaints need clearer ownership`}
                </h3>

                <p className="mt-4 font-bold text-[#3B2A18] leading-relaxed">
                  {language === "ta"
                    ? `தற்போதைய ${selectedMetric.normalResolutionDays} நாள் தீர்வு நேரம், பொறுப்பு தெளிவுபடுத்தப்பட்டால் ${selectedMetric.escalatedResolutionDays} நாட்களாக குறையலாம்.`
                    : `The current ${selectedMetric.normalResolutionDays}-day resolution time could reduce to ${selectedMetric.escalatedResolutionDays} days if ownership is clarified.`}
                </p>
              </div>

              <div className="bg-[#F8F6F0] rounded-3xl p-6 text-center">
                <p className="text-sm font-black text-gray-500">
                  {language === "ta" ? "மொத்த மேம்பாடு" : "Total Improvement"}
                </p>

                <p className="text-6xl font-black text-[#8B2F2F] mt-3">
                  {selectedMetric.expectedImprovementPct}%
                </p>

                <p className="font-bold text-gray-500 mt-2">
                  {language === "ta" ? "வேகமான தீர்வு சாத்தியம்" : "faster resolution possible"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CounterfactualSimulator;