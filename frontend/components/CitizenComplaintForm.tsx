import React, { useEffect, useState } from "react";
import {
  analyzeCitizenComplaint,
  getRecentCitizenRequests,
  RecentCitizenRequest,
} from "../services/backendApi";
import { translations } from "../data/translations";
import { Language } from "../types";

interface AnalysisResult {
  category: string;
  risk: string;
  riskReason: string;
  baseResolutionDays: number;
  escalatedResolutionDays: number;
  recommendedDept: string;
  entropyScore: number;
  improvement: string;
}

interface Props {
  language: Language;
}

const categories = [
  { code: "ELECTRICAL", name: "Electrical" },
  { code: "DRAIN", name: "Drain" },
  { code: "SOLID_WASTE", name: "Solid Waste" },
  { code: "ROAD_MAINTENANCE", name: "Road Maintenance" },
  { code: "FOREST", name: "Forest" },
  { code: "HEALTH", name: "Health" },
];

const CitizenComplaintForm: React.FC<Props> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentCitizenRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentLoading, setRecentLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const t = translations[language as keyof typeof translations];

  const loadRecentRequests = async () => {
    try {
      setRecentLoading(true);
      const data = await getRecentCitizenRequests();
      setRecentRequests(data);
    } catch (error) {
      console.error("Failed to load recent citizen requests:", error);
    } finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    loadRecentRequests();
  }, []);

  const getCategoryLabel = (category: string) => {
    const categoryMap = t.categories as Record<string, string>;
    return categoryMap[category] || category;
  };

  const getRiskLabel = (risk: string) => {
    const riskMap = t.risk as Record<string, string>;
    return riskMap[risk] || risk;
  };

  const getDepartmentLabel = (department: string) => {
    const departmentMap = t.departments as Record<string, string>;
    return departmentMap[department] || department;
  };

  const getRiskReason = (analysis: AnalysisResult) => {
    if (language !== "ta") return analysis.riskReason;

    return `${getCategoryLabel(
      analysis.category
    )} தொடர்பான புகார்கள் பல துறைகளில் பகிரப்பட்டுள்ளதால், தீர்வு தாமதமாகும் அபாயம் அதிகம்.`;
  };

  const handleAnalyze = async () => {
    if (!selectedCategory) {
      alert(t.citizen.selectAlert);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setResult(null);

    try {
      const backendResult = await analyzeCitizenComplaint({
        categoryCode: selectedCategory,
        description: description,
        language: language,
      });

      const mappedResult: AnalysisResult = {
        category: backendResult.categoryName,
        risk: backendResult.riskLevel,
        riskReason: backendResult.reason,
        baseResolutionDays: backendResult.normalResolutionDays,
        escalatedResolutionDays: backendResult.escalatedResolutionDays,
        recommendedDept: backendResult.recommendedDepartment,
        entropyScore: backendResult.entropyScore,
        improvement:
          language === "ta"
            ? `${backendResult.expectedImprovementPct}% வேகமான தீர்வு சாத்தியம்`
            : `${backendResult.expectedImprovementPct}% faster resolution possible`,
      };

      setResult(mappedResult);

      setSuccessMessage(
        language === "ta"
          ? "உங்கள் புகார் வெற்றிகரமாக பகுப்பாய்வு செய்யப்பட்டு தரவுத்தளத்தில் சேமிக்கப்பட்டது."
          : "Your complaint was analyzed successfully and saved to the database."
      );

      setSelectedCategory("");
      setDescription("");

      await loadRecentRequests();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        language === "ta"
          ? "Backend API-ஐ தொடர்பு கொள்ள முடியவில்லை. Spring Boot server இயங்குகிறதா என்று சரிபார்க்கவும்."
          : "Could not connect to backend API. Check whether Spring Boot server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-[#1F1F1F] rounded-[3rem] p-10 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-black text-[#F4D38A] tracking-normal">
          {t.citizen.title}
        </h2>

        <p className="mt-4 text-white/70 font-bold italic tracking-normal">
          {language === "ta"
            ? "புகார் தாமதம் மற்றும் பரிந்துரைக்கப்படும் துறை மதிப்பீடு"
            : "Complaint delay risk and recommended department assessment"}
        </p>
      </div>

      {/* Explanation Card */}
      <div className="bg-[#F8F6F0] rounded-[2rem] p-6 border border-[#9C7A3C]/20 shadow-sm">
        <p className="text-sm font-black text-[#9C7A3C] mb-3 tracking-normal">
          {t.common.whatThisPageShows}
        </p>

        <p className="text-[#3B2A18] font-bold leading-relaxed">
          {t.pageExplanations.citizen}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
        <p className="text-sm font-black text-yellow-800 mb-2 tracking-normal">
          {t.disclaimer.title}
        </p>

        <p className="text-yellow-900 font-bold leading-relaxed">
          {t.disclaimer.citizen}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-600 mb-2">
              {t.citizen.category}
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 font-bold bg-white"
            >
              <option value="">{t.citizen.selectCategory}</option>

              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {getCategoryLabel(cat.name)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-600 mb-2">
              {t.citizen.description}
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder={t.citizen.placeholder}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 font-bold"
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-800 font-bold">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-green-800 font-bold">{successMessage}</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-[#9C7A3C] hover:bg-[#86672F] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-black transition"
          >
            {loading
              ? language === "ta"
                ? "பகுப்பாய்வு செய்கிறது..."
                : "Analyzing..."
              : t.citizen.analyze}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-sm font-black text-[#9C7A3C] tracking-normal">
                {t.citizen.result}
              </p>

              <h3 className="text-3xl font-black text-[#1F1F1F] mt-2">
                {getCategoryLabel(result.category)}
              </h3>
            </div>

            <div className="bg-red-50 text-red-800 px-5 py-3 rounded-full font-black text-sm">
              {getRiskLabel(result.risk)}
            </div>
          </div>

          <div className="bg-[#F8F6F0] rounded-3xl p-6">
            <p className="text-sm font-black text-[#9C7A3C] mb-2">
              {t.citizen.reason}
            </p>

            <p className="font-bold text-[#3B2A18] leading-relaxed">
              {getRiskReason(result)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-[#9C7A3C]/20 rounded-3xl p-6">
              <p className="text-sm font-black text-gray-500">
                {t.citizen.normalResolution}
              </p>

              <p className="text-4xl font-black text-[#8B2F2F] mt-2">
                {result.baseResolutionDays}
              </p>

              <p className="font-bold text-gray-500">{t.citizen.days}</p>
            </div>

            <div className="bg-white border border-[#9C7A3C]/20 rounded-3xl p-6">
              <p className="text-sm font-black text-gray-500">
                {t.citizen.escalatedResolution}
              </p>

              <p className="text-4xl font-black text-[#9C7A3C] mt-2">
                {result.escalatedResolutionDays}
              </p>

              <p className="font-bold text-gray-500">{t.citizen.days}</p>
            </div>

            <div className="bg-white border border-[#9C7A3C]/20 rounded-3xl p-6">
              <p className="text-sm font-black text-gray-500">
                {t.citizen.recommendedDept}
              </p>

              <p className="text-xl font-black text-[#1F1F1F] mt-2">
                {getDepartmentLabel(result.recommendedDept)}
              </p>
            </div>

            <div className="bg-white border border-[#9C7A3C]/20 rounded-3xl p-6">
              <p className="text-sm font-black text-gray-500">
                {t.citizen.entropyScore}
              </p>

              <p className="text-4xl font-black text-[#8B2F2F] mt-2">
                {result.entropyScore}
              </p>
            </div>
          </div>

          <div className="bg-[#1F1F1F] rounded-3xl p-6 border border-[#9C7A3C]/30">
            <p className="text-sm font-black text-[#F4D38A] mb-3 tracking-normal">
              {t.citizen.expectedImprovement}
            </p>

            <p className="font-bold text-white leading-relaxed text-lg">
              {result.improvement}
            </p>
          </div>
        </div>
      )}

      {/* Recent Live Citizen Requests */}
      <div className="bg-white rounded-[3rem] p-8 border border-[#9C7A3C]/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <p className="text-sm font-black text-[#9C7A3C] tracking-normal">
              {language === "ta" ? "நேரடி தரவு" : "LIVE DATABASE DATA"}
            </p>

            <h3 className="text-2xl font-black text-[#1F1F1F] mt-2">
              {language === "ta"
                ? "சமீபத்திய குடிமக்கள் கோரிக்கைகள்"
                : "Recent Citizen Requests"}
            </h3>
          </div>

          <button
            onClick={loadRecentRequests}
            disabled={recentLoading}
            className="bg-[#F8F6F0] hover:bg-[#EFE8D8] text-[#3B2A18] px-5 py-3 rounded-xl font-black transition border border-[#9C7A3C]/20"
          >
            {recentLoading
              ? language === "ta"
                ? "புதுப்பிக்கிறது..."
                : "Refreshing..."
              : language === "ta"
              ? "புதுப்பிக்க"
              : "Refresh"}
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="bg-[#F8F6F0] rounded-2xl p-5">
            <p className="font-bold text-[#3B2A18]">
              {language === "ta"
                ? "இன்னும் சமீபத்திய கோரிக்கைகள் இல்லை."
                : "No recent requests found yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div
                key={request.requestId}
                className="bg-[#F8F6F0] rounded-2xl p-5 border border-[#9C7A3C]/10"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-[#9C7A3C]">
                      #{request.requestId} • {request.createdAt}
                    </p>

                    <h4 className="text-lg font-black text-[#1F1F1F] mt-1">
                      {getCategoryLabel(request.categoryName)}
                    </h4>
                  </div>

                  <span className="bg-red-50 text-red-800 px-4 py-2 rounded-full text-xs font-black w-fit">
                    {getRiskLabel(request.riskLevel)}
                  </span>
                </div>

                <p className="mt-3 font-bold text-[#3B2A18] leading-relaxed">
                  {request.description}
                </p>

                <div className="grid md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs font-black text-gray-500">
                      {t.citizen.recommendedDept}
                    </p>

                    <p className="font-black text-[#1F1F1F]">
                      {getDepartmentLabel(request.recommendedDepartment)}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs font-black text-gray-500">
                      {t.citizen.normalResolution}
                    </p>

                    <p className="font-black text-[#8B2F2F]">
                      {request.normalResolutionDays} {t.citizen.days}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs font-black text-gray-500">
                      {t.citizen.escalatedResolution}
                    </p>

                    <p className="font-black text-[#9C7A3C]">
                      {request.escalatedResolutionDays} {t.citizen.days}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenComplaintForm;