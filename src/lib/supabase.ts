import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder",
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
