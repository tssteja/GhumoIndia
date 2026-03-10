# 🛕 TempleMap

**Explore Famous Temples Across India** — A location-based discovery platform where users browse an interactive map of India, click temple locations, watch top-ranked YouTube travel videos, read key information, and get directions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + React + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Firebase Firestore |
| Maps | Google Maps JavaScript API |
| Temple Discovery | Google Places API |
| Videos | YouTube Data API v3 |
| Deployment | Vercel |

## Features

- 🗺️ **Interactive Map** — Full-screen Google Map of India with temple markers
- 🔍 **Search** — Find temples by name with instant search
- 📍 **Temple Details** — Dedicated SEO pages with images, info, directions
- 🎥 **YouTube Videos** — Auto-ranked travel videos per temple
- 📍 **Nearby Temples** — Discover temples within 100 km
- ⚡ **Scheduled Jobs** — Auto-discover temples & rank videos
- 📱 **Mobile Responsive** — Works on all screen sizes

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Firebase project
- Google Cloud API keys

### 1. Install Dependencies

```bash
cd templemap-app
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `GOOGLE_PLACES_API_KEY` | Google Places API key |
| `CRON_SECRET` | Secret for protecting cron endpoints |

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Cloud Firestore** in the Firebase console
4. Create a **Web App** and copy the config values to `.env.local`
5. In Firestore, create two collections:
   - `temples`
   - `templeVideos`

### 4. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
3. Create an API key and add it to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
4. Create a separate server-side API key for `GOOGLE_PLACES_API_KEY`

### 5. YouTube API Setup

1. In Google Cloud Console, enable **YouTube Data API v3**
2. Create an API key and add it to `YOUTUBE_API_KEY`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Seed Initial Data

Run the temple discovery script to populate Firestore:

```bash
npx ts-node scripts/discoverTemples.ts
```

Then fetch videos for discovered temples:

```bash
npx ts-node scripts/updateTempleVideos.ts
```

## Project Structure

```
templemap-app/
├── app/
│   ├── api/
│   │   ├── temples/
│   │   │   ├── route.ts          # GET all temples
│   │   │   ├── [slug]/route.ts   # GET temple by slug
│   │   │   ├── search/route.ts   # GET search temples
│   │   │   └── nearby/route.ts   # GET nearby temples
│   │   └── cron/
│   │       ├── discover-temples/route.ts  # POST weekly discovery
│   │       └── update-videos/route.ts     # POST daily video update
│   ├── temple/[slug]/
│   │   ├── page.tsx              # Temple detail (server)
│   │   └── TempleDetailClient.tsx # Temple detail (client)
│   ├── layout.tsx
│   ├── page.tsx                  # Homepage with map
│   └── globals.css
├── components/
│   ├── TempleMap.tsx
│   ├── TempleMarker.tsx
│   ├── TempleSidebar.tsx
│   ├── TempleCard.tsx
│   ├── VideoGallery.tsx
│   ├── YouTubeEmbed.tsx
│   ├── SearchBar.tsx
│   └── NearbyTemples.tsx
├── lib/
│   ├── firebase.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── templeDiscovery.ts
│   ├── youtubeService.ts
│   └── videoRanking.ts
├── scripts/
│   ├── seedInitialGrid.ts
│   ├── discoverTemples.ts
│   └── updateTempleVideos.ts
├── vercel.json                   # Cron schedules
└── .env.local.example
```

## Scheduled Jobs

The app uses Vercel Cron Jobs. Configure in `vercel.json`:

| Job | Schedule | Description |
|-----|----------|-------------|
| Temple Discovery | Weekly (Sunday 2 AM UTC) | Discover new temples across India |
| Video Ranking | Daily (3 AM UTC) | Update YouTube video rankings |

Protect cron endpoints with the `CRON_SECRET` env variable.

## Deployment (Vercel)

1. Push to GitHub.
2. Import project in [Vercel Dashboard](https://vercel.com/new).
3. Add all environment variables from `.env.local`.
4. Deploy!

Cron jobs will automatically run based on `vercel.json` configuration.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/temples` | Fetch all temples |
| GET | `/api/temples/[slug]` | Get temple by slug + videos |
| GET | `/api/temples/search?q=` | Search temples by name |
| GET | `/api/temples/nearby?lat=&lng=&radius=` | Find nearby temples |
| POST | `/api/cron/discover-temples` | Run temple discovery |
| POST | `/api/cron/update-videos` | Run video ranking |

## License

MIT
