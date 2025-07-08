"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const platforms = ["Tiktok", "Youtube", "Instagram"];

export default function InfluencerSignup() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [usedPlatforms, setUsedPlatforms] = useState<string[]>([]);
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [primaryPlatform, setPrimaryPlatform] = useState("");
  const [tiktokFollowers, setTiktokFollowers] = useState("");
  const [youtubeFollowers, setYoutubeFollowers] = useState("");
  const [instagramFollowers, setInstagramFollowers] = useState("");
  const [links, setLinks] = useState([""]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePlatformChange = (platform: string) => {
    setUsedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleLinkChange = (idx: number, value: string) => {
    setLinks(prev => prev.map((l, i) => (i === idx ? value : l)));
  };

  const addLink = () => setLinks(prev => [...prev, ""]);
  const removeLink = (idx: number) => setLinks(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName ||
      !birthDate ||
      usedPlatforms.length === 0 ||
      !primaryCategory ||
      !primaryPlatform ||
      !tiktokFollowers ||
      !youtubeFollowers ||
      !instagramFollowers ||
      links.some(l => !l)
    ) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }
    setError("");
    // Query string ile verileri aktar
    const params = new URLSearchParams({
      fullName,
      birthDate,
      usedPlatforms: usedPlatforms.join(","),
      primaryCategory,
      primaryPlatform,
      tiktokFollowers,
      youtubeFollowers,
      instagramFollowers,
      links: links.join(",")
    }).toString();
    router.push(`/influencer/signup/credentials?${params}`);
  };

  return (
    <main className="min-h-screen bg-[#222222] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg flex flex-col gap-5 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">Influencer Kayıt</h2>
        <input
          type="text"
          placeholder="İsim Soyisim"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <input
          type="date"
          placeholder="Doğum Günü"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <div>
          <label className="text-white block mb-1">Kullanılan Platformlar</label>
          <div className="flex gap-4">
            {platforms.map(platform => (
              <label key={platform} className="flex items-center gap-1 text-white">
                <input
                  type="checkbox"
                  checked={usedPlatforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                  className="accent-blue-600"
                />
                {platform}
              </label>
            ))}
          </div>
        </div>
        <input
          type="text"
          placeholder="Primary Content Category"
          value={primaryCategory}
          onChange={e => setPrimaryCategory(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <div>
          <label className="text-white block mb-1">Primary Platform</label>
          <select
            value={primaryPlatform}
            onChange={e => setPrimaryPlatform(e.target.value)}
            className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 w-full text-center"
          >
            <option value="">Seçiniz</option>
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
        <input
          type="number"
          placeholder="Tiktok Follower Count"
          value={tiktokFollowers}
          onChange={e => setTiktokFollowers(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <input
          type="number"
          placeholder="Youtube Follower Count"
          value={youtubeFollowers}
          onChange={e => setYoutubeFollowers(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <input
          type="number"
          placeholder="Instagram Follower Count"
          value={instagramFollowers}
          onChange={e => setInstagramFollowers(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <div>
          <label className="text-white block mb-1">Links to Social Media Platforms</label>
          {links.map((link, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder="https://..."
                value={link}
                onChange={e => handleLinkChange(idx, e.target.value)}
                className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 flex-1 text-center"
              />
              {links.length > 1 && (
                <button type="button" onClick={() => removeLink(idx)} className="text-red-400">Sil</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addLink} className="text-blue-400">+ Link Ekle</button>
        </div>
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded transition-colors disabled:opacity-50"
        >
          Devam Et
        </button>
      </form>
    </main>
  );
} 