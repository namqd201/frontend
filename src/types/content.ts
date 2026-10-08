export type SocialPlatform = 'FACEBOOK' | 'X' | 'LINKEDIN' | 'THREADS';

export interface AICreateContentRequest {
  prompt: string;
  tone?: string;
  modelId?: string;
  targetPlatforms?: SocialPlatform[];
  selectedHook?: string;
}

export interface AICreateContentResponse {
  baseContent: string;
  characterCount: number;
  brandVoicePassed: boolean;
  brandVoiceReport: string;
  suggestedHooks: string[];
  platformVariants: Record<string, string>;
  wordsUsed: number;
}

export interface CreatePostRequest {
  title?: string;
  baseContent: string;
  targetPlatforms: SocialPlatform[];
  platformCustomContent?: Record<string, string>;
  scheduledAt?: string;
  requiresApproval?: boolean;
  action: 'SAVE_DRAFT' | 'SUBMIT_APPROVAL' | 'SCHEDULE' | 'PUBLISH_NOW';
  mediaUrl?: string;
}

export interface PostVariantResponse {
  id: string;
  platform: string;
  customContent: string;
  characterCount: number;
  status: string;
}

export interface PostResponse {
  id: string;
  workspaceId: string;
  title: string;
  baseContent: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  requiresApproval: boolean;
  variants: PostVariantResponse[];
  message: string;
}
