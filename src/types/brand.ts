export interface BrandProfileData {
  brandName: string;
  industry: string;
  positioningDescription: string;
  targetAudience: string;
  selectedTones: string[];
  styleInstruction: string;
  emojiPolicy: "MINIMAL" | "RICH" | "NONE";
  defaultCta: string;
  preferredKeywords: string[];
  forbiddenWords: string[];
  violationPolicy: "AUTO_REWRITE" | "FLAG_MANUAL";
  consistencyScore: number;
  toneMatchScore: number;
  safeWordsScore: number;
  keywordDensityScore: number;
}

export interface BrandVoiceTestResult {
  score: number;
  passed: boolean;
  detectedForbiddenWords: string[];
  detectedPreferredKeywords: string[];
  rewrittenText: string;
  feedback: string;
}
