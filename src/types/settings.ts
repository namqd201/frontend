export interface UserSettings {
  id?: string;
  userId?: string;
  timezone: string;
  defaultLanguage: string;
  tone: string;
  writingStyle?: string;
  forbiddenWords?: string;
  preferredHashtags?: string;
  defaultCta?: string;
  emojiPolicy: "NONE" | "MINIMAL" | "MODERATE" | "EXPRESSIVE";
  extraGuidelines?: string;
  textProviderPrimary: string;
  textProviderFallback: string;
  imageProviderPrimary: string;
  imageProviderFallback: string;
  aiDailyBudgetUsd: number;
  appendAiDisclosure: boolean;
  aiDisclosureText?: string;
  notifyTelegramChatId?: string;
  notifyEmail?: string;
  notifyEvents?: string;
  dailyDigestEnabled: boolean;
  dailyDigestTime: string;
  generateLeadHours: number;
  missedGraceMinutes: number;
}

export interface AiProviderInfo {
  id: string;
  name: string;
  type: "TEXT" | "IMAGE";
  available: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  payload?: string;
  relatedPostId?: string;
  relatedPlanId?: string;
  deliveryStatus: "PENDING" | "SENT" | "FAILED";
  readAt?: string;
  createdAt: string;
}
