export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isPopular?: boolean;
}

export interface FaqCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  itemCount: number;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Overview of RootCause AI, core concepts, and creating your first incident investigation.',
    iconName: 'Rocket',
    itemCount: 5,
  },
  {
    id: 'ai-investigation',
    name: 'AI-Powered Investigation',
    description: 'The 4-agent multi-agent workflow, agent roles, reasoning, and autonomous capabilities.',
    iconName: 'Bot',
    itemCount: 7,
  },
  {
    id: 'rag-knowledge',
    name: 'RAG & Knowledge Base',
    description: 'Retrieval-Augmented Generation, pgvector semantic search, full-text search, and runbooks.',
    iconName: 'Database',
    itemCount: 6,
  },
  {
    id: 'investigation-results',
    name: 'Investigation Results',
    description: 'Interpreting root causes, confidence scores, evidence, recommendations, and re-running.',
    iconName: 'FileCheck',
    itemCount: 7,
  },
  {
    id: 'agent-observability',
    name: 'Agent Execution & Observability',
    description: 'Multi-agent orchestration, tool calls, live traces, latency breakdowns, and failure recovery.',
    iconName: 'Activity',
    itemCount: 7,
  },
  {
    id: 'analytics-troubleshooting',
    name: 'Analytics & Troubleshooting',
    description: 'Performance monitoring, failure reasons, addressing low confidence, and system health.',
    iconName: 'LifeBuoy',
    itemCount: 6,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  // ─── CATEGORY 1: Getting Started ─────────────────────────────────────
  {
    id: 'gs-1',
    category: 'getting-started',
    question: 'What is RootCause AI?',
    answer:
      'RootCause AI is an enterprise-grade Agentic AI Incident Investigation platform designed for Site Reliability Engineers (SREs), DevOps practitioners, and backend developers. It automates post-incident triage and root cause analysis by orchestrating four specialized AI agents to analyze application stack traces, query institutional knowledge bases, correlate recent deployment changes, and synthesize actionable remediation plans.',
    tags: ['overview', 'platform', 'introduction', 'agentic ai'],
    isPopular: true,
  },
  {
    id: 'gs-2',
    category: 'getting-started',
    question: 'What problems does RootCause AI solve?',
    answer:
      'During production outages, engineers often spend hours manually cross-referencing high-volume logs, parsing dense stack traces, searching through fragmented documentation and past incident runbooks, and guessing the root cause. RootCause AI compresses this triage cycle from hours to seconds by autonomously correlating symptoms, historical incidents, deployment diffs, and runbooks into a structured report.',
    tags: ['benefits', 'triage', 'mttr', 'productivity'],
  },
  {
    id: 'gs-3',
    category: 'getting-started',
    question: 'How do I create a new incident?',
    answer:
      'Navigate to Investigations in the sidebar and click "+ New Incident" (or use the "+ New Incident" button on the Dashboard). Enter a concise descriptive title, paste the relevant application log excerpts or stack traces, and optionally provide deployment metadata (e.g., service name, commit hash, container image tag, or recent environment variables). Then click "Create Incident".',
    tags: ['create', 'incident', 'workflow', 'form'],
    isPopular: true,
  },
  {
    id: 'gs-4',
    category: 'getting-started',
    question: 'What information should I provide when creating an incident?',
    answer:
      'To achieve the highest confidence and accurate diagnoses:\n\n• Title: A concise summary of the issue (e.g., "Checkout-Service: Connection pool exhaustion during payment spikes").\n• Logs: Relevant error logs, exceptions, and stack traces around the failure timestamp.\n• Deployment Info: Recent commit messages, deployment timestamps, image tags, environment variable changes, or JVM flags.\n\nProviding deployment context allows the agents to correlate code changes directly with symptom onset.',
    tags: ['inputs', 'logs', 'deployment', 'best practices'],
  },
  {
    id: 'gs-5',
    category: 'getting-started',
    question: 'How do I start an investigation?',
    answer:
      'Once an incident is created, navigate to its detail page and click "Run Investigation" (or "Re-run Analysis"). You can observe the multi-agent investigation execute in real-time with live progress stages, or view the complete analysis report once finished.',
    tags: ['start', 'analyze', 'trigger', 'run'],
  },

  // ─── CATEGORY 2: AI-Powered Investigation ─────────────────────────────
  {
    id: 'ai-1',
    category: 'ai-investigation',
    question: 'How does the AI investigation process work?',
    answer:
      'When an investigation is initiated, the platform invokes an orchestrator (InvestigationOrchestrator) that drives a sequential multi-agent pipeline:\n\n1. LogAnalyzerAgent: Parses raw logs, detects exception types, and extracts culprit components.\n2. ContextRetrieverAgent: Executes hybrid RAG search against knowledge chunks and past incidents.\n3. HypothesisAgent: Evaluates symptoms against retrieved evidence to generate prioritized root cause hypotheses, triggering iterative retrieval if confidence is low.\n4. RemediationAgent: Synthesizes verified evidence into immediate mitigation steps, long-term architectural prevention, and rollback guidance.',
    tags: ['workflow', 'pipeline', 'orchestrator', 'agents'],
    isPopular: true,
  },
  {
    id: 'ai-2',
    category: 'ai-investigation',
    question: 'What are the four specialized AI agents?',
    answer:
      'The architecture decomposes complex diagnosis into four specialized, single-responsibility agents:\n\n• Log Analyzer Agent: Expert at log parsing, regex pattern extraction, and error classification.\n• Context Retriever Agent: Domain expert at querying the knowledge base and historical incident database.\n• Hypothesis Agent: Reasoning engine that connects symptoms, changes, and knowledge to formulate causal explanations.\n• Remediation Agent: Operational advisor that constructs actionable mitigation and prevention procedures.',
    tags: ['agents', 'architecture', 'specialization', 'roles'],
    isPopular: true,
  },
  {
    id: 'ai-3',
    category: 'ai-investigation',
    question: 'What does the Log Analyzer Agent do?',
    answer:
      'The Log Analyzer Agent executes the "analyzeLogPatterns" tool. It examines raw log strings, extracts the root exception classes (e.g., PSQLException, OutOfMemoryError), pinpoints culprit files and line numbers, determines log severity levels, and isolates repeating error patterns.',
    tags: ['log analyzer', 'stack trace', 'exceptions', 'tools'],
  },
  {
    id: 'ai-4',
    category: 'ai-investigation',
    question: 'What does the Context Retriever Agent do?',
    answer:
      'The Context Retriever Agent invokes "searchKnowledgeBase", "findSimilarIncidents", and "getDeploymentContext". It searches pgvector embeddings and PostgreSQL full-text search to locate relevant runbooks, SOPs, postmortems, and recent deployment changes relevant to the incident.',
    tags: ['context retriever', 'rag', 'runbooks', 'tools'],
  },
  {
    id: 'ai-5',
    category: 'ai-investigation',
    question: 'How does the Hypothesis Agent identify potential root causes?',
    answer:
      'The Hypothesis Agent correlates the findings from the Log Analyzer and Context Retriever. It formulates plausible failure scenarios, scores their likelihood, and checks if the evidence is sufficient. If initial context is insufficient or confidence is below 70%, it triggers an iterative retrieval query to fetch more specific telemetry before finalizing the hypothesis.',
    tags: ['hypothesis', 'reasoning', 'confidence', 'iterative retrieval'],
  },
  {
    id: 'ai-6',
    category: 'ai-investigation',
    question: 'What does the Remediation Agent recommend?',
    answer:
      'The Remediation Agent produces a structured, phased remediation plan:\n\n• Immediate Actions: High-priority steps to stop the bleeding and restore system availability (e.g., roll back a deployment, scale up pods, restart connection pools).\n• Long-term Prevention: Architectural hardening, alerting thresholds, connection pool tuning, and circuit breaker implementations.\n• Rollback Strategy: Precise rollback recommendations based on recent commits or image tags.',
    tags: ['remediation', 'mitigation', 'prevention', 'rollback'],
  },
  {
    id: 'ai-7',
    category: 'ai-investigation',
    question: 'Can the AI investigate incidents autonomously?',
    answer:
      'Yes, the multi-agent orchestration runs autonomously once triggered—it calls diagnostic tools, evaluates confidence, performs iterative context searches, and produces the complete report. However, RootCause AI acts as an advisory and diagnostic intelligence system; it does not automatically execute changes or push code to production environments without human engineer authorization.',
    tags: ['autonomy', 'human in the loop', 'safety', 'automation'],
    isPopular: true,
  },

  // ─── CATEGORY 3: RAG & Knowledge Base ─────────────────────────────────
  {
    id: 'rag-1',
    category: 'rag-knowledge',
    question: 'What is Retrieval-Augmented Generation (RAG)?',
    answer:
      "RAG is a technique that grounds AI model generation in your team's verified internal documentation. Instead of relying solely on general model training, RootCause AI embeds your runbooks, postmortems, and troubleshooting guides into vector embeddings, retrieving the most relevant context during an active outage to inform the AI's diagnostic reasoning.",
    tags: ['rag', 'embeddings', 'grounding', 'knowledge'],
    isPopular: true,
  },
  {
    id: 'rag-2',
    category: 'rag-knowledge',
    question: 'How does RootCause AI retrieve relevant troubleshooting information?',
    answer:
      'RootCause AI uses an advanced multi-stage retrieval pipeline:\n\n1. Query Decomposition: Breaks down complex incident descriptions into specific technical search queries.\n2. Hybrid Retrieval: Combines pgvector semantic similarity with PostgreSQL to_tsvector keyword matching.\n3. Reciprocal Rank Fusion (RRF): Merges and deduplicates rank lists from both search strategies.\n4. Relevance Reranking: Re-scores candidates to pass only high-signal knowledge chunks to the LLM.',
    tags: ['pipeline', 'decomposition', 'reranking', 'rrf'],
  },
  {
    id: 'rag-3',
    category: 'rag-knowledge',
    question: 'What is hybrid search?',
    answer:
      'Hybrid search merges two complementary search methodologies:\n\n• Semantic Vector Search (pgvector + Gemini Embeddings): Captures conceptual meaning even when exact words differ (e.g., matching "database unresponsive" to "Hikari connection pool timeout").\n• Keyword Full-Text Search (PostgreSQL TSVector): Guarantees exact matching on technical identifiers, error codes, and class names (e.g., PSQLException, HTTP 504, v2.4.1).',
    tags: ['hybrid search', 'semantic', 'keyword', 'pgvector'],
    isPopular: true,
  },
  {
    id: 'rag-4',
    category: 'rag-knowledge',
    question: 'What information is stored in the Knowledge Base?',
    answer:
      'The Knowledge Base stores runbooks, architectural documents, past postmortems, standard operating procedures (SOPs), and service definitions. When ingested, documents are parsed into overlapping chunks and converted into high-dimensional vector embeddings stored in PostgreSQL with pgvector.',
    tags: ['storage', 'documents', 'chunks', 'runbooks'],
  },
  {
    id: 'rag-5',
    category: 'rag-knowledge',
    question: 'How can I add or manage knowledge documents?',
    answer:
      'Navigate to the Knowledge Base tab in the sidebar and click "+ Add Document". Provide a title, choose the document category (e.g., RUNBOOK, POSTMORTEM, ARCHITECTURE, GENERAL), and input the content. Upon saving, RootCause AI automatically chunks the text, computes vector embeddings, and indexes them for immediate search availability.',
    tags: ['ingestion', 'upload', 'manage', 'documents'],
  },
  {
    id: 'rag-6',
    category: 'rag-knowledge',
    question: 'How does the application find similar historical incidents?',
    answer:
      'When an incident is investigated, the "findSimilarIncidents" tool compares the current incident\'s title, symptoms, and logs against all previously resolved incident records in the database using hybrid similarity search. Matches with high symptom overlap are cited in the report to help engineers reuse proven fixes.',
    tags: ['similar incidents', 'history', 'correlation', 'postmortems'],
  },

  // ─── CATEGORY 4: Investigation Results ────────────────────────────────
  {
    id: 'res-1',
    category: 'investigation-results',
    question: 'How do I interpret the identified root cause?',
    answer:
      'The Root Cause section provides the AI\'s core diagnosis of why the incident occurred. It synthesizes what failed, which component initiated the failure, and the underlying trigger (e.g., a memory leak triggered by a batch consumer update, or thread starvation caused by a missing timeout).',
    tags: ['root cause', 'interpretation', 'report', 'diagnosis'],
  },
  {
    id: 'res-2',
    category: 'investigation-results',
    question: 'What are confidence scores?',
    answer:
      'Confidence scores are integer percentages (0% to 100%) indicating how strongly the collected evidence supports the identified root cause:\n\n• 80% - 100% (High): Clear stack traces, direct match with runbooks or recent commits, and confirmed symptom reproduction.\n• 60% - 79% (Medium): Strong correlation, but some contextual information (like database server metrics or specific config diffs) is inferred or missing.\n• < 60% (Low / Uncertain): Ambiguous logs or generic errors without specific stack traces; indicates that further telemetry is needed.',
    tags: ['confidence score', 'metrics', 'reliability', 'thresholds'],
    isPopular: true,
  },
  {
    id: 'res-3',
    category: 'investigation-results',
    question: 'What is the difference between a hypothesis and a verified root cause?',
    answer:
      'A hypothesis is an AI-proposed causal explanation generated by the HypothesisAgent based on observed correlations. A verified root cause is a hypothesis that has been cross-validated by matching logs, code changes, and knowledge base evidence with high confidence. Engineers should review the supporting evidence before declaring an incident resolved.',
    tags: ['hypothesis', 'verified', 'validation', 'distinction'],
  },
  {
    id: 'res-4',
    category: 'investigation-results',
    question: 'What are remediation steps?',
    answer:
      'Remediation steps are actionable, prioritized instructions designed to restore service availability. They are split into immediate operational procedures (e.g., restart pods, revert feature flag, increase pool size) and follow-up validation checks.',
    tags: ['remediation', 'actions', 'mitigation', 'recovery'],
  },
  {
    id: 'res-5',
    category: 'investigation-results',
    question: 'What are preventive measures?',
    answer:
      'Preventive measures are structural engineering recommendations aimed at permanently preventing recurrence. Examples include implementing resilience patterns (circuit breakers, rate limiting, connection timeouts), refining alerting rules, or adding unit/integration regression tests.',
    tags: ['prevention', 'long term', 'resilience', 'hardening'],
  },
  {
    id: 'res-6',
    category: 'investigation-results',
    question: 'What is a rollback strategy?',
    answer:
      'When an incident is correlated with a recent deployment, the report highlights a Rollback Strategy detailing the culprit commit, container tag, or configuration change, providing the exact version to revert to for instant recovery.',
    tags: ['rollback', 'git commit', 'deployment', 'revert'],
  },
  {
    id: 'res-7',
    category: 'investigation-results',
    question: 'Can I rerun an investigation?',
    answer:
      'Yes! You can click "Re-run Analysis" at any time on the Incident Detail page. This re-triggers the multi-agent pipeline to re-evaluate logs and search updated runbooks. Re-running safely updates the existing report in-place without losing the incident history.',
    tags: ['rerun', 'refresh', 're-analyze', 'update'],
  },

  // ─── CATEGORY 5: Agent Execution & Observability ─────────────────────
  {
    id: 'obs-1',
    category: 'agent-observability',
    question: 'What is multi-agent orchestration?',
    answer:
      'Multi-agent orchestration is a design pattern where specialized AI agents collaborate sequentially and iteratively, passing structured intermediate state between each other. The InvestigationOrchestrator manages stage transitions, tool execution permissions, and state continuity across the entire investigation lifecycle.',
    tags: ['orchestration', 'multi-agent', 'lifecycle', 'architecture'],
  },
  {
    id: 'obs-2',
    category: 'agent-observability',
    question: 'What are tool calls?',
    answer:
      'Tool calls are structured invocations through which AI agents access external systems and databases. RootCause AI provides tools for:\n\n• analyzeLogPatterns: Local regex & heuristic log parsing.\n• searchKnowledgeBase: Hybrid RAG retrieval from vector database.\n• findSimilarIncidents: Querying historical incident postmortems.\n• getDeploymentContext: Parsing deployment YAML, commits, and diffs.',
    tags: ['tools', 'tool calling', 'functions', 'integrations'],
  },
  {
    id: 'obs-3',
    category: 'agent-observability',
    question: 'What is iterative retrieval?',
    answer:
      'If the HypothesisAgent evaluates initial context and detects that confidence is low or specific technical telemetry is missing, it dynamically generates a targeted secondary search query (e.g., querying database slow query logs or metric thresholds) to gather supplementary context before generating recommendations.',
    tags: ['iterative retrieval', 'refinement', 'search', 'accuracy'],
  },
  {
    id: 'obs-4',
    category: 'agent-observability',
    question: 'What are investigation traces?',
    answer:
      'Investigation traces are structured execution audit records that capture every agent action, tool invocation, input payload, returned observation, and execution latency. They provide total transparency into how the AI reached its conclusions.',
    tags: ['traces', 'observability', 'audit', 'transparency'],
    isPopular: true,
  },
  {
    id: 'obs-5',
    category: 'agent-observability',
    question: 'How can I inspect individual agent activities?',
    answer:
      'On the Incident Details page, click the "Agent Traces" tab or drawer. This opens the live trace timeline where you can expand individual stage cards to inspect the exact prompts, tools invoked, parameters passed, duration, and agent outputs.',
    tags: ['traces view', 'inspect', 'timeline', 'debugging'],
  },
  {
    id: 'obs-6',
    category: 'agent-observability',
    question: 'What do execution time and LLM latency mean?',
    answer:
      '• LLM Latency: The exact duration spent waiting for the language model (Gemini 2.5 Flash) to stream responses.\n• Execution Time: The total wall-clock duration of the stage, including tool execution (database queries, vector searches) plus LLM generation.',
    tags: ['latency', 'duration', 'performance', 'metrics'],
  },
  {
    id: 'obs-7',
    category: 'agent-observability',
    question: 'What happens if an agent or LLM request fails?',
    answer:
      'RootCause AI incorporates exponential backoff retries (2s, 4s, 8s) for transient LLM API errors via Spring Retry. If a stage permanently encounters an error, the trace records the failure with error logs, and the platform safely flags the job as FAILED without corrupting existing database records.',
    tags: ['retry', 'backoff', 'fault tolerance', 'error handling'],
  },

  // ─── CATEGORY 6: Analytics & Troubleshooting ─────────────────────────
  {
    id: 'ana-1',
    category: 'analytics-troubleshooting',
    question: 'What information is available in Analytics?',
    answer:
      'The Analytics page provides operational metrics including incident volume trends over time, tag distribution (e.g., Database, Kafka, Network, JVM), average confidence scores across investigations, and recurring root cause categories.',
    tags: ['analytics', 'charts', 'trends', 'metrics'],
  },
  {
    id: 'ana-2',
    category: 'analytics-troubleshooting',
    question: 'How can I monitor investigation performance?',
    answer:
      'You can monitor investigation performance by checking average investigation duration in the live traces, reviewing the RAG retrieval scores in the knowledge base evaluation, and reviewing server metrics via the Actuator health endpoints.',
    tags: ['monitoring', 'performance', 'evaluations', 'health'],
  },
  {
    id: 'ana-3',
    category: 'analytics-troubleshooting',
    question: 'Why might an investigation fail?',
    answer:
      'Investigations typically fail due to:\n\n• Network connectivity drops to external LLM providers or database clusters.\n• Empty or unparseable input logs.\n• Rate limit exhaustion on the Gemini API quota.\n\nCheck backend console logs or the Agent Trace drawer for exact error details.',
    tags: ['failures', 'troubleshooting', 'errors', 'reasons'],
    isPopular: true,
  },
  {
    id: 'ana-4',
    category: 'analytics-troubleshooting',
    question: 'Why might the AI return an uncertain root cause?',
    answer:
      'If logs contain only generic error messages (e.g., "Internal Server Error 500") without full stack traces, or if no deployment context or relevant runbooks exist, the AI will accurately reflect this uncertainty with a lower confidence score (e.g., < 60%) and suggest capturing verbose debug telemetry.',
    tags: ['uncertainty', 'low confidence', 'generic logs', 'telemetry'],
  },
  {
    id: 'ana-5',
    category: 'analytics-troubleshooting',
    question: 'What should I do if no relevant knowledge documents are retrieved?',
    answer:
      'Upload relevant troubleshooting runbooks, architecture diagrams, and past postmortems to the Knowledge Base page. Ensure documents use accurate keywords (e.g., service names, configuration properties, exception types) so the hybrid search engine can index them effectively.',
    tags: ['missing knowledge', 'upload', 'runbook tuning', 'grounding'],
  },
  {
    id: 'ana-6',
    category: 'analytics-troubleshooting',
    question: 'How do I troubleshoot application errors?',
    answer:
      '• Frontend errors: Inspect the browser developer console (F12) for network request failures (/api/incidents, /api/knowledge).\n• Backend errors: Inspect the Spring Boot console logs (Rootcause AI-BE) for detailed stack traces.\n• Database issues: Verify PostgreSQL connection string and pgvector extension status in your Neon dashboard.',
    tags: ['troubleshooting', 'debugging', 'logs', 'developer tools'],
  },
];
