import { Player } from "../../app/types/Player";

export const addPlayer = (player: Player): void => {
  const players = JSON.parse(localStorage.getItem("players") || "[]");
  if (players.find((p: Player) => p.name === player.name)) {
    return;
  }
  players.push(player);
  localStorage.setItem("players", JSON.stringify(players));
};
