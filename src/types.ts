export interface PersonaRole {
  id: string;
  name: string;
  emoji: string;
  description: string;
  pronoun: string;
  particles: string;
  addressUser: string;
  tone: string;
  genderRuleSummary: string;
}

export type ComfortStyleId = 'warm' | 'wisdom' | 'chill' | 'activity';

export interface ComfortStyle {
  id: ComfortStyleId;
  name: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachmentName?: string;
  attachmentUrl?: string;
  isStreaming?: boolean;
}

export interface ChecklistTask {
  id: string;
  task: string;
  completed: boolean;
}

export interface GroundingStep {
  step: number;
  badge: string;
  title: string;
  desc: string;
}
