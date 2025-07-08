"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function InfluencerSignupCredentials() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    // Query string'den profil verilerini al
    const data = {
      fullName: searchParams.get("fullName") || "",
      birthDate: searchParams.get("birthDate") || "",
      usedPlatforms: (searchParams.get("usedPlatforms") || "").split(",").filter(Boolean),
      primaryCategory: searchParams.get("primaryCategory") || "",
      primaryPlatform: searchParams.get("primaryPlatform") || "",
      tiktokFollowers: searchParams.get("tiktokFollowers") || "",
      youtubeFollowers: searchParams.get("youtubeFollowers") || "",
      instagramFollowers: searchParams.get("instagramFollowers") || "",
      links: (searchParams.get("links") || "").split(",").filter(Boolean),
    };
    setProfileData(data);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Lütfen e-posta ve şifreyi girin");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // 1. Supabase Auth ile kullanıcı oluştur
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      const user = signUpData.user;
      if (!user) {
        setError("Kullanıcı oluşturulamadı.");
        setLoading(false);
        return;
      }
      // 2. Profil verilerini influencers tablosuna ekle
      const { error: insertError } = await supabase.from("influencers").insert([
        {
          auth_user_id: user.id,
          full_name: profileData.fullName,
          birth_date: profileData.birthDate,
          used_platforms: profileData.usedPlatforms,
          primary_category: profileData.primaryCategory,
          primary_platform: profileData.primaryPlatform,
          tiktok_followers: Number(profileData.tiktokFollowers),
          youtube_followers: Number(profileData.youtubeFollowers),
          instagram_followers: Number(profileData.instagramFollowers),
          links: profileData.links,
        },
      ]);
      if (insertError) {
        setError("Profil verileri kaydedilemedi: " + insertError.message);
        setLoading(false);
        return;
      }
      setSuccess("Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.");
      setLoading(false);
      // İsteğe bağlı: router.push("/influencer/dashboard");
    } catch (err: any) {
      setError("Bir hata oluştu: " + err.message);
      setLoading(false);
    }
  };

  if (!profileData) return null;

  return (
    <main className="min-h-screen bg-[#222222] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg flex flex-col gap-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">E-posta ve Şifre</h2>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        {success && <div className="text-green-400 text-sm text-center">{success}</div>}
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
      </form>
    </main>
  );
} 