import React from 'react';
import { useRefillContext, ViewTab } from '../../context/RefillContext';
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  Users,
  Building,
  AlertOctagon,
  BarChart3,
  ShieldCheck,
  Bell,
  Settings,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface SidebarProps {
  onOpenDemoWalkthrough?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDemoWalkthrough }) => {
  const {
    activeTab,
    setActiveTab,
    refills,
    tasks,
    currentUser,
    unreadNotificationCount,
    isIntegrationErrorSimulated,
    toggleIntegrationErrorSimulation,
  } = useRefillContext();

  const openCount = refills.filter((r) => r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;
  const needsActionCount = refills.filter(
    (r) => r.status === 'ACTION_REQUIRED' || r.status === 'WAITING_FOR_PROVIDER'
  ).length;
  const escalatedCount = refills.filter((r) => r.status === 'ESCALATED' || r.priority === 'URGENT').length;
  const myPendingTasksCount = tasks.filter(
    (t) => t.status !== 'COMPLETED' && (t.assignedToRole === currentUser.role || t.assignedToId === currentUser.id)
  ).length;

  const navItems: { id: ViewTab; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'queue', label: 'Refill Queue', icon: Inbox, badge: openCount, badgeColor: 'bg-slate-200 text-slate-800' },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: myPendingTasksCount, badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'practices', label: 'Practices', icon: Building },
    { id: 'escalations', label: 'Escalations', icon: AlertOctagon, badge: escalatedCount, badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck },
  ];

  const bottomNavItems: { id: ViewTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'settings', label: 'Settings & SLAs', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen select-none">
      {/* Primary Section Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Operations Workspace
          </span>
          <button
            onClick={() => setActiveTab('landing')}
            className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
              activeTab === 'landing'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Product Tour
          </button>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-teal-600/15 text-teal-300 border-l-2 border-teal-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.2 rounded font-medium ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 pb-1 px-3">
          <div className="h-px bg-slate-800" />
        </div>

        {/* Bottom utility navigation */}
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-teal-600/15 text-teal-300 border-l-2 border-teal-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Integration Resilience Simulation Box */}
      <div className="p-3 mx-3 mb-3 bg-slate-950/60 border border-slate-800 rounded-lg text-left">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
            {isIntegrationErrorSimulated ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>SureScripts / EHR</span>
          </div>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              isIntegrationErrorSimulated
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}
          >
            {isIntegrationErrorSimulated ? 'DEGRADED' : 'ONLINE'}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight mb-2">
          {isIntegrationErrorSimulated
            ? 'Simulating timeout. Refills safely queued locally without loss.'
            : 'NCPDP SCRIPT and FHIR R4 interfaces operating nominally.'}
        </p>
        <button
          onClick={toggleIntegrationErrorSimulation}
          className="w-full text-[11px] py-1 px-2 font-medium rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-200 transition-colors text-center"
        >
          {isIntegrationErrorSimulated ? 'Restore Integration' : 'Simulate Outage'}
        </button>
      </div>

      {/* User Organization Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-teal-900/50 border border-teal-500/30 text-teal-300 font-bold flex items-center justify-center text-xs shrink-0">
            {currentUser.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{currentUser.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{currentUser.organizationName}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
