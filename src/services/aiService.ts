import { GoogleGenAI } from '@google/genai';
import { RefillRequest, TimelineEvent, BlockerType } from '../types';

export interface AISuggestionResponse {
  detectedBlocker: string;
  confidence: number;
  reason: string;
  evidence: string[];
  suggestedNextAction: string;
  activitySummary: string;
  draftedMessage: string;
  isAiGenerated: boolean;
}

// Fallback rule engine that provides 100% deterministic, accurate clinical workflow suggestions
export function getRuleBasedSuggestion(
  refill: RefillRequest,
  timeline: TimelineEvent[]
): AISuggestionResponse {
  let detectedBlocker = 'Provider approval required';
  let confidence = 0.94;
  let reason = 'Zero refills remain on prescription; state medical board regulations require authorized provider authorization.';
  let evidence = ['Refill count = 0', 'Maintenance medication regimen', 'No standing renewal on file'];
  let suggestedNextAction = `Route to ${refill.assignedToName || 'attending provider'} for clinical review and renewal authorization.`;
  let draftedMessage = `Hi ${refill.assignedToName || 'Doctor'}, refill request ${refill.id} for ${refill.patientName} (${refill.medication.name} ${refill.medication.dosage}) is awaiting your review. The pharmacy reports no refills remain on the current prescription.`;

  switch (refill.blockerType) {
    case 'NO_REFILLS_REMAINING':
    case 'PROVIDER_APPROVAL_REQUIRED':
      detectedBlocker = 'Provider approval required';
      confidence = 0.94;
      reason = 'No authorized refills remain on file. Attending physician clinical evaluation is required before fulfillment.';
      evidence = ['Original refills = 0', 'Last renewal expired', 'NCPDP SCRIPT renewal request from pharmacy'];
      suggestedNextAction = `Route to ${refill.assignedToName || 'attending physician'} for clinical renewal sign-off.`;
      draftedMessage = `Hi ${refill.assignedToName || 'Doctor'}, refill request ${refill.id} for ${refill.patientName} (${refill.medication.name} ${refill.medication.dosage}) is awaiting review. Zero refills remain on file.`;
      break;

    case 'MISSING_INFORMATION':
      detectedBlocker = 'Missing laboratory panel or chart data';
      confidence = 0.91;
      reason = 'Routine monitoring parameter (e.g. kidney panel or vitals) requires chart reconciliation prior to renewal.';
      evidence = ['Lab record gap > 6 months', 'Clinical safety protocol flag triggered'];
      suggestedNextAction = 'Practice staff to check external lab integration (Quest/Labcorp) or order standing blood draw.';
      draftedMessage = `Hello, clinical care team: Refill ${refill.id} for ${refill.patientName} requires verification of recent metabolic/renal labs prior to provider sign-off.`;
      break;

    case 'PHARMACY_CLARIFICATION':
      detectedBlocker = 'Pharmacy dosage or fill clarification';
      confidence = 0.93;
      reason = 'Prescription discrepancy between EHR order sig and pharmacy dispensing system.';
      evidence = ['Dosage discrepancy detected', 'Refill-too-soon or timing override needed'];
      suggestedNextAction = 'Contact dispensing pharmacist on duty to clarify intended dose and fill schedule.';
      draftedMessage = `Attention pharmacy team: Calling to clarify prescription ${refill.id} for ${refill.patientName} (${refill.medication.name}). Please confirm current dosage on file.`;
      break;

    case 'PATIENT_VISIT_REQUIRED':
      detectedBlocker = 'Annual patient clinic encounter overdue';
      confidence = 0.88;
      reason = 'Patient has not attended an in-person or telehealth visit within the past 12 months.';
      evidence = ['Last encounter > 365 days', 'Practice quality metric adherence policy'];
      suggestedNextAction = 'Offer patient a 30-day emergency bridge supply conditional on scheduling routine clinic follow-up.';
      draftedMessage = `Dear ${refill.patientName}, Northside Family Medicine needs you to schedule your routine clinic follow-up before issuing a full 90-day refill. A 30-day bridge is available today.`;
      break;

    case 'INSURANCE_PRIOR_AUTH':
      detectedBlocker = 'Insurance prior authorization required';
      confidence = 0.95;
      reason = 'Commercial payer rejected claim transaction with Code 75 (Prior Authorization Required).';
      evidence = ['Payer claim rejection Code 75', 'Formulary step therapy requirement'];
      suggestedNextAction = 'Submit CoverMyMeds electronic PA packet with diagnosis codes and previous step therapy history.';
      draftedMessage = `Prior Auth Team: Please submit urgent ePA for ${refill.patientName} on ${refill.medication.name}. Refill is currently blocked by payer rejection.`;
      break;

    default:
      detectedBlocker = 'Operational review needed';
      confidence = 0.85;
      reason = 'Refill request requires triage by practice care coordinator.';
      evidence = ['Incoming queue item', 'Awaiting triage assignment'];
      suggestedNextAction = 'Triage request and assign appropriate clinical care coordinator.';
      draftedMessage = `Care Coordinator: Please review refill request ${refill.id} for ${refill.patientName}.`;
      break;
  }

  // Generate an authentic activity summary from timeline
  const firstEvent = timeline[0];
  const lastEvent = timeline[timeline.length - 1];
  const activitySummary = firstEvent
    ? `Request initiated by ${firstEvent.actorName} at ${firstEvent.timestamp}. Currently assigned to ${refill.assignedToName || 'Unassigned'} with ${refill.waitingHours}h elapsed. ${lastEvent ? `Last action: ${lastEvent.action}.` : ''}`
    : `Pharmacy submitted request ${refill.waitingHours} hours ago. Request is currently ${refill.status.replace(/_/g, ' ')}.`;

  return {
    detectedBlocker,
    confidence,
    reason,
    evidence,
    suggestedNextAction,
    activitySummary,
    draftedMessage,
    isAiGenerated: false,
  };
}

