'use client';

import { useState } from 'react';
import { Student } from '@/types';
import { ASSESSMENT_ITEMS } from '@/lib/constants';

interface Props {
  students: Student[];
  currentStudentId: number | null;
  onSelectStudent: (id: number) => void;
  onAddStudent: (name: string) => boolean;
  onRemoveStudent: (id: number) => void;
}

export default function StudentManagement({
  students,
  currentStudentId,
  onSelectStudent,
  onAddStudent,
  onRemoveStudent,
}: Props) {
  const [studentName, setStudentName] = useState('');

  const handleAdd = () => {
    if (onAddStudent(studentName.trim())) {
      setStudentName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Studierenden-Verwaltung</h2>

      {/* Add Student */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Name des Studierenden"
          maxLength={50}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-600"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-sm"
        >
          Student hinzufügen
        </button>
      </div>

      {/* Student List */}
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {students.length === 0 ? (
          <p className="text-gray-400 text-center py-8 italic">
            Keine Studierenden vorhanden
          </p>
        ) : (
          students.map((student) => {
            const gradeCount = Object.keys(student.grades).length;
            const isActive = currentStudentId === student.id;

            return (
              <div
                key={student.id}
                className={`flex justify-between items-center p-3 border-2 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-600 hover:bg-gray-50'
                }`}
              >
                <div
                  className="flex-1 flex flex-col gap-1"
                  onClick={() => onSelectStudent(student.id)}
                >
                  <strong className="text-gray-800">{student.name}</strong>
                  <span className="text-sm text-gray-500">
                    {gradeCount}/{ASSESSMENT_ITEMS.length} bewertet
                  </span>
                </div>
                <button
                  onClick={() => onRemoveStudent(student.id)}
                  className="w-9 h-9 bg-transparent text-red-600 border-2 border-red-600 rounded-lg text-xl leading-none hover:bg-red-600 hover:text-white transition-colors"
                  title="Löschen"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
