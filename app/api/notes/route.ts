// app/api/notes/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const API_TOKEN = process.env.API_SECRET_TOKEN!;

// Handler for POST requests to /api/notes
export async function POST(request: Request) {
  // 1. Authenticate the request
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${API_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { task_id, content } = await request.json();

    if (!task_id || !content) {
      return NextResponse.json({ error: 'task_id and content are required' }, { status: 400 });
    }

    // 3. Insert the new note into the task_notes table
    const { data, error } = await supabase
      .from('task_notes')
      .insert({ task_id: task_id, content: content })
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding note:', error);
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }

    // 4. Return the newly created note
    return NextResponse.json(data, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}