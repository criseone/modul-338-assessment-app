export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type Phase = 'Discovery' | 'Define' | 'Development' | 'Delivery';

export type Kompetenzband = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';

export interface AssessmentItem {
  id: string;
  deliverable: string;
  phase: Phase;
  kompetenzband: Kompetenzband;
  description: string;
}

export interface Student {
  id: number;
  name: string;
  grades: Record<string, number>; // deliverableId -> grade (1-6)
  comments: Record<string, string>; // deliverableId -> comment
}

export interface KompetenzbandAverage {
  average: number | null;
  skillLevel: SkillLevel | null;
}

export interface SkillMatrixEntry {
  name: string;
  beginner: string;
  intermediate: string;
  advanced: string;
}

export type SkillMatrix = Record<Kompetenzband, SkillMatrixEntry>;

export interface SessionData {
  version: string;
  exportDate: string;
  students: Student[];
}
