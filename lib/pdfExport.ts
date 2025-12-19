import jsPDF from 'jspdf';
import { Student, Kompetenzband, Phase } from '@/types';
import { ASSESSMENT_ITEMS, KOMPETENZBAND_NAMES, SKILL_MATRIX } from './constants';
import { calculateKompetenzbandAverages, calculateSwissGrade } from './utils';

// Color mappings from Tailwind to RGB
const KOMPETENZBAND_RGB: Record<Kompetenzband, [number, number, number]> = {
  'A': [220, 38, 38],     // red-600
  'B': [234, 88, 12],     // orange-600
  'C': [217, 119, 6],     // amber-600
  'D': [5, 150, 105],     // emerald-600
  'E': [13, 148, 136],    // teal-600
  'F': [37, 99, 235],     // blue-600
  'G': [79, 70, 229],     // indigo-600
  'H': [147, 51, 234],    // purple-600
  'I': [219, 39, 119],    // pink-600
};

const PHASE_RGB: Record<Phase, [number, number, number]> = {
  'Discovery': [37, 99, 235],     // blue-600
  'Define': [22, 163, 74],        // green-600
  'Development': [147, 51, 234],  // purple-600
  'Delivery': [220, 38, 38],      // red-600
};

const SKILL_LEVEL_RGB: Record<string, [number, number, number]> = {
  'beginner': [251, 191, 36],     // yellow-400
  'intermediate': [96, 165, 250], // blue-400
  'advanced': [52, 211, 153],     // green-400
};

// Page configuration
const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN);

/**
 * Wraps text to fit within a maximum width
 */
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

/**
 * Checks if we need a page break and adds one if necessary
 */
function checkPageBreak(doc: jsPDF, currentY: number, requiredSpace: number): number {
  if (currentY + requiredSpace > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return currentY;
}

/**
 * Draws a colored badge with text
 */
function drawBadge(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  bgColor: [number, number, number],
  width: number = 30
): void {
  // Draw background
  doc.setFillColor(...bgColor);
  doc.roundedRect(x, y, width, 6, 1, 1, 'F');

  // Draw text
  doc.setTextColor(255, 255, 255); // white
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(text, x + width / 2, y + 4, { align: 'center' });
}

/**
 * Adds the header section
 */
function addHeader(doc: jsPDF, student: Student, currentY: number): number {
  // Blue gradient background (simulated with solid color)
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(MARGIN, currentY, CONTENT_WIDTH, 25, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Modul 338 - Bewertung nach Kompetenzbändern', PAGE_WIDTH / 2, currentY + 8, { align: 'center' });

  // Student name
  doc.setFontSize(14);
  doc.text(student.name, PAGE_WIDTH / 2, currentY + 16, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Exportiert am: ${dateStr}`, PAGE_WIDTH / 2, currentY + 22, { align: 'center' });

  return currentY + 30;
}

/**
 * Adds the Swiss grade section
 */
function addSwissGrade(doc: jsPDF, grade: number | null, currentY: number): number {
  if (grade === null) return currentY;

  currentY = checkPageBreak(doc, currentY, 30);

  // Purple gradient background (simulated with solid color)
  doc.setFillColor(147, 51, 234); // purple-600
  doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 25, 2, 2, 'F');

  // Section title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Schweizer Note', PAGE_WIDTH / 2, currentY + 6, { align: 'center' });

  // Grade number
  doc.setFontSize(24);
  doc.text(grade.toString(), PAGE_WIDTH / 2, currentY + 15, { align: 'center' });

  // Scale description
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Skala: 1 (schlecht) - 6 (sehr gut)', PAGE_WIDTH / 2, currentY + 21, { align: 'center' });

  return currentY + 30;
}

/**
 * Adds a section header
 */
function addSectionHeader(doc: jsPDF, title: string, y: number, color: [number, number, number]): number {
  y = checkPageBreak(doc, y, 12);

  doc.setFillColor(...color);
  doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title, MARGIN + 3, y + 5.5);

  return y + 12;
}

/**
 * Adds deliverables grouped by phase
 */
function addDeliverables(doc: jsPDF, student: Student, currentY: number): number {
  // Group deliverables by phase
  const phases: Phase[] = ['Discovery', 'Define', 'Development', 'Delivery'];

  for (const phase of phases) {
    const phaseItems = ASSESSMENT_ITEMS.filter(item => item.phase === phase);

    // Phase header
    currentY = addSectionHeader(doc, `${phase} Phase`, currentY, PHASE_RGB[phase]);

    // Add each deliverable
    for (const deliverable of phaseItems) {
      currentY = checkPageBreak(doc, currentY, 25);

      // Box for deliverable
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.rect(MARGIN, currentY, CONTENT_WIDTH, 22);

      let yPos = currentY + 5;

      // ID and name
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${deliverable.id}: ${deliverable.deliverable}`, MARGIN + 3, yPos);

      // Badges
      drawBadge(doc, phase, CONTENT_WIDTH + MARGIN - 75, yPos - 3, PHASE_RGB[phase], 30);
      drawBadge(doc, `Band ${deliverable.kompetenzband}`, CONTENT_WIDTH + MARGIN - 40, yPos - 3,
                KOMPETENZBAND_RGB[deliverable.kompetenzband], 35);

      yPos += 5;

      // Description
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(deliverable.description, MARGIN + 3, yPos);

      yPos += 5;

      // Grade
      const grade = student.grades[deliverable.id];
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(`Note: ${grade !== undefined && grade !== null ? grade.toFixed(1) : '-'}`, MARGIN + 3, yPos);

      // Comment
      const comment = student.comments?.[deliverable.id];
      if (comment && comment.trim()) {
        yPos += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        const wrappedComment = wrapText(doc, `Kommentar: ${comment}`, CONTENT_WIDTH - 6);
        // Limit to 2 lines to fit in the box
        const displayComment = wrappedComment.slice(0, 2);
        for (const line of displayComment) {
          doc.text(line, MARGIN + 3, yPos);
          yPos += 3;
        }
      }

      currentY += 25;
    }

    currentY += 3; // Space between phases
  }

  return currentY;
}

