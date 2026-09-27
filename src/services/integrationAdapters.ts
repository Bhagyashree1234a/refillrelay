export interface IntegrationStatus {
  serviceId: string;
  name: string;
  protocol: string;
  status: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED';
  lastPing: string;
  latencyMs: number;
  totalTransmissionsToday: number;
  failureRate: number;
  errorMessage?: string;
}

export const INITIAL_INTEGRATIONS: IntegrationStatus[] = [
  {
    serviceId: 'int-surescripts',
    name: 'SureScripts NCPDP SCRIPT Network',
    protocol: 'NCPDP SCRIPT Standard v2017071 / TLS 1.3',
    status: 'CONNECTED',
    lastPing: 'Just now',
    latencyMs: 142,
    totalTransmissionsToday: 842,
    failureRate: 0.1,
  },
  {
    serviceId: 'int-epic',
    name: 'Epic Hyperspace FHIR R4 Bridge',
    protocol: 'HL7 FHIR Release 4 RESTful API',
    status: 'CONNECTED',
    lastPing: '30s ago',
    latencyMs: 88,
    totalTransmissionsToday: 620,
    failureRate: 0.0,
  },
  {
    serviceId: 'int-athena',
    name: 'AthenaHealth Partner Platform',
    protocol: 'REST JSON / OAuth 2.0 Webhooks',
    status: 'CONNECTED',
    lastPing: '1m ago',
    latencyMs: 110,
    totalTransmissionsToday: 315,
    failureRate: 0.2,
  },
  {
    serviceId: 'int-direct-msg',
    name: 'Direct Secure Messaging (DirectTrust)',
    protocol: 'SMIME / Direct Project RFC-5322',
    status: 'CONNECTED',
    lastPing: '2m ago',
    latencyMs: 195,
    totalTransmissionsToday: 419,
    failureRate: 0.0,
  },
];

export class PharmacyAdapter {
  static async transmitRefillRenewal(refillId: string, medicationName: string): Promise<{ success: boolean; transactionId: string; timestamp: string }> {
    // Simulated NCPDP transmission
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      transactionId: `TX-NCPDP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  static async verifyFulfillment(refillId: string): Promise<{ dispensed: boolean; rxNumber: string }> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      dispensed: true,
      rxNumber: `RX-6849-${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }
}

export class PracticeEhrAdapter {
  static async syncChartNotes(patientId: string): Promise<{ ehrUpdated: boolean; lastVitalsCheck: string }> {
    await new Promise((r) => setTimeout(r, 500));
    return {
      ehrUpdated: true,
      lastVitalsCheck: '05/18/2026 (BP: 124/80 mmHg, HR: 68 bpm)',
    };
  }

  static async recordProviderDecision(
    refillId: string,
    providerNpi: string,
    decision: string
  ): Promise<{ loggedInEhr: boolean; auditSignature: string }> {
    await new Promise((r) => setTimeout(r, 700));
    return {
      loggedInEhr: true,
      auditSignature: `SIG-EPIC-${Date.now().toString(36).toUpperCase()}`,
    };
  }
}
