# MineralWallet v2 — Super-App del Minero Argentino

## Stack
- **Mobile**: React Native (Expo SDK 54) + TypeScript
- **Navigation**: expo-router (file-based)
- **State**: Zustand + MMKV persistence
- **Storage**: react-native-mmkv (offline cache), expo-secure-store (auth tokens)
- **Backend**: Supabase (Auth + PostgreSQL + Edge Functions + Realtime)
- **UI**: Custom design system (no external UI lib)
- **Fonts**: JetBrains Mono (money), Outfit (headings), DM Sans (body)

## Architecture
- `app/` — expo-router screens (file-based routing)
- `src/theme/` — colors, typography, spacing tokens
- `src/components/ui/` — reusable UI components (Button, Card, Input, Text, Badge, Skeleton, etc.)
- `src/components/layout/` — layout components (TabBar, SOSTabButton, Header, ScreenContainer)
- `src/components/cards/` — domain card components (TransactionCard, ShiftCard, etc.)
- `src/components/forms/` — form components (AmountInput, PinInput, ContactPicker, etc.)
- `src/components/shared/` — shared components (OfflineBanner, ErrorBoundary)
- `src/stores/` — Zustand stores (connected to API services)
- `src/services/` — API services (apiClient, Supabase client, offline queue)
- `src/hooks/` — custom hooks (useWallet, useSOS, useConnectivity, useOfflineSync, usePushNotifications)
- `src/types/` — TypeScript types
- `src/utils/` — utilities (currency, date, haptics, pdfGenerator)
- `supabase/migrations/` — SQL schema + RLS + helper functions
- `supabase/functions/` — Edge Functions (auth, wallet, work, safety, health, benefits, career, notifications)
- `.stitch/` — Stitch design references (DO NOT modify)

## Data Flow
```
Screen → Zustand Store → API Service → Supabase Edge Function → PostgreSQL
                       ↘ Offline Queue (if no network) → auto-sync on reconnect
```

## Design Rules
- Dark-only theme: background #060A14, surface #0F1420
- Copper #C87533 is THE signature accent color
- All touch targets MINIMUM 52px (gloved hands)
- Money amounts ALWAYS use JetBrains Mono (monospace)
- WCAG AAA contrast required
- Offline-first: SOS pre-cached, queue persisted in MMKV
- Never use pure white (#FFFFFF) — use warm white #E8ECF4

## Conventions
- Spanish for all user-facing text
- Files in English (component names, variables)
- No "use client" directives (this is React Native, NOT Next.js)
- Prefer SVG icons inline (react-native-svg) over icon libraries
- Monetary amounts stored as INTEGER (centavos) in database
- All stores use partialize to exclude isLoading/error from MMKV persistence
- API responses follow ApiResponse<T> shape: { success, data?, error? }

## Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL` — Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `EXPO_PUBLIC_API_URL` — Edge Functions base URL

## Key Commands
- `npm start` — Start Expo dev server
- `npx expo start --android` / `--ios` — Platform-specific dev
- `eas build --profile development` — Dev build
- `eas build --profile production` — Production build
