import { createClient } from "@/utils/supabase/client";
import { UserProfile, UserRole, UserRoleRecord } from "@/types/auth";

// Helper mapper dari Supabase snake_case ke UserProfile camelCase
function mapProfileFromDb(penduduk: any, roleData?: any): UserProfile {
  const userRole: UserRole = (roleData?.role as UserRole) || "WARGA";

  return {
    id: penduduk.id,
    nik: penduduk.nik,
    nama: penduduk.nama,
    tempatLahir: penduduk.tempat_lahir,
    tanggalLahir: penduduk.tanggal_lahir,
    jenisKelamin: penduduk.jenis_kelamin,
    agama: penduduk.agama,
    statusPenduduk: penduduk.status_penduduk,
    statusVerifikasiDukcapil: penduduk.status_verifikasi_dukcapil,
    keluargaId: penduduk.keluarga_id,
    clusterdesaId: penduduk.clusterdesa_id,
    rtNumber: penduduk.tweb_clusterdesa?.nama,
    role: userRole,
  };
}

// 1. Login Tanpa Register Berdasarkan NIK
export async function loginByNik(nik: string): Promise<UserProfile> {
  const supabase = createClient();
  const cleanNik = nik.trim();

  if (!cleanNik) {
    throw new Error("NIK tidak boleh kosong.");
  }

  // A. Cari Warga berdasarkan NIK di tweb_penduduk
  const { data: penduduk, error: pendudukError } = await supabase
    .from("tweb_penduduk")
    .select("*")
    .eq("nik", cleanNik)
    .single();

  if (pendudukError || !penduduk) {
    throw new Error("NIK tidak terdaftar pada sistem kependudukan desa.");
  }

  // B. Cari Role Pengguna di tweb_user_role
  const { data: roleData } = await supabase
    .from("tweb_user_role")
    .select("*")
    .eq("penduduk_id", penduduk.id)
    .maybeSingle();

  // C. Jika belum memiliki entri role, buat role default 'WARGA'
  let finalRole = roleData;
  if (!roleData) {
    const newRoleId = crypto.randomUUID();
    const { data: insertedRole, error: insertRoleError } = await supabase
      .from("tweb_user_role")
      .insert({
        id: newRoleId,
        penduduk_id: penduduk.id,
        role: "WARGA",
      })
      .select()
      .single();

    if (!insertRoleError && insertedRole) {
      finalRole = insertedRole;
    }
  }

  return mapProfileFromDb(penduduk, finalRole);
}

// 2. Fetch Profile berdasarkan Penduduk ID
export async function getProfileByPendudukId(
  pendudukId: string,
): Promise<UserProfile> {
  const supabase = createClient();

  const { data: penduduk, error: pendudukError } = await supabase
    .from("tweb_penduduk")
    .select(
      `
    *,
    tweb_clusterdesa (
      id,
      nama
    )
  `,
    )
    .eq("id", pendudukId)
    .single();

  if (pendudukError || !penduduk) {
    throw new Error("Data profil penduduk tidak ditemukan.");
  }

  const { data: roleData } = await supabase
    .from("tweb_user_role")
    .select("*")
    .eq("penduduk_id", pendudukId)
    .maybeSingle();

  return mapProfileFromDb(penduduk, roleData);
}

// 3. Assign / Update Role Pengguna Desa
export async function setUserRole(
  pendudukId: string,
  role: UserRole,
): Promise<UserRole> {
  const supabase = createClient();

  const { data: existingRole } = await supabase
    .from("tweb_user_role")
    .select("*")
    .eq("penduduk_id", pendudukId)
    .maybeSingle();

  if (existingRole) {
    const { error } = await supabase
      .from("tweb_user_role")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("penduduk_id", pendudukId);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("tweb_user_role").insert({
      id: crypto.randomUUID(),
      penduduk_id: pendudukId,
      role,
    });

    if (error) throw error;
  }

  return role;
}

// 4. Get Semua Data Role Pengguna Desa (Untuk Admin)
export async function getAllUserRoles(): Promise<UserRoleRecord[]> {
  const supabase = createClient();
  const { data: roles, error } = await supabase
    .from("tweb_user_role")
    .select("*, tweb_penduduk(nik, nama)")
    .order("created_at", { ascending: false });

  if (error) {
    const { data: rawRoles } = await supabase
      .from("tweb_user_role")
      .select("*");
    const { data: pendudukList } = await supabase
      .from("tweb_penduduk")
      .select("id, nik, nama");
    const pMap = new Map((pendudukList || []).map((p) => [p.id, p]));

    return (rawRoles || []).map((r) => ({
      id: r.id,
      pendudukId: r.penduduk_id,
      nik: pMap.get(r.penduduk_id)?.nik || "-",
      nama: pMap.get(r.penduduk_id)?.nama || "Warga",
      role: r.role as UserRole,
      createdAt: r.created_at,
    }));
  }

  return (roles || []).map((r: any) => ({
    id: r.id,
    pendudukId: r.penduduk_id,
    nik: r.tweb_penduduk?.nik || "-",
    nama: r.tweb_penduduk?.nama || "Warga",
    role: r.role as UserRole,
    createdAt: r.created_at,
  }));
}

// 5. Hapus Penugasan Role User (Reset ke Default)
export async function deleteUserRole(pendudukId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("tweb_user_role")
    .delete()
    .eq("penduduk_id", pendudukId);

  if (error) throw error;
}
