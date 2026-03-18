import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SongCard from '@/components/SongCard';
import { songsApi, browseApi, API_URL } from '@/lib/api';
import { Song, Genre } from '@/types/music';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/stores/playerStore';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [topMatch, setTopMatch] = useState<Song | null>(null);
  const [recommended, setRecommended] = useState<Song[]>([]);
  const [trending, setTrending] = useState<Song[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const { playSong } = usePlayerStore(); // Added playSong hook

  useEffect(() => {
    // Load initial data
    const loadInit = async () => {
      try {
        const [genresRes, trendingRes] = await Promise.all([
          browseApi.genres(),
          songsApi.getTrending() // Ensure api.ts has this
        ]);
        setGenres(genresRes.data || []);
        setTrending(trendingRes.data || []);
      } catch (e) { console.error(e); }
    };

    // Load recent searches
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));

    loadInit();
  }, []);

  useEffect(() => {
    const searchSongs = async () => {
      if (!query.trim() && !selectedGenre) {
        setResults([]);
        setTopMatch(null);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      // Save to recent searches if typing stopped (debounce limit)
      if (query.trim().length > 2 && !recentSearches.includes(query.trim())) {
        const updated = [query.trim(), ...recentSearches].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      }

      try {
        const res = await songsApi.search(query, selectedGenre || undefined);

        if (res.data.top_match !== undefined) {
          setTopMatch(res.data.top_match);
          setResults(res.data.results || []);
          setRecommended([]); // Clear old recs
        } else if (Array.isArray(res.data)) {
          // Fallback
          setResults(res.data);
          setTopMatch(null);
        } else {
          setResults(res.data.results || []);
          setRecommended(res.data.recommended || []);
          setTopMatch(null);
        }

      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchSongs, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedGenre]);

  const clearSearch = () => {
    setQuery('');
    setSelectedGenre(null);
    setResults([]);
    setTopMatch(null);
    setHasSearched(false);
  };

  const removeRecent = (term: string) => {
    const updated = recentSearches.filter(t => t !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }

  return (
    <div className="min-h-screen pb-40 md:pb-32 p-4 md:p-6 bg-[#0A0A0C]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 pt-[calc(env(safe-area-inset-top)+1rem)] sticky top-0 z-20 bg-[#0A0A0C]/80 backdrop-blur-xl pb-4 -mx-4 px-4 border-b border-white/5"
      >
        <h1 className="text-[32px] font-bold text-white mb-4 tracking-tight">Search</h1>

        {/* Search input - Large Pill */}
        <div className="relative max-w-full group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF] pointer-events-none z-10 transition-colors group-focus-within:text-white" />
          <Input
            type="text"
            placeholder="Artists, Songs, Lyrics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-12 h-12 text-[16px] text-white bg-[#151518] border-white/5 rounded-[12px] shadow-sm focus-visible:ring-1 focus-visible:ring-[#6F8CFF] placeholder:text-[#555] font-medium transition-all w-full"
          />
          {(query || selectedGenre) && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-[#121212]/10 hover:bg-[#121212]/20 text-[#121212] transition-colors z-10"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          )}
        </div>

        {/* Genre filters - Chips (Horizontal Scroll) */}
        {!hasSearched && (
          <div className="flex overflow-x-auto gap-2 mt-4 pb-2 -mx-4 px-4 scrollbar-hide">
            {genres.slice(0, 8).map((genre) => (
              <button
                key={genre.genre}
                onClick={() => setSelectedGenre(selectedGenre === genre.genre ? null : genre.genre)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all border whitespace-nowrap',
                  selectedGenre === genre.genre
                    ? 'bg-white text-black border-white'
                    : 'bg-[#1A1A1A] text-[#E0E0E0] border-transparent hover:bg-[#2A2A2A]'
                )}
              >
                {genre.genre}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Results or Browse */}
      {hasSearched ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground text-sm">Searching...</div>
          ) : results.length > 0 || topMatch ? (
            <>
              {/* TOP RESULT */}
              {topMatch && (
                <div className="mb-6">
                  <h3 className="text-[14px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-3">Top Result</h3>
                  <div
                    onClick={() => playSong(topMatch)}
                    className="bg-[#18181B] p-4 rounded-[20px] flex items-center gap-4 cursor-pointer hover:bg-[#202022] transition-colors border border-white/5"
                  >
                    <div className="w-[80px] h-[80px] rounded-full overflow-hidden shrink-0 shadow-lg">
                      {topMatch.cover ? (
                        <img src={topMatch.cover} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#333]" />
                      )}
                    </div>
                    <div>
                      <div className="text-[20px] font-bold text-white mb-1 line-clamp-1">{topMatch.title}</div>
                      <div className="text-[15px] text-[#A1A1AA] flex items-center gap-2">
                        <span className="text-white bg-[#27272A] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">Song</span>
                        <span>{topMatch.artist}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-[18px] font-bold text-white mb-2 tracking-tight">
                  Songs
                </p>
              </div>

              <div className="flex flex-col gap-1">
                {results.map((song, i) => (
                  <SongCard key={song.id} song={song} index={i} variant="list" />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 px-4">
              <p className="text-[18px] font-bold text-white mb-2">No results found</p>
              <p className="text-[15px] text-[#B3B3B3]">
                Please check the spelling or try different keywords.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">

          {/* RECENT SEARCHES */}
          {recentSearches.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[16px] font-bold text-white">Recent Searches</h3>
                {recentSearches.length > 0 && (
                  <button onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('recentSearches');
                  }} className="text-[12px] text-[#A1A1AA] hover:text-white">Clear</button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <div key={term} className="group flex items-center gap-2 bg-[#18181B] pl-4 pr-2 py-2 rounded-full border border-white/5">
                    <span onClick={() => setQuery(term)} className="text-[13px] font-medium text-[#E4E4E7] cursor-pointer hover:text-white">{term}</span>
                    <X onClick={() => removeRecent(term)} className="w-3.5 h-3.5 text-[#52525B] cursor-pointer hover:text-[#EF4444]" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TRENDING */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500/10 rounded-full">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h3 className="text-[16px] font-bold text-white">Trending Now</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {trending.slice(0, 4).map((song, i) => (
                <div key={song.id} onClick={() => playSong(song)} className="flex items-center gap-3 bg-[#18181B] p-2 rounded-[12px] cursor-pointer hover:bg-[#202022] transition-colors group">
                  <div className="w-[48px] h-[48px] rounded-[8px] overflow-hidden relative">
                    {song.cover && <img src={song.cover} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                      <SearchIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-white truncate">{song.title}</div>
                    <div className="text-[11px] text-[#A1A1AA] truncate">{song.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BROWSE ALL */}
          <section className="pt-4">
            <h2 className="text-[20px] font-bold text-white mb-4 tracking-tight">Browse All</h2>
            <div className="grid grid-cols-2 gap-3">
              {genres.map((genre, i) => (
                <motion.button
                  key={genre.genre}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/genre/${genre.genre}`)}
                  className="relative h-24 overflow-hidden rounded-[12px] hover:brightness-110 transition-all shadow-lg"
                  style={{ backgroundColor: ['#E13300', '#7358FF', '#1E3264', '#E8115B', '#116040', '#D84000', '#E91429', '#8C1932'][i % 8] }}
                >
                  <span className="absolute top-3 left-3 font-bold text-[16px] text-white tracking-tight leading-none">{genre.genre}</span>
                  {genre.cover && (
                    <img
                      src={genre.cover.startsWith('http') ? genre.cover : `${API_URL}/covers/${genre.cover}`}
                      alt={genre.genre}
                      className="absolute right-[-10%] bottom-[-5%] w-16 h-16 rotate-[25deg] shadow-lg"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
export default Search;
