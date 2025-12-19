'use client';

import { useState } from 'react';
import { Student } from '@/types';
import { ASSESSMENT_ITEMS, SKILL_MATRIX, KOMPETENZBAND_NAMES, KOMPETENZBAND_COLORS, PHASE_COLORS } from '@/lib/constants';
import { calculateKompetenzbandAverages, calculateSwissGrade } from '@/lib/utils';
import { generateStudentPDF } from '@/lib/pdfExport';

interface Props {
  student: Student | null;
  onUpdateGrade: (deliverableId: string, grade: number | null) => void;
  onUpdateComment: (deliverableId: string, comment: string) => void;
}

export default function IndividualGrading({ student, onUpdateGrade, onUpdateComment }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  if (!student) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-5 text-gray-800">Bewertung</h2>
        <p className="text-gray-500 text-center py-10 text-lg">
          Wählen Sie einen Studierenden aus der Liste aus, um die Bewertung zu starten.
        </p>
      </div>
    );
  }

  const averages = calculateKompetenzbandAverages(student);
  const swissGrade = calculateSwissGrade(student);

  const handleGradeChange = (deliverableId: string, value: string) => {
    if (value === '') {
      onUpdateGrade(deliverableId, null);
    } else {
      const numGrade = parseFloat(value);
      if (!isNaN(numGrade) && numGrade >= 1 && numGrade <= 6) {
        onUpdateGrade(deliverableId, numGrade);
      }
    }
  };

  const handlePdfExport = async () => {
    setIsExporting(true);
    try {
      await generateStudentPDF(student);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Fehler beim Erstellen des PDF: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Bewertung</h2>
          <h3 className="text-blue-600 text-xl font-semibold">{student.name}</h3>
        </div>
        <button
          onClick={handlePdfExport}
          disabled={isExporting}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isExporting ? 'Generiere PDF...' : 'PDF Export'}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>
      </div>

      {/* Deliverables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {ASSESSMENT_ITEMS.map((deliverable) => {
          const currentGrade = student.grades[deliverable.id] || '';
          const currentComment = student.comments?.[deliverable.id] || '';

          return (
            <div
              key={deliverable.id}
              className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 transition-all hover:border-blue-600 hover:shadow-sm"
            >
              <div className="flex gap-2 items-center mb-2 flex-wrap">
                <span className="font-bold text-blue-600">{deliverable.id}</span>
                <span className={`${PHASE_COLORS[deliverable.phase]} text-white px-2 py-1 rounded text-xs font-semibold capitalize`}>
                  {deliverable.phase}
                </span>
                <span className={`${KOMPETENZBAND_COLORS[deliverable.kompetenzband]} text-white px-2 py-1 rounded text-xs font-semibold ml-auto`}>
                  Band {deliverable.kompetenzband}
                </span>
              </div>
              <div className="text-gray-800 mb-2 text-sm font-semibold">{deliverable.deliverable}</div>
              <div className="text-gray-500 text-sm mb-3 italic">{deliverable.description}</div>
              <input
                type="number"
                min="1"
                max="6"
                step="0.5"
                value={currentGrade}
                onChange={(e) => handleGradeChange(deliverable.id, e.target.value)}
                placeholder="1-6"
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-base font-semibold text-center transition-colors focus:outline-none focus:border-blue-600 focus:bg-blue-50 mb-2"
              />
              <textarea
                value={currentComment}
                onChange={(e) => onUpdateComment(deliverable.id, e.target.value)}
                placeholder="Kommentar (optional)"
                rows={2}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-600 focus:bg-blue-50 resize-none"
              />
            </div>
          );
        })}
      </div>

      {/* Kompetenzband Summary */}
      <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
        <h3 className="text-gray-800 text-xl font-semibold mb-5">Kompetenzband-Durchschnitte</h3>

        {/* Swiss Grade Display */}
        {swissGrade !== null && (
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-xl text-center mb-6 shadow-lg">
            <h4 className="text-lg font-semibold mb-3 opacity-95">Schweizer Note</h4>
            <div className="text-5xl font-bold mb-2 drop-shadow-md">{swissGrade}</div>
            <p className="text-sm opacity-90">Skala: 1 (schlecht) - 6 (sehr gut)</p>
          </div>
        )}

        {/* Kompetenzband Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(averages) as Array<keyof typeof averages>)
            .sort()
            .map((band) => {
              const data = averages[band];
              const displayValue = data.average !== null ? data.average.toFixed(2) : '-';
              const skillLevel = data.skillLevel;
              const bandName = KOMPETENZBAND_NAMES[band] || '';

              let progressPercent = 0;
              if (data.average !== null) {
                progressPercent = ((data.average - 1) / 5) * 100;
              }

              const skillLevelLabels = {
                beginner: 'Beginner',
                intermediate: 'Intermediate',
                advanced: 'Advanced',
              };

              const skillLevelColors = {
                beginner: 'bg-yellow-400 text-yellow-900',
                intermediate: 'bg-blue-400 text-blue-900',
                advanced: 'bg-green-400 text-green-900',
              };

              return (
                <div
                  key={band}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 transition-all hover:border-blue-600 hover:shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <strong className={`text-lg ${KOMPETENZBAND_COLORS[band].replace('bg-', 'text-')}`}>Band {band}</strong>
                    <div className="flex gap-2 items-center">
                      <span className={`${KOMPETENZBAND_COLORS[band]} text-white px-3 py-1 rounded font-bold text-base`}>
                        {displayValue}
                      </span>
                      {skillLevel && (
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold uppercase ${skillLevelColors[skillLevel]}`}
                        >
                          {skillLevelLabels[skillLevel]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm mb-3">{bandName}</div>

                  {/* Progress Bar */}
                  {data.average !== null && (
                    <div className="mb-3">
                      <div className="relative h-8 rounded-full overflow-hidden flex shadow-inner">
                        <div className="flex-1 bg-gradient-to-r from-yellow-100 to-yellow-200"></div>
                        <div className="flex-1 bg-gradient-to-r from-blue-100 to-blue-200"></div>
                        <div className="flex-1 bg-gradient-to-r from-green-100 to-green-300"></div>
                        <div
                          className="absolute top-0 h-full w-0.5 bg-gray-800 shadow-md transition-all"
                          style={{ left: `${progressPercent}%` }}
                        >
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-md">
                            {displayValue}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 px-1">
                        <span className="text-xs text-gray-500 font-semibold">Beginner</span>
                        <span className="text-xs text-gray-500 font-semibold">Intermediate</span>
                        <span className="text-xs text-gray-500 font-semibold">Advanced</span>
                      </div>
                    </div>
                  )}

                  {/* Skill Description */}
                  {skillLevel && SKILL_MATRIX[band] && (
                    <div className="mt-3 p-3 bg-gray-50 border-l-3 border-l-blue-600 text-sm text-gray-700 italic">
                      {SKILL_MATRIX[band][skillLevel]}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
