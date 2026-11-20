export interface CalculatedSlot {
  slotKey: string;
  localDate: string;
  localTime: string;
  scheduledAt: string;
  generateAt: string;
}

export interface PlanPreviewData {
  totalDays: number;
  postsPerDay: number;
  totalSlotsPerChannel: number;
  totalPosts: number;
  estimatedCostUsd: number;
  slots: CalculatedSlot[];
}

export interface ContentPlanItem {
  id: string;
  name: string;
  topic: string;
  instructions?: string;
  language: string;
  tone?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  timezone: string;
  postsPerDay: number;
  timeMode: string;
  timeSlots: string[];
  targetAccountIds: string[];
  includeImage: boolean;
  imageStyle?: string;
  estimatedCostUsd: number;
  totalSlots: number;
  publishedSlots: number;
  failedSlots: number;
  createdAt: string;
  activatedAt?: string;
}

export interface CreatePlanPayload {
  name: string;
  topic: string;
  instructions?: string;
  language?: string;
  tone?: string;
  startDate: string;
  endDate: string;
  timezone?: string;
  postsPerDay: number;
  timeMode?: string;
  timeSlots: string[];
  targetAccountIds: string[];
  includeImage: boolean;
  imageStyle?: string;
  imageFailurePolicy?: string;
  contentMode?: string;
  angles?: string[];
}

export interface ContentPillar {
  pillar: string;
  description: string;
}

export interface PlanAngleItem {
  dayIndex: number;
  angle: string;
  pillar?: string;
  hook?: string;
}

export interface MarketingStrategyResponse {
  url: string;
  brandName: string;
  industry: string;
  summary: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  contentPillars: ContentPillar[];
  suggestedCampaignName: string;
  suggestedTopic: string;
  suggestedTone: string;
  suggestedInstructions: string;
  suggestedAngles: PlanAngleItem[];
  rawExtractedLength: number;
  modelUsed: string;
}

export interface AnalyzeWebsitePayload {
  url: string;
  targetAudienceHint?: string;
  campaignDurationDays?: number;
  postsPerDay?: number;
  language?: string;
}
