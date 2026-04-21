import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { songsApi, libraryApi, browseApi, radioApi, API_URL } from '@/lib/api';
import { Song, Genre } from '@/types/music';
import { usePlayerStore } from '@/stores/playerStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

import StreakCard from '@/components/StreakCard';

// 1. Reusable SmallSongCard (wrapping with React.memo for Performance boost)
const SmallSongCard = React.memo(({ song, onClick }: { song: Song; onClick: () => void }) => (
  <div 
    className="min-w-[100px] max-w-[100px] flex flex-col gap-2 cursor-pointer group hover:scale-[1.03] transition-transform active:scale-95" 
    onClick={onClick}
  >
    <div className="h-[100px] w-[100px] bg-[#222] rounded-[18px] overflow-hidden relative shadow-md">
      <img 
        src={song.cover || 'https://placehold.co/100x100/222/FFF?text=Music'} 
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/100x100/222/FFF?text=Music';
        }}
        className="w-full h-full object-cover" 
        alt={song.title}
      />
      <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center transition-all bg-gradient-to-t from-black/60 to-transparent">
        <Play className="fill-white text-white w-8 h-8 opacity-90 drop-shadow-md" />
      </div>
    </div>
    <div className="text-[12px] text-[#9CA3AF] truncate font-medium group-hover:text-white transition-colors">{song.title}</div>
  </div>
));

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

  // 1. Loading State with Skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen pb-[calc(100px+env(safe-area-inset-bottom))] bg-[#0A0A0C] px-4 md:px-6 relative font-sans">
        <div className="pt-[calc(env(safe-area-inset-top)+2rem)] mb-8">
          <div className="h-8 w-48 bg-white/10 animate-pulse rounded-md" />
        </div>
        <div className="space-y-8 max-w-[1920px] mx-auto animate-pulse">
          <div className="h-[120px] w-full bg-white/5 rounded-[28px]" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-white/10 rounded-md" />
            <div className="flex gap-4 overflow-hidden -mx-4 px-4">
               {[1,2,3,4,5].map(i => <div key={i} className="min-w-[100px] h-[100px] bg-white/5 rounded-[18px]" />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-32 bg-white/10 rounded-md" />
            <div className="flex gap-4 overflow-hidden -mx-4 px-4">
               {[1,2,3,4].map(i => <div key={i} className="min-w-[160px] h-[180px] bg-white/5 rounded-[22px]" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🚀 NEXT LEVEL IDEA: Dynamic Home Feed logic
  const feedOrder = (() => {
    if (recentlyPlayed.length === 0 && recommendations.length === 0 && because.length === 0) {
      return ['empty', 'trending'];
    }
    // Heavy listener -> Show 'Jump Back In' and 'Because You Listened' first
    if (recentlyPlayed.length > 3) {
      return ['jump-back', 'because', 'made-for-you', 'trending'];
    }
    // Newer user / Light listener -> Show 'Made For You' and 'Trending' first
    return ['made-for-you', 'trending', 'jump-back', 'because'];
  })();

  const renderEmptyState = () => (
    <div key="empty" className="py-12 text-center text-[#9CA3AF] bg-[#151518] rounded-[24px] border border-white/5 mx-auto max-w-sm mt-8 shadow-lg">
      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#3b82f6]" />
      <p className="text-[18px] font-medium text-white mb-2">Your journey starts here</p>
      <p className="text-[14px]">Start listening to build your taste 🎧</p>
    </div>
  );

  const renderJumpBackIn = () => recentlyPlayed.length > 0 ? (
    <section key="jump-back">
      <div className="text-[16px] font-semibold text-white mb-4">Jump Back In</div>
      <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide">
        {recentlyPlayed.slice(0, 6).map((song) => (
          <SmallSongCard key={`recent-${song.id}`} song={song} onClick={() => playSong(song)} />
        ))}
      </div>
    </section>
  ) : null;

  const renderBecauseYouListened = () => because.length > 0 ? (
    <section key="because">
      <div className="text-[16px] font-semibold text-white mb-4">Because You Listened</div>
      <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide">
        {because.slice(0, 6).map((song) => (
          <SmallSongCard key={`because-${song.id}`} song={song} onClick={() => playSong(song)} />
        ))}
      </div>
    </section>
  ) : null;

  const renderMadeForYou = () => recommendations.length > 0 ? (
    <section key="made-for-you">
      <div className="text-[16px] font-semibold text-white mb-4">Made For You</div>
      <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide">
        {recommendations.slice(0, 5).map((song) => (
          <div 
            key={`rec-${song.id}`} 
            className="min-w-[160px] max-w-[160px] bg-[#151518] rounded-[22px] p-[14px] flex flex-col cursor-pointer group hover:scale-[1.03] hover:bg-[#1a1a20] transition-all active:scale-95 border border-transparent hover:border-white/10 shadow-sm"
            onClick={() => playSong(song)}
          >
            <div className="h-[132px] bg-[#222] rounded-[18px] w-full mb-3 overflow-hidden relative shadow-md">
              <img 
                src={song.cover || 'https://placehold.co/160x160/222/FFF?text=Music'} 
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/160x160/222/FFF?text=Music'; }}
                className="w-full h-full object-cover" 
                alt={song.title}
              />
              <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center transition-all">
                <Play className="fill-white text-white w-10 h-10 opacity-90 drop-shadow-md" />
              </div>
            </div>
            <div className="text-[14px] font-semibold text-white truncate group-hover:text-[#3b82f6] transition-colors">{song.title}</div>
            <div className="text-[12px] text-[#9CA3AF] truncate">{song.artist}</div>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const renderTrending = () => songs.length > 0 ? (
    <section key="trending">
      <div className="text-[16px] font-semibold text-white mb-4">Trending in Krew</div>
      <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide">
        {songs.slice(0, 8).map((song) => (
          <SmallSongCard key={`trend-${song.id}`} song={song} onClick={() => playSong(song)} />
        ))}
      </div>
    </section>
  ) : null;

  return (
    <div className="min-h-screen pb-[calc(100px+env(safe-area-inset-bottom))] bg-[#0A0A0C] px-4 md:px-6 relative font-sans">
      
      {/* 1. Header & Greeting */}
      <div className="pt-[calc(env(safe-area-inset-top)+2rem)] mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-semibold text-white tracking-tight">{getGreeting()}, {user?.username || 'User'}</h1>
        </div>
      </div>

      <div className="space-y-8 max-w-[1920px] mx-auto">
        {/* HERO (Streak) */}
        <StreakCard />

        {/* DYNAMIC FEED SECTIONS */}
        {feedOrder.map(section => {
          if (section === 'empty') return renderEmptyState();
          if (section === 'jump-back') return renderJumpBackIn();
          if (section === 'because') return renderBecauseYouListened();
          if (section === 'made-for-you') return renderMadeForYou();
          if (section === 'trending') return renderTrending();
          return null;
        })}
        
        <div className="h-20 w-full bg-gradient-to-b from-transparent to-[#0A0A0C]" />
      </div>
    </div>
  );
};

export default Home;
