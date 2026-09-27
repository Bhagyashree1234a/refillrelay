export type Role = 'PHARMACY_STAFF' | 'PRACTICE_STAFF' | 'PROVIDER' | 'ADMIN';

export type RefillStatus = 
  | 'NEW'
  | 'TRIAGED'
  | 'WAITING_FOR_PHARMACY'
  | 'WAITING_FOR_PRACTICE'
  | 'WAITING_FOR_PROVIDER'
  | 'WAITING_FOR_PATIENT'
  | 'WAITING_FOR_INSURANCE'
  | 'ACTION_REQUIRED'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type BlockerType = 
  | 'NO_REFILLS_REMAINING'
  | 'PROVIDER_APPROVAL_REQUIRED'
  | 'MISSING_INFORMATION'
  | 'PATIENT_VISIT_REQUIRED'
  | 'INSURANCE_PRIOR_AUTH'
  | 'PHARMACY_CLARIFICATION'
  | 'LAB_WORK_NEEDED'
  | 'DOSAGE_VERIFICATION'
  | 'NONE';

export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
  organizationName: string;
  organizationType: 'PHARMACY' | 'PRACTICE' | 'HEALTH_SYSTEM';
  title: string;
  avatarInitials: string;
}

export interface Patient {
  id: string;
  name: string; // Fictional e.g. Michael R.
  dob: string;
  mrn: string;
  phone: string;
  preferredPharmacyId: string;
  practiceId: string;
  activeRefillCount: number;
  lastContact: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  sig: string; // Directions e.g. "Take 1 tablet daily"
  ndc: string;
  daysSupply: number;
  quantity: number;
  isControlled: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  npi: string;
  phone: string;
  fax: string;
  address: string;
  system: string; // e.g. "EnterpriseRx / PioneerRx"
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
}

export interface Practice {
  id: string;
  name: string;
  phone: string;
  ehrSystem: string; // e.g. "Epic Hyperspace", "AthenaHealth"
  openRefills: number;
  waitingRefills: number;
  escalatedRefills: number;
  avgResolutionHours: number;
  leadPhysician: string;
}

export interface TimelineEvent {
  id: string;
  refillId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorType: 'PHARMACY' | 'PRACTICE' | 'PROVIDER' | 'SYSTEM' | 'PATIENT';
  action: string;
  result: string;
  details?: string;
}

export interface RefillMessage {
  id: string;
  refillId: string;
  senderId: string;
  senderName: string;
  senderRole: Role | 'SYSTEM';
  recipientOrg: string;
  content: string;
  timestamp: string;
  isInternalNote: boolean;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export interface Task {
  id: string;
  refillId: string;
  patientName: string;
  medicationName: string;
  title: string;
  assignedToId: string;
  assignedToName: string;
  assignedToRole: Role;
  priority: Priority;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED';
  createdAt: string;
}

export interface RefillRequest {
  id: string; // e.g. "RF-10482"
  patientId: string;
  patientName: string;
  patientDob: string;
  patientPhone: string;
  medication: Medication;
  pharmacy: Pharmacy;
  practice: Practice;
  status: RefillStatus;
  blockerType: BlockerType;
  blockerDescription: string;
  priority: Priority;
  assignedToId?: string;
  assignedToName?: string;
  assignedToRole?: Role;
  nextRequiredAction: string;
  waitingHours: number;
  slaDeadlineHours: number;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  resolutionType?: 'APPROVED' | 'APPROVED_WITH_APPOINTMENT' | 'DENIED' | 'MODIFIED';
  aiSuggestion?: {
    detectedBlocker: string;
    confidence: number;
    reason: string;
    suggestedNextAction: string;
    draftedMessage: string;
    isDismissed?: boolean;
    isAccepted?: boolean;
  };
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: Role;
  organizationId: string;
  organizationName: string;
  action: string;
  resourceType: 'REFILL' | 'TASK' | 'MESSAGE' | 'SETTINGS' | 'INTEGRATION';
  resourceId: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILURE';
  metadata?: Record<string, string | number | boolean>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  refillId?: string;
  type: 'ASSIGNMENT' | 'SLA_WARNING' | 'OVERDUE' | 'PROVIDER_REVIEWED' | 'RESOLVED' | 'SYSTEM';
  timestamp: string;
  read: boolean;
}

export interface SLASettings {
  providerReviewHours: number;
  practiceResponseHours: number;
  pharmacyClarificationHours: number;
  patientContactHours: number;
  autoEscalateOverdue: boolean;
  notifyApproachingSlaMinutes: number;
}
