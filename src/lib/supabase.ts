import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface ScanRecord {
  id: string;
  user_id: string;
  image_data: string | null;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  scanned_at: string;
}
