import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Role,
  RefillRequest,
  RefillStatus,
  TimelineEvent,
  RefillMessage,
  Task,
  AuditEvent,
  AppNotification,
  SLASettings,
  BlockerType,
  Priority,
} from '../types';
import {
  DEMO_USERS,
  DEMO_REFILLS,
  DEMO_TIMELINE,
  DEMO_MESSAGES,
  DEMO_TASKS,
  DEMO_AUDIT_LOG,
  DEMO_NOTIFICATIONS,
  DEFAULT_SLA_SETTINGS,
} from '../data/initialData';
import { INITIAL_INTEGRATIONS, IntegrationStatus } from '../services/integrationAdapters';

export type ViewTab =
  | 'overview'
  | 'queue'
  | 'detail'
  | 'tasks'
  | 'patients'
  | 'practices'
  | 'escalations'
  | 'analytics'
  | 'audit'
  | 'settings'
  | 'landing';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface RefillContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  currentRole: Role;
  switchRole: (role: Role) => void;

  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;

  selectedRefillId: string | null;
  setSelectedRefillId: (id: string | null) => void;

  refills: RefillRequest[];
  tasks: Task[];
  auditLogs: AuditEvent[];
  notifications: AppNotification[];
  slaSettings: SLASettings;
  integrations: IntegrationStatus[];

  getRefillById: (id: string) => RefillRequest | undefined;
  getTimelineForRefill: (refillId: string) => TimelineEvent[];
  getMessagesForRefill: (refillId: string) => RefillMessage[];

  // Core Operational Actions
  updateRefillStatus: (refillId: string, newStatus: RefillStatus, reason: string) => void;
  assignRefill: (refillId: string, assignedToId: string, assignedToName: string, role: Role) => void;
  escalateRefill: (refillId: string, reason: string) => void;
  sendReminder: (refillId: string) => void;
  postMessage: (refillId: string, content: string, isInternalNote?: boolean) => void;
  recordProviderDecision: (
    refillId: string,
    decision: 'APPROVED' | 'APPROVED_WITH_APPOINTMENT' | 'DENIED' | 'MODIFIED',
    notes: string,
    bridgeDays?: number
  ) => void;
  completeTask: (taskId: string) => void;
  updateSlaSettings: (newSettings: Partial<SLASettings>) => void;
  addNewRefill: (newRefill: Partial<RefillRequest>) => void;

  // Search & Filters
  globalSearch: string;
  setGlobalSearch: (query: string) => void;

  // Synchronization & Live Alerts
  lastSyncTime: Date;
  isSyncing: boolean;
  triggerLiveSync: () => void;
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;

  // Integration Failure Simulation
  isIntegrationErrorSimulated: boolean;
  toggleIntegrationErrorSimulation: () => void;

  // Demo Controls
  resetToDemoData: () => void;
  runAutomatedHackathonDemo: () => void;
  isDemoRunning: boolean;

  // Feedback
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const RefillContext = createContext<RefillContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'rxresolve_data_v1';
const LEGACY_STORAGE_KEY_PREFIX = 'rxbridge_data_v1';

