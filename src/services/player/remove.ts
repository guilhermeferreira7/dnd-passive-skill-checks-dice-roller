import { Player } from "../../app/types/Player";

export const removePlayer = (player: Player) => {
  const players = JSON.parse(localStorage.getItem("players") || "[]");
  const newPlayers = players.filter((p: Player) => p.name !== player.name);
  localStorage.setItem("players", JSON.stringify(newPlayers));

  return newPlayers;
};
