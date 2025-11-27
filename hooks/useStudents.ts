'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Load students from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('assessmentData');
    if (savedData) {
      try {
        setStudents(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading students:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever students change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('assessmentData', JSON.stringify(students));
    }
  }, [students, loading]);

  const addStudent = (name: string) => {
    if (!name || name.trim() === '') {
      alert('Bitte geben Sie einen Namen ein.');
      return false;
    }

    if (students.length >= 15) {
      alert('Maximale Anzahl von 15 Studierenden erreicht.');
      return false;
    }

    if (students.some((s) => s.name === name)) {
      alert('Ein Student mit diesem Namen existiert bereits.');
      return false;
    }

    const newStudent: Student = {
      id: Date.now(),
      name: name,
      grades: {},
      comments: {},
    };

    setStudents([...students, newStudent]);
    return true;
  };

  const removeStudent = (studentId: number) => {
    if (confirm('Möchten Sie diesen Studierenden wirklich löschen?')) {
      setStudents(students.filter((s) => s.id !== studentId));
      return true;
    }
    return false;
  };

  const updateGrade = (studentId: number, deliverableId: string, grade: number | null) => {
    setStudents(students.map((student) => {
      if (student.id !== studentId) return student;

      const updatedGrades = { ...student.grades };
      if (grade === null || grade === undefined) {
        delete updatedGrades[deliverableId];
      } else if (grade >= 1 && grade <= 6) {
        updatedGrades[deliverableId] = grade;
      }

      return { ...student, grades: updatedGrades };
    }));
  };

  const updateComment = (studentId: number, deliverableId: string, comment: string) => {
    setStudents(students.map((student) => {
      if (student.id !== studentId) return student;

      const updatedComments = { ...student.comments };
      if (comment === '' || comment === null) {
        delete updatedComments[deliverableId];
      } else {
        updatedComments[deliverableId] = comment;
      }

      return { ...student, comments: updatedComments };
    }));
  };

  const clearAllData = () => {
    if (confirm('ACHTUNG: Möchten Sie wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      if (confirm('Sind Sie sicher? Alle Studierenden und Bewertungen werden gelöscht.')) {
        setStudents([]);
        return true;
      }
    }
    return false;
  };

  const importSession = (sessionData: { students: Student[] }) => {
    if (!sessionData.students || !Array.isArray(sessionData.students)) {
      throw new Error('Ungültiges Dateiformat');
    }
    setStudents(sessionData.students);
  };

  return {
    students,
    loading,
    addStudent,
    removeStudent,
    updateGrade,
    updateComment,
    clearAllData,
    importSession,
  };
}
