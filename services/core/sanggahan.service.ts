import { createClient } from "@/utils/supabase/client";
import {
  SanggahanPenduduk,
  SanggahanRumah,
  SanggahanLog,
  SanggahanPendudukPayload,
  SanggahanRumahPayload,
  JenisSanggahan,
} from "@/types/sanggahan";
import { ActorRole } from "@/types/mutasi";

// Mappers
function mapSanggahanPendudukFromDb(row: any): SanggahanPenduduk {
  return {
    id: row.id,
    pendudukId: row.penduduk_id,
    nikPelapor: row.nik_pelapor,
    namaPelapor: row.nama_pelapor,
    jenisKetidakcocokan: row.jenis_ketidakcocokan,
    alasanSanggahan: row.alasan_sanggahan,
    tipeProses: row.tipe_proses,
    reqMethod: row.req_method || row.tipe_proses || "ONLINE",
    status: row.status,
    feedbackSekdes: row.feedback_sekdes,
    tahunPeriode: row.tahun_periode,
    createdBy: row.created_by,
    approvedBy: row.approved_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSanggahanRumahFromDb(row: any): SanggahanRumah {
  return {
    id: row.id,
    pendudukId: row.penduduk_id,
    nikPelapor: row.nik_pelapor,
    namaPelapor: row.nama_pelapor,
    jenisDinding: row.jenis_dinding,
    jenisLantai: row.jenis_lantai,
    sanitasi: row.sanitasi,
    skorSistem: row.skor_sistem,
    alasanWarga: row.alasan_warga,
    tipeProses: row.tipe_proses,
    reqMethod: row.req_method || row.tipe_proses || "ONLINE",
    status: row.status,
    feedbackSekdes: row.feedback_sekdes,
    tahunPeriode: row.tahun_periode,
    createdBy: row.created_by,
    approvedBy: row.approved_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSanggahanLogFromDb(row: any): SanggahanLog {
  return {
    id: row.id,
    sanggahanId: row.sanggahan_id,
    jenisSanggahan: row.jenis_sanggahan,
    actorId: row.actor_id,
    actorRole: row.actor_role,
    action: row.action,
    statusAwal: row.status_awal,
    statusBaru: row.status_baru,
    catatan: row.catatan,
    createdAt: row.created_at,
  };
}

// 1. Get Sanggahan Data Diri List
export async function getSanggahanPendudukList(
  tahun?: string
): Promise<SanggahanPenduduk[]> {
  const supabase = createClient();
  let query = supabase
    .from("tweb_sanggahan_penduduk")
    .select("*")
    .order("created_at", { ascending: false });

  if (tahun) {
    query = query.eq("tahun_periode", tahun);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapSanggahanPendudukFromDb);
}

// 2. Get Sanggahan Rumah List
export async function getSanggahanRumahList(
  tahun?: string
): Promise<SanggahanRumah[]> {
  const supabase = createClient();
  let query = supabase
    .from("tweb_sanggahan_rumah")
    .select("*")
    .order("created_at", { ascending: false });

  if (tahun) {
    query = query.eq("tahun_periode", tahun);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapSanggahanRumahFromDb);
}

// 3. Submit Sanggahan Penduduk
export async function submitSanggahanPenduduk(
  payload: SanggahanPendudukPayload,
  actorId: string,
  actorRole: ActorRole
): Promise<SanggahanPenduduk> {
  const supabase = createClient();
  const sanggahanId = crypto.randomUUID();

  const dbPayload = {
    id: sanggahanId,
    penduduk_id: payload.pendudukId || null,
    nik_pelapor: payload.nikPelapor,
    nama_pelapor: payload.namaPelapor,
    jenis_ketidakcocokan: payload.jenisKetidakcocokan,
    alasan_sanggahan: payload.alasanSanggahan,
    tipe_proses: payload.tipeProses,
    req_method: payload.reqMethod || payload.tipeProses || "ONLINE",
    status: "PENDING",
    tahun_periode: payload.tahunPeriode || "2026",
    created_by: actorId,
  };

  const { data, error } = await supabase
    .from("tweb_sanggahan_penduduk")
    .insert(dbPayload)
    .select()
    .single();

  if (error) throw error;

  // Audit Log
  await supabase.from("tweb_sanggahan_logs").insert({
    id: crypto.randomUUID(),
    sanggahan_id: sanggahanId,
    jenis_sanggahan: "PENDUDUK",
    actor_id: actorId,
    actor_role: actorRole,
    action: payload.tipeProses === "OFFLINE" ? "SUBMIT_OFFLINE" : "SUBMIT_ONLINE",
    status_awal: null,
    status_baru: "PENDING",
    catatan: "Sanggahan perbaikan data diri warga dibuat",
  });

  return mapSanggahanPendudukFromDb(data);
}

// 4. Submit Sanggahan Rumah
export async function submitSanggahanRumah(
  payload: SanggahanRumahPayload,
  actorId: string,
  actorRole: ActorRole
): Promise<SanggahanRumah> {
  const supabase = createClient();
  const sanggahanId = crypto.randomUUID();

  const dbPayload = {
    id: sanggahanId,
    penduduk_id: payload.pendudukId || null,
    nik_pelapor: payload.nikPelapor,
    nama_pelapor: payload.namaPelapor,
    jenis_dinding: payload.jenisDinding,
    jenis_lantai: payload.jenisLantai,
    sanitasi: payload.sanitasi,
    skor_sistem: payload.skorSistem || 0,
    alasan_warga: payload.alasanWarga,
    tipe_proses: payload.tipeProses,
    req_method: payload.reqMethod || payload.tipeProses || "ONLINE",
    status: "PENDING",
    tahun_periode: payload.tahunPeriode || "2026",
    created_by: actorId,
  };

  const { data, error } = await supabase
    .from("tweb_sanggahan_rumah")
    .insert(dbPayload)
    .select()
    .single();

  if (error) throw error;

  // Audit Log
  await supabase.from("tweb_sanggahan_logs").insert({
    id: crypto.randomUUID(),
    sanggahan_id: sanggahanId,
    jenis_sanggahan: "RUMAH",
    actor_id: actorId,
    actor_role: actorRole,
    action: payload.tipeProses === "OFFLINE" ? "SUBMIT_OFFLINE" : "SUBMIT_ONLINE",
    status_awal: null,
    status_baru: "PENDING",
    catatan: "Sanggahan kondisi rumah warga dibuat",
  });

  return mapSanggahanRumahFromDb(data);
}

// 5. RT Meneruskan Sanggahan ke Sekdes
export async function forwardSanggahanToSekdes(
  id: string,
  jenis: JenisSanggahan,
  rtId: string
) {
  const supabase = createClient();
  const tableName = jenis === "PENDUDUK" ? "tweb_sanggahan_penduduk" : "tweb_sanggahan_rumah";

  const { data, error } = await supabase
    .from(tableName)
    .update({
      status: "DIAJUKAN_SEKDES",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await supabase.from("tweb_sanggahan_logs").insert({
    id: crypto.randomUUID(),
    sanggahan_id: id,
    jenis_sanggahan: jenis,
    actor_id: rtId,
    actor_role: "RT",
    action: "FORWARD_TO_SEKDES",
    status_awal: "PENDING",
    status_baru: "DIAJUKAN_SEKDES",
    catatan: "RT meninjau dan meneruskan sanggahan ke Sekdes",
  });

  return jenis === "PENDUDUK"
    ? mapSanggahanPendudukFromDb(data)
    : mapSanggahanRumahFromDb(data);
}

// 6. Verifikasi Sanggahan oleh Sekdes (Approve / Reject)
export async function verifySanggahanSekdes(
  id: string,
  jenis: JenisSanggahan,
  isApproved: boolean,
  feedback: string | undefined,
  sekdesId: string
) {
  const supabase = createClient();
  const tableName = jenis === "PENDUDUK" ? "tweb_sanggahan_penduduk" : "tweb_sanggahan_rumah";
  const statusBaru = isApproved ? "APPROVED" : "REJECTED";

  const { data, error } = await supabase
    .from(tableName)
    .update({
      status: statusBaru,
      feedback_sekdes: feedback || null,
      approved_by: sekdesId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await supabase.from("tweb_sanggahan_logs").insert({
    id: crypto.randomUUID(),
    sanggahan_id: id,
    jenis_sanggahan: jenis,
    actor_id: sekdesId,
    actor_role: "SEKDES",
    action: isApproved ? "APPROVE" : "REJECT",
    status_awal: "DIAJUKAN_SEKDES",
    status_baru: statusBaru,
    catatan: feedback || (isApproved ? "Disetujui Sekdes" : "Ditolak Sekdes"),
  });

  return jenis === "PENDUDUK"
    ? mapSanggahanPendudukFromDb(data)
    : mapSanggahanRumahFromDb(data);
}

// 7. Get Audit Log History Sanggahan
export async function getSanggahanLogs(sanggahanId: string): Promise<SanggahanLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tweb_sanggahan_logs")
    .select("*")
    .eq("sanggahan_id", sanggahanId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapSanggahanLogFromDb);
}
