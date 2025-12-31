# PCP Document Automation: DOE Architecture Blueprint

**ATTENTION DEVELOPER / CODING AGENT:**
You have been handed this folder to implement the **Professional Civil Process (PCP) Document Automation System**. 

Your role is to write the **Execution Code** (Python/PowerShell) that fulfills the architecture defined below.

## 1. The Architecture (DOE Framework)
This project follows the **DOE** (Directive, Orchestration, Execution) methodology.

- **Directives (`directives/`)**: The "Business Logic" and "Rules". You must read these to understand *what* to build.
    - `d_hunter_monitor.md`: Logic for monitoring Outlook.
    - `d_judge_validation.md`: Logic for validating PDFs.
    - `d_scribe_processing.md`: Logic for renaming/moving files.
    - `d_troubleshooting.md`: Logic for error handling.
- **Orchestration (`agent.md`)**: The "System Prompt" or "Brain". It defines the `Hunter`, `Judge`, and `Scribe` agents.
- **Execution (`execution/`)**: The "Machinery". **Your job is to fill this folder**.

## 2. Your Mission
1.  **Read `agent.md`**: Understand the three agents (Hunter, Judge, Scribe).
2.  **Read the Directives**: Understand the inputs/outputs for each agent.
3.  **Implement the Scripts**:
    - Build a portable runtime (Python recommended, packaged as EXE later) that acts as the "Orchestrator Loop".
    - Implement the functions described in the directives.
    - **Constraint**: The final output must be a "Portable Folder" containing an executable that runs on any Windows machine with Outlook installed.

## 3. The "Portable Bundle"
The final delivery should look like this:
```text
PCP_Automation_v2/
├── config.json           # User settings (Paths, Rules)
├── directives/           # The SOPs (Editable by user)
├── execution/            # The Logic (Scripts/Binaries)
└── PCP_Runtime.exe       # The Orchestrator that runs the loop
```

## 4. Where to Start
- Open `directives/d_hunter_monitor.md`. Write the code to check Outlook.
- Open `directives/d_judge_validation.md`. Write the code to parse PDF text.
- Open `directives/d_scribe_processing.md`. Write the code to rename/move files.

**Good luck.**
