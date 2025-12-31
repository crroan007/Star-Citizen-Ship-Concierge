# DOE Implementation Strategy: PCP Document Automation

## 1. Overview
The **Professional Civil Process (PCP) Document Automation System** is a perfect candidate for the DOE (Directive, Orchestration, Execution) framework. The current system relies on rigid PowerShell scripts and Windows Services. DOE allows us to decouple the "Business Logic" (Rules) from the "Machinery" (Scripts), introducing an "Intelligent Orchestrator" (Agent) to handle edge cases and routing.

## 2. DOE Structure Map

### Layer 1: Directives (The "What" & "Rules")
Stored in `directives/` as Markdown files. These replace hardcoded configurations and complex conditional logic in scripts.

- **`d_document_validation.md`**: Defines the "Business Rules" for a valid document.
    - *Content*: "A document is valid if it contains regex patterns (X or Y) AND has an envelope number. If questionable, flag for Review."
- **`d_processing_rules.md`**: Defines how to rename and route documents.
    - *Content*: "If case starts with 'AX02', rename to 'AX42'. Routing priority: Network Share > Local."
- **`d_exception_handling.md`**: Standard Operating Procedure (SOP) for what to do when things break.
    - *Content*: "If OCR fails, retry once with different contrast. If still failing, move to 'Exceptions' folder and log."

### Layer 2: Orchestration (The "Named Agents")
The system is divided into three distinct agents, each with a specific persona and responsibility. This ensures "Separation of Concerns" and easier debugging.

1.  **Agent "Hunter" (The Monitor)**:
    - *Role*: Watcher of Inboxes.
    - *Personality*: Alert, fast, observant.
    - *Function*: Polls Outlook, identifies PDFs, grabs metadata.
    - *Directive*: `directives/d_hunter_monitor.md`

2.  **Agent "Judge" (The Validator)**:
    - *Role*: Compliance Officer.
    - *Personality*: Strict, rules-lawyer, detail-oriented.
    - *Function*: Reads PDF content, checks Regex rules, checks "Seal of Approval".
    - *Directive*: `directives/d_judge_validation.md`

3.  **Agent "Scribe" (The Processor)**:
    - *Role*: Archivist and Renamer.
    - *Personality*: Organized, precise, efficient.
    - *Function*: Renames files, moves them to destination, logs actions.
    - *Directive*: `directives/d_scribe_processing.md`

### Layer 3: Execution (The "Hands")
Stored in `execution/` as deterministic, atomic scripts. These are "dumb" tools that simply do exactly what they affect.

- **`monitor_email.ps1`**:
    - *Old Role*: Everything (Monitor -> processed).
    - *New Role*: Just connect to Outlook, grab the next unread email with a PDF, save it to a temp path, and return the path + metadata.
- **`extract_text.ps1`**:
    - *Input*: PDF Path.
    - *Output*: Raw Text (ASCII/UTF-8).
- **`move_file.ps1`**:
    - *Input*: Source, Dest.
    - *Output*: Success/Fail.
- **`log_event.ps1`**:
    - *Role*: Standardized logging.

## 3. Portability & Distribution Strategy
To meet the "100% Portable EXE" requirement:

1.  **Configuration Tool**: A standalone GUI (or TUI) tool to set API Keys (if using LLM APIs) and Folder Paths.
    - *Output*: `config.json` in the local directory.
2.  **Executable Packaging**:
    - Use **PyInstaller** to bundle the Python Agent Runtime + Scripts into a single `.exe`.
    - Include the `directives/` folder as an external resource (so users can edit SOPs without recompiling) OR embed them for strict control. *Recommendation: External for "Self-Annealing".*
3.  **No Install Required**: The EXE should run directly from the folder.

## 4. Migration Plan (Phased)

## 3. Migration Plan (Phased)

### Phase 1: Hybrid DOE (Parallel Run)
- Keep the existing `PCP-Automation` running for production.
- **Goal**: Create a "Shadow Agent" that monitors the *same* Inbox (or a test folder).
- **Deliverables**:
    - `directives/d_shadow_monitor.md`: Instructions to only *read* and *log* what it *would* do.
    - `execution/read_email_test.ps1`: Safe read-only tool.

### Phase 2: Intelligent Exception Handling
- The existing system dumps errors to an "Exceptions" folder.
- **Goal**: The DOE Agent monitors *only* the "Exceptions" folder.
- **Workflow**:
    - Agent picks up "Failed" PDF.
    - Reads `d_exception_handling.md`.
    - Uses more advanced AI reasoning to fix the issue (e.g., "Ah, this is a scanned image, I need to run the OCR tool" or "The case number is handwritten").
    - Fixes file -> Moves to "Processed".

### Phase 3: Full DOE Control
- The Agent takes over the primary polling loop.
- "Self-Annealing": If the Agent sees it is processing 100 files/hour successfully, it optimizes its own batch size or polling interval in the `d_optimization.md`.

## 4. Implementation Steps (Immediate)
1.  **Populate Directives**: Create initial Markdown SOPs.
2.  **Wrap Tools**: Create simple Python or PowerShell wrappers in `execution/` that expose the existing logic as atomic tools.
3.  **Agent Rule**: Create `agent_pcp.md` (System Prompt) specific to this project context.
