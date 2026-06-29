export const translations = {
  en: {
    appTitle: "MANDATE VACUUM",
    subtitle: "DECISION-SUPPORT INTELLIGENCE",

    tabs: {
      vacuums: "VACUUMS",
      decay: "DECAY",
      simulator: "SIMULATOR",
      insights: "GOVERNANCE INSIGHTS",
      citizen: "CITIZEN PORTAL",
    },

    common: {
      structuralMandateVacuum: "STRUCTURAL MANDATE VACUUM",
      analyzedSummary:
        "3026 complaints analyzed. Entropy range 0.91–1.00 shows high ownership fragmentation across complaint categories.",
      entropyExplanation:
        "High entropy indicates that complaint responsibility is fragmented across multiple departments.",
      halfLifeExplanation:
        "Accountability weakens as complaints move between departments without clear primary ownership.",
      realComplaintsAnalyzed: "3026 REAL COMPLAINTS ANALYZED",
      averageResolutionVaries: "AVERAGE RESOLUTION VARIES BY CATEGORY",
      dataSource: "DATA SOURCE: BBMP COMPLAINT RECORDS",
      recommendation:
        "Consolidate ownership. Current entropy scores indicate severe mandate fragmentation.",
      departments: "Departments",
      reason: "Reason",
      risk: "Risk",
      inference: "Inference",
      whatThisPageShows: "WHAT THIS PAGE SHOWS",
    },

    pageExplanations: {
      vacuums:
        "This page identifies complaint categories where responsibility is spread across multiple departments. A higher entropy score means there is no clear primary owner, so complaints are more likely to get delayed or transferred repeatedly.",
      decay:
        "This page shows how accountability reduces when a complaint moves from one department to another. The more transfers happen, the harder it becomes to identify who is actually responsible.",
      simulator:
        "This page compares the current fragmented system with a better system where one department has clear ownership. It estimates how much faster complaints could be resolved if responsibility is unified.",
      insights:
        "This page summarizes the overall governance problem. It is mainly useful for officials, policy makers, and evaluators because it explains what structural change is needed.",
      citizen:
        "Citizens can select a complaint type and understand whether their complaint may face delay, why the delay may happen, and which department should be approached first.",
    },

    disclaimer: {
      title: "IMPORTANT NOTE",
      citizen:
        "This is a decision-support prototype based on historical BBMP complaint data. It is not an official government complaint filing service.",
    },

    vacuums: {
      title: "MANDATE VACUUM REGISTRY",
      subtitle:
        "STRUCTURAL IDENTIFICATION OF COMPLAINT CATEGORIES WITH ZERO CONSISTENT ADMINISTRATIVE OWNERSHIP.",
      analysisDomain: "ANALYSIS DOMAIN",
      inferenceConfidence: "INFERENCE CONFIDENCE",
      stableOwnership: "STABLE OWNERSHIP",
      fragmentation: "OWNERSHIP FRAGMENTATION",
      primaryDepartment: "PRIMARY DEPARTMENT",
      avgResolution: "AVERAGE RESOLUTION",
      riskLevel: "RISK LEVEL",
    },

    decay: {
      title: "ACCOUNTABILITY DECAY ANALYSIS",
      subtitle: "MANDATE RESPONSIBILITY HALF-LIFE METRICS",
      halfLife: "HALF-LIFE (DAYS)",
      finalAccountability: "FINAL ACCOUNTABILITY",
      transfers: "TRANSFERS",
      stable: "STABLE",
    },

    simulator: {
      title: "COUNTERFACTUAL SIMULATOR",
      subtitle: "SIMULATING UNIFIED MANDATE OWNERSHIP",
      inputs: "SIMULATION INPUTS",
      before: "BEFORE STRUCTURAL REFORM",
      after: "AFTER STRUCTURAL REFORM",
      improvement: "EXPECTED IMPROVEMENT",
      baselineResolution: "BASELINE RESOLUTION TIME",
      optimizedResolution: "OPTIMIZED RESOLUTION TIME",
    },

    simulatorCases: {
      drainWaste: "DRAIN-ADJACENT MIXED WASTE",
      publicToilet: "PUBLIC TOILET STRUCTURE",
      sidewalkDebris: "SIDEWALK DEBRIS",
      entropyText:
        "Entropy indicates ownership fragmentation across multiple departments.",
      reasonText:
        "Complaint bounces between departments with no clear primary owner.",
      riskText:
        "ZERO DEPARTMENTAL ACCOUNTABILITY - CIRCULAR TRANSFER LOOP.",
    },

    insights: {
      title: "GOVERNANCE INSIGHTS",
      subtitle: "AI-SYNTHESIZED STRUCTURAL ANALYSIS",
      structuralInterpretation: "STRUCTURAL INTERPRETATION",
      keyFindings: "KEY FINDINGS",
      recommendationTitle: "GOVERNANCE RECOMMENDATION",
      findingOne:
        "All 6 complaint categories show high ownership fragmentation.",
      findingTwo:
        "Entropy scores range from 0.91 to 1.00, indicating unclear departmental responsibility.",
      findingThree:
        "Unified ownership can reduce complaint stagnation and improve resolution speed.",
    },

    citizen: {
      title: "Citizen Complaint Risk Check",
      category: "Complaint Category",
      selectCategory: "Select Category",
      description: "Description",
      placeholder: "Describe the issue...",
      analyze: "Analyze Complaint",
      result: "Analysis Result",
      riskLevel: "Risk Level",
      reason: "Reason",
      normalResolution: "Normal Resolution",
      escalatedResolution: "Escalated Resolution",
      recommendedDept: "Recommended Department",
      entropyScore: "Entropy Score",
      expectedImprovement: "Expected Improvement",
      days: "days",
      selectAlert: "Please select a category",
    },

    categories: {
      Electrical: "Electrical",
      Drain: "Drain",
      "Solid Waste": "Solid Waste",
      "Road Maintenance": "Road Maintenance",
      Forest: "Forest",
      Health: "Health",
    },

    risk: {
      HIGH: "HIGH",
      MEDIUM: "MEDIUM",
      LOW: "LOW",
    },

    departments: {
      "Electrical Dept": "Electrical Dept",
      "Drainage Dept": "Drainage Dept",
      "Sanitation Dept": "Sanitation Dept",
      PWD: "PWD",
      "Parks Dept": "Parks Dept",
      "Health Dept": "Health Dept",
    },
  },

  ta: {
    appTitle: "மேண்டேட் வேக்க்யூம்",
    subtitle: "முடிவு ஆதரவு நுண்ணறிவு",

    tabs: {
      vacuums: "வெற்றிடங்கள்",
      decay: "சிதைவு",
      simulator: "மாதிரி",
      insights: "ஆட்சிமுறை நுண்ணறிவு",
      citizen: "குடிமக்கள் பகுதி",
    },

    common: {
      structuralMandateVacuum: "கட்டமைப்பு பொறுப்பு வெற்றிடம்",
      analyzedSummary:
        "3026 புகார்கள் பகுப்பாய்வு செய்யப்பட்டன. 0.91 முதல் 1.00 வரை உள்ள சிதறல் மதிப்பெண், புகார் பொறுப்பு பல துறைகளில் அதிகமாக சிதறியிருப்பதை காட்டுகிறது.",
      entropyExplanation:
        "அதிக சிதறல் மதிப்பெண் என்பது புகார் பொறுப்பு பல துறைகளில் தெளிவில்லாமல் பகிரப்பட்டிருப்பதை குறிக்கிறது.",
      halfLifeExplanation:
        "புகார்கள் துறைகளுக்கு இடையே மாறும்போது தெளிவான முதன்மை பொறுப்பு குறைகிறது.",
      realComplaintsAnalyzed: "3026 உண்மையான புகார்கள் பகுப்பாய்வு செய்யப்பட்டன",
      averageResolutionVaries: "சராசரி தீர்வு காலம் புகார் வகைக்கு ஏற்ப மாறும்",
      dataSource: "தரவு மூலம்: BBMP புகார் பதிவுகள்",
      recommendation:
        "பொறுப்பை ஒருங்கிணைக்க வேண்டும். தற்போதைய சிதறல் மதிப்பெண்கள் கடுமையான பொறுப்பு பிரிவை காட்டுகின்றன.",
      departments: "துறைகள்",
      reason: "காரணம்",
      risk: "அபாயம்",
      inference: "மதிப்பீடு",
      whatThisPageShows: "இந்த பக்கம் என்ன காட்டுகிறது",
    },

    pageExplanations: {
      vacuums:
        "இந்த பக்கம் புகார் பொறுப்பு பல துறைகளில் சிதறியுள்ள பகுதிகளை காட்டுகிறது. அதிக சிதறல் மதிப்பெண் இருந்தால், தெளிவான முதன்மை பொறுப்பாளர் இல்லை என்பதையும், புகார் தாமதமாகும் வாய்ப்பு அதிகம் என்பதையும் குறிக்கிறது.",
      decay:
        "ஒரு புகார் ஒரு துறையிலிருந்து மற்றொரு துறைக்கு மாறும்போது பொறுப்புணர்வு எப்படி குறைகிறது என்பதை இந்த பக்கம் காட்டுகிறது. மாற்றங்கள் அதிகமானால், உண்மையில் யார் பொறுப்பு என்பது தெளிவில்லாமல் போகிறது.",
      simulator:
        "தற்போதைய சிதறிய பொறுப்பு அமைப்பையும், ஒரே துறைக்கு தெளிவான பொறுப்பு வழங்கப்படும் மேம்பட்ட அமைப்பையும் இந்த பக்கம் ஒப்பிடுகிறது. பொறுப்பு ஒருங்கிணைக்கப்பட்டால் புகார்கள் எவ்வளவு வேகமாக தீர்க்கப்படலாம் என்பதை மதிப்பிடுகிறது.",
      insights:
        "மொத்த நிர்வாகப் பிரச்சினையை இந்த பக்கம் சுருக்கமாக விளக்குகிறது. இது அதிகாரிகள், கொள்கை முடிவெடுப்போர் மற்றும் மதிப்பீட்டாளர்களுக்கு பயனுள்ளதாக இருக்கும்.",
      citizen:
        "குடிமக்கள் புகார் வகையைத் தேர்வு செய்து, அந்த புகார் தாமதமாகும் வாய்ப்பு உள்ளதா, ஏன் தாமதம் ஏற்படலாம், முதலில் எந்த துறையை அணுக வேண்டும் என்பதைக் காணலாம்.",
    },

    disclaimer: {
      title: "முக்கிய குறிப்பு",
      citizen:
        "இது BBMP பழைய புகார் தரவின் அடிப்படையில் உருவாக்கப்பட்ட முடிவு-ஆதரவு மாதிரி. இது அதிகாரப்பூர்வ அரசு புகார் பதிவு சேவை அல்ல.",
    },

    vacuums: {
      title: "பொறுப்பு வெற்றிடப் பதிவகம்",
      subtitle:
        "நிலையான நிர்வாகப் பொறுப்பு இல்லாத புகார் வகைகளின் கட்டமைப்பு அடையாளம்.",
      analysisDomain: "பகுப்பாய்வு பகுதி",
      inferenceConfidence: "மதிப்பீட்டு நம்பகத்தன்மை",
      stableOwnership: "நிலையான பொறுப்பு",
      fragmentation: "பொறுப்பு சிதறல்",
      primaryDepartment: "முதன்மை துறை",
      avgResolution: "சராசரி தீர்வு காலம்",
      riskLevel: "அபாய நிலை",
    },

    decay: {
      title: "பொறுப்பு சிதைவு பகுப்பாய்வு",
      subtitle: "நிர்வாகப் பொறுப்பு குறையும் கால அளவீடுகள்",
      halfLife: "அரை-ஆயுள் காலம் (நாட்கள்)",
      finalAccountability: "இறுதி பொறுப்புணர்வு",
      transfers: "மாற்றங்கள்",
      stable: "நிலையானது",
    },

    simulator: {
      title: "மாற்று நிர்வாக மாதிரி",
      subtitle: "ஒருங்கிணைந்த பொறுப்பு அமைப்பின் விளைவு மதிப்பீடு",
      inputs: "மாதிரி உள்ளீடுகள்",
      before: "கட்டமைப்பு மாற்றத்திற்கு முன்",
      after: "கட்டமைப்பு மாற்றத்திற்கு பின்",
      improvement: "எதிர்பார்க்கப்படும் முன்னேற்றம்",
      baselineResolution: "தற்போதைய தீர்வு காலம்",
      optimizedResolution: "மேம்படுத்தப்பட்ட தீர்வு காலம்",
    },

    simulatorCases: {
      drainWaste: "வடிகாலுக்கு அருகிலுள்ள கலப்பு கழிவு",
      publicToilet: "பொது கழிப்பறை கட்டமைப்பு",
      sidewalkDebris: "நடைபாதை குப்பைகள்",
      entropyText:
        "சிதறல் மதிப்பெண், பொறுப்பு பல துறைகளில் பகிரப்பட்டிருப்பதை காட்டுகிறது.",
      reasonText:
        "தெளிவான முதன்மை பொறுப்பாளர் இல்லாததால் புகார் துறைகள் இடையே மாறுகிறது.",
      riskText: "துறை பொறுப்புணர்வு குறைவு - சுற்றி வரும் மாற்று நிலை.",
    },

    insights: {
      title: "ஆட்சிமுறை நுண்ணறிவு",
      subtitle: "AI அடிப்படையிலான கட்டமைப்பு விளக்கம்",
      structuralInterpretation: "கட்டமைப்பு விளக்கம்",
      keyFindings: "முக்கிய கண்டறிதல்கள்",
      recommendationTitle: "ஆட்சிமுறை பரிந்துரை",
      findingOne:
        "அனைத்து 6 புகார் வகைகளிலும் அதிக பொறுப்பு சிதறல் காணப்படுகிறது.",
      findingTwo:
        "சிதறல் மதிப்பெண்கள் 0.91 முதல் 1.00 வரை உள்ளன. இது துறைகளின் பொறுப்பு தெளிவில்லாமல் இருப்பதை காட்டுகிறது.",
      findingThree:
        "ஒருங்கிணைந்த பொறுப்பு அமைப்பு புகார் தாமதத்தை குறைத்து தீர்வு வேகத்தை மேம்படுத்த முடியும்.",
    },

    citizen: {
      title: "குடிமக்கள் புகார் அபாய மதிப்பீடு",
      category: "புகார் வகை",
      selectCategory: "புகார் வகையைத் தேர்வு செய்யவும்",
      description: "விளக்கம்",
      placeholder: "பிரச்சினையை விவரிக்கவும்...",
      analyze: "புகாரை பகுப்பாய்வு செய்",
      result: "பகுப்பாய்வு முடிவு",
      riskLevel: "அபாய நிலை",
      reason: "காரணம்",
      normalResolution: "சாதாரண தீர்வு காலம்",
      escalatedResolution: "எஸ்கலேஷன் பின் தீர்வு காலம்",
      recommendedDept: "பரிந்துரைக்கப்படும் துறை",
      entropyScore: "சிதறல் மதிப்பெண்",
      expectedImprovement: "எதிர்பார்க்கப்படும் முன்னேற்றம்",
      days: "நாட்கள்",
      selectAlert: "தயவுசெய்து ஒரு புகார் வகையைத் தேர்வு செய்யவும்",
    },

    categories: {
      Electrical: "மின்சாரம்",
      Drain: "வடிகால்",
      "Solid Waste": "திடக் கழிவு",
      "Road Maintenance": "சாலை பராமரிப்பு",
      Forest: "மரம் / பூங்கா",
      Health: "சுகாதாரம்",
    },

    risk: {
      HIGH: "அதிக அபாயம்",
      MEDIUM: "மிதமான அபாயம்",
      LOW: "குறைந்த அபாயம்",
    },

    departments: {
      "Electrical Dept": "மின்சாரத் துறை",
      "Drainage Dept": "வடிகால் துறை",
      "Sanitation Dept": "தூய்மைத் துறை",
      PWD: "பொது பணித் துறை",
      "Parks Dept": "பூங்கா / மர பராமரிப்பு துறை",
      "Health Dept": "சுகாதாரத் துறை",
    },
  },
};

export type TranslationKey = keyof typeof translations;