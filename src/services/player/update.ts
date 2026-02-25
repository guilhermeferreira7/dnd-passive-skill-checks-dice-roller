import { Player } from "../../app/types/Player";
import { getAllPlayers } from "./getAll";

export function update(player: Player): Player[] {
  const players = getAllPlayers();
  const index = players.findIndex((p) => p.id === player.id);
  players[index] = player;
  localStorage.setItem("players", JSON.stringify(players));
  return getAllPlayers();
}
