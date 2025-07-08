"use client";
import { useState, useEffect } from "react";
import { FaHome, FaCompass, FaBullhorn, FaCog, FaSearch, FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaUser, FaLock, FaCreditCard, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { supabase } from "@/utils/supabaseClient";

const sidebarItems = [
  { name: "Ana Sayfa", icon: <FaHome size={22} /> },
  { name: "Keşfet", icon: <FaCompass size={22} /> },
  { name: "Kampanyalarım", icon: <FaBullhorn size={22} /> },
  { name: "Profil", icon: <FaUser size={22} /> },
];
const searchItem = { name: "Arama", icon: <FaSearch size={22} /> };

type PlatformKey = "instagram" | "tiktok" | "x" | "youtube";
const platformIcons: Record<PlatformKey, React.ReactNode> = {
  instagram: <FaInstagram size={20} className="text-pink-500" />,
  tiktok: <FaTiktok size={20} className="text-black dark:text-white" />,
  x: <FaTwitter size={20} className="text-black dark:text-white" />,
  youtube: <FaYoutube size={20} className="text-red-600" />,
};

function CampaignDiscoverList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, title, description, reward, platforms, banner_url, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) {
        setError("Kampanyalar yüklenirken hata oluştu: " + error.message);
        setLoading(false);
        return;
      }
      setCampaigns(data || []);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  if (loading) return <div className="text-center text-white">Kampanyalar yükleniyor...</div>;
  if (error) return <div className="text-red-400 text-center">{error}</div>;
  if (campaigns.length === 0) return <div className="text-center text-gray-400">Şu anda keşfedilecek kampanya yok.</div>;

  return (
    <div className="flex flex-col gap-6 mt-8">
      {campaigns.map((c) => (
        <div key={c.id} className="bg-[#232323] rounded-xl p-6 shadow border border-gray-700 flex flex-col md:flex-row gap-4 items-center">
          {c.banner_url && (
            <img src={c.banner_url} alt="Banner" className="w-full max-w-[180px] max-h-32 object-cover rounded" />
          )}
          <div className="flex-1 w-full">
            <div className="text-xl font-bold text-white mb-1">{c.title}</div>
            <div className="text-sm text-gray-300 mb-2">{c.description}</div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-2">
              <span>Platformlar: {c.platforms}</span>
              <span>Ödül: {c.reward}</span>
            </div>
            <div className="text-xs text-gray-500">Oluşturulma: {new Date(c.created_at).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InfluencerDashboard() {
  const [activeTab, setActiveTab] = useState<string>("Ana Sayfa");
  const [selected, setSelected] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [applications, setApplications] = useState<{ campaignId: string; date: string; status: string }[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const fullName = "Ege Aydemir";

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, title, description, reward, platforms, banner_url, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) {
        setError("Kampanyalar yüklenirken hata oluştu: " + error.message);
        setLoading(false);
        return;
      }
      setCampaigns(data || []);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      setApplicationsLoading(true);
      const user = await supabase.auth.getUser();
      const influencer_id = user.data.user?.id;
      if (!influencer_id) {
        setApplicationsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          campaign_id,
          status,
          video_url,
          created_at,
          campaigns (
            id,
            title,
            description,
            reward,
            platforms
          )
        `)
        .eq("influencer_id", influencer_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Başvurular yüklenirken hata:", error);
        setApplicationsLoading(false);
        return;
      }

      setMyApplications(data || []);
      setApplicationsLoading(false);
    };
    fetchApplications();
  }, [applications]);

  const WEEKLY_LIMIT = 5;
  const canApply = isPremium || applications.length < WEEKLY_LIMIT;

  const handleApply = async (campaignId: string) => {
    if (!canApply) return;
    if (applications.some(app => app.campaignId === campaignId)) return;
    
    // Kullanıcı UID'sini al
    const user = await supabase.auth.getUser();
    const influencer_id = user.data.user?.id;
    if (!influencer_id) {
      alert("Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    // Supabase'a başvuru ekle
    const { error } = await supabase.from("applications").insert([
      {
        campaign_id: campaignId,
        influencer_id: influencer_id,
        status: "applied", // Başvuru durumu
        // video_url boş başlar, sonra doldurulur
      },
    ]);

    if (error) {
      alert("Başvuru yapılırken hata oluştu: " + error.message);
      return;
    }

    // Başvuru başarılı, state'i güncelle
    setApplications(prev => [
      ...prev,
      { campaignId, date: new Date().toLocaleDateString(), status: "Beklemede" },
    ]);

    alert("Başvurunuz başarıyla gönderildi! Marka tarafından değerlendirilecek.");
  };

  const handleSidebarClick = (name: string) => {
    setActiveTab(name);
    setSelected(null);
  };

  return (
    <div className="min-h-screen flex bg-[#222222]">
      <aside className="w-16 bg-[#18181b] flex flex-col py-6 items-center shadow-lg justify-between">
        <div className="flex flex-col items-center w-full">
          <div className="mb-8 text-white text-2xl font-bold">I</div>
          <nav className="flex flex-col gap-4">
            {sidebarItems.map((item, idx) => (
              <div key={item.name} className="relative group flex justify-center">
                <button
                  className={`flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-[#27272a] transition-colors ${activeTab === item.name ? "bg-[#27272a]" : ""}`}
                  onClick={() => handleSidebarClick(item.name)}
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
        <nav className="flex flex-col gap-4 mb-2">
          <div className="relative group flex justify-center">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-[#27272a] transition-colors"
            >
              {searchItem.icon}
            </button>
            <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 shadow-lg transition-opacity">
              {searchItem.name}
            </span>
          </div>
        </nav>
      </aside>
      <main className="flex-1 flex">
        {activeTab === "Ana Sayfa" && (
          <>
            <section className="w-1/2 min-h-screen p-8 flex flex-col gap-6 overflow-y-auto">
              {loading ? (
                <div className="text-center text-white mt-20 text-lg">Kampanyalar yükleniyor...</div>
              ) : error ? (
                <div className="text-red-400 text-center mt-20 text-lg">{error}</div>
              ) : campaigns.length === 0 ? (
                <div className="text-center text-gray-400 mt-20 text-lg">Şu anda hiç kampanya yok.</div>
              ) : (
                campaigns.map((c) => (
                  <div
                    key={c.id}
                    className={`bg-[#232323] rounded-xl p-6 shadow-lg flex flex-col gap-3 cursor-pointer border-2 transition-all ${selected === c.id ? "border-orange-400" : "border-transparent"}`}
                    style={{ minHeight: "220px" }}
                    onClick={() => setSelected(c.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-white font-bold text-lg">{c.title?.[0] || "?"}</div>
                      <div className="text-white font-semibold text-base">{c.title || "Bilinmiyor"}</div>
                      <span className="text-gray-400 text-xs ml-auto">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}</span>
                    </div>
                    <div className="text-white text-xl font-bold mt-1">{c.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-200 text-lg font-mono">{c.reward ? `Ödül: ${c.reward}` : ""}</span>
                    </div>
                    <div className="w-full h-3 bg-[#18181b] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                        style={{ width: `50%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-8 mt-2">
                      <div>
                        <div className="text-xs text-gray-400">Platformlar</div>
                        <div className="flex gap-2 mt-1">
                          {(c.platforms ? c.platforms.split(",") : []).map((p: string) => (
                            <span key={p} className="bg-[#111] rounded px-1.5 py-0.5 flex items-center">
                              {platformIcons[p.trim() as PlatformKey] || p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold bg-gray-700 text-gray-400`}>0 çevrimiçi</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>
            <section className="w-1/2 min-h-screen flex items-center justify-center border-l border-[#232323] bg-[#18181b]">
              {selected ? (
                <div className="w-full max-w-xl mx-auto bg-[#232323] rounded-2xl shadow-xl p-0 overflow-hidden flex flex-col">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    {campaigns.find(c => c.id === selected)?.banner_url ? (
                      <img src={campaigns.find(c => c.id === selected)?.banner_url} alt="Banner" className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-white text-2xl">Banner Yok</span>
                    )}
                  </div>
                  <div className="p-6 pb-2 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-white font-bold text-lg">{campaigns.find(c => c.id === selected)?.title?.[0] || "?"}</div>
                      <span className="text-white font-semibold text-lg">{campaigns.find(c => c.id === selected)?.title || "Bilinmiyor"}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{campaigns.find(c => c.id === selected)?.title}</div>
                    <div className="flex gap-2 mt-2">
                      {(campaigns.find(c => c.id === selected)?.platforms ? campaigns.find(c => c.id === selected)?.platforms.split(",") : []).map((p: string) => (
                        <span key={p} className="bg-[#111] rounded px-2 py-1 flex items-center">
                          {platformIcons[p.trim() as PlatformKey] || p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-3 gap-4 border-b border-[#232323]">
                    <div>
                      <div className="text-xs text-gray-400">ÖDÜL</div>
                      <div className="text-white font-semibold text-lg">{campaigns.find(c => c.id === selected)?.reward || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">KATEGORİ</div>
                      <div className="text-white font-semibold text-lg">-</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">PLATFORMLAR</div>
                      <div className="flex gap-1 mt-1">
                        {(campaigns.find(c => c.id === selected)?.platforms ? campaigns.find(c => c.id === selected)?.platforms.split(",") : []).map((p: string) => (
                          <span key={p} className="bg-[#111] rounded px-1.5 py-0.5 flex items-center">
                            {platformIcons[p.trim() as PlatformKey] || p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="text-xs text-gray-400 mb-2">GEREKSİNİMLER</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Video en az 10 saniye olmalı",
                        "Videoda watermark olmamalı",
                        "10.000 izlenmeden fazla olmalı",
                        "Hedef kitle çoğunlukla Türkiye",
                        "AI edit araçları yasak",
                        "Klip markanın resmi hesabından olmalı",
                        "Videoda markanın çağrısı olmalı",
                        "Marka kanal linki bio'da olmalı",
                      ].map((req, i) => (
                        <span key={i} className="bg-[#292929] text-white text-xs rounded px-3 py-1">{req}</span>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 pb-4">
                    <div className="text-xs text-gray-400 mb-1">ASSETS</div>
                    <a href="#" className="inline-block bg-[#222] text-blue-400 px-3 py-1 rounded text-xs font-semibold hover:underline">Dosya Yok</a>
                  </div>
                  <div className="px-6 pb-6 flex flex-col gap-2">
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg transition-colors disabled:opacity-50"
                      disabled={!canApply || applications.some(app => app.campaignId === selected)}
                      onClick={() => handleApply(selected!)}
                    >
                      {applications.some(app => app.campaignId === selected)
                        ? "Başvuruldu"
                        : !canApply
                        ? "Başvuru Hakkınız Doldu"
                        : "Başvur"}
                    </button>
                    {!isPremium && !canApply && (
                      <div className="text-center text-orange-400 text-sm">
                        Haftalık başvuru hakkınız doldu. Daha fazla başvuru için <button className="underline text-blue-400" onClick={() => setIsPremium(true)}>Premium'a geçin</button>.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-xl">Bir kampanya seçin</div>
              )}
            </section>
          </>
        )}
        {activeTab === "Kampanyalarım" && (
          <section className="w-full min-h-screen p-8 flex flex-col gap-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Başvurduğun Kampanyalar</h2>
            {applicationsLoading ? (
              <div className="text-white text-lg mt-20 text-center">Başvurularınız yükleniyor...</div>
            ) : myApplications.length === 0 ? (
              <div className="text-gray-400 text-lg mt-20 text-center">Henüz hiçbir kampanyaya başvurmadınız.</div>
            ) : (
              myApplications.map((app) => {
                const campaign = app.campaigns;
                if (!campaign) return null;

                // Status'u Türkçe'ye çevir
                const getStatusText = (status: string) => {
                  switch (status) {
                    case "applied": return "Beklemede";
                    case "approved": return "Onaylandı";
                    case "rejected": return "Reddedildi";
                    case "completed": return "Tamamlandı";
                    default: return status;
                  }
                };

                const getStatusColor = (status: string) => {
                  switch (status) {
                    case "applied": return "text-yellow-400";
                    case "approved": return "text-green-400";
                    case "rejected": return "text-red-400";
                    case "completed": return "text-blue-400";
                    default: return "text-gray-400";
                  }
                };

                return (
                  <div key={app.id} className="bg-[#232323] rounded-xl p-6 shadow-lg flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-white font-bold text-lg">{campaign.title?.[0] || "?"}</div>
                      <div className="text-white font-semibold text-base">{campaign.title}</div>
                      <span className="text-gray-400 text-xs ml-auto">{new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-white text-xl font-bold mt-1">{campaign.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-200 text-lg font-mono">Ödül: {campaign.reward}</span>
                      <span className={`ml-auto font-semibold ${getStatusColor(app.status)}`}>Durum: {getStatusText(app.status)}</span>
                    </div>
                    {app.status === "approved" && !app.video_url && (
                      <div className="mt-2">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowVideoModal(true);
                          }}
                        >
                          Video Linki Yükle
                        </button>
                      </div>
                    )}
                    {app.video_url && (
                      <div className="mt-2">
                        <a href={app.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                          Video Linki: {app.video_url}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        )}
        {activeTab === "Profil" && (
          <section className="w-full min-h-screen flex items-center justify-center bg-[#18181b]">
            <div className="w-full max-w-md mx-auto bg-[#232323] rounded-2xl shadow-xl p-0 overflow-hidden flex flex-col">
              <div className="flex flex-col items-center gap-2 py-8 border-b border-[#232323]">
                <div className="text-white text-xl font-bold mt-2">{fullName}</div>
              </div>
              <div className="flex flex-col py-6 gap-2">
                <ProfileOption icon={<FaCog size={18} />} label="Ayarlar" />
                <ProfileOption icon={<FaLock size={18} />} label="Güvenlik ve Gizlilik" />
                <ProfileOption icon={<FaCreditCard size={18} />} label="Ödeme Seçenekleri" />
                <ProfileOption icon={<FaHistory size={18} />} label="Ödeme Geçmişi" />
                <ProfileOption icon={<FaSignOutAlt size={18} />} label="Çıkış Yap" danger />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function ProfileOption({ icon, label, danger }: { icon: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <button
      className={`flex items-center gap-3 px-6 py-3 text-left text-base font-medium rounded-lg transition-colors ${danger ? "text-red-400 hover:bg-red-900/30" : "text-white hover:bg-[#27272a]"}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
} 