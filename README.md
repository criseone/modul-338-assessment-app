# Modul 338 - Student Assessment Application

A comprehensive Next.js application for assessing students based on competency bands using the Design Thinking process.

## Features

### 📊 Student Management
- Add/remove students (maximum 15)
- Track grading progress per student
- Automatic data persistence using localStorage

### ✅ Assessment System
- **27 deliverables** across 4 phases:
  - **Discovery (DSC1-DSC6)**: 6 items
  - **Define (DFN1-DFN5)**: 5 items
  - **Development (DEV1-DEV6)**: 6 items
  - **Delivery (DLV1-DLV7)**: 7 items

### 📝 Grading
- **1-6 point scale** (Swiss grading system)
- Half-point increments (0.5 steps)
- Optional comments for each deliverable
- Empty fields don't affect calculations

### 🎨 Two Grading Views

#### Individual Grading
- Detailed view for one student at a time
- Visual competency band summaries with:
  - Progress bars showing skill level
  - Skill level badges (Beginner/Intermediate/Advanced)
  - Detailed skill descriptions
  - Swiss grade display (1-6 scale)
- Color-coded phases and competency bands
- Comment fields for each deliverable

#### Batch Grading
- Table view for grading multiple students efficiently
- All students and deliverables visible at once
- Sticky header and first column for easy navigation
- Real-time Swiss grade calculation
- Inline comment fields

### 🎯 Competency Bands (A-I)

Nine skill areas covering the complete problem-solving process:
- **Band A**: Ausgangslage für die Lösungsfindung definieren
- **Band B**: Grundlagen für die Lösungsfindung schaffen
- **Band C**: Zielgruppen definieren
- **Band D**: Lösungsentwicklung methodisch aufgleisen und durchführen
- **Band E**: Methoden für die Lösungsentwicklung anwenden
- **Band F**: Kreativitätstechniken anwenden
- **Band G**: Lösungen anhand der Wirkung überprüfen
- **Band H**: Erfolg messen
- **Band I**: Ergebnisse dokumentieren und reflektieren

### 📈 Grading Logic
- **Band-weighted averaging**: Each of the 9 competency bands contributes equally to the final grade
- **Skill levels** based on band averages:
  - Beginner: < 3.5
  - Intermediate: 3.5 - 5.0
  - Advanced: ≥ 5.0
- **Swiss grade**: Direct 1:1 mapping (average of band averages)

### 💾 Export/Import
- **CSV Export**: All grades, comments, band averages, skill levels, and Swiss grades
- **JSON Session**: Save/load complete session data for backups
- **Clear Data**: Remove all students and grades with confirmation

### 🎨 Color Coding

**Phases:**
- Discovery: Blue
- Define: Green
- Development: Purple
- Delivery: Red

**Competency Bands:**
- Band A: Red
- Band B: Orange
- Band C: Amber
- Band D: Emerald
- Band E: Teal
- Band F: Blue
- Band G: Indigo
- Band H: Purple
- Band I: Pink

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (custom useStudents hook)
- **Data Persistence**: localStorage
- **Type Safety**: Full TypeScript coverage

## Project Structure

```
assessment-app/
├── app/
│   ├── api/
│   │   └── students/
│   │       └── route.ts          # API route for data persistence
│   ├── page.tsx                  # Main application page
│   └── layout.tsx                # App layout
├── components/
│   ├── StudentManagement.tsx    # Student list and add/remove
│   ├── Actions.tsx               # Export, import, clear data
│   ├── IndividualGrading.tsx    # Detailed individual view
│   └── BatchGrading.tsx         # Table view for batch grading
├── hooks/
│   └── useStudents.ts           # Custom hook for student data
├── lib/
│   ├── constants.ts             # Assessment items, skill matrix, colors
│   └── utils.ts                 # Calculation utilities
└── types/
    └── index.ts                 # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Students
1. Enter student name in the input field
2. Click "Student hinzufügen" or press Enter
3. Student appears in the list with 0/27 graded

### Grading Students

**Individual View:**
1. Click on a student in the list
2. Enter grades (1-6) for each deliverable
3. Optionally add comments
4. View real-time competency band summaries and Swiss grade

**Batch View:**
1. Click "Batch-Bewertung" button
2. Grade multiple students in table format
3. Add comments inline
4. Switch back with "Einzelbewertung" button

### Exporting Data

**CSV Export:**
- Click "Als CSV exportieren"
- Includes all grades, comments, band averages, and Swiss grades
- Opens in Excel or any spreadsheet application

**Session Save:**
- Click "Session speichern" to download JSON file
- Contains complete application state
- Use "Session laden" to restore

## Data Model

```typescript
interface Student {
  id: number;
  name: string;
  grades: Record<string, number>;    // deliverableId -> grade (1-6)
  comments: Record<string, string>;  // deliverableId -> comment
}

interface AssessmentItem {
  id: string;                        // e.g., "DSC1", "DFN2"
  deliverable: string;
  phase: Phase;
  kompetenzband: Kompetenzband;
  description: string;
}
```

## Key Features

### Band-Weighted Grading
Unlike simple averaging, each competency band has equal weight in the final grade, regardless of how many deliverables it contains. This ensures balanced assessment across all skill areas.

### Real-Time Calculations
All averages, skill levels, and Swiss grades update automatically as you enter data. No need to save or recalculate manually.

### Data Persistence
All data is automatically saved to localStorage. Your work persists across browser sessions until you explicitly clear it.

### Responsive Design
Works on desktop, tablet, and mobile devices with adaptive layouts.

## Screenshots

### Easy Assessment
<img width="1624" height="1060" alt="Screenshot 2025-11-27 at 22 48 47" src="https://github.com/user-attachments/assets/32815561-a71e-4f60-b1fc-cd125844e950" />

### Automatic Grading
<img width="1624" height="1060" alt="Screenshot 2025-11-27 at 22 50 30" src="https://github.com/user-attachments/assets/186f911a-cad9-4e50-bfeb-38ae2c105f13" />


## Contributing

This is an educational assessment tool for Modul 338. Customize as needed for your specific requirements.

## License

MIT
