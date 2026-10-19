'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameProvider, useGame } from '@/context/GameContext';
import { Navbar } from '@/components/Navbar';
import { ToastContainer } from '@/components/Toasts';
import { LobbyView } from '@/components/LobbyView';
import { GameTable } from '@/components/GameTable';
import { HowToPlayModal } from '@/components/modals/HowToPlayModal';
import { GuestProfileModal } from '@/components/modals/GuestProfileModal';
import { Avatar, AVATAR_OPTIONS } from '@/components/Avatar';
import { Sparkles, Users, ArrowRight, Loader2, Shield } from 'lucide-react';

function RoomInner() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params?.code as string) || '').toUpperCase();

  const {
    publicState,
    playerId,
    joinRoom,
    playerName,
    playerAvatar,
    setPlayerIdentity,
    isConnected,
  } = useGame();

  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [joinName, setJoinName] = useState(playerName);
  const [joinAvatar, setJoinAvatar] = useState(playerAvatar);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Synchronize initial input with context
  useEffect(() => {
    setJoinName(playerName);
    setJoinAvatar(playerAvatar);
  }, [playerName, playerAvatar]);

  // If already in the room
  const isInThisRoom =
    publicState &&
    publicState.roomCode.toUpperCase() === roomCode &&
    publicState.players.some((p) => p.id === playerId);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName.trim()) {
      setJoinError('Please enter your name.');
      return;
    }
    setPlayerIdentity(joinName.trim(), joinAvatar);

    setIsJoining(true);
    setJoinError('');
    const res = await joinRoom(roomCode);
    setIsJoining(false);

    if (!res.success) {
      setJoinError(res.error || 'Failed to join room.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#F3F4F6] relative">
      <Navbar
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div className="flex-1 flex flex-col justify-center">
        {/* If player is in this room, show Lobby or Game Table based on phase */}
        {isInThisRoom ? (
          publicState.phase === 'lobby' ? (
            <LobbyView roomCode={roomCode} />
          ) : (
            <GameTable />
          )
        ) : (
          /* Invite Link Preview Card */
          <div className="max-w-md mx-auto w-full px-4 py-12 animate-in fade-in duration-300">
            <div className="bg-[#11131A] border border-[#232733] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center mb-6">
                <span className="px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-[11px] font-bold text-violet-300 uppercase tracking-wider inline-block mb-3">
                  Private Game Invitation
                </span>
                <h1 className="text-2xl font-black text-white">Join Room</h1>
                <div className="mt-2 inline-block px-4 py-1 rounded-xl bg-[#171A24] border border-[#2D3344]">
                  <span className="text-2xl font-mono font-black tracking-widest text-violet-400">
                    {roomCode}
                  </span>
                </div>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => {
                      setJoinName(e.target.value);
                      setJoinError('');
                    }}
                    placeholder="Enter your alias"
                    maxLength={20}
                    className="w-full bg-[#171A23] border border-[#2B3040] focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:ring-1 focus:ring-violet-500"
                  />
                  {joinError && <p className="text-xs text-red-400 mt-1">{joinError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Select Avatar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setJoinAvatar(opt.id)}
                        className={`p-1.5 rounded-xl border flex items-center justify-center transition ${
                          joinAvatar === opt.id
                            ? 'border-violet-500 bg-violet-600/20 ring-2 ring-violet-500/50'
                            : 'border-[#232733] bg-[#171A23] hover:border-gray-600'
                        }`}
                      >
                        <Avatar avatarId={opt.id} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isJoining}
                    className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-extrabold text-sm text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Entering Room...
                      </>
                    ) : (
                      <>
                        Join Table
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <GuestProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-500 font-medium text-sm">
          Entering room...
        </div>
      }
    >
      <RoomInner />
    </Suspense>
  );
}
