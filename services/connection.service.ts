import { createClient } from "@/utils/supabase/client";

export async function checkConnection() {
  try {
    const supabase = createClient();

    const { error } = await supabase.from("todos").select("id").limit(1);

    return !error;
  } catch {
    return false;
  }
}
