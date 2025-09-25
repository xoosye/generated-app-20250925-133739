import { Hono } from "hono";
import { eq, sql } from 'drizzle-orm';
import type { Env } from './core-utils';
import { ok, bad, notFound, isStr } from './core-utils';
import type { Channel, Episode } from "@shared/types";
import { getDb } from './db';
import { channels, episodes } from './db/schema';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CHANNELS
  app.get('/api/channels', async (c) => {
    const db = getDb(c);
    const allChannels = await db.query.channels.findMany();
    return ok(c, allChannels);
  });
  app.get('/api/channels/:id', async (c) => {
    const id = c.req.param('id');
    const db = getDb(c);
    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, id),
    });
    if (!channel) return notFound(c, 'channel not found');
    return ok(c, channel);
  });
  app.post('/api/channels', async (c) => {
    const { title, description, coverArtUrl } = await c.req.json<{ title: string, description: string, coverArtUrl: string }>();
    if (!isStr(title) || !isStr(description) || !isStr(coverArtUrl)) return bad(c, 'title, description, and coverArtUrl are required');
    const db = getDb(c);
    const newChannel: Channel = {
      id: crypto.randomUUID(),
      title,
      description,
      coverArtUrl
    };
    const [createdChannel] = await db.insert(channels).values(newChannel).returning();
    return ok(c, createdChannel);
  });
  app.put('/api/channels/:id', async (c) => {
    const id = c.req.param('id');
    const { title, description, coverArtUrl } = await c.req.json<{ title: string, description: string, coverArtUrl: string }>();
    if (!isStr(title) || !isStr(description) || !isStr(coverArtUrl)) return bad(c, 'title, description, and coverArtUrl are required');
    const db = getDb(c);
    const [updatedChannel] = await db.update(channels)
      .set({ title, description, coverArtUrl })
      .where(eq(channels.id, id))
      .returning();
    if (!updatedChannel) return notFound(c, 'channel not found');
    return ok(c, updatedChannel);
  });
  app.delete('/api/channels/:id', async (c) => {
    const id = c.req.param('id');
    const db = getDb(c);
    // Also delete episodes associated with the channel
    await db.delete(episodes).where(eq(episodes.channelId, id));
    const [deletedChannel] = await db.delete(channels).where(eq(channels.id, id)).returning({ id: channels.id });
    if (!deletedChannel) return notFound(c, 'channel not found');
    return ok(c, { id: deletedChannel.id });
  });
  // EPISODES
  app.get('/api/channels/:channelId/episodes', async (c) => {
    const channelId = c.req.param('channelId');
    const db = getDb(c);
    const channelExists = await db.query.channels.findFirst({ where: eq(channels.id, channelId) });
    if (!channelExists) return notFound(c, 'channel not found');
    const channelEpisodes = await db.query.episodes.findMany({
      where: eq(episodes.channelId, channelId),
    });
    return ok(c, channelEpisodes);
  });
  app.get('/api/episodes/:id', async (c) => {
    const id = c.req.param('id');
    const db = getDb(c);
    const episode = await db.query.episodes.findFirst({
        where: eq(episodes.id, id),
    });
    if (!episode) return notFound(c, 'episode not found');
    return ok(c, episode);
  });
  app.post('/api/channels/:channelId/episodes', async (c) => {
    const channelId = c.req.param('channelId');
    const db = getDb(c);
    const channelExists = await db.query.channels.findFirst({ where: eq(channels.id, channelId) });
    if (!channelExists) return notFound(c, 'channel not found');
    const { title, description, audioUrl } = await c.req.json<{ title: string, description: string, audioUrl: string }>();
    if (!isStr(title) || !isStr(description) || !isStr(audioUrl)) return bad(c, 'title, description, and audioUrl are required');
    const newEpisodeData = {
      id: crypto.randomUUID(),
      channelId,
      title,
      description,
      audioUrl,
      publishedAt: new Date(),
    };
    const [createdEpisode] = await db.insert(episodes).values(newEpisodeData).returning();
    return ok(c, createdEpisode);
  });
  app.put('/api/episodes/:id', async (c) => {
    const id = c.req.param('id');
    const { title, description, audioUrl } = await c.req.json<{ title: string, description: string, audioUrl: string }>();
    if (!isStr(title) || !isStr(description) || !isStr(audioUrl)) return bad(c, 'title, description, and audioUrl are required');
    const db = getDb(c);
    const [updatedEpisode] = await db.update(episodes)
      .set({ title, description, audioUrl })
      .where(eq(episodes.id, id))
      .returning();
    if (!updatedEpisode) return notFound(c, 'episode not found');
    return ok(c, updatedEpisode);
  });
  app.delete('/api/episodes/:id', async (c) => {
    const id = c.req.param('id');
    const db = getDb(c);
    const [deletedEpisode] = await db.delete(episodes).where(eq(episodes.id, id)).returning({ id: episodes.id });
    if (!deletedEpisode) return notFound(c, 'episode not found');
    return ok(c, { id: deletedEpisode.id });
  });
  // HEALTH CHECK
  app.get('/api/health-check', async (c) => {
    const healthStatus = {
      databaseUrlConfigured: false,
      databaseConnected: false,
      timestamp: new Date().toISOString(),
    };
    if (c.env.DATABASE_URL && c.env.DATABASE_URL.length > 0) {
      healthStatus.databaseUrlConfigured = true;
    }
    try {
      const db = getDb(c);
      await db.execute(sql`SELECT 1`);
      healthStatus.databaseConnected = true;
      return ok(c, healthStatus);
    } catch (error) {
      console.error('Health check failed:', error);
      healthStatus.databaseConnected = false;
      // Still return ok, as the health check endpoint itself is working.
      // The payload indicates the service health.
      return ok(c, healthStatus);
    }
  });
}