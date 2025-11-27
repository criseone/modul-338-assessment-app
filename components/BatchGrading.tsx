'use client';

import { Student, Phase } from '@/types';
import { ASSESSMENT_ITEMS, PHASE_COLORS } from '@/lib/constants';
import { calculateSwissGrade } from '@/lib/utils';

interface Props {
  students: Student[];
  onUpdateGrade: (studentId: number, deliverableId: string, grade: number | null) => void;
  onUpdateComment: (studentId: number, deliverableId: string, comment: string) => void;
}

export default function BatchGrading({ students, onUpdateGrade, onUpdateComment }: Props) {
  if (students.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-5 text-gray-800">Batch-Bewertung</h2>
        <p className="text-gray-500 text-center py-10 text-lg">
          Keine Studierenden vorhanden. Bitte fügen Sie zuerst Studierende hinzu.
        </p>
      </div>
    );
  }

  const phases: Phase[] = ['Discovery', 'Define', 'Development', 'Delivery'];

  const handleGradeChange = (studentId: number, deliverableId: string, value: string) => {
    if (value === '') {
      onUpdateGrade(studentId, deliverableId, null);
    } else {
      const numGrade = parseFloat(value);
      if (!isNaN(numGrade) && numGrade >= 1 && numGrade <= 6) {
        onUpdateGrade(studentId, deliverableId, numGrade);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-5 text-gray-800">Batch-Bewertung</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 z-20 bg-blue-600 text-left px-4 py-3 font-semibold min-w-[150px] border-r-2 border-blue-700">
                Student
              </th>
              {phases.map((phase) => {
                const phaseDeliverables = ASSESSMENT_ITEMS.filter((d) => d.phase === phase);
                return phaseDeliverables.map((d) => (
                  <th
                    key={d.id}
                    className={`px-2 py-3 text-center font-semibold border-b-2 min-w-[80px] ${PHASE_COLORS[phase]} border-opacity-50`}
                    title={`${d.deliverable} - ${d.description}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold">{d.id}</span>
                      <span className="bg-white/30 px-2 py-0.5 rounded text-xs font-medium">
                        {phase}
                      </span>
                    </div>
                  </th>
                ));
              })}
              <th className="px-3 py-3 bg-purple-600 font-bold min-w-[80px]">Note</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const swissGrade = calculateSwissGrade(student);

              return (
                <tr
                  key={student.id}
                  className={`transition-colors hover:bg-gray-50 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td
                    className={`sticky left-0 z-10 px-4 py-2 font-semibold text-gray-800 border-r-2 border-gray-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {student.name}
                  </td>
                  {phases.map((phase) => {
                    const phaseDeliverables = ASSESSMENT_ITEMS.filter((d) => d.phase === phase);
                    return phaseDeliverables.map((d) => {
                      const grade = student.grades[d.id] || '';
                      const comment = student.comments?.[d.id] || '';
                      const hasComment = comment.length > 0;

                      return (
                        <td key={d.id} className="px-1 py-1 text-center border-b border-gray-200">
                          <div className="flex flex-col gap-1">
                            <input
                              type="number"
                              min="1"
                              max="6"
                              step="0.5"
                              value={grade}
                              onChange={(e) => handleGradeChange(student.id, d.id, e.target.value)}
                              placeholder="-"
                              className="w-full px-2 py-1.5 border-2 border-gray-200 rounded text-sm font-semibold text-center transition-colors focus:outline-none focus:border-blue-600 focus:bg-blue-50"
                            />
                            <textarea
                              value={comment}
                              onChange={(e) => onUpdateComment(student.id, d.id, e.target.value)}
                              placeholder="💬"
                              rows={1}
                              title={hasComment ? comment : 'Kommentar hinzufügen'}
                              className={`w-full px-2 py-1 border-2 rounded text-xs transition-colors focus:outline-none focus:border-blue-600 focus:bg-blue-50 resize-none ${
                                hasComment ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                              }`}
                            />
                          </div>
                        </td>
                      );
                    });
                  })}
                  <td className="px-3 py-2 bg-gradient-to-br from-purple-50 to-purple-100 font-bold text-base text-blue-600 text-center border-b border-gray-200">
                    {swissGrade !== null ? swissGrade : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
