import React, { useEffect } from 'react';
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
import type { Channel } from '@shared/types';
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  coverArtUrl: z.string().url('Please enter a valid image URL.'),
});
type ChannelFormData = z.infer<typeof formSchema>;
export function ChannelFormPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(channelId);
  const form = useForm<ChannelFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      coverArtUrl: '',
    },
  });
  useEffect(() => {
    if (isEditing) {
      const fetchChannel = async () => {
        try {
          const channel = await api<Channel>(`/api/channels/${channelId}`);
          form.reset(channel);
        } catch (error) {
          toast.error('Failed to load channel data.');
          console.error(error);
        }
      };
      fetchChannel();
    }
  }, [isEditing, channelId, form]);
  const onSubmit = async (data: ChannelFormData) => {
    try {
      const promise = isEditing
        ? api<Channel>(`/api/channels/${channelId}`, { method: 'PUT', body: JSON.stringify(data) })
        : api<Channel>('/api/channels', { method: 'POST', body: JSON.stringify(data) });
      toast.promise(promise, {
        loading: isEditing ? 'Updating channel...' : 'Creating channel...',
        success: (channel) => {
          setTimeout(() => navigate(isEditing ? `/channels/${channelId}` : `/channels/${channel.id}`), 1000);
          return `Channel ${isEditing ? 'updated' : 'created'} successfully!`;
        },
        error: `Failed to ${isEditing ? 'update' : 'create'} channel.`,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Layout>
      <Toaster richColors theme="dark" />
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to={isEditing ? `/channels/${channelId}` : '/'} className="inline-flex items-center space-x-2 text-cyan-400 hover:text-yellow-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>{isEditing ? 'Back to Channel' : 'Back to Dashboard'}</span>
        </Link>
        <Card className="bg-black/30 border-2 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-4xl text-cyan-400">{isEditing ? 'Edit Channel' : 'Create New Channel'}</CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              {isEditing ? 'Update the details for your podcast channel.' : 'Launch a new podcast into the digital ether.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl text-yellow-300">Channel Title</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-cyan-400/50 focus:border-yellow-300 focus:ring-yellow-300 text-lg p-6" placeholder="e.g., SYNTHWAVE SESSIONS" {...field} />
                      </FormControl>
                      <FormMessage className="text-magenta" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl text-yellow-300">Description</FormLabel>
                      <FormControl>
                        <Textarea className="bg-black/50 border-cyan-400/50 focus:border-yellow-300 focus:ring-yellow-300 text-lg p-6 min-h-[150px]" placeholder="A deep dive into the retro-futuristic sounds of the 80s..." {...field} />
                      </FormControl>
                      <FormMessage className="text-magenta" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coverArtUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl text-yellow-300">Cover Art URL</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-cyan-400/50 focus:border-yellow-300 focus:ring-yellow-300 text-lg p-6" placeholder="https://picsum.photos/seed/synthwave/500/500" {...field} />
                      </FormControl>
                      <FormMessage className="text-magenta" />
                    </FormItem>
                  )}
                />
                <div className="text-center p-6 border-2 border-dashed border-cyan-400/50 rounded-md">
                    <UploadCloud className="mx-auto h-12 w-12 text-cyan-400/70" />
                    <p className="mt-4 text-gray-400">Mock File Upload</p>
                    <p className="text-sm text-gray-500">Actual file uploads are not implemented. Please provide a URL.</p>
                </div>
                <Button type="submit" size="lg" className="w-full text-xl py-8 bg-cyan-500 text-black hover:bg-yellow-300 transition-all duration-300 font-bold" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Submitting...' : (isEditing ? 'Update Channel' : 'Create Channel')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}