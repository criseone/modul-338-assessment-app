import { SkillMatrix, AssessmentItem, Kompetenzband } from '@/types';

export const SKILL_MATRIX: SkillMatrix = {
  'A': {
    name: 'Ausgangslage für die Lösungsfindung definieren',
    beginner: 'Ich kann die Hauptaspekte der Ausgangsproblematik identifizieren.',
    intermediate: 'Ich kann anhand der Problemstellung die zu erreichenden Ziele für jede beteiligte Zielgruppe identifizieren.',
    advanced: 'Ich kann eine umfassende Analyse der Ausganglage durchführen und mögliche Lösungsvarianten vorschlagen.'
  },
  'B': {
    name: 'Grundlagen für die Lösungsfindung schaffen',
    beginner: 'Ich kann mögliche Ziele und Anforderungen als Grundlage für die Lösungsfindung definieren.',
    intermediate: 'Ich kann relevante Erfolgskriterien anhand der definierten Ziele und Anforderungen ableiten und analysieren.',
    advanced: 'Ich kann die Erfolgskriterien korrekt bewerten und priorisieren.'
  },
  'C': {
    name: 'Zielgruppen definieren',
    beginner: 'Ich kann die Zielgruppe grob definieren und grundlegende Bedürfnisse identifizieren.',
    intermediate: 'Ich kann die Zielgruppe detailliert segmentieren und spezifische Bedürfnisse herausarbeiten.',
    advanced: 'Ich kann mögliche Vorgehen und Methoden auf Grund der relevanten Zielgruppen und deren spezifischen Bedürfnissen ableiten.'
  },
  'D': {
    name: 'Lösungsentwicklung methodisch aufgleisen und durchführen',
    beginner: 'Ich kann ein einfaches Lösungkonzept entwickeln.',
    intermediate: 'Ich kann ein mehrphasiges Lösungskonzept entwickeln und die einzelnen Phasen im Detail ausarbeiten.',
    advanced: 'Ich kann die einzelnen Teile der Lösungsentwicklung planen, deren Ziele definieren und methodisch vorbereiten und durchführen.'
  },
  'E': {
    name: 'Methoden für die Lösungsentwicklung anwenden',
    beginner: 'Ich kann einfache Methoden zur Lösungsentwicklung anwenden.',
    intermediate: 'Ich kann verschiedene Methoden für die Entwicklung von Lösungen situativ passend anwenden.',
    advanced: 'Ich kann Methoden für die Lösungsentwicklung kombinieren und für die einzelnen Phasen der Lösungsentwicklung gezielt einsetzen.'
  },
  'F': {
    name: 'Kreativitätstechniken anwenden',
    beginner: 'Ich kann einfache Kreativitätstechniken anwenden.',
    intermediate: 'Ich kann unterschiedliche Kreativitätstechniken situativ passend anwenden.',
    advanced: 'Ich kann passende Kreativitätstechniken in den einzelnen Phasen der Lösungsentwicklung gezielt anwenden.'
  },
  'G': {
    name: 'Lösungen anhand der Wirkung überprüfen',
    beginner: 'Ich kann einfache Methoden zur Wirkungsüberprüfung anwenden.',
    intermediate: 'Ich kann verschiedene Methoden zur Wirkungsüberprüfung zielgerichtet anwenden (z.B. Umfragen, Retrospektiven, Messwerte, Prototyp, etc.)',
    advanced: 'Ich kann die Ergebnisse aus der Überprüfung korrekt interpretieren und mögliche Verbesserungsmassnahmen ableiten.'
  },
  'H': {
    name: 'Erfolg messen',
    beginner: 'Ich kann den Erfolg der Lösung anhand einfacher Kriterien messen.',
    intermediate: 'Ich kann eine detaillierte Messungen durchführen und den Erfolg bewerten.',
    advanced: 'Ich kann anhand der definierten Messwerte die Qualität und den Erfüllungsgrad des erzielten Resultats beurteilen und darauf basierend mögliche Optimierungen (inhaltlich) ableiten.'
  },
  'I': {
    name: 'Ergebnisse dokumentieren und reflektieren',
    beginner: 'Ich kann grundlegende Ergebnisse dokumentieren und einfache Reflexionen durchführen.',
    intermediate: 'Ich kann die Ergebnisse zielgruppengerecht und detailliert aufbereiten/dokumentieren, und kann diese zielgruppengerecht reflektieren.',
    advanced: 'Ich kann die Ergebnisse richtig einschätzen und darauf basierend mögliche Optimierungsmassnahmen (methodisch) ableiten.'
  }
};

