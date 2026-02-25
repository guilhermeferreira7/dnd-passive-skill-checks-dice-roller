import { Player } from "../../app/types/Player";

export const removePlayer = (player: Player) => {
  const storagePlayers: Player[] = JSON.parse(
    localStorage.getItem("players") || "[]",
  );

  const updatedPlayers = storagePlayers.filter((p) => p.id !== player.id);

  localStorage.setItem("players", JSON.stringify(updatedPlayers));

  return updatedPlayers;
};
