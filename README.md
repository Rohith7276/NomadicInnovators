**Tour De India** — Next.js app for travel and itinerary experiences

Summary
- A modern Next.js 14 app that uses Firebase (Auth, Firestore, Storage), optional Upstash Redis caching, and serverless API routes. Includes UI components, theme support, and an AI/chat API integration.

Quick setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` at the project root and add required environment variables (example below).

3. Run the development server:

```bash
npm run dev
```

4. Open http://localhost:3000

Environment variables
- Firebase (used in `app/firebase/firebaseConfig.jsx`):

	- `NEXT_PUBLIC_FIREBASE_API_KEY`
	- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
	- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
	- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
	- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
	- `NEXT_PUBLIC_FIREBASE_APP_ID`
	- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

- Upstash Redis (optional cache used by `lib/redisCache.js`):

	- `UPSTASH_REDIS_REST_URL`
	- `UPSTASH_REDIS_REST_TOKEN`

Example `.env.local` (replace values):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

Available npm scripts
- `dev` — runs the Next.js development server
- `build` — builds the production app
- `start` — runs the production server
- `lint` — runs ESLint

Project structure (high-level)
- `app/` — Next.js App Router pages and server components
	- `firebase/firebaseConfig.jsx` — Firebase initialization
	- `api/` — serverless API routes (chat, itinerary, state)
- `components/` — React UI components used across the app
- `contexts/` — React contexts (auth, themes)
- `public/` — static assets and images
- `lib/redisCache.js` — optional Upstash Redis cache helper

Notes and tips
- The app falls back to direct Firebase/Groq requests if Redis is not configured.
- Authentication integrates Firebase Auth (Google provider included in `firebaseConfig.jsx`).
- If you plan to deploy to Vercel, add the environment variables into your Vercel project settings.

Deployment
- Deploy to Vercel for easiest hosting of Next.js apps. Ensure all `NEXT_PUBLIC_*` and `UPSTASH_*` variables are set in the Vercel dashboard.

Troubleshooting
- If a Firebase feature isn't working, confirm the `NEXT_PUBLIC_FIREBASE_*` values match your Firebase project settings.
- If caching behaves unexpectedly, verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` and consult Upstash docs.

Contributing
- Feel free to open issues or add pull requests. Keep changes focused and include brief descriptions.
 
