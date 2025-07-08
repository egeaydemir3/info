"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function BrandSignup() {
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!companyName || !sector || !phone || !website || !email || !password) {
      setError("Lütfen tüm alanları doldurun");
      setLoading(false);
      return;
    }
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
      // 2. Profil verilerini brands tablosuna ekle
      const { error: insertError } = await supabase.from("brands").insert([
        {
          auth_user_id: user.id,
          company_name: companyName,
          sector,
          phone,
          website,
          is_approved: false,
        },
      ]);
      if (insertError) {
        setError("Profil verileri kaydedilemedi: " + insertError.message);
        setLoading(false);
        return;
      }
      setSuccess("Başvurunuz alınmıştır, ekibimiz tarafından incelenecek.");
      setLoading(false);
    } catch (err: any) {
      setError("Bir hata oluştu: " + err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#222222] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg flex flex-col gap-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">Marka Kayıt</h2>
        <input
          type="text"
          placeholder="Şirket Adı"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <input
          type="text"
          placeholder="Sektör"
          value={sector}
          onChange={e => setSector(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <input
          type="text"
          placeholder="Telefon Numarası"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
        <input
          type="text"
          placeholder="Web Sitesi"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          className="p-3 rounded bg-[#222222] text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center"
        />
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