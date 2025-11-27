'use client';

import { useState } from 'react';
import { useStudents } from '@/hooks/useStudents';
import StudentManagement from '@/components/StudentManagement';
import Actions from '@/components/Actions';
import IndividualGrading from '@/components/IndividualGrading';
import BatchGrading from '@/components/BatchGrading';

export default function Home() {
  const studentData = useStudents();
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'individual' | 'batch'>('individual');

  const currentStudent = studentData.students.find((s) => s.id === currentStudentId) || null;

  if (studentData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white p-8 rounded-xl shadow-sm mb-8 text-center">
          <h1 className="text-blue-600 text-3xl font-bold mb-2">
            Modul 338 - Student Assessment
          </h1>
          <p className="text-gray-500 text-lg">
            Bewertung der Studierenden nach Kompetenzbändern
          </p>
        </header>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="lg:col-span-2">
            <StudentManagement
              students={studentData.students}
              currentStudentId={currentStudentId}
              onSelectStudent={setCurrentStudentId}
              onAddStudent={studentData.addStudent}
              onRemoveStudent={(id) => {
                if (studentData.removeStudent(id) && currentStudentId === id) {
                  setCurrentStudentId(null);
                }
              }}
            />
          </div>
          <div>
            <Actions
              students={studentData.students}
              viewMode={viewMode}
              onToggleView={() =>
                setViewMode((prev) => (prev === 'individual' ? 'batch' : 'individual'))
              }
              onClearData={() => {
                if (studentData.clearAllData()) {
                  setCurrentStudentId(null);
                }
              }}
              onImportSession={(data) => {
                try {
                  studentData.importSession(data);
                  setCurrentStudentId(null);
                  alert('Session erfolgreich importiert!');
                } catch (error) {
                  alert('Fehler beim Importieren der Session: ' + (error as Error).message);
                }
              }}
            />
          </div>
        </div>

        {/* Assessment Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm">
          {viewMode === 'individual' ? (
            <IndividualGrading
              student={currentStudent}
              onUpdateGrade={(deliverableId, grade) => {
                if (currentStudent) {
                  studentData.updateGrade(currentStudent.id, deliverableId, grade);
                }
              }}
              onUpdateComment={(deliverableId, comment) => {
                if (currentStudent) {
                  studentData.updateComment(currentStudent.id, deliverableId, comment);
                }
              }}
            />
          ) : (
            <BatchGrading
              students={studentData.students}
              onUpdateGrade={studentData.updateGrade}
              onUpdateComment={studentData.updateComment}
            />
          )}
        </div>
      </div>
    </div>
  );
}
