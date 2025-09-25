import { pgTable, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
export const channels = pgTable('channels', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  coverArtUrl: text('cover_art_url').notNull(),
});
export const episodes = pgTable('episodes', {
  id: text('id').primaryKey(),
  channelId: text('channel_id')
    .notNull()
    .references(() => channels.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  audioUrl: text('audio_url').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
});
export const channelRelations = relations(channels, ({ many }) => ({
  episodes: many(episodes),
}));
export const episodeRelations = relations(episodes, ({ one }) => ({
  channel: one(channels, {
    fields: [episodes.channelId],
    references: [channels.id],
  }),
}));