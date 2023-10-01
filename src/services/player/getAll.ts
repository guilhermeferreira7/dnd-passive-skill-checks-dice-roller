import { Player } from "../../app/types/Player";

export const getAllPlayers = (): Player[] => {
  return JSON.parse(localStorage.getItem("players") || "[]");
};
