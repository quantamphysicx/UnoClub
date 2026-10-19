# UNO CLUB 🎴

> **Your friends. Your cards. Your chaos.**

UNO CLUB is a premium, browser-based real-time multiplayer card game built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and an authoritative **Node.js + Socket.IO** game engine.

Players can instantly create private tables, share a unique 6-character invitation code, join from desktop or mobile devices without registration, and play a complete Classic UNO match in a cinematic, dark-themed digital tabletop.

---

## 🌟 Key Features

### 1. Cinematic Gaming Aesthetic
- **Curated Dark Palette**: Primary `#0B0C10`, surface `#171A23`, electric violet `#7C3AED` accent.
- **Original Vector Cards**: Custom SVG/CSS card faces with corner indices, dynamic 3D hover lift, playable glow states, and zero third-party copyrighted assets.
- **Geometric Avatars**: 8 original geometric player avatars (Cyber Prism, Solar Flare, Matrix Ring, Crimson Shield, Azure Vortex, Nebula Star, Golden Crown, Phantom Eye).
- **Interactive Game Felt**: Radial lighting, rotating direction chevrons, pulsing active color ring, and 3D stacked draw deck.

### 2. Private Rooms & Instant Joining
- **Unambiguous 6-Character Codes**: Cryptographically generated using characters `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (avoiding confusing `0/O`, `1/I/L`).
- **Direct Invite URLs**: Shareable links in the form `/room/[CODE]` with an invite preview card.
- **One-Click Clipboard**: Instant copy for room code and direct join link with toast feedback.
- **Host Permissions**: Host controls room capacity (2–8 players), turn timers (off, 15s, 30s, 45s), kick player, and match launch.
- **Graceful Host Transfer**: Automatic host reassignment if the host disconnects or leaves.

### 3. Server-Authoritative Classic Game Engine
- **Standard 108-Card Deck**:
  - 76 Number cards (0–9 across Red, Blue, Green, Yellow).
  - 24 Action cards (Skip, Reverse, Draw Two).
  - 8 Wild cards (4 Wild, 4 Wild Draw Four).
- **Authoritative Legality Checks**: The server validates color matching, value matching, card ownership, turn ownership, and action idempotency.
- **Official Turn Rules**:
  - Direction reversal (with official 2-player rule: Reverse acts as a Skip).
  - Skip progression (+2 turn advances).
  - Draw Two (+2 cards and turn skip).
  - Wild Draw Four (+4 cards, color selection, and turn skip).
  - Empty draw pile reshuffling from discard pile.
- **UNO Declaration & Challenge Penalty**:
  - Urgent pulsating UNO button when down to 1 or 2 cards.
  - 5-second challenge window if a player fails to declare UNO before playing. Opponents can challenge, imposing a +2 penalty card draw.
- **Rematch Flow**: Winner celebration with `canvas-confetti`, match statistics, and instant round restart while retaining room members.

### 4. Zero-Asset Web Audio Synthesizer
- Built using the native **Web Audio API**: zero external MP3s to load or fail.
- Procedurally synthesized crisp card snaps, draw slides, whoosh skips, dual-tone reverse chimes, resonant color chords, high-energy UNO alarm, and victory fanfare.
- Persistent global sound mute/unmute control.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Real-Time Multiplayer**: Node.js HTTP Server + Socket.IO (Authoritative Server)
- **Validation**: Zod
- **Icons**: Lucide React
- **Animations**: CSS 3D Transforms, Transitions & Keyframes
- **Effects**: Canvas Confetti
- **Testing**: Vitest (Unit & Socket.IO Integration Tests)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended, tested on Node v24)
- npm (v9.0 or higher)

### Installation
```bash
npm install
```

### Development Server
Run the unified Next.js + Socket.IO real-time server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests
Run Vitest to verify all 12 game engine rules and real-time socket integration tests:
```bash
npm test
```

### Production Build
```bash
npm run build
npm start
```

---

## 📁 Architecture & File Layout

```
uno/
├── server.ts                    # Unified Node.js server binding Next.js + Socket.IO
├── server/
│   ├── rooms.ts                 # RoomManager, 6-char code generator, session tracking
│   └── socket.ts                # Real-time event handlers, validation, private hand sync
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with persistent GameProvider & dark theme
│   │   ├── page.tsx             # Landing page with hero, floating card art, & CTAs
│   │   └── room/[code]/page.tsx # Dynamic room route: invite preview, lobby, & game table
│   ├── components/
│   │   ├── CardView.tsx         # Original vector card faces, 3D lift, playable glow
│   │   ├── GameTable.tsx        # Digital table, center piles, opponents, player hand
│   │   ├── LobbyView.tsx        # Synchronized waiting room, ready states, copy controls
│   │   ├── Navbar.tsx           # Compact header with Live status, sound toggle, & profile
│   │   ├── Avatar.tsx           # 8 original geometric cyber/indie vector avatars
│   │   ├── Toasts.tsx           # Non-obtrusive glassmorphic toast notifications
│   │   └── modals/
│   │       ├── CreateRoomModal.tsx      # Game settings (capacity, turn timers)
│   │       ├── JoinRoomModal.tsx        # 6-character code input with paste
│   │       ├── HowToPlayModal.tsx       # Official Classic UNO rules guide
│   │       ├── GuestProfileModal.tsx    # Display name & avatar selection
│   │       ├── WildColorPickerModal.tsx # Active color selection (Red/Blue/Green/Yellow)
│   │       └── VictoryModal.tsx         # Confetti celebration, winner stats, & rematch
│   ├── context/
│   │   └── GameContext.tsx      # Client socket hook, session restoration, actions
│   ├── lib/
│   │   ├── game-engine/
│   │   │   ├── deck.ts          # 108-card deck creation & Fisher-Yates shuffle
│   │   │   ├── rules.ts         # Move legality checking & card scoring
│   │   │   └── engine.ts        # Authoritative UnoGameEngine (turns, UNO, reshuffle)
│   │   └── sound/
│   │       └── audio.ts         # Native Web Audio API procedural sound synthesizer
│   └── types/
│       └── game.ts              # Shared TypeScript contracts & socket interfaces
└── tests/
    ├── engine.test.ts           # Vitest unit tests for deck, rules, 2p reverse, UNO
    └── multiplayer.test.ts      # Vitest integration tests for 2-client socket games
```

---

## 🔒 Security & Fair Play
- **Authoritative Server**: Client requests never modify state directly. The server validates turn ownership, card possession, legal moves, and win conditions.
- **Private State Separation**: Complete decks and opponent hands are never broadcast to the network. Each player receives only public table state plus their own 7 cards.
- **Input Sanitization**: Room codes are sanitized and normalized; guest display names are validated (2–20 characters, trimmed, HTML-escaped).
- **Session Restoration**: Disconnections have a 60-second grace period with state resynchronization upon page refresh.
