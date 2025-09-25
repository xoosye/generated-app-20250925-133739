import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { Channel } from '@shared/types';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Radio, Trash2 } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import { Toaster, toast } from 'sonner';
const ChannelCard = ({ channel, onDelete }: { channel: Channel, onDelete: (channel: Channel) => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
    transition={{ duration: 0.5 }}
    className="relative"
  >
    <div className="absolute top-2 right-2 z-10">
      <Button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(channel);
        }}
        variant="ghost"
        size="icon"
        className="text-magenta h-10 w-10 rounded-full bg-black/50 hover:bg-magenta hover:text-white transition-colors"
        aria-label={`Delete channel ${channel.title}`}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
    <Link to={`/channels/${channel.id}`}>
      <Card className="bg-black/30 border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 rounded-md overflow-hidden group h-full flex flex-col">
        <CardHeader className="p-0">
          <img src={channel.coverArtUrl} alt={channel.title} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" />
        </CardHeader>
        <CardContent className="p-6 flex-grow flex flex-col">
          <CardTitle className="text-2xl text-cyan-400 group-hover:text-yellow-300 transition-colors truncate">{channel.title}</CardTitle>
          <CardDescription className="text-gray-400 mt-2 flex-grow h-20 overflow-hidden text-ellipsis">{channel.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);
const LoadingSkeleton = () => (
  <div className="space-y-4 p-1 border-2 border-transparent rounded-md">
     <Card className="bg-black/30 border-2 border-cyan-400/30 rounded-md overflow-hidden">
        <Skeleton className="h-48 w-full bg-muted/50" />
        <CardContent className="p-6 space-y-2">
          <Skeleton className="h-8 w-3/4 bg-muted/50" />
          <Skeleton className="h-5 w-full bg-muted/50" />
          <Skeleton className="h-5 w-5/6 bg-muted/50" />
        </CardContent>
      </Card>
  </div>
);
const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-cyan-400/50 rounded-md">
        <Radio className="h-24 w-24 text-cyan-400/70" />
        <h2 className="mt-6 text-3xl font-semibold text-cyan-400">No Channels Found</h2>
        <p className="mt-2 text-lg text-gray-400">It's quiet in here. Start your own broadcast.</p>
        <Button asChild className="mt-6 text-lg px-6 py-6 bg-yellow-300 text-black hover:bg-yellow-400 transition-colors font-bold">
            <Link to="/create-channel">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Channel
            </Link>
        </Button>
    </div>
);
export function HomePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api<Channel[]>('/api/channels');
      setChannels(data);
    } catch (err) {
      setError('Failed to load channels. The mainframe might be down.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);
  const handleDeleteChannel = async () => {
    if (!channelToDelete) return;
    try {
      await api(`/api/channels/${channelToDelete.id}`, { method: 'DELETE' });
      toast.success(`Channel "${channelToDelete.title}" and all its episodes deleted.`);
      setChannelToDelete(null);
      // Optimistic update
      setChannels(prev => prev.filter(c => c.id !== channelToDelete.id));
    } catch (err) {
      toast.error('Failed to delete channel.');
      console.error(err);
      fetchChannels(); // Re-fetch on error to sync state
    }
  };
  return (
    <Layout>
      <Toaster richColors theme="dark" />
      <DeleteConfirmationDialog
        open={!!channelToDelete}
        onOpenChange={(open) => !open && setChannelToDelete(null)}
        onConfirm={handleDeleteChannel}
        title="Delete Channel?"
        description={`Are you sure you want to permanently delete "${channelToDelete?.title}"? This will also delete all of its episodes. This action cannot be undone.`}
      />
      <div className="space-y-16">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-6xl font-bold text-cyan-400 tracking-wider">Dashboard</h1>
            <p className="text-xl text-gray-400 mt-2">Your portal to the podcasting dimension.</p>
          </div>
          {channels.length > 0 && (
            <Button asChild variant="outline" className="text-lg px-6 py-6 border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-black transition-all duration-300">
              <Link to="/create-channel">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Channel
              </Link>
            </Button>
          )}
        </header>
        {error && <div className="text-center text-magenta text-2xl p-8 border-2 border-magenta rounded-md">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} />)
          ) : channels.length > 0 ? (
            channels.map(channel => <ChannelCard key={channel.id} channel={channel} onDelete={setChannelToDelete} />)
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </Layout>
  );
}