import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, ListMusic, Plus, Play, MoreHorizontal, FlaskConical, Shuffle, Search } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { libraryApi, playlistsApi, API_URL } from '@/lib/api';
import { Song, Playlist } from '@/types/music';
import SongCard from '@/components/SongCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/stores/playerStore';
import PlaylistMixer from '@/components/PlaylistMixer';
import DuplicateFinder from '@/components/DuplicateFinder';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Library = () => {
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { playSong } = usePlayerStore();
  const { toast } = useToast();

  const tabs = [
    { to: '/library', label: 'All', icon: ListMusic },
    { to: '/library/liked', label: 'Liked', icon: Heart },
    { to: '/library/playlists', label: 'Playlists', icon: ListMusic },
    { to: '/library/recent', label: 'Recent', icon: Clock },
  ];

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const [likedRes, recentRes, playlistsRes] = await Promise.all([
          libraryApi.getLiked(),
          libraryApi.getRecent(),
          playlistsApi.getAll(),
        ]);

        setLikedSongs(likedRes.data || []);
        setRecentSongs(recentRes.data || []);
        setPlaylists(playlistsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch library:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const res = await playlistsApi.create(newPlaylistName);
      setPlaylists([...playlists, { id: res.data.id, name: res.data.name }]);
      setNewPlaylistName('');
      setDialogOpen(false);
      toast({ title: 'Playlist created!', description: `"${newPlaylistName}" has been created.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create playlist', variant: 'destructive' });
    }
  };

  const handlePlayLiked = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0]);
    }
  };

  const isMainLibrary = location.pathname === '/library';

  return (
    <div className="min-h-screen pb-40 md:pb-32 px-4 pt-4 md:px-8 w-full overflow-hidden bg-[#0A0A0C] font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 pt-[calc(env(safe-area-inset-top)+1rem)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[34px] font-bold tracking-tight text-white/90">Library</h1>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-[#151518] flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#151518] flex items-center justify-center text-white/50 hover:text-white transition-colors" onClick={() => setDialogOpen(true)}>
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs / Filters - Horizontal Scrollable Chips matched to library.html */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 mask-fade-sides">
          {['Playlists', 'Artists', 'Albums', 'Podcasts', 'Downloaded'].map((filter) => (
            <button
              key={filter}
              className="px-5 py-2.5 rounded-[20px] bg-[#151518] text-[#9CA3AF] text-[14px] font-medium border border-white/5 whitespace-nowrap hover:bg-[#222] hover:text-white transition-all"
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-[#151518] rounded-[16px] animate-pulse" />
          ))}
        </div>
      ) : isMainLibrary ? (
        <div className="flex flex-col space-y-1">
          {/* 1. LIKED SONGS ROW (Pinned) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/library/liked')}
            className="group flex items-center gap-4 p-3 rounded-[20px] hover:bg-[#151518] active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-[64px] h-[64px] bg-gradient-to-br from-[#450af5] to-[#c4efd9] rounded-[16px] flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 blur-md" />
              <Heart className="w-7 h-7 text-white fill-white relative z-10" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-[16px] mb-0.5">Liked Songs</h3>
              <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF]">
                <span className="text-[#6F8CFF] font-medium">📌 Pinned</span>
                <span className="w-1 h-1 rounded-full bg-[#333]" />
                <span>{likedSongs.length} songs</span>
              </div>
            </div>
          </motion.div>

          {/* 2. PLAYLISTS LIST */}
          {playlists.map((playlist, i) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="group flex items-center gap-4 p-3 rounded-[20px] hover:bg-[#151518] active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="w-[64px] h-[64px] bg-[#151518] rounded-[16px] overflow-hidden shrink-0 shadow-sm border border-white/5 relative">
                {playlist.cover ? (
                  <img
                    src={playlist.cover.startsWith('http') ? playlist.cover : `${API_URL}${API_URL.endsWith('/') ? '' : '/'}/covers/${playlist.cover.startsWith('/') ? playlist.cover.slice(1) : playlist.cover}`}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1A1A1D]">
                    <ListMusic className="w-7 h-7 text-white/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate text-[16px] mb-0.5">{playlist.name}</h3>
                <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF]">
                  <span>Playlist</span>
                  <span className="w-1 h-1 rounded-full bg-[#333]" />
                  <span>{playlist.songs?.length || 0} songs</span>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="h-20" />
        </div>
      ) : (
        <Outlet />
      )}

      {/* Keep Dialog for functionality */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            />
            <Button onClick={handleCreatePlaylist} className="w-full">Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Library;
