# MineralWallet v2 — Super-App del Minero Argentino

## Stack
- **Mobile**: React Native (Expo SDK 54) + TypeScript
- **Navigation**: expo-router (file-based)
- **State**: Zustand
- **Storage**: react-native-mmkv (offline), expo-secure-store (auth)
- **UI**: Custom design system (no external UI lib)
- **Fonts**: JetBrains Mono (money), Outfit (headings), DM Sans (body)

## Architecture
- `app/` — expo-router screens (file-based routing)
- `src/theme/` — colors, typography, spacing tokens
- `src/components/ui/` — reusable UI components (Button, Card, Input, Text, Badge, etc.)
- `src/components/layout/` — layout components (TabBar, SOSTabButton)
- `src/stores/` — Zustand stores
- `src/services/` — API services
- `src/hooks/` — custom hooks
- `src/types/` — TypeScript types
- `.stitch/` — Stitch design references (DO NOT modify)

## Design Rules
- Dark-only theme: background #060A14, surface #0F1420
- Copper #C87533 is THE signature accent color
- All touch targets MINIMUM 52px (gloved hands)
- Money amounts ALWAYS use JetBrains Mono (monospace)
- WCAG AAA contrast required
- Offline-first: SOS screen pre-cached, works without network
- Never use pure white (#FFFFFF) — use warm white #E8ECF4

## Conventions
- Spanish for all user-facing text
- Files in English (component names, variables)
- No "use client" directives (this is React Native, NOT Next.js)
- Prefer SVG icons inline (react-native-svg) over icon libraries
