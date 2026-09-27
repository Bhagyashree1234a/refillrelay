# RxResolve — Healthcare Refill Coordination Platform

RxResolve is an enterprise-grade healthcare refill coordination platform designed to bridge the operational divide between retail pharmacies, ambulatory care practices, attending providers, and patients. It replaces fragmented faxes, phone queues, and disconnected EHR inboxes with a centralized, real-time coordination workspace.

---

## 🚀 Key Highlights & Capabilities

- **Unified Multi-Role Workspace**: Tailored interfaces and permission levels for **Pharmacy Staff**, **Practice Staff / Medical Assistants**, **Providers (MD/DO/NP/PA)**, and **Clinic Administrators**.
- **Real-Time Refill Queue & SLA Engine**: Prioritization based on waiting time, clinical urgency, blocker classifications, and practice SLAs.
- **End-to-End Case Management**: Granular tracking across every stage (`NEW`, `TRIAGED`, `WAITING_FOR_PROVIDER`, `WAITING_FOR_PHARMACY`, `ESCALATED`, `RESOLVED`, `CLOSED`).
- **AI-Powered Operational Assistance (Gemini 3.8 Flash)**:
  - Automated bottleneck analysis and blocker detection.
  - Context-aware administrative response drafting.
  - Multi-event timeline log summarization.
  - *Zero-downtime reliability*: Seamlessly falls back to an integrated deterministic clinical rule engine when offline or unconfigured.
- **Immutable Audit Logging & Compliance**: Complete chronological event history detailing every actor, action, result, and timestamp for HIPAA adherence and quality reviews.
- **Cross-Entity Communication Hub**: Direct threaded messaging between dispensing pharmacy technicians, triage staff, and clinic prescribers.
- **Practice & Patient Directories**: Deep visibility into clinic response metrics, EHR integrations (Epic, AthenaHealth, Cerner, etc.), and patient adherence records.
- **Executive Analytics & Operational Heatmaps**: Granular metrics tracking average resolution time, escalation bottlenecks, volume spikes, and provider response rates.
- **Enterprise Authentication (Sign In & Sign Up)**: Role selection, secure credential handling, "Remember this device" state persistence, and one-click persona switching for testing.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)
- **AI / LLM Integration**: [@google/genai](https://github.com/google/generative-ai-js) (Model: `gemini-3.8-flash`)

---

## 📁 Repository Structure

```text
├── .env.example              # Environment variables template
├── index.html                # Entry HTML template with SEO & OpenGraph tags
├── metadata.json             # Applet metadata, permissions & capabilities
├── package.json              # Dependencies and execution scripts
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite configuration with Tailwind CSS plugin
├── src/
│   ├── main.tsx              # React DOM entry point
│   ├── App.tsx               # Primary application router & layout orchestrator
│   ├── index.css             # Tailwind CSS imports & global design tokens
│   ├── types/
│   │   └── index.ts          # Core domain models (Refills, Users, Patients, Events)
│   ├── context/
│   │   └── RefillContext.tsx # Centralized state management & business logic
│   ├── data/
│   │   └── initialData.ts    # Seed data: refill queue, demo users, practices, patients
│   ├── services/
│   │   ├── aiService.ts      # Gemini 3.8 Flash integration & deterministic rule engine
│   │   └── integrationAdapters.ts # Pharmacy & EHR integration connectors
│   └── components/
│       ├── common/
│       │   └── Logo.tsx      # Platform branding & responsive logo component
│       ├── layout/
│       │   ├── Navbar.tsx    # Header with live sync, alerts, and user menu
│       │   └── Sidebar.tsx   # Primary navigation bar with badge counters
│       ├── modals/
│       │   ├── AuditLogModal.tsx      # Comprehensive event history dialog
│       │   ├── NewRefillModal.tsx     # Refill request intake & creation form
│       │   └── ResolutionModal.tsx    # Clinician renewal/denial confirmation modal
│       └── views/
│           ├── AnalyticsView.tsx      # Performance metrics & SLA dashboards
│           ├── AuditLogView.tsx       # System-wide audit event ledger
│           ├── DashboardView.tsx      # Clinical operations overview & KPI cards
│           ├── EscalationsView.tsx    # Critical bottleneck & urgent blocker queue
│           ├── LandingPageView.tsx    # Platform overview, features & workflows
│           ├── LoginView.tsx          # Dual-tab Sign In & Sign Up authentication view
│           ├── MyTasksView.tsx        # Filtered workload assigned to current user
│           ├── PatientsView.tsx       # Searchable patient directory & history
│           ├── PracticesView.tsx      # Clinic directory with EHR statuses & metrics
│           ├── RefillDetailView.tsx   # Detailed refill workspace with timeline & chat
│           ├── RefillQueueView.tsx    # Multi-filter interactive refill queue table
│           └── SettingsView.tsx       # Organization profile & notification settings
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version `18.0.0` or higher)
- [npm](https://www.npmjs.com/) (version `9.0.0` or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rxresolve
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Configure `GEMINI_API_KEY` for live generative responses. If omitted, the built-in deterministic clinical rule engine automatically powers all triage and message-drafting capabilities.

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port `3000` |
| `npm run build` | Compiles and builds production-ready static assets in `dist/` |
| `npm run preview` | Locally serves the production build for testing |
| `npm run lint` | Runs TypeScript type checking via `tsc --noEmit` |
| `npm run clean` | Cleans previous build artifacts and compiled assets |

---

## 👥 Personas & Role-Based Access Control

RxResolve includes built-in persona switching to test clinical workflows across different perspectives:

1. **Elena Rostova, CPhT** (*Pharmacy Staff* — Metro Health Pharmacy)
   - Focused on submitting new refill requests, clarifying prescriptions, and tracking dispensed medications.
2. **Marcus Chen, MA** (*Practice Staff / Clinical Triage* — Northside Family Medicine)
   - Manages incoming requests, checks laboratory results, resolves chart discrepancies, and prepares renewals for physician approval.
3. **Dr. Sarah Jenkins, MD** (*Attending Physician / Prescriber* — Northside Family Medicine)
   - Authorized clinician who signs off on prescription renewals, adjusts dosages, issues emergency bridge supplies, or schedules patient visits.
4. **David Miller, MHA** (*Practice Administrator* — Summit Medical Network)
   - Oversees turnaround SLAs, clinic compliance, integration statuses, and audit trails.

---

## 🔒 Clinical Safety & Architectural Guardrails

- **Assistive Workflow Automation**: RxResolve’s AI and triage services assist with operational classification, administrative communications, and queue management.
- **Clinician in the Loop**: Prescription approvals, denials, changes, and electronic signatures always require affirmative licensed clinician action.
- **Simulated Privacy Safeguards**: Patient identifiers in the demo dataset are de-identified and simulated for training, validation, and testing environments.

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.
