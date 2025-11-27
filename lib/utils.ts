import { Student, KompetenzbandAverage, SkillLevel, Kompetenzband } from '@/types';
import { ASSESSMENT_ITEMS } from './constants';

export function getSkillLevel(average: number | null): SkillLevel | null {
  if (average === null) return null;
  if (average < 3.5) return 'beginner';
  if (average < 5.0) return 'intermediate';
  return 'advanced';
}

export function calculateKompetenzbandAverages(
  student: Student
): Record<Kompetenzband, KompetenzbandAverage> {
  const averages: Record<string, KompetenzbandAverage> = {};

  // Group deliverables by Kompetenzband
  const grouped: Record<string, string[]> = {};
  ASSESSMENT_ITEMS.forEach((d) => {
    if (!grouped[d.kompetenzband]) {
      grouped[d.kompetenzband] = [];
    }
    grouped[d.kompetenzband].push(d.id);
  });

  // Calculate average for each Kompetenzband
  Object.keys(grouped).forEach((band) => {
    const deliverableIds = grouped[band];
    const grades = deliverableIds
      .map((id) => student.grades[id])
      .filter((g) => g !== undefined && g !== null);

    if (grades.length > 0) {
      const sum = grades.reduce((a, b) => a + b, 0);
      const avg = sum / grades.length;
      averages[band] = {
        average: avg,
        skillLevel: getSkillLevel(avg),
      };
    } else {
      averages[band] = {
        average: null,
        skillLevel: null,
      };
    }
  });

  return averages as Record<Kompetenzband, KompetenzbandAverage>;
}

export function calculateSwissGrade(student: Student): number | null {
  // Calculate band averages first
  const bandAverages = calculateKompetenzbandAverages(student);

  // Get only bands that have been graded (non-null averages)
  const validBandAverages = Object.values(bandAverages)
    .map((data) => data.average)
    .filter((avg): avg is number => avg !== null);

  if (validBandAverages.length === 0) return null;

  // Calculate average of band averages (each band has equal weight)
  const sum = validBandAverages.reduce((a, b) => a + b, 0);
  const average = sum / validBandAverages.length;

  // Direct 1:1 mapping - grades are already in Swiss 1-6 scale
  return parseFloat(average.toFixed(1));
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
