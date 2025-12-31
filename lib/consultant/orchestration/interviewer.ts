import { ConsultationState, AgentResponse, Directive } from '../types';

// Mock LLM Call (Placeholder for real API)
async function queryLLM(prompt: string): Promise<string> {
    // In a real app, this calls OpenAI or a local LLM
    console.log('[LLM_QUERY]', prompt);
    return "MOCK_RESPONSE";
}

export class InterviewerAgent {
    private directives: Directive[];

    constructor(directives: Directive[]) {
        this.directives = directives;
    }

    async process(state: ConsultationState, userInput: string): Promise<AgentResponse> {
        const persona = this.directives.find(d => d.id === 'd_ark_persona')?.content || '';

        // Simple Heuristic Logic for Phase 1 (Discovery)
        // In reality, this would be a full prompt construction

        if (!state.userIntent) {
            // We need to find out what they want
            return {
                message: "Affirmative, Commander. I see you are piloting an Origin 300i. What is your primary mission profile today? (e.g., Bounty Hunting, Touring, Stealth)",
                suggestedActions: ["Combat", "Stealth", "Racing"]
            };
        }

        return {
            message: `Understood. Configuring for ${state.userIntent}. Standby for component selection.`,
            nextPhase: 'DRAFTING'
        };
    }
}
