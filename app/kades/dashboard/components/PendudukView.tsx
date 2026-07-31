"use client";

interface PendudukViewProps {
  currentView: string;
  mockWilayahData: any[];
  selectedRT: any;
  selectedKK: any;
  setSelectedRT: (rt: any) => void;
  setSelectedKK: (kk: any) => void;
  setCurrentView: (view: any) => void;
}

export default function PendudukView({
  currentView,
  mockWilayahData,
  selectedRT,
  selectedKK,
  setSelectedRT,
  setSelectedKK,
  setCurrentView,
}: PendudukViewProps) {
  if (currentView === "rt-list") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockWilayahData.map((rt) => (
            <div
              key={rt.id}
              onClick={() => {
                setSelectedRT(rt);
                setCurrentView("kk-list");
              }}
              className="bg-white p-5 border border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-500 transition"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 text-sm">{rt.nama}</h4>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                  {rt.totalWarga} Jiwa
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === "kk-list" && selectedRT) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold">
                <th className="p-4">Kepala Keluarga</th>
                <th className="p-4">Alamat Rumah</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {selectedRT.keluarga.map((kk: any) => (
                <tr key={kk.id} className="hover:bg-slate-50/60">
                  <td className="p-4 text-slate-900 font-bold">
                    {kk.kepalaKeluarga}
                  </td>
                  <td className="p-4 text-slate-500">{kk.alamat}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedKK(kk);
                        setCurrentView("anggota-list");
                      }}
                      className="px-3 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-lg shadow-2xs"
                    >
                      Lihat Anggota →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (currentView === "anggota-list" && selectedKK) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {selectedKK.anggota.map((anggota: any, i: number) => (
          <div
            key={i}
            className="bg-white p-4 border border-slate-200 rounded-xl space-y-2"
          >
            <h4 className="font-bold text-slate-900 text-sm">{anggota.nama}</h4>
            <div className="text-[11px] text-slate-500">
              Status: {anggota.status}
            </div>
            <div className="text-[11px] text-amber-600">
              Bansos: {anggota.bansos}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
