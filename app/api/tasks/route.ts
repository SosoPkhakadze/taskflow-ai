// app/api/tasks/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Do NOT use NEXT_PUBLIC_ variables in server-side code.
// Create a separate, secure Supabase client for server-to-server interactions.
// This uses environment variables that are ONLY available on the server.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!; // <-- This is a new, secret key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// A simple security check using a bearer token.
// In a real app, this would be more robust (e.g., JWT, OAuth).
const API_TOKEN = process.env.API_SECRET_TOKEN!;

// Handler for POST requests to /api/tasks
export async function POST(request: Request) {
  // 1. Authenticate the request
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${API_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse the incoming request body
  try {
    const { text, priority = 'medium' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Task text is required' }, { status: 400 });
    }

    // 3. Insert the new task into the database
    const { data, error } = await supabase
      .from('tasks')
      .insert({ text: text, priority: priority, completed: false })
      .select()
      .single(); // .single() returns a single object instead of an array

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create task', details: error.message }, { status: 500 });
    }

    // 4. Return the newly created task
    return NextResponse.json(data, { status: 201 }); // 201 Created

  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}