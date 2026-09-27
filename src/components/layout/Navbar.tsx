import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { Logo } from '../common/Logo';
import {
  Search,
  Bell,
  RefreshCw,
  Plus,
  Check,
  ChevronDown,
  Building2,
  LogOut,
} from 'lucide-react';
import { Role } from '../../types';

interface NavbarProps {
  onOpenNewRefillModal: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewRefillModal,
  onSignOut,
}) => {
  const {
    currentUser,
    switchRole,
    availableUsers,
    activeTab,
    setActiveTab,
    globalSearch,
    setGlobalSearch,
    lastSyncTime,
    isSyncing,
    triggerLiveSync,
    unreadNotificationCount,
    markNotificationsAsRead,
  } = useRefillContext();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'overview':
        return 'Operations Dashboard';
      case 'queue':
        return 'Refill Queue';
      case 'detail':
        return 'Refill Detail & Workflow';
      case 'tasks':
        return 'My Assigned Tasks';
      case 'patients':
        return 'Patient Directory';
      case 'practices':
        return 'Partner Practices';
      case 'escalations':
        return 'SLA Escalation Center';
      case 'analytics':
        return 'Operational Analytics';
      case 'audit':
        return 'Compliance Audit Trail';
      case 'settings':
        return 'Practice & SLA Settings';
      case 'landing':
        return 'Product Overview';
      default:
        return 'Workflow';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Single element brand title / Logo */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
        >
          <Logo size="sm" />
        </button>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
          <span>{currentUser.organizationName}</span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-700">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Zone 2: Global Search Input */}
      <div className="flex-1 max-w-md mx-2 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, medication, Rx ID or pharmacy..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              if (activeTab !== 'queue' && e.target.value.length > 0) {
                setActiveTab('queue');
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white text-xs text-slate-900 rounded-lg pl-9 pr-3 py-1.5 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Zone 3: Live Sync, Alerts & Role Switcher */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Live Sync Status */}
        <button
          onClick={triggerLiveSync}
          disabled={isSyncing}
          title={`Last sync: ${lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="font-mono text-[11px] tabular-nums text-slate-500 hidden xl:inline">
            Sync: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </button>

        {/* New Refill Button */}
        <button
          onClick={onOpenNewRefillModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Refill</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifDropdownOpen(!isNotifDropdownOpen);
              if (!isNotifDropdownOpen && unreadNotificationCount > 0) {
                markNotificationsAsRead();
              }
            }}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>

        {/* User Account & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 text-xs border border-slate-200 hover:border-slate-300 rounded-md bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-slate-800 text-teal-400 flex items-center justify-center text-[11px] font-bold">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="font-medium text-slate-900 truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Active Organization Profile
              </div>
              <div className="px-3 py-2 bg-slate-50/80 border-b border-slate-100 mb-1">
                <div className="font-semibold text-slate-900 text-xs">{currentUser.name}</div>
                <div className="text-[11px] text-slate-600">{currentUser.title}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3" />
                  {currentUser.organizationName}
                </div>
              </div>

              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Role Perspective
              </div>
              {availableUsers.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchRole(u.role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-start justify-between text-xs hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-slate-50/80 font-medium text-teal-800' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900 flex items-center gap-1.5 text-xs">
                        {u.name}
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      </div>
                      <div className="text-[10px] text-slate-500">{u.title}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 shrink-0 font-mono">
                      {u.role.replace('_', ' ')}
                    </span>
                  </button>
                );
              })}

              {onSignOut && (
                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