export const ASSESSMENT_ITEMS: AssessmentItem[] = [
  {
    id: "DSC1",
    deliverable: "Persona & Empathy Map",
    phase: "Discovery",
    kompetenzband: "C",
    description: "Definiert Zielgruppen und ihre Bedürfnisse."
  },
  {
    id: "DSC2",
    deliverable: "Methode Placemat",
    phase: "Discovery",
    kompetenzband: "A",
    description: "Erfasst Ausgangslage und Problemkontext."
  },
  {
    id: "DSC3",
    deliverable: "Mind Map",
    phase: "Discovery",
    kompetenzband: "B",
    description: "Sammelt und strukturiert Grundlagenwissen."
  },
  {
    id: "DSC4",
    deliverable: "Ishikawa-Diagramm",
    phase: "Discovery",
    kompetenzband: "B",
    description: "Identifiziert Ursachen und strukturiert das Problem."
  },
  {
    id: "DSC5",
    deliverable: "Selbstanalyse",
    phase: "Discovery",
    kompetenzband: "A",
    description: "Klärt Ausgangslage und eigenes Verständnis."
  },
  {
    id: "DSC6",
    deliverable: "Umfeldanalyse",
    phase: "Discovery",
    kompetenzband: "B",
    description: "Analysiert relevante Umweltfaktoren."
  },
  {
    id: "DFN1",
    deliverable: "Problemstatement",
    phase: "Define",
    kompetenzband: "D",
    description: "Leitet das Problem methodisch weiter."
  },
  {
    id: "DFN2",
    deliverable: "Gedankenfelder",
    phase: "Define",
    kompetenzband: "E",
    description: "Methode zur strukturierten Zielableitung."
  },
  {
    id: "DFN3",
    deliverable: "SWOT-Matrix",
    phase: "Define",
    kompetenzband: "E",
    description: "Bewertet Stärken, Schwächen, Chancen, Risiken."
  },
  {
    id: "DFN4",
    deliverable: "Soll-Ist-Vergleich",
    phase: "Define",
    kompetenzband: "D",
    description: "Gap-Analyse zur methodischen Planung."
  },
  {
    id: "DFN5",
    deliverable: "Anforderungen formulieren",
    phase: "Define",
    kompetenzband: "D",
    description: "Leitet klare Projektanforderungen ab."
  },
  {
    id: "DEV1",
    deliverable: "Kopfstand-Methode",
    phase: "Development",
    kompetenzband: "F",
    description: "Kreativitätstechnik zur Ideengenerierung."
  },
  {
    id: "DEV2",
    deliverable: "Bodystorming",
    phase: "Development",
    kompetenzband: "F",
    description: "Physische Ideation-Methode."
  },
  {
    id: "DEV3",
    deliverable: "Crazy 8s Deluxe",
    phase: "Development",
    kompetenzband: "F",
    description: "Schnelle Ideenproduktion."
  },
  {
    id: "DEV4",
    deliverable: "Brainwriting Pool",
    phase: "Development",
    kompetenzband: "F",
    description: "Kollaboratives Ideen-Sammeln."
  },
  {
    id: "DEV5",
    deliverable: "6-3-5 Methode",
    phase: "Development",
    kompetenzband: "F",
    description: "Systematisches Brainwriting."
  },
  {
    id: "DEV6",
    deliverable: "Prototyp",
    phase: "Development",
    kompetenzband: "E",
    description: "Erstellt einen funktionalen Prototyp."
  },
  {
    id: "DLV1",
    deliverable: "Feuerwehr-Methode",
    phase: "Delivery",
    kompetenzband: "G",
    description: "Bewertung und Priorisierung von Lösungen."
  },
  {
    id: "DLV2",
    deliverable: "Paarweiser Vergleich",
    phase: "Delivery",
    kompetenzband: "G",
    description: "Systematische Auswahl der besten Option."
  },
  {
    id: "DLV3",
    deliverable: "Pitch Presentation",
    phase: "Delivery",
    kompetenzband: "I",
    description: "Kommuniziert und reflektiert die Lösung."
  },
  {
    id: "DLV4",
    deliverable: "Documentation",
    phase: "Delivery",
    kompetenzband: "I",
    description: "Schriftliche Dokumentation und Reflexion."
  },
  {
    id: "DLV5",
    deliverable: "Walt Disney Denkstühle",
    phase: "Delivery",
    kompetenzband: "G",
    description: "Perspektivenwechsel zur Bewertung."
  },
  {
    id: "DLV6",
    deliverable: "Usertests",
    phase: "Delivery",
    kompetenzband: "H",
    description: "Messen der Wirkung und Nutzbarkeit."
  },
  {
    id: "DLV7",
    deliverable: "Business Model Canvas",
    phase: "Delivery",
    kompetenzband: "D",
    description: "Strukturiert die Lösung auf Geschäftsmodellebene."
  }
];

export const KOMPETENZBAND_NAMES: Record<Kompetenzband, string> = {
  'A': 'Ausgangslage für die Lösungsfindung definieren',
  'B': 'Grundlagen für die Lösungsfindung schaffen',
  'C': 'Zielgruppen definieren',
  'D': 'Lösungsentwicklung methodisch aufgleisen und durchführen',
  'E': 'Methoden für die Lösungsentwicklung anwenden',
  'F': 'Kreativitätstechniken anwenden',
  'G': 'Lösungen anhand der Wirkung überprüfen',
  'H': 'Erfolg messen',
  'I': 'Ergebnisse dokumentieren und reflektieren'
};

export const KOMPETENZBAND_COLORS: Record<Kompetenzband, string> = {
  'A': 'bg-red-600',
  'B': 'bg-orange-600',
  'C': 'bg-amber-600',
  'D': 'bg-emerald-600',
  'E': 'bg-teal-600',
  'F': 'bg-blue-600',
  'G': 'bg-indigo-600',
  'H': 'bg-purple-600',
  'I': 'bg-pink-600'
};

export const PHASE_COLORS: Record<Phase, string> = {
  'Discovery': 'bg-blue-600',
  'Define': 'bg-green-600',
  'Development': 'bg-purple-600',
  'Delivery': 'bg-red-600'
};
