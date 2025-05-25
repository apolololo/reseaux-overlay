// Configuration du client Supabase
import { createClient } from '@supabase/supabase-js';

// URL et clé publique de Supabase
const supabaseUrl = 'https://uejmtvhqzadtxrqtowtm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlam10dmhxemFkdHhycXRvd3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk0NTQ4MDAsImV4cCI6MjAxNTAzMDgwMH0.KlFwQaFZ9mQ-FVsV_wkRqQrLJdZHlvQpGTfJWOUJUJA';

// Création du client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;