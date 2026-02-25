import { PersonAddAlt1Sharp } from "@mui/icons-material";
import React from "react";

type NewPlayerButtonProps = {
  onAddPlayer: () => void;
};

export function NewPlayerButton({ onAddPlayer }: NewPlayerButtonProps) {
  return (
    <button
      className="p-2 text-center rounded-md border border-orange-700 flex items-center gap-1"
      onClick={onAddPlayer}
    >
      Novo personagem
      <PersonAddAlt1Sharp />
    </button>
  );
}
