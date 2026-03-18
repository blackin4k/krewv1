import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import SongCard from '@/components/SongCard';
import { songsApi, libraryApi, browseApi, radioApi, API_URL } from '@/lib/api';
import { Song, Genre } from '@/types/music';
import { usePlayerStore } from '@/stores/playerStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

import StreakCard from '@/components/StreakCard';

const Home = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [because, setBecause] = useState<Song[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { playSong } = usePlayerStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, genresRes] = await Promise.all([
          songsApi.getAll(1, 12, 'random'),
          browseApi.genres(),
        ]);

        setSongs(songsRes.data.items || []);
        setGenres(genresRes.data || []);

        // Fetch authenticated data
        try {
          const [recsRes, recentRes] = await Promise.all([
            libraryApi.getRecommendations(),
            libraryApi.getRecent(),
          ]);
          setRecommendations(recsRes.data || []);
          setRecentlyPlayed(recentRes.data || []);

          // Fetch 'Because You Listened' if recent exists
          if (recentRes.data && recentRes.data.length > 0) {
            const firstRecent = recentRes.data[0];
            // Use radioApi or direct axios if not exported
            const becauseRes = await radioApi.becauseYouListened(firstRecent.id);
            setBecause(becauseRes.data || []);
          }
        } catch {
          // User might not be authenticated
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen pb-[120px] bg-[#0A0A0C] px-4 md:px-6 relative font-sans">

      {/* 1. Header & Greeting */}
      <div className="pt-[calc(env(safe-area-inset-top)+2rem)] mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-semibold text-white tracking-tight">{getGreeting()}, {user?.username || 'User'}</h1>
        </div>
        <div className="w-[38px] h-[38px] rounded-full bg-[#151518] overflow-hidden border border-white/10">
          {user?.avatar ? (
            <img src={user.avatar} className="w-full h-full object-cover" />
          ) : (
            <User className="w-full h-full p-2 text-[#9CA3AF]" />
          )}
        </div>
      </div>

      <div className="space-y-8 max-w-[1920px] mx-auto">

        {/* 2. HERO (Streak) */}
        <StreakCard />

        {/* 3. Jump Back In (Recently Played) - Horizontal Small Cards */}
        {recentlyPlayed.length > 0 && (
          <section>
            <div className="text-[16px] font-semibold text-white mb-4">Jump Back In</div>
            <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide">
              {recentlyPlayed.slice(0, 6).map((song, i) => (
                <div key={`recent-${song.id}`} className="min-w-[100px] flex flex-col gap-2 cursor-pointer transition-transform active:scale-95" onClick={() => playSong(song)}>
                  <div className="h-[100px] w-[100px] bg-[#222] rounded-[18px] overflow-hidden relative group">
                    {song.cover && <img src={song.cover} className="w-full h-full object-cover" />}
                    {/* Play overlay could go here */}
                    <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                      <Play className="fill-white text-white w-8 h-8 opacity-80" />
                    </div>
                  </div>
                  <div className="text-[12px] text-[#9CA3AF] truncate font-medium">{song.title}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Made For You - Large Cards */}
        {recommendations.length > 0 && (
          <section>
            <div className="text-[16px] font-semibold text-white mb-4">Made For You</div>
            <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide">
              {recommendations.slice(0, 5).map((song, i) => (
                <div key={`rec-${song.id}`} className="min-w-[160px] bg-[#151518] rounded-[22px] p-[14px] flex flex-col cursor-pointer transition-transform active:scale-95" onClick={() => playSong(song)}>
                  <div className="h-[120px] bg-[#222] rounded-[18px] w-full mb-3 overflow-hidden">
                    {song.cover && <img src={song.cover} className="w-full h-full object-cover" />}
                  </div>
                  <div className="text-[14px] font-semibold text-white truncate">{song.title}</div>
                  <div className="text-[12px] text-[#9CA3AF] truncate">{song.artist}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Trending (Quick Picks) */}
        <section>
          <div className="text-[16px] font-semibold text-white mb-4">Trending in Krew</div>
          <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide">
            {songs.slice(0, 8).map((song, i) => (
              <div key={`trend-${song.id}`} className="min-w-[100px] flex flex-col gap-2 cursor-pointer transition-transform active:scale-95" onClick={() => playSong(song)}>
                <div className="h-[100px] w-[100px] bg-[#222] rounded-[18px] overflow-hidden">
                  {song.cover && <img src={song.cover} className="w-full h-full object-cover" />}
                </div>
                <div className="text-[12px] text-[#9CA3AF] truncate font-medium">{song.title}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
