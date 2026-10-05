export type Role = 'PM' | 'Developer' | 'Designer' | 'Marketing';
export type Level = 'Explorer' | 'Builder' | 'Founder';
export type BoxType = 'Startup' | 'Hackathon' | 'Agency' | 'Content' | 'Research';
export type BoxStatus = 'Open' | 'Full' | 'Sprinting' | 'Completed';
export interface User { id: string; name: string; avatarColor: string; role: Role; skills: string[]; hoursPerWeek: number; level: Level; reputation: number; xp: number; streak: number; badges: string[]; timezone: string; bio: string; }
export interface Task { id: string; title: string; owner: string; dueDay: number; done: boolean; }
export interface Message { id: string; from: string | 'AI'; text: string; time: string; }
export interface Box { id: string; name: string; type: BoxType; level: Level; slots: { role: Role; filledBy?: string }[]; status: BoxStatus; sprintDay: number; health: number; idea?: string; tasks: Task[]; messages: Message[]; ideas: { id: string; title: string; votes: number }[]; }
