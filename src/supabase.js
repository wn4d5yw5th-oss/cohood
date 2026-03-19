import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eujxukklmdieqgpiizoh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1anh1a2tsbWRpZXFncGlpem9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4ODM0MzksImV4cCI6MjA4OTQ1OTQzOX0.0O5YhOr3ZDi5nqJv7bWXnXr4XXllfpYZSTkEDWCpaHw';

export const supabase = createClient(supabaseUrl, supabaseKey);