const getInitialStorage = (key: string): string | null => {
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}_${key}`) || localStorage.getItem(`${LEGACY_STORAGE_KEY_PREFIX}_${key}`);
};

export const RefillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = getInitialStorage('user');
    return saved ? JSON.parse(saved) : DEMO_USERS[1]; // Default to Sarah Johnson (Practice Staff)
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [selectedRefillId, setSelectedRefillId] = useState<string | null>('RF-10482');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const [refills, setRefills] = useState<RefillRequest[]>(() => {
    const saved = getInitialStorage('refills');
    return saved ? JSON.parse(saved) : DEMO_REFILLS;
  });

  const [timelineMap, setTimelineMap] = useState<Record<string, TimelineEvent[]>>(() => {
    const saved = getInitialStorage('timeline');
    return saved ? JSON.parse(saved) : DEMO_TIMELINE;
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, RefillMessage[]>>(() => {
    const saved = getInitialStorage('messages');
    return saved ? JSON.parse(saved) : DEMO_MESSAGES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = getInitialStorage('tasks');
    return saved ? JSON.parse(saved) : DEMO_TASKS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = getInitialStorage('audit');
    return saved ? JSON.parse(saved) : DEMO_AUDIT_LOG;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = getInitialStorage('notifications');
    return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS;
  });

  const [slaSettings, setSlaSettings] = useState<SLASettings>(() => {
    const saved = getInitialStorage('sla');
    return saved ? JSON.parse(saved) : DEFAULT_SLA_SETTINGS;
  });

  const [integrations, setIntegrations] = useState<IntegrationStatus[]>(INITIAL_INTEGRATIONS);
  const [isIntegrationErrorSimulated, setIsIntegrationErrorSimulated] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_refills`, JSON.stringify(refills));
  }, [refills]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_timeline`, JSON.stringify(timelineMap));
  }, [timelineMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_messages`, JSON.stringify(messagesMap));
  }, [messagesMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_sla`, JSON.stringify(slaSettings));
  }, [slaSettings]);

  // Periodic simulated live synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncTime(new Date());
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (
    action: string,
    resourceType: 'REFILL' | 'TASK' | 'MESSAGE' | 'SETTINGS' | 'INTEGRATION',
    resourceId: string,
    result: 'SUCCESS' | 'WARNING' | 'FAILURE',
    metadata?: Record<string, string | number | boolean>
  ) => {
    const newEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      organizationId: currentUser.organizationId,
      organizationName: currentUser.organizationName,
      action,
      resourceType,
      resourceId,
      result,
      metadata,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const triggerLiveSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSyncTime(new Date());
      setIsSyncing(false);
      showToast('Queue synchronized with SureScripts and EHR feeds', 'success');
    }, 600);
  };

  const switchRole = (role: Role) => {
    const matched = DEMO_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      showToast(`Switched view to ${matched.name} (${role.replace('_', ' ')})`, 'info');
      logAudit('ROLE_SWITCH', 'SETTINGS', role, 'SUCCESS', { user: matched.name });
    }
  };

  const getRefillById = (id: string) => {
    return refills.find((r) => r.id === id);
  };

  const getTimelineForRefill = (refillId: string): TimelineEvent[] => {
    return timelineMap[refillId] || [];
  };

  const getMessagesForRefill = (refillId: string): RefillMessage[] => {
    return messagesMap[refillId] || [];
  };

  const updateRefillStatus = (refillId: string, newStatus: RefillStatus, reason: string) => {
    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refillId) {
          const prevStatus = r.status;
          return {
            ...r,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : r.resolvedAt,
          };
        }
        return r;
      })
    );

    // Add timeline event
    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      refillId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorType: currentUser.organizationType === 'PHARMACY' ? 'PHARMACY' : 'PRACTICE',
      action: `Status changed to ${newStatus.replace(/_/g, ' ')}`,
      result: reason,
    };

    setTimelineMap((prev) => ({
      ...prev,
      [refillId]: [...(prev[refillId] || []), newTimelineEvent],
    }));

    logAudit('STATUS_UPDATE', 'REFILL', refillId, 'SUCCESS', {
      newStatus,
      reason,
    });

    showToast(`Refill ${refillId} updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
  };

  const assignRefill = (refillId: string, assignedToId: string, assignedToName: string, role: Role) => {
    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refillId) {
          return {
            ...r,
            assignedToId,
            assignedToName,
            assignedToRole: role,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    // Update or create task
    const existingTask = tasks.find((t) => t.refillId === refillId && t.status !== 'COMPLETED');
    if (existingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === existingTask.id
            ? { ...t, assignedToId, assignedToName, assignedToRole: role }
            : t
        )
      );
    } else {
      const refill = refills.find((r) => r.id === refillId);
      if (refill) {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          refillId,
          patientName: refill.patientName,
          medicationName: refill.medication.name,
          title: `Action needed for ${refill.patientName}`,
          assignedToId,
          assignedToName,
          assignedToRole: role,
          priority: refill.priority,
          dueDate: refill.dueAt,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [newTask, ...prev]);
      }
    }

    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      refillId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorType: 'PRACTICE',
      action: 'Assigned Owner',
      result: `Assigned to ${assignedToName}`,
    };

    setTimelineMap((prev) => ({
      ...prev,
      [refillId]: [...(prev[refillId] || []), newTimelineEvent],
    }));

    logAudit('ASSIGN_OWNER', 'REFILL', refillId, 'SUCCESS', {
      assignedTo: assignedToName,
    });

    showToast(`Assigned ${refillId} to ${assignedToName}`, 'info');
  };

  const escalateRefill = (refillId: string, reason: string) => {
    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refillId) {
          return {
            ...r,
            status: 'ESCALATED',
            priority: 'URGENT',
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      refillId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorType: 'PRACTICE',
      action: 'Escalated to Supervisor',
      result: reason,
    };

    setTimelineMap((prev) => ({
      ...prev,
      [refillId]: [...(prev[refillId] || []), newTimelineEvent],
    }));

    // Add alert notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Refill Escalated to High Priority',
      message: `Refill ${refillId} was escalated by ${currentUser.name}: ${reason}`,
      refillId,
      type: 'OVERDUE',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    logAudit('ESCALATE_REFILL', 'REFILL', refillId, 'WARNING', { reason });
    showToast(`Refill ${refillId} escalated to URGENT priority`, 'warning');
  };

  const sendReminder = (refillId: string) => {
    const refill = refills.find((r) => r.id === refillId);
    if (!refill) return;

    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      refillId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorType: 'PRACTICE',
      action: 'Reminder Transmitted',
      result: `Priority notification pinged to ${refill.assignedToName || 'practice inbox'}`,
    };

    setTimelineMap((prev) => ({
      ...prev,
      [refillId]: [...(prev[refillId] || []), newTimelineEvent],
    }));

    logAudit('SEND_REMINDER', 'REFILL', refillId, 'SUCCESS', {
      recipient: refill.assignedToName || 'Unassigned',
    });

    showToast(`Reminder sent to ${refill.assignedToName || 'assigned staff'}`, 'info');
  };

  const postMessage = (refillId: string, content: string, isInternalNote = false) => {
    if (!content.trim()) return;

    const newMessage: RefillMessage = {
      id: `msg-${Date.now()}`,
      refillId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientOrg: isInternalNote ? currentUser.organizationName : 'All Connected Care Teams',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInternalNote,
      status: 'SENT',
    };

    setMessagesMap((prev) => ({
      ...prev,
      [refillId]: [...(prev[refillId] || []), newMessage],
    }));

    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      refillId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorType: currentUser.organizationType === 'PHARMACY' ? 'PHARMACY' : 'PRACTICE',
      action: isInternalNote ? 'Internal Clinical Note Added' : 'Secure Message Sent',
      result: content.substring(0, 60) + (content.length > 60 ? '...' : ''),
    };

    setTimelineMap((prev) => ({
      ...prev,
      [refillId]: [...(prev[refillId] || []), newTimelineEvent],
    }));

    logAudit('POST_MESSAGE', 'MESSAGE', refillId, 'SUCCESS', {
      isInternal: isInternalNote,
      length: content.length,
    });

    showToast(isInternalNote ? 'Internal note saved' : 'Secure message sent to care team', 'success');
  };

  // Provider Clinical Decision (Human Controlled)
  const recordProviderDecision = (
    refillId: string,
    decision: 'APPROVED' | 'APPROVED_WITH_APPOINTMENT' | 'DENIED' | 'MODIFIED',
    notes: string,
    bridgeDays?: number
  ) => {
    const isApproved = decision === 'APPROVED' || decision === 'APPROVED_WITH_APPOINTMENT';
    const newStatus: RefillStatus = isApproved ? 'RESOLVED' : decision === 'DENIED' ? 'CLOSED' : 'TRIAGED';

    let actionLabel = 'Provider Approved Refill';
    if (decision === 'APPROVED_WITH_APPOINTMENT') {
      actionLabel = `Provider Approved ${bridgeDays || 30}-day bridge (Visit Required)`;
    } else if (decision === 'DENIED') {
      actionLabel = 'Provider Denied Refill (In-person evaluation required)';
    }

    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refillId) {
          return {
            ...r,
            status: newStatus,
            blockerType: isApproved ? 'NONE' : r.blockerType,
            resolutionType: decision,
            resolutionNotes: notes,
            resolvedAt: isApproved ? new Date().toISOString() : undefined,
            waitingHours: 0,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    // Complete associated tasks
    setTasks((prev) =>
      prev.map((t) => (t.refillId === refillId ? { ...t, status: 'COMPLETED' } : t))
    );

    // Add timeline record
    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      refillId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorType: 'PROVIDER',
      action: actionLabel,
      result: `Electronic prescription transmitted via SureScripts to pharmacy. Notes: ${notes}`,
    };

    setTimelineMap((prev) => ({
      ...prev,
      [refillId]: [...(prev[refillId] || []), newTimelineEvent],
    }));

    // Post automated message for pharmacy
    const autoMsg: RefillMessage = {
      id: `msg-${Date.now()}`,
      refillId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientOrg: 'Metro Community Pharmacy',
      content: `CLINICAL RESOLUTION: ${actionLabel}. ${notes}. Transmitted to dispensing system.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInternalNote: false,
      status: 'SENT',
    };

    setMessagesMap((prev) => ({
      ...prev,
      [refillId]: [...(prev[refillId] || []), autoMsg],
    }));

    // Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Refill Request Resolved',
      message: `${actionLabel} for ${refillId}. Patient and pharmacy informed.`,
      refillId,
      type: 'RESOLVED',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    logAudit('PROVIDER_CLINICAL_DECISION', 'REFILL', refillId, 'SUCCESS', {
      decision,
      provider: currentUser.name,
      notes,
    });

    showToast(`Refill ${refillId} marked ${newStatus} (${decision})`, 'success');
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'COMPLETED' } : t))
    );
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      logAudit('COMPLETE_TASK', 'TASK', taskId, 'SUCCESS', { title: task.title });
      showToast(`Task completed: "${task.title}"`, 'success');
    }
  };

  const updateSlaSettings = (newSettings: Partial<SLASettings>) => {
    setSlaSettings((prev) => ({ ...prev, ...newSettings }));
    logAudit('UPDATE_SLA_POLICY', 'SETTINGS', 'SLA_CONFIG', 'SUCCESS', {
      ...newSettings,
    });
    showToast('SLA threshold policies saved', 'success');
  };

  const addNewRefill = (newRefill: Partial<RefillRequest>) => {
    const id = `RF-${Math.floor(10500 + Math.random() * 500)}`;
    const fullRefill: RefillRequest = {
      id,
      patientId: newRefill.patientId || 'pat-1',
      patientName: newRefill.patientName || 'Demo Patient',
      patientDob: newRefill.patientDob || '01/01/1975',
      patientPhone: newRefill.patientPhone || '(555) 555-0199',
      medication: newRefill.medication || {
        id: `med-${Date.now()}`,
        name: 'Atorvastatin',
        dosage: '20 mg oral tablet',
        sig: 'Take 1 tablet daily',
        ndc: '00071-0156-23',
        daysSupply: 90,
        quantity: 90,
        isControlled: false,
      },
      pharmacy: newRefill.pharmacy || DEMO_REFILLS[0].pharmacy,
      practice: newRefill.practice || DEMO_REFILLS[0].practice,
      status: 'NEW',
      blockerType: newRefill.blockerType || 'NO_REFILLS_REMAINING',
      blockerDescription: newRefill.blockerDescription || 'No refills remaining on file; provider approval required.',
      priority: newRefill.priority || 'MEDIUM',
      assignedToId: currentUser.id,
      assignedToName: currentUser.name,
      assignedToRole: currentUser.role,
      nextRequiredAction: 'Triage request and assign provider review',
      waitingHours: 1,
      slaDeadlineHours: 24,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueAt: 'Tomorrow, 9:00 AM',
    };

    setRefills((prev) => [fullRefill, ...prev]);

    const initialEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      refillId: id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorType: currentUser.organizationType === 'PHARMACY' ? 'PHARMACY' : 'PRACTICE',
      action: 'Refill Request Submitted',
      result: `Electronic order received for ${fullRefill.medication.name}`,
    };

    setTimelineMap((prev) => ({
      ...prev,
      [id]: [initialEvent],
    }));

    logAudit('CREATE_REFILL_REQUEST', 'REFILL', id, 'SUCCESS', {
      patient: fullRefill.patientName,
      medication: fullRefill.medication.name,
    });

    showToast(`Refill ${id} successfully logged into queue`, 'success');
    setSelectedRefillId(id);
    setActiveTab('detail');
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleIntegrationErrorSimulation = () => {
    setIsIntegrationErrorSimulated((prev) => {
      const next = !prev;
      setIntegrations((integrationsPrev) =>
        integrationsPrev.map((intg) => {
          if (intg.serviceId === 'int-surescripts') {
            return {
              ...intg,
              status: next ? 'DEGRADED' : 'CONNECTED',
              errorMessage: next ? 'NCPDP SCRIPT gateway timeout: 504 Gateway Timeout' : undefined,
            };
          }
          return intg;
        })
      );
      showToast(
        next
          ? 'Simulating integration warning: SureScripts gateway degraded'
          : 'All external integrations restored to nominal operation',
        next ? 'warning' : 'success'
      );
      return next;
    });
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setRefills(DEMO_REFILLS);
    setTimelineMap(DEMO_TIMELINE);
    setMessagesMap(DEMO_MESSAGES);
    setTasks(DEMO_TASKS);
    setAuditLogs(DEMO_AUDIT_LOG);
    setNotifications(DEMO_NOTIFICATIONS);
    setSlaSettings(DEFAULT_SLA_SETTINGS);
    setCurrentUser(DEMO_USERS[1]);
    setSelectedRefillId('RF-10482');
    setActiveTab('overview');
    showToast('Demo data reset to baseline state', 'info');
  };

  // Run the 3-minute hackathon demo sequence automatically step-by-step
  const runAutomatedHackathonDemo = () => {
    setIsDemoRunning(true);
    showToast('Starting 3-minute Hackathon Demo Scenario: Refill #RF-10482', 'info');
    setSelectedRefillId('RF-10482');
    setActiveTab('detail');

    setTimeout(() => {
      // Step: Switch to provider
      switchRole('PROVIDER');
      showToast('Dr. Priya Patel opened the refill request', 'info');

      setTimeout(() => {
        // Step: Provider approves refill
        recordProviderDecision(
          'RF-10482',
          'APPROVED',
          'Reviewed 6-month BP log (126/82) and metabolic labs. Approved 1-year renewal (90 days x 3 refills). Instructed patient on adherence.'
        );
        setIsDemoRunning(false);
        showToast('Refill #RF-10482 resolved! Pharmacy notified & timeline completed.', 'success');
      }, 3500);
    }, 2500);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <RefillContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: DEMO_USERS,
        currentRole: currentUser.role,
        switchRole,
        activeTab,
        setActiveTab,
        selectedRefillId,
        setSelectedRefillId,
        refills,
        tasks,
        auditLogs,
        notifications,
        slaSettings,
        integrations,
        getRefillById,
        getTimelineForRefill,
        getMessagesForRefill,
        updateRefillStatus,
        assignRefill,
        escalateRefill,
        sendReminder,
        postMessage,
        recordProviderDecision,
        completeTask,
        updateSlaSettings,
        addNewRefill,
        globalSearch,
        setGlobalSearch,
        lastSyncTime,
        isSyncing,
        triggerLiveSync,
        unreadNotificationCount,
        markNotificationsAsRead,
        isIntegrationErrorSimulated,
        toggleIntegrationErrorSimulation,
        resetToDemoData,
        runAutomatedHackathonDemo,
        isDemoRunning,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </RefillContext.Provider>
  );
};

export const useRefillContext = () => {
  const context = useContext(RefillContext);
  if (!context) {
    throw new Error('useRefillContext must be used within a RefillProvider');
  }
  return context;
};
