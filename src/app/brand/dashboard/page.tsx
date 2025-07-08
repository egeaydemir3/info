"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaListAlt, FaCheckCircle, FaChartBar } from "react-icons/fa";
import { supabase } from "@/utils/supabaseClient";

const sidebarItems = [
  { name: "Kampanya Oluştur", icon: <FaPlus size={22} /> },
  { name: "Aktif Kampanyalarım", icon: <FaListAlt size={22} /> },
  { name: "Tamamlanan Kampanyalarım", icon: <FaCheckCircle size={22} /> },
  { name: "Analizler", icon: <FaChartBar size={22} /> },
];

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<string>("Kampanya Oluştur");

  return (
    <div className="min-h-screen flex bg-[#222222]">
      {/* Sidebar */}
      <aside className="w-16 bg-[#18181b] flex flex-col py-8 items-center shadow-lg justify-between">
        <div className="flex flex-col items-center w-full gap-2">
          <div className="mb-8 text-white text-2xl font-bold">I</div>
          <nav className="flex flex-col gap-4">
            {sidebarItems.map((item) => (
              <div key={item.name} className="relative group flex justify-center">
                <button
                  className={`flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-[#232323] transition-colors ${activeTab === item.name ? "bg-[#232323]" : ""}`}
                  onClick={() => setActiveTab(item.name)}
                >
                  {item.icon}
                </button>
                <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 shadow-lg transition-opacity">
                  {item.name}
                </span>
              </div>
            ))}
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        {activeTab === "Kampanya Oluştur" && (
          <section className="w-full max-w-xl mx-auto bg-[#232323] rounded-2xl shadow-xl p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white mb-4">Kampanya Oluştur</h2>
            <CampaignCreateForm />
          </section>
        )}
        {activeTab === "Aktif Kampanyalarım" && (
          <section className="w-full max-w-xl mx-auto bg-[#232323] rounded-2xl shadow-xl p-8 flex flex-col gap-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Aktif Kampanyalarım</h2>
            <CampaignList />
          </section>
        )}
        {activeTab === "Tamamlanan Kampanyalarım" && (
          <section className="w-full max-w-xl mx-auto bg-[#232323] rounded-2xl shadow-xl p-8 flex flex-col gap-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Tamamlanan Kampanyalarım</h2>
            <div>Şu anda tamamlanan kampanyanız yok.</div>
          </section>
        )}
        {activeTab === "Analizler" && (
          <section className="w-full max-w-xl mx-auto bg-[#232323] rounded-2xl shadow-xl p-8 flex flex-col gap-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Analizler</h2>
            <div>Analizler yakında burada olacak.</div>
          </section>
        )}
      </main>
    </div>
  );
}

