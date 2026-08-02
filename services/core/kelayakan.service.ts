import { createClient } from "@/utils/supabase/client";
import {
  SurveiKelayakan,
  SurveiKelayakanLog,
  SurveiKelayakanPayload,
} from "@/types/kelayakan";
import { ActorRole } from "@/types/mutasi";

function mapSurveiKelayakanFromDb(row: any): SurveiKelayakan {
  return {
    id: row.id,
    pendudukId: row.penduduk_id,
    nik: row.nik,
    nama: row.nama,
    skor: row.skor,
    kategori: row.kategori,
    indikatorDetail: row.indikator_detail,
    jenisDinding: row.jenis_dinding,
    jenisLantai: row.jenis_lantai,
    sumberAir: row.sumber_air,
    sanitasi: row.sanitasi,
    penghasilanBulanan: row.penghasilan_bulanan ? Number(row.penghasilan_bulanan) : null,
    adaLansia: row.ada_lansia || false,
    tipeProses: row.tipe_proses,
    status: row.status,
    feedbackSekdes: row.feedback_sekdes,
    tahunPeriode: row.tahun_periode,
    createdBy: row.created_by,
    approvedBy: row.approved_by,
    programId: row.program_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Ambil program terbaru berdasarkan created_at. Mengembalikan null jika belum ada program. */
async function getLatestProgramId(supabase: ReturnType<typeof createClient>): Promise<string | null> {
  const { data, error } = await supabase
    .from("program")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data.id as string;
}

function mapSurveiKelayakanLogFromDb(row: any): SurveiKelayakanLog {
  return {
    id: row.id,
    surveiId: row.survei_id,
    actorId: row.actor_id,
    actorRole: row.actor_role,
    action: row.action,
    statusAwal: row.status_awal,
    statusBaru: row.status_baru,
    catatan: row.catatan,
    createdAt: row.created_at,
  };
}

// 1. Get List Survei Kelayakan
export async function getSurveiKelayakanList(
  tahun?: string,
  createdByUserId?: string | null
): Promise<SurveiKelayakan[]> {
  const supabase = createClient();
  let query = supabase
    .from("tweb_survei_kelayakan")
    .select("*")
    .order("created_at", { ascending: false });

  if (tahun) {
    query = query.eq("tahun_periode", tahun);
  }

  if (createdByUserId) {
    try {
      query = query.or(`created_by_user_id.eq.${createdByUserId},created_by.eq.${createdByUserId}`);
    } catch {
      query = query.eq("created_by", createdByUserId);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapSurveiKelayakanFromDb);
}

// 2. Get Detail Survei Kelayakan by ID
export async function getSurveiKelayakanById(
  id: string
): Promise<SurveiKelayakan | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tweb_survei_kelayakan")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapSurveiKelayakanFromDb(data);
}

// 3. Submit Survei Kelayakan Baru (OFFLINE via RT / ONLINE via Warga)
export async function submitSurveiKelayakan(
  payload: SurveiKelayakanPayload,
  actorId: string,
  actorRole: ActorRole
): Promise<SurveiKelayakan> {
  const supabase = createClient();
  const surveiId = crypto.randomUUID();

  // Ambil program terbaru (created_at DESC) untuk di-link ke survei ini
  const latestProgramId = await getLatestProgramId(supabase);

  const dbPayload = {
    id: surveiId,
    penduduk_id: payload.pendudukId,
    nik: payload.nik,
    nama: payload.nama,
    skor: payload.skor,
    kategori: payload.kategori,
    indikator_detail: payload.indikatorDetail,
    jenis_dinding: payload.jenisDinding || null,
    jenis_lantai: payload.jenisLantai || null,
    sumber_air: payload.sumberAir || null,
    sanitasi: payload.sanitasi || null,
    penghasilan_bulanan: payload.penghasilanBulanan || null,
    ada_lansia: payload.adaLansia || false,
    tipe_proses: payload.tipeProses,
    status: "PENDING",
    tahun_periode: payload.tahunPeriode || "2026",
    created_by: actorId,
    program_id: latestProgramId, // FK ke program terbaru, null jika belum ada program
  };

  const { data, error } = await supabase
    .from("tweb_survei_kelayakan")
    .insert(dbPayload)
    .select()
    .single();

  if (error) throw error;

  // Catat Audit Log Tracking
  await supabase.from("tweb_survei_kelayakan_logs").insert({
    id: crypto.randomUUID(),
    survei_id: surveiId,
    actor_id: actorId,
    actor_role: actorRole,
    action: payload.tipeProses === "OFFLINE" ? "SUBMIT_OFFLINE" : "SUBMIT_ONLINE",
    status_awal: null,
    status_baru: "PENDING",
    catatan: payload.tipeProses === "OFFLINE"
      ? "Survei kelayakan bansos diinput langsung oleh RT"
      : "Permohonan survei kelayakan diajukan online oleh warga",
  });

  return mapSurveiKelayakanFromDb(data);
}

// 4. Verifikasi Survei Kelayakan oleh Sekdes
export async function verifySurveiKelayakanSekdes(
  id: string,
  isApproved: boolean,
  feedback: string | undefined,
  sekdesId: string
): Promise<SurveiKelayakan> {
  const supabase = createClient();
  const statusBaru = isApproved ? "APPROVED" : "REJECTED";

  const { data, error } = await supabase
    .from("tweb_survei_kelayakan")
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

  await supabase.from("tweb_survei_kelayakan_logs").insert({
    id: crypto.randomUUID(),
    survei_id: id,
    actor_id: sekdesId,
    actor_role: "SEKDES",
    action: isApproved ? "APPROVE" : "REJECT",
    status_awal: "PENDING",
    status_baru: statusBaru,
    catatan: feedback || (isApproved ? "Survei disetujui Sekdes" : "Survei ditolak Sekdes"),
  });

  return mapSurveiKelayakanFromDb(data);
}

// 5. Get Audit Log History Survei Kelayakan
export async function getSurveiKelayakanLogs(
  surveiId: string
): Promise<SurveiKelayakanLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tweb_survei_kelayakan_logs")
    .select("*")
    .eq("survei_id", surveiId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapSurveiKelayakanLogFromDb);
}
