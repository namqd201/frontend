export interface AutomationWorkflowItem {
  id: string;
  name: string;
  mode: "GENERATE_AND_SCHEDULE" | "REQUIRE_APPROVAL" | "GENERATE_ONLY" | "WEBHOOK";
  cronExpression: string;
  scheduleDescription: string;
  active: boolean;
  promptInstruction: string;
  targetPlatforms: string[];
  lastRunText: string;
  lastRunStatusText: string;
  nextRunText: string;
  iconName: string;
}

export interface AutomationWorkflowRunLogItem {
  runId: string;
  workflowName: string;
  startTime: string;
  durationOrEndTime: string;
  generatedPostIds: string[];
  status: "RUNNING" | "SUCCESS" | "FAILED";
  failureReason?: string;
}

export interface AutomationDashboardData {
  activeWorkflowsCount: number;
  totalWorkflowsCount: number;
  autoPublishedPostsMonth: number;
  growthPercent: number;
  precisionSla: number;
  avgLatency: string;
  nextRunTime: string;
  nextRunDay: string;
  timezone: string;
  workflows: AutomationWorkflowItem[];
  runLogs: AutomationWorkflowRunLogItem[];
}
