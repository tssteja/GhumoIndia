export interface Temple {
  id: string;
  placeId: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  rating: number;
  ratingCount: number;
  address: string;
  photos: string[];
  videos: TempleVideo[];
  lastUpdated: string;
  timings?: {
    open: string;
    close: string;
    darshan?: string[];
    special?: string;
  };
  festivals?: Array<{
    name: string;
    date: string;
    description?: string;
  }>;
  guidelines?: {
    dressCode?: string;
    photography?: string;
    allowedItems?: string[];
    prohibitedItems?: string[];
    otherRules?: string[];
  };
  heritageTag?: string;
  deity?: string;
}

export interface TempleVideo {
  id: string;
  templeId: string;
  youtubeVideoId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  channel: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  score: number;
  publishedAt: string;
  lastUpdated: string;
}

export interface GridCoordinate {
  lat: number;
  lng: number;
  label: string;
  state?: string;
}

export interface TempleMarkerData {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  rating: number;
  ratingCount: number;
  city: string;
  state: string;
  photo?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  rating: number;
}
