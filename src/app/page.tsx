'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showInfluencerOptions, setShowInfluencerOptions] = useState(false);
  const [showBrandOptions, setShowBrandOptions] = useState(false);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#222222] flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-12 text-white">
          INFCO - Markanı Yükselt, İçeriğini Parlat
        </h1>
        
        <div className="flex flex-row gap-8">
          {/* Influencer Button */}
          <div className="relative"
               onMouseEnter={() => setShowInfluencerOptions(true)}
               onMouseLeave={() => setShowInfluencerOptions(false)}>
            <button
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Influencer
            </button>
            {showInfluencerOptions && (
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#333333] rounded-lg shadow-lg p-4 w-48">
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded text-white"
                    onClick={() => router.push('/influencer/login')}>Login</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded text-white"
                    onClick={() => router.push('/influencer/signup')}>Sign Up</button>
                </div>
              </div>
            )}
          </div>

          {/* Brand Button */}
          <div className="relative"
               onMouseEnter={() => setShowBrandOptions(true)}
               onMouseLeave={() => setShowBrandOptions(false)}>
            <button
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Brand
            </button>
            {showBrandOptions && (
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#333333] rounded-lg shadow-lg p-4 w-48">
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded text-white"
                    onClick={() => router.push('/brand/login')}>Login</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded text-white"
                    onClick={() => router.push('/brand/signup')}>Sign Up</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 