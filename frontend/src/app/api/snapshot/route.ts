import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // The snapshot is located in the backend folder, one level up from frontend
    const snapshotPath = path.join(process.cwd(), '..', 'backend', 'snapshot.json');
    const fileContents = await fs.readFile(snapshotPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading snapshot.json:', error);
    return NextResponse.json(
      { error: 'Failed to read snapshot data' },
      { status: 500 }
    );
  }
}
