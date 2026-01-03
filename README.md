# The Agentic Twelve

## A Manifesto for Building Robust, Scalable, and Safe AI-Native Applications

-----

> *“In the age of the 12-Factor App, we told machines **how** to compute. In the age of The Agentic Twelve, we tell them **what** we want—and they figure out the rest.”*

-----

## Introduction: From Imperative to Intent

The [12-Factor App](https://12factor.net) was a watershed moment for cloud-native development. It gave us a shared language and a set of best practices for building applications that were portable, resilient, and scalable in the era of containerized microservices.

**That era is over.**

We have entered the age of **Agentic Computing**—where applications are no longer just executed, but *reasoned through*. Where code is increasingly generated, not just written. Where the interface between human intent and machine execution is collapsing into a single natural-language prompt.

This shift demands a new architectural standard. Not to replace the 12-Factor App, but to extend it for a world where:

- **LLMs are first-class runtime components**, not just developer tools.
- **Probabilistic reasoning** coexists with deterministic execution.
- **Context windows**, not just memory limits, constrain what’s possible.
- **Agents collaborate** with humans and each other in long-running workflows.

**The Agentic Twelve** is that standard.

-----

## The Nomenclature

|Term                        |Definition                                                                                                                                                                                                                   |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|**The Agentic Twelve (A12)**|This manifesto. A set of 12 principles for building applications in the age of AI agents and vibe coding.                                                                                                                    |
|**Agent-Native**            |An application or infrastructure that is designed from the ground up to be readable, manipulatable, and orchestrable by AI agents—not just humans. An Agent-Native system treats LLMs as first-class citizens of its runtime.|
|**Vibe-Coded**              |Software specified primarily through natural language intent, with implementation details delegated to generative AI systems.                                                                                                |
|**A12-Compliant**           |A system that adheres to all 12 principles of this manifesto.                                                                                                                                                                |

-----

## The Twelve Factors

-----

### I. Intent Over Implementation

#### *Declare what, not how.*

**The Traditional Way:** Developers write explicit, step-by-step instructions. Every branch, every loop, every edge case is manually coded.

**The Agentic Twist:** Developers express *desired outcomes* and *constraints*. The agent reasons through the implementation path. Code becomes a specification language, not an execution plan.

**The Guideline:**

- Structure your prompts and specifications as **goal states** with **acceptance criteria**, not procedural scripts.
- Use declarative schemas (JSON Schema, Pydantic, Zod) to define the *shape* of success, and let agents fill in the substance.
- Treat natural language as a first-class configuration layer—version it, lint it, test it.

```yaml
# Bad: Imperative
"Loop through users, check if each is active, then send email"

# Good: Intent-based
intent: "Notify all active users about the system update"
constraints:
  - channel: email
  - exclude: users who opted out in the last 30 days
  - tone: professional, concise
```

-----

### II. Bounded Context Windows

#### *Memory is a budget. Spend it wisely.*

**The Traditional Way:** Applications have access to virtually unlimited memory. State can be loaded, cached, and queried at will.

**The Agentic Twist:** LLMs operate within fixed context windows (4K to 200K+ tokens). Exceeding this limit causes catastrophic information loss. Context is the scarcest resource in agentic systems.

**The Guideline:**

- Implement a **three-tier memory architecture**:
  - **Working Memory:** Current context window. Hot, expensive, ephemeral.
  - **Session Memory:** Conversation or task-level state. Warm, summarizable.
  - **Long-Term Memory:** Persistent knowledge stores (vector DBs, knowledge graphs). Cold, queryable.
- Use **aggressive summarization** and **semantic chunking** to compress session state before it enters the context window.
- Never assume the agent “remembers.” Always inject relevant context explicitly.

```
┌─────────────────────────────────────┐
│  WORKING MEMORY (Context Window)   │  ← Hot: Current tokens
├─────────────────────────────────────┤
│  SESSION MEMORY (Conversation)     │  ← Warm: Summarized history
├─────────────────────────────────────┤
│  LONG-TERM MEMORY (Vector DB/KG)   │  ← Cold: Semantic retrieval
└─────────────────────────────────────┘
```

-----

### III. Probabilistic Determinism

#### *Embrace uncertainty. Enforce boundaries.*

**The Traditional Way:** Code is deterministic. Given the same input, you get the same output. Testing is straightforward.

**The Agentic Twist:** LLM outputs are inherently probabilistic. The same prompt may yield different responses. “Correct” becomes a spectrum, not a binary.

**The Guideline:**

- Wrap probabilistic components in **deterministic shells**. Let the agent generate, but validate and constrain the output with traditional code.
- Use **structured outputs** (JSON mode, tool calls, function calling) to force responses into parseable, testable formats.
- Implement **confidence thresholds**. If the agent’s self-reported confidence (or a classifier’s score) falls below a threshold, escalate to a fallback path.
- Write **property-based tests**, not just example-based tests. Assert invariants, not exact outputs.

```python
# Probabilistic core, deterministic shell
response = agent.generate(prompt)
parsed = validate_against_schema(response)  # Deterministic gate
if parsed.confidence < 0.85:
    return fallback_to_human_review(parsed)
```

-----

### IV. Radical Observability

#### *If you can’t explain it, you can’t trust it.*

**The Traditional Way:** Logs, metrics, and traces capture *what* happened. Debugging follows deterministic stack traces.

**The Agentic Twist:** Agents are black boxes. You need to capture *why* a decision was made—the reasoning chain, the retrieved context, the tool selection logic.

**The Guideline:**

- Log **full reasoning traces**, not just inputs and outputs. Capture chain-of-thought, retrieved documents, and tool call sequences.
- Implement **decision attribution**. For every output, you should be able to answer: *“What context led to this? What alternatives were considered?”*
- Build **replay infrastructure**. You must be able to re-run any agent decision with the exact same context to debug failures.
- Use structured telemetry standards (OpenTelemetry, LangSmith, Langfuse) with agent-specific semantic conventions.

```json
{
  "trace_id": "abc-123",
  "decision": "Recommend product X",
  "reasoning_chain": [
    "User expressed interest in outdoor gear",
    "Retrieved 5 products matching 'hiking'",
    "Product X has highest rating + in-stock"
  ],
  "retrieved_context": ["doc_1", "doc_2"],
  "confidence": 0.91,
  "alternatives_considered": ["Product Y", "Product Z"]
}
```

-----

### V. Tool Abstraction

#### *Agents don’t call APIs. They use capabilities.*

**The Traditional Way:** Developers write explicit HTTP calls, handle auth, parse responses, manage errors. Integration logic is scattered.

**The Agentic Twist:** Agents need to *discover*, *understand*, and *invoke* tools dynamically. The interface must be self-describing and semantically meaningful.

**The Guideline:**

- Expose capabilities through **agent-friendly protocols**: MCP (Model Context Protocol), OpenAPI with rich descriptions, or GraphQL with semantic annotations.
- Every tool must have:
  - A **clear, natural-language description** of what it does
  - **Explicit input/output schemas** with examples
  - **Error semantics** the agent can reason about
- Prefer **capability-based naming** over implementation-based. `search_documents` > `POST /api/v2/docs/search`.
- Abstract authentication and rate limiting away from the agent. The orchestration layer handles infra; the agent handles intent.

```yaml
# MCP-style tool definition
name: search_knowledge_base
description: |
  Searches the company knowledge base for relevant documents.
  Use when the user asks about internal policies, procedures, or past decisions.
parameters:
  query:
    type: string
    description: Natural language search query
  max_results:
    type: integer
    default: 5
returns:
  type: array
  items:
    type: object
    properties:
      title: string
      snippet: string
      relevance_score: number
```

-----

### VI. Human Sovereignty

#### *Agents propose. Humans dispose.*

**The Traditional Way:** Automated systems execute within predefined rules. Humans intervene only on exceptions.

**The Agentic Twist:** Agents can take actions with significant real-world consequences. The boundary between “suggestion” and “action” must be explicit and controllable.

**The Guideline:**

- Implement **tiered action classification**:
  - **Tier 1 (Autonomous):** Low-risk, reversible actions. Execute freely.
  - **Tier 2 (Notify):** Medium-risk actions. Execute, but alert human.
  - **Tier 3 (Approve):** High-risk actions. Require explicit human approval before execution.
  - **Tier 4 (Forbidden):** Never allowed. Hard-coded refusals.
- Build **approval workflows** as first-class primitives, not afterthoughts.
- Always provide a **kill switch**. Any agent workflow must be stoppable by a human at any point.
- Log all actions with attribution: *which agent*, *what context*, *who approved*.

```
┌─────────────────────────────────────────────┐
│  TIER 1: AUTONOMOUS                         │
│  "Send calendar reminder"                   │
├─────────────────────────────────────────────┤
│  TIER 2: NOTIFY                             │
│  "Update CRM record"                        │
├─────────────────────────────────────────────┤
│  TIER 3: APPROVE                            │
│  "Send contract to client"                  │
├─────────────────────────────────────────────┤
│  TIER 4: FORBIDDEN                          │
│  "Delete production database"               │
└─────────────────────────────────────────────┘
```

-----

### VII. Sandbox-First Execution

#### *Trust, but verify. Actually, don’t trust.*

**The Traditional Way:** Code runs with the permissions it’s granted. Security is enforced at deployment time.

**The Agentic Twist:** Agents can generate and execute arbitrary code. The attack surface is the entire capability space. You must assume the agent will try things you didn’t anticipate.

**The Guideline:**

- All agent-generated code runs in **isolated sandboxes** with minimal permissions. No exceptions.
- Implement **capability-based security**. Agents get explicit tokens for specific actions, not ambient authority.
- Apply **principle of least privilege** aggressively. An agent that summarizes documents should not have network access.
- Use **resource limits** (CPU, memory, time, API calls) to prevent runaway execution.
- Treat agent output as **untrusted user input**. Validate, sanitize, escape.

```python
sandbox_config = {
    "network": False,
    "filesystem": {"read": ["/data/docs"], "write": []},
    "max_execution_time": 30,  # seconds
    "max_memory": "512MB",
    "allowed_imports": ["json", "re", "datetime"]
}
result = execute_in_sandbox(agent_code, config=sandbox_config)
```

-----

### VIII. Graceful Degradation

#### *Fail elegantly. Escalate intelligently.*

**The Traditional Way:** Systems fail fast with explicit errors. Retry logic is straightforward.

**The Agentic Twist:** Agents can fail *silently*—producing plausible but wrong outputs. Failure modes are semantic, not just syntactic.

**The Guideline:**

- Implement **multi-level fallback chains**:

1. Retry with rephrased prompt
1. Fall back to simpler model
1. Fall back to rule-based system
1. Escalate to human

- Build **semantic validators** that check not just format, but meaning. A valid JSON response can still be nonsense.
- Use **circuit breakers** for external dependencies. If a tool fails repeatedly, stop calling it.
- Design for **partial success**. If an agent can complete 80% of a task, return that 80% with clear annotations about what failed.

```python
async def execute_with_fallback(task):
    try:
        return await primary_agent.run(task)
    except LowConfidenceError:
        return await fallback_agent.run(task)
    except ToolFailureError:
        return await rule_based_fallback(task)
    except:
        return await escalate_to_human(task)
```

-----

### IX. Feedback Loops as Infrastructure

#### *Learning is a feature, not a bug.*

**The Traditional Way:** Improvement requires code changes. Deploy, measure, iterate.

**The Agentic Twist:** Systems can improve through prompt tuning, example curation, and RLHF—without touching code. Feedback is a continuous input stream, not a periodic review.

**The Guideline:**

- Capture **explicit feedback signals** (thumbs up/down, corrections, rewrites) as structured data.
- Capture **implicit feedback signals** (task completion rates, retry frequency, escalation rates).
- Implement **prompt versioning**. Prompts are code. Track changes, A/B test, roll back.
- Build **example pipelines**. Good outputs become few-shot examples. Bad outputs become negative examples.
- Design for **continuous calibration**. The system should get better at knowing when it’s wrong.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  FEEDBACK   │───▶│  ANALYSIS   │───▶│   TUNING    │
│  Collection │    │  Pipeline   │    │   Pipeline  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                                     │
       │         ┌─────────────┐             │
       └────────▶│  EXAMPLE    │◀────────────┘
                 │   STORE     │
                 └─────────────┘
```

-----

### X. Versioned Behavior

#### *Treat prompts like code. Because they are.*

**The Traditional Way:** Version control tracks source code. Behavior is a function of the code.

**The Agentic Twist:** Behavior is a function of prompts, examples, model versions, and retrieval corpora. All of these must be versioned together.

**The Guideline:**

- Maintain **atomic behavior snapshots**: prompt + model ID + temperature + retrieved context + examples = reproducible behavior.
- Use **semantic versioning for prompts**. Breaking changes (new required fields, changed intent) get major bumps.
- Implement **behavior diffing**. Before deploying a prompt change, run it against a test suite and compare outputs.
- Pin model versions in production. Never let a model upgrade silently change behavior.

```yaml
# behavior.yaml
version: 2.1.0
model: claude-sonnet-4-20250514
temperature: 0.7
system_prompt: ./prompts/v2/customer_support.md
few_shot_examples: ./examples/v2/support_tickets.json
retrieval_corpus: s3://knowledge-base/v2024-12/
guardrails: ./guardrails/v1/safety.yaml
```

-----

### XI. Agent Interoperability

#### *Agents must speak a common tongue.*

**The Traditional Way:** Services communicate via well-defined APIs. Contracts are explicit.

**The Agentic Twist:** Agents need to delegate to other agents, share context, and coordinate on complex tasks. This requires shared protocols for agent-to-agent communication.

**The Guideline:**

- Adopt **standardized agent protocols** (A2A, MCP, OpenAI function calling conventions) for inter-agent communication.
- Define **agent capability manifests**. Every agent should expose: what it can do, what inputs it needs, what outputs it produces.
- Implement **context handoff protocols**. When Agent A delegates to Agent B, there must be a standard way to transfer relevant context without losing fidelity.
- Use **shared ontologies** for domain concepts. If two agents disagree on what “customer” means, they can’t collaborate.

```yaml
# agent-manifest.yaml
agent_id: invoice-processor
version: 1.2.0
capabilities:
  - name: extract_line_items
    input: { type: "pdf", max_size: "10MB" }
    output: { type: "array", items: "LineItem" }
  - name: validate_totals
    input: { type: "Invoice" }
    output: { type: "ValidationResult" }
protocols:
  - mcp/1.0
  - a2a/0.9
```

-----

### XII. Idempotent Orchestration

#### *Run it twice. Get the same result.*

**The Traditional Way:** Idempotency is a property of individual operations. Orchestration is separate concern.

**The Agentic Twist:** Agent workflows are long-running, stateful, and prone to interruption. Every step must be resumable. Every action must be replayable.

**The Guideline:**

- Design all agent actions as **idempotent operations**. Executing the same action twice should not produce side effects.
- Implement **checkpoint-based orchestration**. Persist workflow state after each step so it can be resumed on failure.
- Use **deterministic action IDs**. The same intent should generate the same action ID, enabling deduplication.
- Build **compensation actions**. For every action, define how to undo it if the workflow needs to roll back.

```python
@idempotent(key=lambda ctx: f"{ctx.workflow_id}:{ctx.step_id}")
async def send_invoice(ctx, invoice):
    # Check if already sent
    if await already_executed(ctx.action_id):
        return await get_previous_result(ctx.action_id)
    
    result = await email_service.send(invoice)
    await save_result(ctx.action_id, result)
    return result
```

-----

## The Checklist

Use this checklist to evaluate A12 compliance:

|#   |Principle                       |Question                                                                   |
|----|--------------------------------|---------------------------------------------------------------------------|
|I   |Intent Over Implementation      |Are specifications declarative with clear goal states?                     |
|II  |Bounded Context Windows         |Is there a tiered memory architecture with explicit context management?    |
|III |Probabilistic Determinism       |Are probabilistic outputs wrapped in deterministic validation?             |
|IV  |Radical Observability           |Can you trace the full reasoning chain for any decision?                   |
|V   |Tool Abstraction                |Are all capabilities self-describing with semantic interfaces?             |
|VI  |Human Sovereignty               |Is there a clear tiered permission model with approval workflows?          |
|VII |Sandbox-First Execution         |Does all agent-generated code run in isolated, limited sandboxes?          |
|VIII|Graceful Degradation            |Are there multi-level fallbacks with semantic validation?                  |
|IX  |Feedback Loops as Infrastructure|Is feedback captured and used for continuous improvement?                  |
|X   |Versioned Behavior              |Are prompts, models, and examples versioned together atomically?           |
|XI  |Agent Interoperability          |Can agents discover and communicate with each other via standard protocols?|
|XII |Idempotent Orchestration        |Are all workflows resumable and all actions replayable?                    |

-----

## Conclusion: The Agent-Native Future

The shift from imperative to agentic computing is as significant as the shift from monoliths to microservices. But unlike that transition, which was primarily about *how* we deploy, this one is about *how we think*.

**Agent-Native systems** are not just systems that use AI. They are systems designed from first principles for a world where:

- Intelligence is a commodity, available via API
- Natural language is a programming language
- Reasoning is a runtime operation
- Uncertainty is a feature, not a bug

The Agentic Twelve is not a straitjacket. It’s a shared vocabulary—a set of patterns that let us build systems that are powerful *and* predictable, autonomous *and* accountable, intelligent *and* inspectable.

The code you write today will increasingly be the code that *teaches* the code of tomorrow.

Build accordingly.

-----

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                      THE AGENTIC TWELVE                         │
├─────────────────────────────────────────────────────────────────┤
│  I.   Intent Over Implementation      │  Declare what, not how │
│  II.  Bounded Context Windows         │  Memory is a budget    │
│  III. Probabilistic Determinism       │  Embrace uncertainty   │
│  IV.  Radical Observability           │  Trace every decision  │
│  V.   Tool Abstraction                │  Self-describing caps  │
│  VI.  Human Sovereignty               │  Humans dispose        │
│  VII. Sandbox-First Execution         │  Never trust agents    │
│  VIII.Graceful Degradation            │  Fail elegantly        │
│  IX.  Feedback Loops as Infra         │  Learning is a feature │
│  X.   Versioned Behavior              │  Prompts are code      │
│  XI.  Agent Interoperability          │  Common protocols      │
│  XII. Idempotent Orchestration        │  Run twice, same result│
└─────────────────────────────────────────────────────────────────┘
```

-----

*The Agentic Twelve is an open standard. Contributions welcome.*

**License:** CC BY 4.0  
**Version:** 1.0.0  
**Authors:** The Agent-Native Community

-----

> *“We shape our tools, and thereafter our tools shape us.”*  
> — Marshall McLuhan (probably talking about LLMs)