// Kampanya oluşturma formu bileşeni
function CampaignCreateForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Kullanıcı UID'sini al
    const user = await supabase.auth.getUser();
    const brand_id = user.data.user?.id;
    if (!brand_id) {
      setError("Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("campaigns").insert([
      {
        brand_id,
        title,
        description,
        reward,
        platforms,
        banner_url: bannerUrl,
        // is_approved ve created_at otomatik
      },
    ]);
    if (insertError) {
      setError("Kampanya eklenirken hata oluştu: " + insertError.message);
    } else {
      setSuccess("Kampanya başarıyla eklendi! Onaylanınca yayınlanacak.");
      setTitle("");
      setDescription("");
      setReward("");
      setPlatforms("");
      setBannerUrl("");
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Kampanya Başlığı"
        className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Kampanya Açıklaması"
        className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        rows={4}
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Ödül (ör: $1.00 / 1K izlenme)"
        className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        value={reward}
        onChange={e => setReward(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Platformlar (ör: Instagram, TikTok)"
        className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        value={platforms}
        onChange={e => setPlatforms(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Banner URL (opsiyonel)"
        className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        value={bannerUrl}
        onChange={e => setBannerUrl(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded transition-colors disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Kaydediliyor..." : "Kampanya Oluştur"}
      </button>
      {success && <div className="text-green-400 text-center">{success}</div>}
      {error && <div className="text-red-400 text-center">{error}</div>}
    </form>
  );
}

// Aktif kampanyaları listeleyen bileşen
function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [applications, setApplications] = useState<{ [campaignId: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchCampaignsAndApplications = async () => {
      setLoading(true);
      setError("");
      // Kullanıcı UID'sini al
      const user = await supabase.auth.getUser();
      const brand_id = user.data.user?.id;
      if (!brand_id) {
        setError("Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }
      // Kampanyaları çek
      const { data: campaignData, error: fetchError } = await supabase
        .from("campaigns")
        .select("id, title, description, reward, platforms, banner_url, is_approved, created_at, budget")
        .eq("brand_id", brand_id)
        .order("created_at", { ascending: false });
      if (fetchError) {
        setError("Kampanyalar yüklenirken hata oluştu: " + fetchError.message);
        setLoading(false);
        return;
      }
      setCampaigns(campaignData || []);
      // Her kampanya için başvuruları çek
      const appMap: { [campaignId: string]: any[] } = {};
      if (campaignData && campaignData.length > 0) {
        const campaignIds = campaignData.map((c: any) => c.id);
        const { data: appData, error: appError } = await supabase
          .from("applications")
          .select("id, campaign_id, influencer_id, status, video_url, created_at")
          .in("campaign_id", campaignIds);
        if (appError) {
          setError("Başvurular yüklenirken hata oluştu: " + appError.message);
          setLoading(false);
          return;
        }
        // Kampanya ID'ye göre grupla
        campaignIds.forEach((cid: string) => {
          appMap[cid] = (appData || []).filter((a: any) => a.campaign_id === cid);
        });
      }
      setApplications(appMap);
      setLoading(false);
    };
    fetchCampaignsAndApplications();
  }, []);

  // Kampanya silme fonksiyonu
  const handleDelete = async (campaignId: string) => {
    if (!window.confirm("Bu kampanyayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    setDeletingId(campaignId);
    setDeleteError("");
    const { error: deleteError } = await supabase.from("campaigns").delete().eq("id", campaignId);
    if (deleteError) {
      setDeleteError("Kampanya silinirken hata oluştu: " + deleteError.message);
      setDeletingId(null);
      return;
    }
    // Silinen kampanyayı listeden çıkar
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    setDeletingId(null);
  };

  if (loading) return <div>Kampanyalar yükleniyor...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (campaigns.length === 0) return <div>Şu anda aktif kampanyanız yok.</div>;

  return (
    <div className="flex flex-col gap-4">
      {deleteError && <div className="text-red-400 text-center">{deleteError}</div>}
      {campaigns.map((c) => {
        const apps = applications[c.id] || [];
        const participationCount = apps.length;
        const completedApps = apps.filter((a) => a.status === "completed");
        const completedCount = completedApps.length;
        // reward'ı sayıya çevir (ör: '100' veya '1.00')
        let reward = 0;
        if (typeof c.reward === "number") reward = c.reward;
        else if (typeof c.reward === "string") reward = parseFloat(c.reward.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
        const budget = c.budget !== undefined && c.budget !== null && c.budget !== "" ? Number(c.budget) : null;
        const remainingBudget = budget !== null ? budget - (completedCount * reward) : null;
        return (
          <div key={c.id} className="bg-[#18181b] rounded-xl p-4 text-left shadow border border-gray-700 relative flex flex-col justify-between min-h-[320px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">{c.title}</span>
              <span className={`text-xs px-2 py-1 rounded ${c.is_approved ? "bg-green-700" : "bg-yellow-700"}`}>{c.is_approved ? "Onaylandı" : "Onay Bekliyor"}</span>
            </div>
            <div className="text-sm mb-1">{c.description}</div>
            <div className="text-xs text-gray-400 mb-1">Platformlar: {c.platforms}</div>
            <div className="text-xs text-gray-400 mb-1">Ödül: {c.reward}</div>
            <div className="text-xs text-gray-400 mb-1">Toplam Bütçe: {budget !== null ? `${budget} TL` : "Belirtilmedi"}</div>
            <div className="text-xs text-gray-400 mb-1">Kalan Bütçe: {remainingBudget !== null ? `${remainingBudget} TL` : "Belirtilmedi"}</div>
            <div className="text-xs text-gray-400 mb-1">Katılım Sayısı: {participationCount}</div>
            {c.banner_url && <img src={c.banner_url} alt="Banner" className="w-full max-h-32 object-cover rounded mt-2" />}
            <div className="text-xs text-gray-500 mt-2">Oluşturulma: {new Date(c.created_at).toLocaleString()}</div>
            {apps.length > 0 && (
              <div className="mt-3">
                <div className="font-semibold text-sm text-white mb-1">Katılanlar ve Video Linkleri:</div>
                <ul className="list-disc ml-5">
                  {apps.map((a) => (
                    <li key={a.id} className="mb-1">
                      <span className="text-xs text-gray-300">Başvuru: {a.influencer_id}</span>
                      {a.status === "completed" && a.video_url ? (
                        <>
                          <span className="ml-2 text-green-400">(Tamamlandı)</span>
                          <a href={a.video_url} target="_blank" rel="noopener noreferrer" className="ml-2 underline text-blue-400">Video Linki</a>
                        </>
                      ) : (
                        <span className="ml-2 text-yellow-400">(Devam Ediyor)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Sağ alt köşede Kampanyayı Sil butonu */}
            <div className="mt-4 flex items-center w-full justify-end">
              <button
                className={`text-red-400 hover:text-red-600 border border-red-400 hover:border-red-600 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id || apps.length > 0}
                title={apps.length > 0 ? "Katılım olduğu için silinemez" : "Kampanyayı Sil"}
              >
                {deletingId === c.id ? "Siliniyor..." : "Kampanyayı Sil"}
              </button>
              {apps.length > 0 && (
                <span className="text-xs text-gray-400 ml-2">Katılım olduğu için silinemez</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 