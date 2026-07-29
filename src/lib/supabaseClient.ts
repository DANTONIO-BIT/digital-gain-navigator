import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rjluunvachozgyixagnh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oMhxneWclWb8JOdw3TFWVA_A9UpM0nG";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