/**
 * Draws a progress bar showing skill level position
 */
function drawProgressBar(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  progressPercent: number,
  displayValue: string
): void {
  // Draw three sections (beginner, intermediate, advanced)
  const sectionWidth = width / 3;

  // Beginner section (yellow)
  doc.setFillColor(254, 243, 199); // yellow-100
  doc.rect(x, y, sectionWidth, height, 'F');

  // Intermediate section (blue)
  doc.setFillColor(219, 234, 254); // blue-100
  doc.rect(x + sectionWidth, y, sectionWidth, height, 'F');

  // Advanced section (green)
  doc.setFillColor(209, 250, 229); // green-100
  doc.rect(x + sectionWidth * 2, y, sectionWidth, height, 'F');

  // Draw border around progress bar
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.rect(x, y, width, height);

  // Draw position indicator line
  const lineX = x + (width * progressPercent / 100);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(lineX, y, lineX, y + height);

  // Draw value label above the line
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(lineX - 6, y - 5, 12, 4, 0.5, 0.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(displayValue, lineX, y - 2, { align: 'center' });

  // Draw small triangle pointer (pointing down to the bar)
  const triangleSize = 0.8;
  doc.setFillColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  // Draw triangle using lines
  doc.line(lineX, y - 1, lineX - triangleSize, y - triangleSize - 1);
  doc.line(lineX, y - 1, lineX + triangleSize, y - triangleSize - 1);
  doc.line(lineX - triangleSize, y - triangleSize - 1, lineX + triangleSize, y - triangleSize - 1);

  // Draw section labels below
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('Beginner', x + sectionWidth / 2, y + height + 3, { align: 'center' });
  doc.text('Intermediate', x + sectionWidth + sectionWidth / 2, y + height + 3, { align: 'center' });
  doc.text('Advanced', x + sectionWidth * 2 + sectionWidth / 2, y + height + 3, { align: 'center' });
}

/**
 * Adds Kompetenzband summary section
 */
function addKompetenzbandSummary(doc: jsPDF, student: Student, currentY: number): number {
  const averages = calculateKompetenzbandAverages(student);

  currentY = addSectionHeader(doc, 'Kompetenzband-Zusammenfassung', currentY, [37, 99, 235]);

  const bands: Kompetenzband[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  for (const band of bands) {
    const data = averages[band];
    currentY = checkPageBreak(doc, currentY, 30);

    // Band box - increased height to accommodate progress bar
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(MARGIN, currentY, CONTENT_WIDTH, 28);

    let yPos = currentY + 5;

    // Band letter and name
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Band ${band}`, MARGIN + 3, yPos);

    // Average badge
    const avgText = data.average !== null ? data.average.toFixed(2) : '-';
    drawBadge(doc, avgText, CONTENT_WIDTH + MARGIN - 50, yPos - 3, KOMPETENZBAND_RGB[band], 20);

    // Skill level badge
    if (data.skillLevel) {
      const skillLabels = { beginner: 'BEG', intermediate: 'INT', advanced: 'ADV' };
      drawBadge(doc, skillLabels[data.skillLevel], CONTENT_WIDTH + MARGIN - 25, yPos - 3,
                SKILL_LEVEL_RGB[data.skillLevel], 20);
    }

    yPos += 4;

    // Band name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const bandName = KOMPETENZBAND_NAMES[band];
    const wrappedName = wrapText(doc, bandName, CONTENT_WIDTH - 6);
    doc.text(wrappedName[0], MARGIN + 3, yPos);

    yPos += 4;

    // Progress bar visualization
    if (data.average !== null) {
      const progressPercent = ((data.average - 1) / 5) * 100;
      const progressBarWidth = CONTENT_WIDTH - 6;
      const progressBarHeight = 5;
      drawProgressBar(
        doc,
        MARGIN + 3,
        yPos,
        progressBarWidth,
        progressBarHeight,
        progressPercent,
        avgText
      );
      yPos += progressBarHeight + 5; // Space for bar and labels
    }

    // Skill description
    if (data.skillLevel && SKILL_MATRIX[band]) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const skillDesc = SKILL_MATRIX[band][data.skillLevel];
      const wrappedDesc = wrapText(doc, skillDesc, CONTENT_WIDTH - 6);
      doc.text(wrappedDesc[0], MARGIN + 3, yPos);
      if (wrappedDesc.length > 1) {
        yPos += 3;
        doc.text(wrappedDesc[1], MARGIN + 3, yPos);
      }
    }

    currentY += 31;
  }

  return currentY;
}

/**
 * Adds footer to the current page
 */
function addFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);

    const timestamp = new Date().toISOString();
    doc.text(`Generiert: ${timestamp}`, MARGIN, PAGE_HEIGHT - 10);
    doc.text(`Seite ${i} von ${pageCount}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 10, { align: 'right' });
  }
}

/**
 * Sanitizes student name for use in filename
 */
function sanitizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Main export function - generates and downloads PDF for a student
 */
export async function generateStudentPDF(student: Student): Promise<void> {
  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let currentY = MARGIN;

    // Add sections
    currentY = addHeader(doc, student, currentY);

    const swissGrade = calculateSwissGrade(student);
    currentY = addSwissGrade(doc, swissGrade, currentY);

    currentY += 5; // Extra space after Swiss grade

    currentY = addDeliverables(doc, student, currentY);

    currentY += 5; // Space before Kompetenzband summary

    addKompetenzbandSummary(doc, student, currentY);

    // Add footer to all pages
    addFooter(doc);

    // Generate filename
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `assessment-${sanitizeName(student.name)}-${dateStr}.pdf`;

    // Download PDF
    doc.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF-Generierung fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}
