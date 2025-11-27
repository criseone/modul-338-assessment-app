import { NextResponse } from 'next/server';
import { Student } from '@/types';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'students.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readStudents(): Promise<Student[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeStudents(students: Student[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2));
}

export async function GET() {
  const students = await readStudents();
  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const students: Student[] = await request.json();
  await writeStudents(students);
  return NextResponse.json({ success: true });
}
