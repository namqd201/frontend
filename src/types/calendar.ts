export type CalendarViewMode = "month" | "week" | "day" | "queue";

export type SocialChannel = "FB" | "X" | "TH" | "IN";

export type PostCalendarStatus =
  | "PUBLISHED"
  | "SCHEDULED"
  | "PENDING_APPROVAL"
  | "DRAFT"
  | "FAILED";

export interface CalendarPostItem {
  id: string;
  title: string;
  timeText: string; // e.g. "14:30"
  date: string; // ISO date "2026-10-15"
  platforms: SocialChannel[];
  status: PostCalendarStatus;
  statusLabel: string;
  reachMetric?: string; // e.g. "12.4k reach"
  draggable: boolean;
}

export interface CampaignMilestoneItem {
  id: string;
  type: "MILESTONE" | "EVENT";
  dateRange: string; // e.g. "19/10 - 25/10"
  title: string;
  description: string;
  progressLabel?: string; // e.g. "8 Bài đã liên kết • Hoàn thành 75% kế hoạch"
  imageUrl?: string;
}

export interface CalendarMonthData {
  monthLabel: string;
  campaignQuarter: string;
  timezone: string;
  posts: CalendarPostItem[];
  completedPosts: number;
  plannedPosts: number;
  progressPercent: number;
  successRate: number;
  nextAutoRunTime: string;
  nextAutoRunTitle: string;
  nextAutoRunMode: string;
  nextAutoRunTarget: string;
  milestones: CampaignMilestoneItem[];
}
