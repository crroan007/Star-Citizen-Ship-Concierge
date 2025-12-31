# Directive: Agent Judge (The Validator)

**Goal**: Validate that the document extracted by Hunter meets business rules.

## Validation Rules
Read `config.json` for custom rules. By default, ensure the following regex matches exist in the PDF text:

1.  **Filing Status**: `filing.*accepted` OR `filed` OR `submitted`.
2.  **Envelope Number**: `envelope.*number.*[0-9]+`.
3.  **Lead Document**: A document is a "Lead" if it contains `lead.*document` or matches the primary case filing pattern.

## Process Flow
1.  **Input**: Receives `path_to_pdf` and `metadata_json` from Hunter.
2.  **Extract Text**: Call `execution/extract_text.ps1` (or Python equivalent).
3.  **Evaluate**:
    - Check Text against Rules.
    - Check if "Scanned" (Low text density) -> If so, **Flag** for OCR (Phase 2 feature).
4.  **Verdict**:
    - **PASS**: Meets all criteria.
    - **FAIL**: Missing criteria.
    - **REVIEW**: Ambiguous.
5.  **Handoff**:
    - If PASS -> Call Agent **Scribe** (Process).
    - If FAIL -> Call Agent **Scribe** (Move to Exception).

## Self-Annealing
- If a document Fails but is manually moved to "Processed" in the future (Correction Loop), **Agent Judge** should learn the pattern and add it to `custom_rules` in config.
