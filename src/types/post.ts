export interface PostItem {
  id: string;
  planId?: string;
  planName?: string;
  source: string;
  groupId?: string;
  slotKey: string;
  socialAccountId: string;
  channelName?: string;
  platform: 'FACEBOOK' | 'THREADS' | 'X' | 'LINKEDIN';
  scheduledAt: string;
  scheduledTimezone: string;
  generateAt?: string;
  status:
    | 'PLANNED'
    | 'GENERATING'
    | 'READY'
    | 'PUBLISHING'
    | 'PUBLISHED'
    | 'FAILED'
    | 'NEEDS_REVIEW'
    | 'RECONCILING'
    | 'SKIPPED'
    | 'MISSED'
    | 'GENERATION_FAILED';
  content?: string;
  hashtags?: string;
  threadParts?: string;
  imagePrompt?: string;
  contentEditedByUser?: boolean;
  angle?: string;
  publishCycle: number;
  attemptCount: number;
  maxAttempts: number;
  nextAttemptAt?: string;
  errorClass?: string;
  lastError?: string;
  needsReviewReason?: string;
  platformPostId?: string;
  platformPostUrl?: string;
  publishedAt?: string;
  mediaUrls?: string[];
}

export interface PostAttempt {
  id: string;
  postId: string;
  publishCycle: number;
  attemptNo: number;
  workerId?: string;
  startedAt?: string;
  requestSentAt?: string;
  finishedAt?: string;
  outcome: string;
  httpStatus?: number;
  platformErrorCode?: string;
  errorMessage?: string;
  responseSnippet?: string;
}

export interface ScheduleSummary {
  publishedToday: number;
  scheduledNext24h: number;
  needsAttention: number;
}

export interface RegeneratePostRequest {
  customPrompt?: string;
  tone?: string;
  angle?: string;
}

export interface ChatAttachment {
  fileName: string;
  mimeType: string;
  base64Data: string;
  previewUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatAttachment[];
  suggestedContent?: string;
  suggestedHashtags?: string[];
}

export interface PostChatResponse {
  reply: string;
  suggestedContent?: string;
  suggestedHashtags?: string[];
  modelUsed?: string;
}
