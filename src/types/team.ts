export interface TeamMemberItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'WORKSPACE_OWNER' | 'WORKSPACE_ADMIN' | 'CONTENT_CREATOR' | 'VIEWER_ANALYST';
  status: 'ACTIVE' | 'PAUSED' | 'INACTIVE';
  permissionsSummary: string;
  joinedAt: string;
  isCurrentUser: boolean;
}

export interface PendingInvitationItem {
  id: string;
  email: string;
  role: 'WORKSPACE_ADMIN' | 'CONTENT_CREATOR' | 'VIEWER_ANALYST';
  invitedAt: string;
  expiresAt: string;
  tokenType: string;
  status: 'PENDING' | 'EXPIRED';
  note?: string;
  hoursRemaining: number;
}

export interface WorkspaceTeamResponse {
  workspaceId: string;
  workspaceName: string;
  planTier: string;
  totalMembers: number;
  memberLimit: number;
  adminCount: number;
  creatorCount: number;
  pendingInviteCount: number;
  rbacStatus: string;
  members: TeamMemberItem[];
  invitations: PendingInvitationItem[];
}

export interface InviteMemberRequest {
  email: string;
  role: string;
  note?: string;
}

export interface UpdateMemberRoleRequest {
  role: string;
}
