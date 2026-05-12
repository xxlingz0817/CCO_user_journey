export type Branch = "web" | "app";
export type Role = "advertiser" | "technical" | "internal";
export type Severity = "high" | "medium" | "low";

export interface PainPoint {
  role: Role;
  text: string;
  severity: Severity;
}

export interface DesignOpportunity {
  title: string;
  description: string;
}

export interface JourneyNode {
  id: string;
  title: string;
  branch: Branch[];
  stage: string;
  shortDescription: string;
  roles: Role[];
  painPoints: PainPoint[];
  designOpportunities: DesignOpportunity[];
  dependencies: string[];
  openQuestions: string[];
}

export interface JourneyEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

// ─── WEB CCO NODES ───────────────────────────────────────────────────────────

const webNodes: JourneyNode[] = [
  {
    id: "web-signal-source",
    title: "Connect Signal Source",
    branch: ["web"],
    stage: "Setup",
    shortDescription:
      "Advertiser connects a Pixel or Events API as the signal source for web conversion tracking.",
    roles: ["advertiser", "technical"],
    painPoints: [
      {
        role: "advertiser",
        text: "Unclear which signal source (Pixel vs Events API) is the right choice for my business.",
        severity: "medium",
      },
      {
        role: "technical",
        text: "Pixel installation is error-prone; no inline validation during setup.",
        severity: "high",
      },
      {
        role: "technical",
        text: "Events API requires server-side infrastructure that many advertisers lack.",
        severity: "medium",
      },
    ],
    designOpportunities: [
      {
        title: "Signal source recommendation",
        description:
          "Guide advertisers to the right source type based on their tech stack and goals.",
      },
      {
        title: "Inline health check",
        description:
          "Show real-time signal status immediately after connection so issues surface early.",
      },
    ],
    dependencies: [],
    openQuestions: [
      "Do advertisers understand the difference between Pixel and Events API?",
      "Can we auto-detect which source type is already active?",
    ],
  },
  {
    id: "web-event-setup",
    title: "Set Up Web Events",
    branch: ["web"],
    stage: "Setup",
    shortDescription:
      "Define and verify the web events (e.g. Purchase, AddToCart) that will be tracked by the Pixel or Events API.",
    roles: ["technical", "advertiser"],
    painPoints: [
      {
        role: "technical",
        text: "Event parameter mapping is complex; easy to miss required fields like currency or value.",
        severity: "high",
      },
      {
        role: "advertiser",
        text: "Hard to tell whether events are actually firing correctly without deep debugging.",
        severity: "high",
      },
      {
        role: "internal",
        text: "Support tickets often stem from missing event parameters that aren't surfaced until campaign launch.",
        severity: "medium",
      },
    ],
    designOpportunities: [
      {
        title: "Event parameter checklist",
        description:
          "Show which required and recommended parameters are present vs missing for each event.",
      },
      {
        title: "Test event flow",
        description:
          "Let advertisers fire a test event and see confirmation in the UI within seconds.",
      },
    ],
    dependencies: ["web-signal-source"],
    openQuestions: [
      "What is the minimum viable event setup for CCO eligibility?",
      "Which parameters are strictly required vs recommended for optimization?",
    ],
  },
  {
    id: "web-cco-creation",
    title: "Create Custom Conversion",
    branch: ["web"],
    stage: "CCO Creation",
    shortDescription:
      "Advertiser defines a custom conversion by naming it, selecting the event, and setting rule conditions.",
    roles: ["advertiser"],
    painPoints: [
      {
        role: "advertiser",
        text: "Unclear what makes a 'good' custom conversion definition vs a redundant one.",
        severity: "medium",
      },
      {
        role: "advertiser",
        text: "No preview of how many recent events would match the rule before saving.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "Rule preview / match count",
        description:
          "Show an estimated count of matching events from the past 7–30 days so advertisers can validate their rule before saving.",
      },
      {
        title: "Naming guidance",
        description:
          "Suggest a clear naming convention so CCOs remain organized across campaigns.",
      },
    ],
    dependencies: ["web-event-setup"],
    openQuestions: [
      "Can advertisers edit a CCO after campaigns have used it?",
      "Is there a limit on the number of CCOs per advertiser account?",
    ],
  },
  {
    id: "web-rule-config",
    title: "Configure CCO Rules",
    branch: ["web"],
    stage: "CCO Creation",
    shortDescription:
      "Set filter conditions on the custom conversion: event type, URL match, parameter values, etc.",
    roles: ["advertiser", "technical"],
    painPoints: [
      {
        role: "advertiser",
        text: "Rule builder logic (AND/OR conditions) is confusing for non-technical users.",
        severity: "high",
      },
      {
        role: "technical",
        text: "URL match patterns are brittle; small typos cause silent failures.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "Plain-language rule summary",
        description:
          "Auto-generate a human-readable summary of the configured rule alongside the technical definition.",
      },
      {
        title: "URL pattern tester",
        description:
          "Let users input a sample URL and see whether it matches the current rule in real time.",
      },
    ],
    dependencies: ["web-cco-creation"],
    openQuestions: [
      "What parameter types can be used in CCO rules for web?",
      "How does rule evaluation interact with deduplication logic?",
    ],
  },
  {
    id: "web-eligibility",
    title: "Eligibility & Readiness Check",
    branch: ["web"],
    stage: "Validation",
    shortDescription:
      "System validates that the CCO has received enough signal data to be eligible for campaign optimization.",
    roles: ["advertiser", "internal"],
    painPoints: [
      {
        role: "advertiser",
        text: "Eligibility criteria are opaque; advertisers don't know why a CCO is 'not ready'.",
        severity: "high",
      },
      {
        role: "internal",
        text: "PSO teams need hidden system state (event count, recency, dedup status) to diagnose issues.",
        severity: "medium",
      },
    ],
    designOpportunities: [
      {
        title: "Readiness progress indicator",
        description:
          "Show a visual progress bar or checklist of eligibility criteria with current status.",
      },
      {
        title: "Actionable error states",
        description:
          "When not eligible, explain exactly which criterion is failing and what action to take.",
      },
    ],
    dependencies: ["web-rule-config"],
    openQuestions: [
      "What is the minimum event volume threshold for eligibility?",
      "Does eligibility reset when rules are changed?",
    ],
  },
  {
    id: "web-ads-handoff",
    title: "Use CCO in Campaign",
    branch: ["web"],
    stage: "Activation",
    shortDescription:
      "Advertiser selects the ready CCO as the optimization goal when creating or editing a campaign in Ads Manager.",
    roles: ["advertiser"],
    painPoints: [
      {
        role: "advertiser",
        text: "CCO options appear in campaign setup without clear context on readiness state.",
        severity: "medium",
      },
      {
        role: "advertiser",
        text: "No obvious path back to fix a CCO that fails eligibility check during campaign creation.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "CCO status badge in Ads Manager",
        description:
          "Show 'Ready' / 'Not Ready' status inline when selecting a CCO as a campaign goal.",
      },
      {
        title: "Deep-link to fix flow",
        description:
          "When a CCO is not ready, provide a direct link to the specific issue in the Events Manager.",
      },
    ],
    dependencies: ["web-eligibility"],
    openQuestions: [
      "Who owns the CCO selection UI in Ads Manager — Signal design or Campaign design?",
      "Can an advertiser save a draft campaign with a not-ready CCO?",
    ],
  },
  {
    id: "web-diagnosis",
    title: "Diagnose Issues",
    branch: ["web"],
    stage: "Support",
    shortDescription:
      "Advertiser or PSO troubleshoots why a CCO is not working: missing events, rule mismatches, eligibility failures.",
    roles: ["advertiser", "internal"],
    painPoints: [
      {
        role: "advertiser",
        text: "Diagnosis tools are scattered across Events Manager, Ads Manager, and support channels.",
        severity: "high",
      },
      {
        role: "internal",
        text: "No single view showing event health + CCO rule state + eligibility status together.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "Unified CCO health panel",
        description:
          "Single view combining signal health, rule status, and eligibility in one place.",
      },
      {
        title: "Step-by-step diagnosis wizard",
        description:
          "Guide the user through a structured checklist to isolate the root cause.",
      },
    ],
    dependencies: ["web-ads-handoff"],
    openQuestions: [
      "What data does PSO currently need that is not surfaced in the UI?",
      "Should diagnosis be self-serve or require internal tool access?",
    ],
  },
];

