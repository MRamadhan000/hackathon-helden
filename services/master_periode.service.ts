import { createClient } from "@/utils/supabase/client";
import { MasterPeriode, MasterPeriodeInsert, MasterPeriodeUpdate } from "@/types/master_periode";

export async function getMasterPeriodeList(): Promise<MasterPeriode[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("master_periode")
    .select("*")
    .order("tahun", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addMasterPeriode(payload: MasterPeriodeInsert): Promise<MasterPeriode> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("master_periode")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateMasterPeriode(id: number, payload: MasterPeriodeUpdate): Promise<MasterPeriode> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("master_periode")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteMasterPeriode(id: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("master_periode")
    .delete()
    .eq("id", id);

  if (error) throw error;
}