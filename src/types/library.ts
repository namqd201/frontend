export type PostStatusFilter =
  | 'ALL'
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'PARTIALLY_PUBLISHED'
  | 'FAILED';

export interface PlatformItem {
  platform: 'FACEBOOK' | 'LINKEDIN' | 'X' | 'THREADS';
  iconText: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  tooltip?: string;
}

export interface AuthorItem {
  name: string;
  avatarText?: string;
  role: string;
  isAi: boolean;
  aiModel?: string;
}

export interface PostListItem {
  id: string;
  postNumber: string;
  title: string;
  summary: string;
  baseContent: string;
  status: string;
  statusLabel: string;
  categoryBadge?: string;
  mediaThumbnailUrl?: string;
  isAiGenerated?: boolean;
  platforms: PlatformItem[];
  author: AuthorItem;
  scheduledAt?: string;
  scheduledTimeText: string;
  relativeTimeText: string;
  submissionNote?: string;
  failureReason?: string;
}

export interface ContentLibraryResponse {
  posts: PostListItem[];
  statusCounts: Record<string, number>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
