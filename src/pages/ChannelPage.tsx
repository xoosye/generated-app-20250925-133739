import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { api } from '@/lib/api-client';
import type { Channel, Episode } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, ArrowLeft, PlusCircle, Edit, Trash2, PauseCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import { Toaster, toast } from 'sonner';
const LoadingSkeleton = () => (
  <div className="space-y-16">
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <Skeleton className="w-full md:w-1/3 h-80 rounded-md bg-muted/50" />
      <div className="w-full md:w-2/3 space-y-4">
        <Skeleton className="h-16 w-3/4 bg-muted/50" />
        <Skeleton className="h-6 w-full bg-muted/50" />
        <Skeleton className="h-6 w-5/6 bg-muted/50" />
        <div className="flex space-x-4 pt-4">
            <Skeleton className="h-12 w-48 bg-muted/50" />
            <Skeleton className="h-12 w-48 bg-muted/50" />
        </div>
      </div>
    </div>
    <Skeleton className="h-12 w-1/4 bg-muted/50" />
    <div className="space-y-6">
        <Skeleton className="h-32 w-full bg-muted/50" />
        <Skeleton className="h-32 w-full bg-muted/50" />
    </div>
  </div>
);
export function ChannelPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const { playEpisode, episode: currentEpisode, isPlaying } = useAudioPlayerStore();
  const fetchData = useCallback(async () => {
    if (!channelId) {
      setError("Channel ID not found.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [channelData, episodesData] = await Promise.all([
        api<Channel>(`/api/channels/${channelId}`),
        api<Episode[]>(`/api/channels/${channelId}/episodes`)
      ]);
      setChannel(channelData);
      setEpisodes(episodesData);
    } catch (err) {
      setError("Could not connect to the channel. Please check the frequency.");
      console.error(err);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  }, [channelId, navigate]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleDeleteEpisode = async () => {
    if (!episodeToDelete) return;
    try {
      await api(`/api/episodes/${episodeToDelete.id}`, { method: 'DELETE' });
      toast.success(`Episode "${episodeToDelete.title}" deleted.`);
      setEpisodeToDelete(null);
      fetchData(); // Refresh episodes
    } catch (err) {
      toast.error('Failed to delete episode.');
      console.error(err);
    }
  };
  if (loading) {
    return <Layout><LoadingSkeleton /></Layout>;
  }
  if (error || !channel) {
    return (
      <Layout>
        <div className="text-center text-magenta text-2xl p-8 border-2 border-magenta rounded-md">{error || 'Channel not found.'}</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <Toaster richColors theme="dark" />
      <DeleteConfirmationDialog
        open={!!episodeToDelete}
        onOpenChange={(open) => !open && setEpisodeToDelete(null)}
        onConfirm={handleDeleteEpisode}
        title="Delete Episode?"
        description={`Are you sure you want to permanently delete "${episodeToDelete?.title}"? This action cannot be undone.`}
      />
      <div className="space-y-16">
        <Link to="/" className="inline-flex items-center space-x-2 text-cyan-400 hover:text-yellow-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
        <header className="flex flex-col md:flex-row gap-8 items-start">
          <img src={channel.coverArtUrl} alt={channel.title} className="w-full md:w-1/3 rounded-md border-2 border-cyan-400/50 aspect-square object-cover" />
          <div className="w-full md:w-2/3">
            <h1 className="text-6xl font-bold text-cyan-400 tracking-wider">{channel.title}</h1>
            <p className="text-xl text-gray-300 mt-4">{channel.description}</p>
            <div className="mt-8 flex space-x-4">
                <Button asChild variant="outline" className="text-lg px-6 py-6 border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-black transition-all duration-300">
                    <Link to={`/channels/${channelId}/add-episode`}>
                        <PlusCircle className="mr-2 h-5 w-5" /> Add Episode
                    </Link>
                </Button>
                <Button asChild variant="outline" className="text-lg px-6 py-6 border-2 border-cyan-400/80 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300">
                    <Link to={`/channels/${channelId}/edit`}>
                        <Edit className="mr-2 h-5 w-5" /> Edit Channel
                    </Link>
                </Button>
            </div>
          </div>
        </header>
        <section>
          <h2 className="text-4xl font-semibold text-yellow-300 border-b-2 border-yellow-300/50 pb-4 mb-8">Episodes</h2>
          <div className="space-y-6">
            {episodes.length > 0 ? episodes.map(episode => {
              const isCurrentlyPlaying = currentEpisode?.id === episode.id && isPlaying;
              return (
                <Card key={episode.id} className="bg-black/30 border border-cyan-400/20 hover:border-cyan-400/60 transition-colors duration-300 flex items-center p-4">
                  <CardContent className="flex-grow p-0">
                    <CardTitle className="text-2xl text-cyan-400">{episode.title}</CardTitle>
                    <CardDescription className="text-gray-400 mt-2">{episode.description}</CardDescription>
                    <p className="text-sm text-gray-500 mt-2">Published: {format(new Date(episode.publishedAt), 'MMMM d, yyyy')}</p>
                  </CardContent>
                  <div className="flex items-center space-x-2">
                      <Button onClick={() => setEpisodeToDelete(episode)} variant="ghost" size="icon" className="text-magenta hover:text-white hover:bg-transparent" aria-label={`Delete episode ${episode.title}`}>
                          <Trash2 className="h-6 w-6" />
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="text-cyan-400 hover:text-yellow-300 hover:bg-transparent">
                          <Link to={`/episodes/${episode.id}/edit`} aria-label={`Edit episode ${episode.title}`}>
                              <Edit className="h-6 w-6" />
                          </Link>
                      </Button>
                      <Button onClick={() => playEpisode(episode)} variant="ghost" size="icon" className="text-cyan-400 hover:text-yellow-300 hover:bg-transparent" aria-label={isCurrentlyPlaying ? `Pause episode ${episode.title}` : `Play episode ${episode.title}`}>
                          {isCurrentlyPlaying ? <PauseCircle className="h-12 w-12 text-yellow-300" /> : <PlayCircle className="h-12 w-12" />}
                      </Button>
                  </div>
                </Card>
              )
            }) : (
              <div className="text-center py-16 border-2 border-dashed border-cyan-400/50 rounded-md">
                <h3 className="text-3xl font-semibold text-cyan-400">No Episodes Yet</h3>
                <p className="mt-2 text-lg text-gray-400">This channel is waiting for its first broadcast.</p>
                <Button asChild className="mt-6 text-lg px-6 py-6 bg-yellow-300 text-black hover:bg-yellow-400 transition-colors font-bold">
                    <Link to={`/channels/${channelId}/add-episode`}>
                        <PlusCircle className="mr-2 h-5 w-5" /> Add First Episode
                    </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}