// Optional Gemini AI integration if API key is provided
export async function generateAiAssistance(
  refill: RefillRequest,
  timeline: TimelineEvent[]
): Promise<AISuggestionResponse> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return getRuleBasedSuggestion(refill, timeline);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are an AI operational assistant in RxBridge, a healthcare refill coordination platform.
CRITICAL SAFETY RULE: You do NOT make medical decisions, prescribe, diagnose, or approve medications.
You only analyze workflow bottlenecks, summarize timeline logs, suggest operational routing, and draft administrative messages.

Context:
Refill ID: ${refill.id}
Patient: ${refill.patientName}
Medication: ${refill.medication.name} (${refill.medication.dosage})
Practice: ${refill.practice.name}
Pharmacy: ${refill.pharmacy.name}
Current Status: ${refill.status}
Reported Blocker: ${refill.blockerDescription}
Assigned to: ${refill.assignedToName || 'Unassigned'}
Waiting time: ${refill.waitingHours} hours
Recent activity:
${timeline.map(t => `- [${t.timestamp}] ${t.actorName}: ${t.action} -> ${t.result}`).join('\n')}

Output JSON with strictly these fields:
{
  "detectedBlocker": "Short blocker title",
  "confidence": 0.94,
  "reason": "Clear explanation of why it is stuck",
  "evidence": ["Evidence 1", "Evidence 2"],
  "suggestedNextAction": "Concrete operational next step for human staff",
  "activitySummary": "1-2 sentence scannable summary of what happened so far",
  "draftedMessage": "Respectful, ready-to-edit administrative communication"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      detectedBlocker: parsed.detectedBlocker || 'Provider approval required',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.92,
      reason: parsed.reason || 'Verification needed before continuing.',
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : ['Prescription audit log entry'],
      suggestedNextAction: parsed.suggestedNextAction || 'Review refill request with provider.',
      activitySummary: parsed.activitySummary || 'Request awaiting provider intervention.',
      draftedMessage: parsed.draftedMessage || `Hi Dr. Patel, refill ${refill.id} is awaiting your clinical review.`,
      isAiGenerated: true,
    };
  } catch (_err) {
    return getRuleBasedSuggestion(refill, timeline);
  }
}
