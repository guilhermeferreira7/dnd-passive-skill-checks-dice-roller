"use client";

import { PersonAddAlt1Sharp } from "@mui/icons-material";
import { useState } from "react";

import Table from "./components/Table";
import { addPlayer } from "../services/player/add";
import { getAllPlayers } from "../services/player/getAll";

export default function Home() {
  const [players, setPlayers] = useState(getAllPlayers());

  const handleAddPlayer = () => {
    addPlayer({
      name: `novopersonagem${Math.floor(Math.random() * 100) + 1}`,
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
        <div className="flex gap-1">
          <button
            className="p-2 text-center rounded-md border border-orange-700 flex items-center gap-1"
            onClick={handleAddPlayer}
          >
            Novo personagem
            <PersonAddAlt1Sharp />
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <div className="px-4">
          <Table players={players} />
        </div>
      </main>
      <footer className="flex justify-center p-4 border-t border-t-gray-500">
        Criado com muito carinho por:
        <span className="italic ml-1">suamae</span>
      </footer>
    </div>
  );
}
