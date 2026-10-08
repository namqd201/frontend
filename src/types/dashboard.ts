export interface Workspace {
  id: string;
  name: string;
  slug: string;
  planTier: string;
  timezone: string;
  aiQuotaMonthly: number;
  aiQuotaUsed: number;
  userRole: string;
}

export interface MetricsSummary {
  aiQuotaUsedPosts: number;
  aiQuotaTotalPosts: number;
  aiQuotaPercentage: number;
  aiPlanTier: string;
  aiResetDays: number;

  scheduledPostsCount: number;
  pendingApprovalCount: number;
  scheduledTrendLabel: string;

  reliabilityRate: number;
  avgLatencySeconds: number;

  totalImpressions: number;
  impressionsTrendMoM: number;
  totalEngagements: number;
}

export type SocialPlatform = 'FACEBOOK' | 'X' | 'LINKEDIN' | 'THREADS' | 'TIKTOK' | 'YOUTUBE';

export interface SocialAccountHealthItem {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  accountHandle: string;
  avatarUrl?: string;
  healthStatus: string;
  statusLabel: string;
  healthPercent: number;
}

export type QueuePostStatus = 'SCHEDULED' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'FAILED';

export interface QueuePostItem {
  id: string;
  postNumber: string;
  title: string;
  contentPreview: string;
  scheduledTimeText: string;
  platforms: SocialPlatform[];
  status: QueuePostStatus;
  statusLabel: string;
  authorName?: string;
  mediaThumbnailUrl?: string;
  nodeRouteText?: string;
  isPollThread?: boolean;
}

export interface AiInsightItem {
  id: string;
  type: 'OPTIMAL_WINDOW' | 'VIRAL_TOPIC';
  title: string;
  content: string;
  badgeText: string;
  metricGainText?: string;
}

export interface AuditLogItem {
  id: string;
  timeText: string;
  tag: string;
  actorName?: string;
  content: string;
  levelColor: 'tertiary' | 'secondary' | 'primary';
}

export interface DashboardSummaryResponse {
  workspace: Workspace;
  metrics: MetricsSummary;
  socialAccounts: SocialAccountHealthItem[];
  queuePosts: QueuePostItem[];
  aiInsights: AiInsightItem[];
  auditLogs: AuditLogItem[];
  nextRunTimeText: string;
}
