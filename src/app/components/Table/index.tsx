import {
  Add,
  Clear,
  ManageAccounts,
  PersonRemove,
  Remove,
  Save,
} from "@mui/icons-material";
import { Modal } from "@mui/material";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Image from "next/image";

import D20 from "../../../assets/icons/d20.svg";
import { getAllPlayers } from "../../../services/player/getAll";
import { removePlayer } from "../../../services/player/remove";
import { update } from "../../../services/player/update";
import { Player } from "../../types/Player";
import { NewPlayerButton } from "../NewPlayerButton/NewPlayerButton";
import { RollResult, useDiceAnimation } from "./_useDiceAnimation";
import { cn } from "@/utils";

const SKILLS_CONFIG = [
  { id: "arcana", label: "Arcanismo" },
  { id: "history", label: "História" },
  { id: "insight", label: "Intuição" },
  { id: "investigation", label: "Investigação" },
  { id: "nature", label: "Natureza" },
  { id: "perception", label: "Percepção" },
  { id: "religion", label: "Religião" },
] as const;

const ROLL_ANIMATION_DURATION = 1000;

type TableProps = {
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  onAddPlayer: () => void;
};

export default function Table({
  players,
  onAddPlayer,
  setPlayers,
}: TableProps) {
  const [rollModalOpen, setRollModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [rollResults, setRollResults] = useState<RollResult[]>([]);
  const [displayResults, setDisplayResults] = useState<RollResult[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const { isRolling, setIsRolling } = useDiceAnimation({
    rollResults,
    setDisplayResults,
  });

  const handleOpenRolls = (title: string, results: RollResult[]) => {
    setModalTitle(title);
    setRollResults(results);
    setDisplayResults(
      results.map((r) => ({
        ...r,
        die: Math.floor(Math.random() * 20) + 1,
        total: 0,
      })),
    );
    setRollModalOpen(true);
    setIsRolling(true);
  };

  const handleRollDices = (skill: keyof Player["skills"]) => {
    const results = players.map((player) => {
      const dice = Math.floor(Math.random() * 20) + 1;
      const mod = player.skills[skill];
      return { name: player.name, dice: dice, mod, total: dice + mod };
    });

    const skillLabel =
      SKILLS_CONFIG.find((s) => s.id === skill)?.label || skill;

    handleOpenRolls(String(skillLabel), results);
  };

  const handleUpdatePlayer = () => {
    if (editingPlayer) {
      update(editingPlayer);
      setPlayers(getAllPlayers());
      setEditModalOpen(false);
      setEditingPlayer(null);
    }
  };

  const updateSkillValue = (skillId: keyof Player["skills"], value: number) => {
    if (!editingPlayer) return;
    setEditingPlayer({
      ...editingPlayer,
      skills: { ...editingPlayer.skills, [skillId]: value },
    });
  };

  const PlayerItem = ({ player }: { player: Player }) => {
    const handleRollDice = (skill: string, modifier: number) => {
      const dice = Math.floor(Math.random() * 20) + 1;
      handleOpenRolls(skill, [
        { name: player.name, dice, mod: modifier, total: dice + modifier },
      ]);
    };

    const rowStyles = cn(
      "flex flex-col border-b mb-4 text-white overflow-hidden rounded-lg",
      "dark:border-neutral-500",
      "md:table-row md:mb-0 md:bg-transparent md:rounded-none",
      "bg-neutral-800",
    );

    return (
      <tr className={rowStyles}>
        <td className="whitespace-nowrap px-6 py-4 font-medium flex items-center justify-between gap-1 md:table-cell border-b md:border-none border-neutral-700">
          <div className="flex flex-col md:block">
            <span className="text-[10px] uppercase text-gray-400 md:hidden">
              Personagem
            </span>
            {player.name}
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1 rounded text-red-500 hover:bg-red-500/10"
              onClick={() => setPlayers(removePlayer(player))}
            >
              <PersonRemove />
            </button>
            <button
              className="p-1 rounded text-yellow-500 hover:bg-yellow-500/10"
              onClick={() => {
                setEditingPlayer(player);
                setEditModalOpen(true);
              }}
            >
              <ManageAccounts />
            </button>
          </div>
        </td>

        {SKILLS_CONFIG.map((skill) => (
          <td
            key={skill.id}
            className="whitespace-nowrap px-6 py-3 md:py-4 flex justify-between items-center md:table-cell border-b md:border-none border-neutral-700 last:border-none"
          >
            <span className="md:hidden font-medium text-gray-300">
              {skill.label}
            </span>
            <button
              onClick={() =>
                handleRollDice(
                  skill.label,
                  player.skills[skill.id as keyof Player["skills"]],
                )
              }
              className="flex gap-2 items-center hover:text-blue-400 transition-colors"
            >
              {player.skills[skill.id as keyof Player["skills"]]}{" "}
              <Image src={D20} alt="dice" />
            </button>
          </td>
        ))}
      </tr>
    );
  };

  if (players.length < 1) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 py-10">
        <span className="text-white text-2xl font-bold">
          Nenhum personagem cadastrado
        </span>
        <NewPlayerButton onAddPlayer={onAddPlayer} />
      </div>
    );
  }

  return (
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm font-light border-collapse">
          <thead className="hidden md:table-header-group border-b font-medium dark:border-neutral-500 uppercase text-xs text-white">
            <tr>
              <th scope="col" className="px-6 py-4">
                Personagens
              </th>
              {SKILLS_CONFIG.map((skill) => (
                <th key={skill.id} scope="col" className="px-6 py-4">
                  {skill.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {players.map((p) => (
              <PlayerItem key={p.name} player={p} />
            ))}
            <tr className="hidden md:table-row border-b dark:border-neutral-500 italic font-medium text-gray-400">
              <td className="whitespace-nowrap px-6 py-4 text-white font-bold text-center md:text-left">
                Rolar p/ Todos:
              </td>
              {SKILLS_CONFIG.map((skill) => (
                <td key={skill.id} className="whitespace-nowrap px-6 py-4">
                  <button
                    className="hover:text-yellow-500 transition-colors"
                    onClick={() =>
                      handleRollDices(skill.id as keyof Player["skills"])
                    }
                  >
                    Rolar
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <div className="md:hidden mt-6 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-600">
            <h3 className="text-white font-bold uppercase text-xs tracking-widest flex items-center gap-2">
              <Image src={D20} alt="dice" /> Rolar para Todos
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            {SKILLS_CONFIG.map((skill) => (
              <button
                key={skill.id}
                onClick={() =>
                  handleRollDices(skill.id as keyof Player["skills"])
                }
                className="bg-neutral-700 hover:bg-neutral-600 text-white text-[11px] font-bold py-3 px-2 rounded uppercase transition-colors flex items-center justify-between"
              >
                {skill.label}
                <span className="text-yellow-500 text-[10px]">Rolar</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={rollModalOpen}
        onClose={() => !isRolling && setRollModalOpen(false)}
      >
        <div className="bg-neutral-800 text-white rounded-lg p-0 w-[95%] max-w-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col shadow-2xl border border-neutral-600 overflow-hidden outline-none">
          <div className="bg-neutral-700 px-6 py-4 border-b border-neutral-600">
            <h2 className="text-xl font-bold text-yellow-500 uppercase tracking-tight">
              {modalTitle}
            </h2>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase text-gray-400 border-b border-neutral-700">
                  <th className="py-2 px-2">Player</th>
                  <th className="py-2 px-2 text-center">Dado</th>
                  <th className="py-2 px-2 text-center">Mod</th>
                  <th className="py-2 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {displayResults.map((res, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-700/50 hover:bg-neutral-700/30"
                  >
                    <td className="py-3 px-2 font-medium">{res.name}</td>
                    <td className="py-3 px-2 text-center text-blue-400">
                      {res.dice}
                    </td>
                    <td className="py-3 px-2 text-center text-gray-400">
                      {res.mod >= 0 ? `+${res.mod}` : res.mod}
                    </td>
                    <td
                      className={`py-3 px-2 text-right font-bold text-lg transition-opacity duration-200 ${isRolling ? "opacity-30" : "opacity-100 text-yellow-500"}`}
                    >
                      {isRolling ? "?" : res.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-neutral-900/50">
            <button
              disabled={isRolling}
              className={`w-full py-2 rounded font-bold uppercase text-xs transition-colors ${isRolling ? "bg-neutral-800 text-gray-600" : "bg-neutral-700 hover:bg-neutral-600 text-white"}`}
              onClick={() => setRollModalOpen(false)}
            >
              {isRolling ? "Rolando..." : "Fechar"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="bg-neutral-800 text-white rounded-lg p-0 w-[95%] max-w-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col shadow-2xl border border-neutral-600 overflow-hidden outline-none">
          <div className="bg-neutral-700 px-6 py-4 border-b border-neutral-600 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-400 uppercase tracking-tight">
              Editar Personagem
            </h2>
            <button
              onClick={handleUpdatePlayer}
              className="bg-green-600 hover:bg-green-700 p-2 rounded-md transition-colors shadow-lg"
            >
              <Save fontSize="small" />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase text-gray-400 font-bold">
                Nome do Personagem
              </label>
              <input
                type="text"
                value={editingPlayer?.name || ""}
                onChange={(e) =>
                  editingPlayer &&
                  setEditingPlayer({ ...editingPlayer, name: e.target.value })
                }
                className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 outline-none focus:border-blue-400 transition-colors text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editingPlayer &&
                SKILLS_CONFIG.map((skill) => {
                  const currentVal =
                    editingPlayer.skills[skill.id as keyof Player["skills"]];
                  return (
                    <div
                      key={skill.id}
                      className="flex flex-col gap-2 bg-neutral-700/30 p-3 rounded-md border border-neutral-600/50"
                    >
                      <label className="text-[10px] uppercase text-gray-400 font-bold">
                        {skill.label}
                      </label>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          className="p-1 bg-neutral-600 text-white rounded hover:bg-red-500/50 transition-colors"
                          onClick={() =>
                            updateSkillValue(
                              skill.id as keyof Player["skills"],
                              currentVal - 1,
                            )
                          }
                        >
                          <Remove fontSize="small" />
                        </button>
                        <input
                          type="number"
                          value={currentVal}
                          onChange={(e) =>
                            updateSkillValue(
                              skill.id as keyof Player["skills"],
                              Number(e.target.value),
                            )
                          }
                          className="text-lg font-bold w-full text-center bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white"
                        />
                        <button
                          className="p-1 bg-neutral-600 text-white rounded hover:bg-green-500/50 transition-colors"
                          onClick={() =>
                            updateSkillValue(
                              skill.id as keyof Player["skills"],
                              currentVal + 1,
                            )
                          }
                        >
                          <Add fontSize="small" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="p-4 bg-neutral-900/50 flex gap-2 border-t border-neutral-700">
            <button
              className="flex-1 py-2 bg-neutral-700 hover:bg-neutral-600 rounded font-bold uppercase text-xs transition-colors text-white"
              onClick={() => setEditModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold uppercase text-xs transition-colors text-white"
              onClick={handleUpdatePlayer}
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
