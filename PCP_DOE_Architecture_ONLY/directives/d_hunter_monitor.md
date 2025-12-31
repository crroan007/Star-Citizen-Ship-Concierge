# Directive: Agent Hunter (The Monitor)

**Goal**: Monitor configured email folders for new PDF documents.

## Operational Parameters
- **Poll Interval**: Read from `config.json` (Default: 300 seconds).
- **Target Folders**: Read from `config.json` -> `SourceFolders`.
- **Target File Type**: `.pdf` only.

## Process Flow
1.  **Wake Up**: Triggered by `start_monitoring` command.
2.  **Scan**: connect to Outlook MAPI via `execution/monitor_email.ps1`.
3.  **Filter**: Ignore read emails. Ignore emails without attachments.
4.  **Extract**: Save the PDF attachment to `temp/incoming/`.
5.  **Metadata**: Create a JSON accompanying the PDF with:
    - `SenderEmail`
    - `SubjectLine`
    - `ReceivedTime`
    - `OriginalFileName`
6.  **Handoff**: Call Agent **Judge**.

## Edge Cases
- **Outlook Closed**: Log error "Outlook not running", wait 60s, retry.
- **Network Error**: Log error, wait 30s, retry.
- **No Attachments**: Mark email as "Skipped" (if configured) or just Ignore.
