import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { usePlayerStore } from '@/stores/playerStore';
import { useJamStore } from '@/stores/jamStore';
import { songsApi } from '@/lib/api';
import { toast } from 'sonner';

const DeepLinkHandler = () => {
    const navigate = useNavigate();
    const { playSong, setExpanded } = usePlayerStore();
    const { setJamId } = useJamStore();

    useEffect(() => {
        App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
            const url = new URL(event.url);
            let type = '';
            let id = '';

            // Handle HTTPS Links (https://api.kreewaux.xyz/song/123)
            if (url.protocol === 'https:' && url.host === 'api.kreewaux.xyz') {
                const parts = url.pathname.split('/').filter(Boolean); // ['song', '123']
                if (parts.length >= 2) {
                    type = parts[0];
                    id = parts[1];
                }
            }
            // Handle Custom Scheme (krew://song/123)
            else if (url.protocol.includes('krew')) {
                type = url.host;
                id = url.pathname.replace('/', '');
            }

            console.log('Deep Link:', { type, id, url: event.url });

            if (type === 'song' && id) {
                try {
                    toast.info('Loading shared song...');
                    const songId = parseInt(id);
                    // Fetch song and play
                    const res = await songsApi.get(songId);

                    if (res.data) {
                        playSong(res.data);
                        setExpanded(true); // Auto-expand player
                    }
                } catch (e) {
                    console.error('Deep link song error', e);
                    toast.error('Could not load shared song.');
                }
            }
            else if (type === 'jam' && id) {
                setJamId(id);
                navigate('/jam');
                toast.info(`Joining Jam ${id}...`);
            }
        });
    }, [navigate]);

    return null;
};

export default DeepLinkHandler;
