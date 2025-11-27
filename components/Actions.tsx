'use client';

import { useRef } from 'react';
import { Student, SessionData } from '@/types';
import { ASSESSMENT_ITEMS, KOMPETENZBAND_NAMES } from '@/lib/constants';
import { calculateKompetenzbandAverages, calculateSwissGrade } from '@/lib/utils';

interface Props {
  students: Student[];
  viewMode: 'individual' | 'batch';
  onToggleView: () => void;
  onClearData: () => void;
  onImportSession: (data: SessionData) => void;
}

export default function Actions({
  students,
  viewMode,
  onToggleView,
  onClearData,
  onImportSession,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToCSV = () => {
    if (students.length === 0) {
      alert('Keine Daten zum Exportieren vorhanden.');
      return;
    }

    let csv = 'Name';

    // Add deliverable columns (grade and comment)
    ASSESSMENT_ITEMS.forEach((d) => {
      csv += `,${d.id} Note,${d.id} Kommentar`;
    });

    // Add Kompetenzband average and skill level columns
    const bands = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    bands.forEach((band) => {
      csv += `,Band ${band} Durchschnitt,Band ${band} Level`;
    });

    csv += ',Schweizer Note\n';

    // Add student data
    students.forEach((student) => {
      csv += `"${student.name}"`;

      // Add grades and comments
      ASSESSMENT_ITEMS.forEach((d) => {
        const grade = student.grades[d.id];
        const comment = student.comments?.[d.id] || '';
        csv += `,${grade !== undefined ? grade : ''},"${comment.replace(/"/g, '""')}"`;
      });

      // Add averages and skill levels
      const averages = calculateKompetenzbandAverages(student);
      bands.forEach((band) => {
        const data = averages[band as keyof typeof averages];
        const avg = data.average !== null ? data.average.toFixed(2) : '';
        const level = data.skillLevel || '';
        csv += `,${avg},${level}`;
      });

      // Add Swiss grade
      const swissGrade = calculateSwissGrade(student);
      csv += `,${swissGrade !== null ? swissGrade : ''}`;

      csv += '\n';
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `assessment-export-${date}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSession = () => {
    if (students.length === 0) {
      alert('Keine Daten zum Exportieren vorhanden.');
      return;
    }

    const sessionData: SessionData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      students: students,
    };

    const json = JSON.stringify(sessionData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `session-${date}.json`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSession = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const sessionData = JSON.parse(event.target?.result as string);
        onImportSession(sessionData);
      } catch (error) {
        alert('Fehler beim Importieren der Session: ' + (error as Error).message);
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-800">Aktionen</h2>

      <button
        onClick={onToggleView}
        className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-sm"
      >
        {viewMode === 'individual' ? 'Batch-Bewertung' : 'Einzelbewertung'}
      </button>

      <button
        onClick={exportToCSV}
        className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all hover:-translate-y-0.5 shadow-sm"
      >
        Als CSV exportieren
      </button>

      <button
        onClick={exportSession}
        className="px-5 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all hover:-translate-y-0.5 shadow-sm"
      >
        Session speichern
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-5 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all hover:-translate-y-0.5 shadow-sm"
      >
        Session laden
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportSession}
        className="hidden"
      />

      <button
        onClick={onClearData}
        className="px-5 py-3 bg-transparent text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors"
      >
        Alle Daten löschen
      </button>
    </div>
  );
}
