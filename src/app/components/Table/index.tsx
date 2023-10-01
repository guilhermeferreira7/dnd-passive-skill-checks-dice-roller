import React, { useEffect, useState } from "react";
import {
  Cancel,
  CancelOutlined,
  Casino,
  Clear,
  ManageAccounts,
  PersonRemove,
  Save,
} from "@mui/icons-material";
import { Input, Modal, Slider } from "@mui/material";

import { Player } from "../../types/Player";
import { removePlayer } from "../../../services/player/remove";
import { update } from "../../../services/player/update";
import { getAllPlayers } from "../../../services/player/getAll";

export default function Table({ players }: { players: Player[] }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [message, setMessage] = useState<string[]>([]);

  const [playersUpdated, setPlayers] = useState(players);
  useEffect(() => {
    setPlayers(players);
  }, [players]);

  const handleRollDices = (
    skill: keyof (typeof playersUpdated)[0]["skills"]
  ) => {
    const message = playersUpdated.map((player) => {
      const random = Math.floor(Math.random() * 20) + 1;
      const result = random + player.skills[skill];
      return `${player.name} -> ${random} + ${player.skills[skill]} = ${result}`;
    });

    setMessage([skill, ...message]);
  };

  const PlayerItem = ({ player }: { player: Player }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatePlayer, setUpdatePlayer] = useState(player);
    const handleRollDice = (skill: string, modifier: number) => {
      const random = Math.floor(Math.random() * 20) + 1;
      const result = random + modifier;
      setMessage([
        skill,
        `${player.name} -> ${random} + ${modifier} = ${result}`,
      ]);
    };

    const handleRemovePlayer = () => {
      setPlayers(removePlayer(player));
    };

    const handleUpdatePlayer = () => {
      setIsUpdating(false);
      update(updatePlayer);
      setPlayers(getAllPlayers());
    };

    return (
      <tr key={player.name} className="border-b dark:border-neutral-500">
        <td className="whitespace-nowrap px-6 py-4 font-medium flex items-center justify-between gap-1">
          {player.name}
          <div className="flex items-center gap-1">
            {isUpdating ? (
              <>
                <button
                  onClick={() => setIsUpdating(false)}
                  className="p-1 rounded text-red-500"
                >
                  <Clear />
                </button>
                <button
                  onClick={handleUpdatePlayer}
                  className="p-1 rounded text-green-500"
                >
                  <Save />
                </button>
              </>
            ) : (
              <>
                <button
                  className="p-1 rounded text-red-500"
                  onClick={handleRemovePlayer}
                >
                  <PersonRemove />
                </button>
                <button
                  className="p-1 rounded text-yellow-500"
                  onClick={() => setIsUpdating(true)}
                >
                  <ManageAccounts />
                </button>
              </>
            )}
          </div>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {isUpdating ? (
            <input
              type="number"
              defaultValue={player.skills.arcana}
              value={updatePlayer.skills.arcana}
              onChange={(e) => {
                setUpdatePlayer({
                  ...updatePlayer,
                  skills: {
                    ...updatePlayer.skills,
                    arcana: Number(e.target.value),
                  },
                });
              }}
              max={35}
              min={-20}
              className="text-white bg-gray-700 w-12 rounded-sm"
            />
          ) : (
            <button
              onClick={() => {
                handleOpen();
                handleRollDice("Arcanismo", player.skills.arcana);
              }}
            >
              {player.skills.arcana} <Casino />
            </button>
          )}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <button
            onClick={() => {
              handleOpen();
              handleRollDice("História", player.skills.history);
            }}
          >
            {player.skills.history} <Casino />
          </button>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <button
            onClick={() => {
              handleOpen();
              handleRollDice("Intuição", player.skills.insight);
            }}
          >
            {player.skills.insight} <Casino />
          </button>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <button
            onClick={() => {
              handleOpen();
              handleRollDice("Investigação", player.skills.investigation);
            }}
          >
            {player.skills.investigation} <Casino />
          </button>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <button
            onClick={() => {
              handleOpen();
              handleRollDice("Natureza", player.skills.nature);
            }}
          >
            {player.skills.nature} <Casino />
          </button>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <button
            onClick={() => {
              handleOpen();
              handleRollDice("Percepção", player.skills.perception);
            }}
          >
            {player.skills.perception} <Casino />
          </button>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <button
            onClick={() => {
              handleOpen();
              handleRollDice("Religião", player.skills.religion);
            }}
          >
            {player.skills.religion} <Casino />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="px-6 py-4">
                Personagens
              </th>
              <th scope="col" className="px-6 py-4">
                Arcanismo
              </th>
              <th scope="col" className="px-6 py-4">
                História
              </th>
              <th scope="col" className="px-6 py-4">
                Intuição
              </th>
              <th scope="col" className="px-6 py-4">
                Investigação
              </th>
              <th scope="col" className="px-6 py-4">
                Natureza
              </th>
              <th scope="col" className="px-6 py-4">
                Percepção
              </th>
              <th scope="col" className="px-6 py-4">
                Religião
              </th>
            </tr>
          </thead>
          <tbody>
            {playersUpdated.map((player) => (
              <PlayerItem key={player.name} player={player} />
            ))}
            <tr className="border-b dark:border-neutral-500">
              <td className="whitespace-nowrap px-6 py-4 font-medium"></td>
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                <button
                  onClick={() => {
                    handleOpen();
                    handleRollDices("arcana");
                  }}
                >
                  Todos
                </button>
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                <button
                  onClick={() => {
                    handleOpen();
                    handleRollDices("history");
                  }}
                >
                  Todos
                </button>
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                <button
                  onClick={() => {
                    handleOpen();
                    handleRollDices("insight");
                  }}
                >
                  Todos
                </button>
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                <button
                  onClick={() => {
                    handleOpen();
                    handleRollDices("investigation");
                  }}
                >
                  Todos
                </button>
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                <button
                  onClick={() => {
                    handleOpen();
                    handleRollDices("nature");
                  }}
                >
                  Todos
                </button>
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                <button
                  onClick={() => {
                    handleOpen();
                    handleRollDices("perception");
                  }}
                >
                  Todos
                </button>
              </td>
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                <button
                  onClick={() => {
                    handleOpen();
                    handleRollDices("religion");
                  }}
                >
                  Todos
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-gray-600 rounded-md p-2 w-1/2 absolute top-1/4 left-1/4 flex flex-col justify-center items-center">
          <p>
            {message.map((msg, index) => (
              <p className="text-center" key={index}>
                {msg}
              </p>
            ))}
          </p>
          <button
            className="p-2 border bg-gray-700 rounded-md self-end"
            onClick={handleClose}
          >
            Ok
          </button>
        </div>
      </Modal>
    </div>
  );
}
