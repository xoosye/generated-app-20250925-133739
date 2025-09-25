import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { api } from '@/lib/api-client';
import { Toaster, toast } from 'sonner';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import type { Episode } from '@shared/types';
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  audioUrl: z.string().url('Please enter a valid audio URL.')
});
type EpisodeFormData = z.infer<typeof formSchema>;
export function EpisodeFormPage() {
  const { channelId, episodeId } = useParams<{channelId: string;episodeId: string;}>();
  const navigate = useNavigate();
  const isEditing = Boolean(episodeId);
  const effectiveChannelId = isEditing ? undefined : channelId;
  const [fetchedEpisode, setFetchedEpisode] = useState<Episode | null>(null);
  const form = useForm<EpisodeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      audioUrl: '/mock-audio.mp3'
    }
  });
  useEffect(() => {
    if (isEditing) {
      const fetchEpisode = async () => {
        try {
          const episode = await api<Episode>(`/api/episodes/${episodeId}`);
          setFetchedEpisode(episode);
          form.reset(episode);
        } catch (error) {
          toast.error('Failed to load episode data.');
          console.error(error);
        }
      };
      fetchEpisode();
    }
  }, [isEditing, episodeId, form, setFetchedEpisode]);
  const onSubmit = async (data: EpisodeFormData) => {
    try {
      const promise = isEditing ?
      api<Episode>(`/api/episodes/${episodeId}`, { method: 'PUT', body: JSON.stringify(data) }) :
      api<Episode>(`/api/channels/${effectiveChannelId}/episodes`, { method: 'POST', body: JSON.stringify(data) });
      toast.promise(promise, {
        loading: isEditing ? 'Updating episode...' : 'Creating episode...',
        success: (episode) => {
          setTimeout(() => navigate(`/channels/${episode.channelId}`), 1000);
          return `Episode ${isEditing ? 'updated' : 'created'} successfully!`;
        },
        error: `Failed to ${isEditing ? 'update' : 'create'} episode.`
      });
    } catch (error) {
      console.error(error);
    }
  };
  const backLink = isEditing && fetchedEpisode ?
  `/channels/${fetchedEpisode.channelId}` :
  `/channels/${channelId}`;
  return (
    <Layout>
      <Toaster richColors theme="dark" />
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to={backLink} className="inline-flex items-center space-x-2 text-cyan-400 hover:text-yellow-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Channel</span>
        </Link>
        <Card className="bg-black/30 border-2 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-4xl text-cyan-400">{isEditing ? 'Edit Episode' : 'Add New Episode'}</CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              {isEditing ? 'Fine-tune the details of this episode.' : 'Upload a new episode to your channel.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel className="text-xl text-yellow-300">Episode Title</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-cyan-400/50 focus:border-yellow-300 focus:ring-yellow-300 text-lg p-6" placeholder="e.g., The Rise of Outrun" {...field} />
                      </FormControl>
                      <FormMessage className="text-magenta" />
                    </FormItem>
                  } />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel className="text-xl text-yellow-300">Description</FormLabel>
                      <FormControl>
                        <Textarea className="bg-black/50 border-cyan-400/50 focus:border-yellow-300 focus:ring-yellow-300 text-lg p-6 min-h-[150px]" placeholder="Exploring the origins of the Outrun music genre..." {...field} />
                      </FormControl>
                      <FormMessage className="text-magenta" />
                    </FormItem>
                  } />

                <FormField
                  control={form.control}
                  name="audioUrl"
                  render={({ field }) =>
                  <FormItem>
                      <FormLabel className="text-xl text-yellow-300">Audio File URL</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-cyan-400/50 focus:border-yellow-300 focus:ring-yellow-300 text-lg p-6" placeholder="/mock-audio.mp3" {...field} />
                      </FormControl>
                      <FormMessage className="text-magenta" />
                    </FormItem>
                  } />

                <div className="text-center p-6 border-2 border-dashed border-cyan-400/50 rounded-md">
                    <UploadCloud className="mx-auto h-12 w-12 text-cyan-400/70" />
                    <p className="mt-4 text-gray-400">Mock File Upload</p>
                    <p className="text-sm text-gray-500">Actual file uploads are not implemented. Please provide a URL.</p>
                </div>
                <Button type="submit" size="lg" className="w-full text-xl py-8 bg-cyan-500 text-black hover:bg-yellow-300 transition-all duration-300 font-bold" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Submitting...' : isEditing ? 'Update Episode' : 'Add Episode'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>);

}