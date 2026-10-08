export interface ActivePipelineTask {
  postId: string;
  planId?: string;
  planName: string;
  platform: string;
  topic: string;
  status: "PLANNED" | "GENERATING" | "READY" | "GENERATION_FAILED" | string;
  currentStep: number; // 1 to 5
  currentStepName: string;
  progressDescription: string;
  percentComplete: number;
  modelUsed: string;
  updatedAt: string;
}

export interface AiRecentActivity {
  id: string;
  kind?: string;
  feature?: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: string;
  error?: string;
  createdAt: string;
}

export interface AiPipelineProgressResponse {
  totalPlanned: number;
  totalGenerating: number;
  totalReady: number;
  totalFailed: number;
  activeTasks: ActivePipelineTask[];
  recentActivities: AiRecentActivity[];
}
