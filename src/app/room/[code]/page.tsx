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
import { ArrowRight, Loader2 } from 'lucide-react';

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
    const res = await joinRoom(roomCode, joinName.trim(), joinAvatar);
    setIsJoining(false);

    if (!res.success) {
      setJoinError(res.error || 'Failed to join room.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#101010] text-[#F2F0EB] relative">
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
          <div className="max-w-sm mx-auto w-full px-4 py-12 animate-in fade-in duration-200">
            <div className="bg-[#181818] border border-[#333333] rounded-xl p-6 sm:p-7 shadow-xl">
              <div className="text-center mb-6">
                <span className="px-2.5 py-1 rounded bg-[#202020] border border-[#333333] text-[11px] font-mono text-[#A5A39E] uppercase tracking-wider inline-block mb-3">
                  Private Game Invitation
                </span>
                <h1 className="text-xl font-bold text-[#F2F0EB] tracking-tight">Join Room</h1>
                <div className="mt-2 inline-block px-4 py-1.5 rounded-lg bg-[#202020] border border-[#333333]">
                  <span className="text-2xl font-mono font-bold tracking-widest text-[#D6FF62]">
                    {roomCode}
                  </span>
                </div>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A39E] mb-1.5">
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
                    className="w-full bg-[#202020] border border-[#333333] focus:border-[#D6FF62] rounded-lg px-3.5 py-2 text-sm text-[#F2F0EB] placeholder-[#777570] outline-none transition"
                  />
                  {joinError && <p className="text-xs text-[#D32F2F] mt-1">{joinError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A39E] mb-2">
                    Select Avatar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setJoinAvatar(opt.id)}
                        className={`p-1.5 rounded-lg border flex items-center justify-center transition ${
                          joinAvatar === opt.id
                            ? 'border-[#D6FF62] bg-[#202020] ring-1 ring-[#D6FF62]'
                            : 'border-[#333333] bg-[#202020] hover:border-[#555555]'
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
                    className="w-full py-3 rounded-lg bg-[#D6FF62] hover:bg-[#cbf556] font-bold text-xs uppercase tracking-wider text-[#101010] flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
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
        <div className="min-h-screen bg-[#101010] flex items-center justify-center text-[#777570] font-mono text-xs uppercase tracking-wider">
          Connecting to room...
        </div>
      }
    >
      <RoomInner />
    </Suspense>
  );
}
