export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Channel {
  id: string;
  title: string;
  description: string;
  coverArtUrl: string;
}
export interface Episode {
  id: string;
  channelId: string;
  title: string;
  description: string;
  audioUrl: string;
  publishedAt: string; // ISO 8601 date string
}