import { createClient } from "@/utils/supabase/client";
import { Penduduk, PendudukHistory } from "@/types/penduduk";

export async function getPendudukList(): Promise<Penduduk[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tweb_penduduk")
    .select("*")
    .order("nama", { ascending: true });

  if (error) throw error;

  return data;
}

export async function addPenduduk(
  payload: Omit<Penduduk, "id">,
): Promise<Penduduk> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tweb_penduduk")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updatePenduduk(
  id: string,
  payload: Partial<Penduduk>,
  historyPayload: Omit<PendudukHistory, "id" | "createdAt">,
) {
  const supabase = createClient();

  // 1. Update data penduduk utama
  const { data, error } = await supabase
    .from("tweb_penduduk")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // 2. Catat riwayat perubahan ke tabel audit trail (penduduk_histories)
  const { error: historyError } = await supabase
    .from("penduduk_histories")
    .insert({
      penduduk_id: id,
      changed_by: historyPayload.changedBy,
      field_name: historyPayload.fieldName,
      old_value: historyPayload.oldValue,
      new_value: historyPayload.newValue,
    });

  if (historyError) throw historyError;

  return data;
}

export async function deletePenduduk(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("tweb_penduduk").delete().eq("id", id);

  if (error) throw error;
}
