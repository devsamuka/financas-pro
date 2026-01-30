
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wlzeqxmsuzhkxqqscasa.supabase.co';
const supabaseKey = 'sb_publishable__70127jgHb7lF6xYAbyUng_khobvhVG';

export const supabase = createClient(supabaseUrl, supabaseKey);
