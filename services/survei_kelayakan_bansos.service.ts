import { createClient } from "@/utils/supabase/client";
import { 
  SurveiKelayakanBansos, 
  SurveiKelayakanBansosInsert, 
  SurveiKelayakanBansosUpdate 
} from "@/types/survei_kelayakan_bansos";

export async function getSurveiKelayakanList(): Promise<SurveiKelayakanBansos[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("survei_kelayakan_bansos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getSurveiKelayakanById(id: string): Promise<SurveiKelayakanBansos | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("survei_kelayakan_bansos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function addSurveiKelayakan(payload: SurveiKelayakanBansosInsert): Promise<SurveiKelayakanBansos> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("survei_kelayakan_bansos")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateSurveiKelayakan(
  id: string, 
  payload: SurveiKelayakanBansosUpdate
): Promise<SurveiKelayakanBansos> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("survei_kelayakan_bansos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteSurveiKelayakan(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("survei_kelayakan_bansos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}