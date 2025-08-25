// supabase 전용 클라이언트 파일
import { createClient } from "@supabase/supabase-js";
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
 
export const supabase = createClient(supabaseUrl, supabaseKey);