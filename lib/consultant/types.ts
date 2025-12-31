export type AgentRole = 'INTERVIEWER' | 'ENGINEER' | 'JUDGE';

export interface Directive {
    id: string; // e.g. "d_ark_persona"
    content: string; // The markdown content
    priority: 'CRITICAL' | 'HIGH' | 'STANDARD';
}

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export interface ConsultationState {
    sessionId: string;
    userIntent?: string; // e.g. "Bounty Hunting"
    shipHull?: string;   // e.g. "Origin 300i"
    constraints: string[]; // e.g. ["Budget: 50k", "Stealth"]
    currentPhase: 'DISCOVERY' | 'DRAFTING' | 'REFINING' | 'COMPLETE';
    history: Message[];
}

export interface AgentResponse {
    message: string;
    nextPhase?: 'DISCOVERY' | 'DRAFTING' | 'REFINING' | 'COMPLETE';
    suggestedActions?: string[]; // e.g. ["Show Loadout A", "Scan Ship"]
}
