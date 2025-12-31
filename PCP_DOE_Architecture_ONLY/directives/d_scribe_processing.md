# Directive: Agent Scribe (The Processor)

**Goal**: Rename, Move, and Log the document based on Judge's verdict.

## Renaming Rules (The "Scribe's Pen")
- Rules are defined in `config.json` under `RenameRules`.
- **Logic**:
    - Iterate through all rules.
    - If `OriginalFilename` contains `Rule.Key` (case-insensitive), replace it with `Rule.Value`.
    - Example: `AX02` -> `AX42`.

## Routing Rules
### Scenario A: Verdict = PASS
1.  **Rename**: Apply renaming rules.
2.  **Destination**: `config.json` -> `OutputLocation`.
3.  **Action**: Move file to Destination.
4.  **Email**: Move original email to `config.json` -> `ProcessedFolder`.
5.  **Log**: Write to `logs/audit.log` (SUCCESS).

### Scenario B: Verdict = FAIL
1.  **Destination**: `config.json` -> `ExceptionFolder`.
2.  **Action**: Move file to Exception Folder.
3.  **Email**: Move original email to `config.json` -> `ExceptionFolder` in Outlook.
4.  **Log**: Write to `logs/audit.log` (FAIL - Reason).

## Process Flow
1.  **Receive**: Verdict + File from Judge.
2.  **Execute**: Perform Move/Rename.
3.  **Report**: Return final status to Hunter (to close loop).