// ─── APP CCO NODES ────────────────────────────────────────────────────────────

const appNodes: JourneyNode[] = [
  {
    id: "app-app-id",
    title: "Connect App ID",
    branch: ["app"],
    stage: "Setup",
    shortDescription:
      "Advertiser registers and connects their mobile app (App ID) as the signal source for App CCO.",
    roles: ["advertiser", "technical"],
    painPoints: [
      {
        role: "advertiser",
        text: "App ID concept is confusing; advertisers don't always know where to find it.",
        severity: "medium",
      },
      {
        role: "technical",
        text: "App eligibility requirements (e.g. minimum installs, store listing status) are not documented clearly.",
        severity: "high",
      },
      {
        role: "internal",
        text: "App allowlist status is a hidden gate that blocks setup without a visible error.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "App eligibility pre-check",
        description:
          "Before the advertiser starts setup, surface whether their App ID meets minimum requirements.",
      },
      {
        title: "Allowlist status visibility",
        description:
          "Show internal eligibility gates (with appropriate permissions) so PSO can diagnose blockers.",
      },
    ],
    dependencies: [],
    openQuestions: [
      "What are the exact eligibility requirements for App CCO?",
      "Is the allowlist manual or automatic?",
    ],
  },
  {
    id: "app-sdk-mmp",
    title: "Set Up SDK / MMP",
    branch: ["app"],
    stage: "Setup",
    shortDescription:
      "Technical implementer integrates TikTok SDK or connects an MMP (Mobile Measurement Partner) to send app events.",
    roles: ["technical"],
    painPoints: [
      {
        role: "technical",
        text: "SDK integration varies significantly across iOS, Android, and hybrid frameworks.",
        severity: "high",
      },
      {
        role: "technical",
        text: "MMP event mapping to TikTok standard events is often incomplete or incorrect.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "Integration guide selector",
        description:
          "Let the user select their platform (iOS / Android / Unity / React Native) and MMP to get a tailored integration guide.",
      },
      {
        title: "MMP event mapping validator",
        description:
          "Show which MMP events map to TikTok standard events and flag unmapped events.",
      },
    ],
    dependencies: ["app-app-id"],
    openQuestions: [
      "Which MMPs are officially supported for App CCO?",
      "How does deduplication work between SDK and MMP sources?",
    ],
  },
  {
    id: "app-event-setup",
    title: "Set Up App Events",
    branch: ["app"],
    stage: "Setup",
    shortDescription:
      "Define and verify app events (e.g. Purchase, LaunchApp) that will be used for custom conversion rules.",
    roles: ["technical", "advertiser"],
    painPoints: [
      {
        role: "technical",
        text: "App events have different parameter requirements than web events; easy to confuse the two.",
        severity: "medium",
      },
      {
        role: "advertiser",
        text: "No clear way to confirm that app events are being received without triggering real installs.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "Sandbox test mode",
        description:
          "Allow sending test events from a dev build to verify receipt before going live.",
      },
      {
        title: "Event comparison: web vs app",
        description:
          "Side-by-side view showing which events are set up for web vs app to help advertisers running both.",
      },
    ],
    dependencies: ["app-sdk-mmp"],
    openQuestions: [
      "Can App CCO use the same event taxonomy as web CCO?",
      "Are in-app purchase events treated differently for eligibility?",
    ],
  },
  {
    id: "app-cco-creation",
    title: "Create Custom Conversion",
    branch: ["app"],
    stage: "CCO Creation",
    shortDescription:
      "Advertiser defines a custom conversion for app — selecting the app event and setting rule conditions.",
    roles: ["advertiser"],
    painPoints: [
      {
        role: "advertiser",
        text: "App CCO and Web CCO creation UIs look the same but have different available parameters.",
        severity: "medium",
      },
      {
        role: "advertiser",
        text: "Unclear how app-specific attributes (e.g. country, OS version) can be used in rules.",
        severity: "medium",
      },
    ],
    designOpportunities: [
      {
        title: "Context-aware rule builder",
        description:
          "Dynamically show only the parameters available for the selected signal source (web vs app).",
      },
      {
        title: "App-specific rule examples",
        description:
          "Provide templates for common app CCO use cases (e.g. re-engagement, high-value purchase).",
      },
    ],
    dependencies: ["app-event-setup"],
    openQuestions: [
      "What app-specific parameters can be used in CCO rules?",
      "Is there a separate CCO creation entry point for app vs web?",
    ],
  },
  {
    id: "app-rule-config",
    title: "Configure CCO Rules",
    branch: ["app"],
    stage: "CCO Creation",
    shortDescription:
      "Set filter conditions on the app custom conversion using app event parameters and attributes.",
    roles: ["advertiser", "technical"],
    painPoints: [
      {
        role: "technical",
        text: "Parameter names in the rule builder don't always match the SDK parameter names.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "Parameter name mapping",
        description:
          "Show the SDK/MMP parameter name alongside the UI label so technical users can map them easily.",
      },
    ],
    dependencies: ["app-cco-creation"],
    openQuestions: [
      "Are rule conditions evaluated server-side or at attribution time?",
    ],
  },
  {
    id: "app-eligibility",
    title: "Eligibility & Readiness Check",
    branch: ["app"],
    stage: "Validation",
    shortDescription:
      "System validates that the App CCO has received sufficient event volume and meets app-specific eligibility gates.",
    roles: ["advertiser", "internal"],
    painPoints: [
      {
        role: "advertiser",
        text: "App eligibility can be blocked by store-level issues (e.g. app not published) that are outside the advertiser's immediate control.",
        severity: "high",
      },
      {
        role: "internal",
        text: "App-specific gates like allowlist and OS compatibility are not visible to advertisers.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "App-specific eligibility checklist",
        description:
          "Show app store status, allowlist status, and event volume as distinct checklist items.",
      },
    ],
    dependencies: ["app-rule-config"],
    openQuestions: [
      "Are app eligibility thresholds different from web thresholds?",
      "How does iOS ATT consent affect event volume and eligibility?",
    ],
  },
  {
    id: "app-ads-handoff",
    title: "Use CCO in Campaign",
    branch: ["app"],
    stage: "Activation",
    shortDescription:
      "Advertiser selects the App CCO as the optimization goal in Ads Manager for an app campaign.",
    roles: ["advertiser"],
    painPoints: [
      {
        role: "advertiser",
        text: "Web and App CCOs appear mixed in the dropdown; no clear visual separation.",
        severity: "medium",
      },
    ],
    designOpportunities: [
      {
        title: "CCO type labeling",
        description:
          "Clearly label each CCO as 'Web' or 'App' in the Ads Manager selection list.",
      },
    ],
    dependencies: ["app-eligibility"],
    openQuestions: [
      "Can an App CCO be used with a web-destination campaign or vice versa?",
    ],
  },
  {
    id: "app-diagnosis",
    title: "Diagnose Issues",
    branch: ["app"],
    stage: "Support",
    shortDescription:
      "Advertiser or PSO troubleshoots App CCO issues: SDK not firing, MMP misconfiguration, low event volume, eligibility failures.",
    roles: ["advertiser", "internal"],
    painPoints: [
      {
        role: "internal",
        text: "App issues often require checking both SDK logs and MMP dashboards — there is no unified view.",
        severity: "high",
      },
      {
        role: "advertiser",
        text: "Self-serve diagnosis for app is even harder than web; advertisers escalate to support faster.",
        severity: "high",
      },
    ],
    designOpportunities: [
      {
        title: "SDK / MMP health summary",
        description:
          "Show last event received timestamp and source (SDK vs MMP) to help narrow down the issue.",
      },
      {
        title: "iOS ATT guidance",
        description:
          "Surface ATT consent impact on event volume as a distinct, explained factor in diagnosis.",
      },
    ],
    dependencies: ["app-ads-handoff"],
    openQuestions: [
      "Can we surface SKAdNetwork attribution data alongside standard event data?",
      "What MMP-specific data can we ingest to aid diagnosis?",
    ],
  },
];

