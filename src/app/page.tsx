"use client";

import { useEffect, useState } from "react";

import { addPlayer } from "../services/player/add";
import { getAllPlayers } from "../services/player/getAll";
import { NewPlayerButton } from "./components/NewPlayerButton/NewPlayerButton";
import Table from "./components/Table";
import { Player } from "./types/Player";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);

  // TODO: fix this
  useEffect(() => {
    setPlayers(getAllPlayers());
  }, []);

  const handleAddPlayer = () => {
    const lastPlayerId = players[players.length - 1]?.id || 0;
    const newId = lastPlayerId + 1;

    addPlayer({
      id: newId,
      name: `Player ${newId}`,
      skills: {
        arcana: 0,
        history: 0,
        insight: 0,
        investigation: 0,
        nature: 0,
        perception: 0,
        religion: 0,
      },
    });

    setPlayers(getAllPlayers());
  };

  return (
    <div className="bg-stone-900 min-h-screen h-full flex flex-col">
      <header className="flex items-center justify-between p-4">
        <span className="text-orange-700 text-xl font-bold">
          Aplicativo da sara
        </span>
        {players.length > 0 && (
          <div className="flex gap-1">
            <NewPlayerButton onAddPlayer={handleAddPlayer} />
          </div>
        )}
      </header>
      <main className="flex-1 flex flex-col">
        <div className="px-4">
          <Table
            players={players}
            setPlayers={setPlayers}
            onAddPlayer={handleAddPlayer}
          />
        </div>
      </main>
      <footer className="flex justify-center p-4 border-t border-t-gray-500">
        Criado com muito carinho por:
        <span className="italic ml-1">suamae</span>
      </footer>
    </div>
  );
}
