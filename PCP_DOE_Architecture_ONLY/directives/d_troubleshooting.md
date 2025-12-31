# Directive: Troubleshooting & Exception Handling

**Goal**: Define standard procedures for when Agents encounter errors. This "Self-Annealing" guide ensures the system recovers or fails gracefully.

## Global Error Levels

### Level 1: Transient (Retryable)
- **Examples**: Network timeout, Outlook busy, File locked.
- **Protocol**:
    1.  Log Warning.
    2.  Wait `RetryInterval` (default: 30s).
    3.  Retry Action (Max 3 attempts).
    4.  If still failing -> Escalate to Level 2.

### Level 2: Functional (Soft Fail)
- **Examples**: Regex validation failed, "Password Protected" PDF, Corrupt File.
- **Protocol**:
    1.  Log Error with "Reason".
    2.  Move file to `Exceptions/` folder.
    3.  Move original email to `Exceptions/` folder in Outlook.
    4.  **Self-Anneal**: record the "Subject Line" or "Sender" in a `learning_log.json` to identify patterns (e.g., "Sender X always sends bad PDFs").
    5.  Continue to next item (Do not crash).

### Level 3: System (Fatal)
- **Examples**: Disk full, Config file missing, Outlook Application not installed.
- **Protocol**:
    1.  Log CRITICAL Error.
    2.  Send "System Alert" (Popup or special file flag).
    3.  **Terminate Process** safely.

## Agent-Specific Recovery

### Hunter (Monitor)
- **Issue**: "Inbox not found".
- **Fix**: Check `config.json` folder names. If changed, auto-update config if possible, else Alert.

### Judge (Validator)
- **Issue**: "Text Extraction returned Empty".
- **Fix**: Assume Scanned PDF. Flag for OCR Queue (Future) or Move to `Exceptions/Needs_OCR`.

### Scribe (Processor)
- **Issue**: "Destination Path Write Access Denied".
- **Fix**: Save to local `Critical_Backup/` folder to prevent data loss. Log Alert.
