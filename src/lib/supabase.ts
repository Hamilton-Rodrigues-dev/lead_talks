import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjuwqjcivkbchustkyjt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdXdxamNpdmtiY2h1c3RreWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcyNzcsImV4cCI6MjA3Nzc3MzI3N30.Z-LuptpiHBLASZdSutMxMAw_axOompBPTwGBylPdqo0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