// ─── EDGES ────────────────────────────────────────────────────────────────────

export const webEdges: JourneyEdge[] = [
  { id: "we1", source: "web-signal-source", target: "web-event-setup" },
  { id: "we2", source: "web-event-setup", target: "web-cco-creation" },
  { id: "we3", source: "web-cco-creation", target: "web-rule-config" },
  { id: "we4", source: "web-rule-config", target: "web-eligibility" },
  { id: "we5", source: "web-eligibility", target: "web-ads-handoff" },
  { id: "we6", source: "web-ads-handoff", target: "web-diagnosis", label: "issue found" },
];

export const appEdges: JourneyEdge[] = [
  { id: "ae1", source: "app-app-id", target: "app-sdk-mmp" },
  { id: "ae2", source: "app-sdk-mmp", target: "app-event-setup" },
  { id: "ae3", source: "app-event-setup", target: "app-cco-creation" },
  { id: "ae4", source: "app-cco-creation", target: "app-rule-config" },
  { id: "ae5", source: "app-rule-config", target: "app-eligibility" },
  { id: "ae6", source: "app-eligibility", target: "app-ads-handoff" },
  { id: "ae7", source: "app-ads-handoff", target: "app-diagnosis", label: "issue found" },
];

export const allNodes: JourneyNode[] = [...webNodes, ...appNodes];
export const allEdges: JourneyEdge[] = [...webEdges, ...appEdges];
