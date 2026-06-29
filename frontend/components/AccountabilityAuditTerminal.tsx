import React, { useEffect, useState } from "react";
import { getAllMetrics, CategoryMetric } from "../services/backendApi";
import { translations } from "../data/translations";
import { Language } from "../types";

interface Props {
  language: Language;
}

const AccountabilityAuditTerminal: React.FC<Props> = ({ language }) => {
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
      console.error("Failed to load decay metrics:", error);

      setErrorMessage(
        language === "ta"
          ? "Backend API-இலிருந்து தரவை பெற முடியவில்லை. Spring Boot server இயங்குகிறதா என்று சரிபார்க்கவும்."
          : "Could not load decay data from backend. Check whether Spring Boot server is running."
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

  const calculateFinalAccountability = (entropyScore: number) => {
    const accountability = Math.round((1 - entropyScore) * 100);
    return Math.max(accountability, 5);
  };

  const getTransferCount = (entropyScore: number) => {
    if (entropyScore >= 0.98) return 4;
    if (entropyScore >= 0.95) return 3;
    if (entropyScore >= 0.9) return 3;
    return 2;
  };

  const getDecayPath = (finalAccountability: number) => [
    {
      stage: language === "ta" ? "புகார் பதிவு" : "Complaint Filed",
      value: 100,
    },
    {
      stage: language === "ta" ? "முதல் துறை" : "First Department",
      value: 82,
    },
    {
      stage: language === "ta" ? "துறை மாற்றம்" : "Department Transfer",
      value: 63,
    },
    {
      stage: language === "ta" ? "பொறுப்பு குழப்பம்" : "Ownership Confusion",
      value: 49,
    },
    {
      stage: language === "ta" ? "இறுதி பொறுப்பு" : "Final Accountability",
      value: finalAccountability,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-[#1F1F1F] rounded-[3rem] p-10 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-black text-[#F4D38A] tracking-[0.25em] uppercase mb-3">
              {language === "ta"
                ? "பொறுப்பு சிதைவு பகுப்பாய்வு"
                : "ACCOUNTABILITY DECAY ANALYSIS"}
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-normal">
              {language === "ta" ? "பொறுப்பு சிதைவு" : "Accountability Decay"}
            </h2>

            <p className="mt-4 text-white/70 font-bold max-w-3xl leading-relaxed">
              {language === "ta"
                ? "புகார் ஒரு துறையிலிருந்து மற்றொரு துறைக்கு நகரும்போது பொறுப்பு எப்படி குறைகிறது என்பதை இந்த பகுதி காட்டுகிறது."
                : "This section shows how accountability weakens when complaints move between departments."}
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
          {t.pageExplanations.decay}
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
              ? "Oracle தரவுத்தளத்திலிருந்து decay தரவு ஏற்றுகிறது..."
              : "Loading decay data from Oracle database..."}
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

          {/* Main Analysis */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
                <p className="text-sm font-black text-[#9C7A3C] mb-2">
                  {language === "ta" ? "தேர்ந்தெடுக்கப்பட்ட வகை" : "Selected Category"}
                </p>

                <h3 className="text-3xl font-black text-[#1F1F1F]">
                  {getCategoryLabel(selectedMetric.categoryName)}
                </h3>

                <p className="font-bold text-gray-500 mt-3">
                  {getDepartmentLabel(selectedMetric.departmentName)}
                </p>
              </div>

              <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
                <p className="text-sm font-black text-gray-500">
                  {language === "ta" ? "பொறுப்பு அரை ஆயுள்" : "Accountability Half-Life"}
                </p>

                <p className="text-6xl font-black text-[#8B2F2F] mt-3">
                  {selectedMetric.halfLifeDays}
                </p>

                <p className="font-bold text-gray-500 mt-2">
                  {language === "ta" ? "நாட்கள்" : "days"}
                </p>
              </div>

              <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
                <p className="text-sm font-black text-gray-500">
                  {language === "ta" ? "மதிப்பிடப்பட்ட மாற்றங்கள்" : "Estimated Transfers"}
                </p>

                <p className="text-6xl font-black text-[#9C7A3C] mt-3">
                  {getTransferCount(selectedMetric.entropyScore)}
                </p>

                <p className="font-bold text-gray-500 mt-2">
                  {language === "ta" ? "பொறுப்பு மாற்றங்கள்" : "responsibility shifts"}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm font-black text-[#9C7A3C] mb-2">
                    {language === "ta" ? "பொறுப்பு சிதைவு பாதை" : "Accountability Decay Path"}
                  </p>

                  <h3 className="text-3xl font-black text-[#1F1F1F]">
                    {language === "ta"
                      ? "துறை மாற்றங்களால் பொறுப்பு குறைவு"
                      : "Responsibility loss across transfers"}
                  </h3>
                </div>

                <div className="bg-red-50 text-red-800 px-5 py-3 rounded-full font-black text-sm">
                  {language === "ta" ? "அதிக சிதைவு" : "HIGH DECAY"}
                </div>
              </div>

              <div className="space-y-6">
                {getDecayPath(
                  calculateFinalAccountability(selectedMetric.entropyScore)
                ).map((stage) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-black text-[#1F1F1F]">{stage.stage}</p>
                      <p className="font-black text-[#8B2F2F]">{stage.value}%</p>
                    </div>

                    <div className="h-4 bg-[#F8F6F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#9C7A3C] rounded-full transition-all"
                        style={{ width: `${stage.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-[#1F1F1F] rounded-3xl p-6 border border-[#9C7A3C]/30">
                <p className="text-sm font-black text-[#F4D38A] mb-3">
                  {language === "ta" ? "விளக்கம்" : "INTERPRETATION"}
                </p>

                <p className="font-bold text-white leading-relaxed">
                  {language === "ta"
                    ? `${getCategoryLabel(
                        selectedMetric.categoryName
                      )} புகார்களில் entropy ${selectedMetric.entropyScore} உள்ளது. இது தெளிவான துறை உரிமை இல்லாததால் பொறுப்பு விரைவாக குறைகிறது என்பதைக் காட்டுகிறது.`
                    : `${selectedMetric.categoryName} complaints have an entropy score of ${selectedMetric.entropyScore}. This shows that accountability decays quickly because ownership is not clearly concentrated in one department.`}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "சாதாரண தீர்வு நேரம்" : "Normal Resolution"}
              </p>

              <p className="text-5xl font-black text-[#8B2F2F] mt-3">
                {selectedMetric.normalResolutionDays}
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta" ? "நாட்கள்" : "days"}
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "மேம்பட்ட தீர்வு நேரம்" : "Escalated Resolution"}
              </p>

              <p className="text-5xl font-black text-[#9C7A3C] mt-3">
                {selectedMetric.escalatedResolutionDays}
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta" ? "நாட்கள்" : "days"}
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-[#9C7A3C]/10 shadow-sm">
              <p className="text-sm font-black text-gray-500">
                {language === "ta" ? "சாத்தியமான மேம்பாடு" : "Possible Improvement"}
              </p>

              <p className="text-5xl font-black text-[#1F1F1F] mt-3">
                {selectedMetric.expectedImprovementPct}%
              </p>

              <p className="font-bold text-gray-500 mt-2">
                {language === "ta" ? "வேகமான தீர்வு சாத்தியம்" : "faster resolution possible"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountabilityAuditTerminal;