import { createClient } from "@/utils/supabase/client";
import { Penduduk, PendudukHistory } from "@/types/penduduk";

function mapPendudukFromDb(row: any): Penduduk {
  return {
    id: row.id,
    nik: row.nik,
    nama: row.nama,
    tempat_lahir: row.tempat_lahir,
    tanggal_lahir: row.tanggal_lahir,
    agama: row.agama,
    statusPenduduk: row.status_penduduk,
    statusVerifikasiDukcapil: row.status_verifikasi_dukcapil,
    keluargaId: row.keluarga_id,
    clusterdesaId: row.clusterdesa_id,
    jenisKelamin: row.jenis_kelamin,
    updated_at: row.updated_at,
    created_at: row.created_at,
  };
}

function mapPendudukToDb(payload: Partial<Penduduk> | Omit<Penduduk, "id">) {
  return {
    nik: payload.nik,
    nama: payload.nama,
    tempat_lahir: payload.tempat_lahir,
    tanggal_lahir: payload.tanggal_lahir,
    agama: payload.agama,
    status_penduduk: payload.statusPenduduk,
    status_verifikasi_dukcapil: payload.statusVerifikasiDukcapil,
    keluarga_id: payload.keluargaId,
    clusterdesa_id: payload.clusterdesaId,
    jenis_kelamin: payload.jenisKelamin,
    updated_at: payload.updated_at,
    created_at: payload.created_at,
  };
}

export async function getPendudukList(): Promise<Penduduk[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tweb_penduduk")
    .select("*")
    .order("nama", { ascending: true });
  
  if (error) throw error;

  return (data || []).map(mapPendudukFromDb);
}

export async function addPenduduk(
  payload: Omit<Penduduk, "id">,
): Promise<Penduduk> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tweb_penduduk")
    .insert(mapPendudukToDb(payload))
    .select()
    .single();

  if (error) throw error;

  return mapPendudukFromDb(data);
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
    .update(mapPendudukToDb(payload))
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

  return mapPendudukFromDb(data);
}

export async function deletePenduduk(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("tweb_penduduk").delete().eq("id", id);

  if (error) throw error;
}
