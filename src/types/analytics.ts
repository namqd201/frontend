export interface DailyMetricPoint {
  dateLabel: string;
  reach: number;
  engagements: number;
  isMilestone: boolean;
}

export interface AIInsightItem {
  id: string;
  icon: string;
  title: string;
  contentHtml: string;
  impactBadge: string;
  impactColor: "tertiary" | "secondary" | "primary";
}

export interface PlatformPerformanceItem {
  platform: "LINKEDIN" | "FACEBOOK" | "X" | "THREADS";
  displayName: string;
  handle: string;
  tagBadge?: string | null;
  postCount: number;
  reach: number;
  engagementText: string;
  ctr: number;
  followerGrowth: string;
  ratingLabel: string;
  ratingStatus: "EXCELLENT" | "GOOD" | "STABLE" | "POTENTIAL";
}

export interface TopPerformingPostItem {
  id: string;
  title: string;
  summary: string;
  platform: string;
  publishedDate: string;
  thumbnailUrl?: string;
  reach: number;
  engagements: number;
  ctr: number;
  viralityScore: number;
}

export interface AnalyticsOverviewData {
  dateRangeLabel: string;
  totalReach: number;
  reachGrowthPercent: number;
  totalEngagements: number;
  engagementRateCtr: number;
  publishingReliability: number;
  queueLatency: string;
  totalPublishedPosts: number;
  totalVariants: number;
  chartPoints: DailyMetricPoint[];
  chartPeakHighlight: string;
  aiInsights: AIInsightItem[];
  platformBreakdown: PlatformPerformanceItem[];
  topPosts: TopPerformingPostItem[];
}
