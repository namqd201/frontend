'use client';

import React from 'react';
import { TeamMemberItem } from '@/types/team';

interface TeamMembersTableProps {
  members: TeamMemberItem[];
  onChangeRole: (member: TeamMemberItem) => void;
  onToggleStatus: (member: TeamMemberItem) => void;
  onRemoveMember: (member: TeamMemberItem) => void;
}

export const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onChangeRole,
  onToggleStatus,
  onRemoveMember,
}) => {
  const getRoleBadge = (role: TeamMemberItem['role']) => {
    switch (role) {
      case 'WORKSPACE_OWNER':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-bold">
            <span className="material-symbols-outlined text-[13px]">military_tech</span>
            WORKSPACE_OWNER
          </span>
        );
      case 'WORKSPACE_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
            <span className="material-symbols-outlined text-[13px]">verified_user</span>
            WORKSPACE_ADMIN
          </span>
        );
      case 'CONTENT_CREATOR':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-bold">
            <span className="material-symbols-outlined text-[13px]">edit_note</span>
            CONTENT_CREATOR
          </span>
        );
      case 'VIEWER_ANALYST':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
            <span className="material-symbols-outlined text-[13px]">visibility</span>
            VIEWER / ANALYST
          </span>
        );
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
            <th className="py-3 px-6">Thành viên</th>
            <th className="py-3 px-4">Vai trò (Role)</th>
            <th className="py-3 px-4">Trạng thái</th>
            <th className="py-3 px-4">Quyền hạn chính</th>
            <th className="py-3 px-4">Ngày gia nhập</th>
            <th className="py-3 px-6 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-slate-800">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3.5 px-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      src={member.avatarUrl}
                    />
                    {member.role === 'WORKSPACE_OWNER' && (
                      <span
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[8px]"
                        title="Chủ sở hữu"
                      >
                        ★
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-slate-900 truncate">{member.name}</span>
                      {member.isCurrentUser && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-mono truncate">{member.email}</span>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 whitespace-nowrap">{getRoleBadge(member.role)}</td>

              <td className="py-3.5 px-4 whitespace-nowrap">
                {member.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Đang hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Tạm ngừng
                  </span>
                )}
              </td>

              <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs">{member.permissionsSummary}</td>

              <td className="py-3.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                {formatDate(member.joinedAt)}
              </td>

              <td className="py-3.5 px-6 text-right whitespace-nowrap">
                {member.role === 'WORKSPACE_OWNER' ? (
                  <div className="inline-flex items-center gap-1 text-slate-400 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium">
                    <span className="material-symbols-outlined text-[15px]">lock</span>
                    <span>Chủ sở hữu</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
                      onClick={() => onChangeRole(member)}
                      type="button"
                    >
                      Đổi role
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      onClick={() => onToggleStatus(member)}
                      title={member.status === 'ACTIVE' ? 'Tạm ngừng quyền' : 'Kích hoạt lại'}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {member.status === 'ACTIVE' ? 'pause_circle' : 'play_circle'}
                      </span>
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                      onClick={() => onRemoveMember(member)}
                      title="Xóa khỏi Workspace"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_remove</span>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
