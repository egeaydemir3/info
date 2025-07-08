"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function InfluencerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      if (
        signInError.message.toLowerCase().includes("email not confirmed") ||
        signInError.message.toLowerCase().includes("email not verified")
      ) {
        setError("Lütfen e-posta adresinizi doğrulayın.");
      } else {
        setError(signInError.message);
      }
      return;
    }

    // Giriş başarılıysa yönlendir
    router.push("/influencer/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#222222] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg flex flex-col gap-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">Influencer Giriş</h2>
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
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </main>
  );
} 