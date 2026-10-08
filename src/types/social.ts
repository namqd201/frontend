export interface SocialAccount {
  id: string;
  connectionId: string;
  platform: 'FACEBOOK' | 'THREADS' | 'X' | 'LINKEDIN';
  accountType: 'PAGE' | 'PROFILE' | 'ORGANIZATION';
  platformAccountId: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  isEnabled: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'ERROR';
  lastHealthCheckAt?: string;
  lastError?: string;
  needsReauthAt?: string;
}

export interface SocialConnection {
  id: string;
  platform: 'FACEBOOK' | 'THREADS' | 'X' | 'LINKEDIN';
  platformUserId: string;
  displayName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'ERROR';
  scopes?: string;
  tokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  lastRefreshedAt?: string;
  refreshFailureCount: number;
  lastError?: string;
  connectedAt: string;
  accounts: SocialAccount[];
}
