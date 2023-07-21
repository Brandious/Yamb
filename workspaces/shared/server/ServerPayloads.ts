import { DiceStateDefinition } from "../common/types";
import { ServerEvents } from "./ServerEvents";

export type ServerPayloads = {
  [ServerEvents.LOBBY_STATE]: {
    lobbyId: string;
    mode: "solo" | "multiple";
    delayBetweenRounds: number;
    hasStarted: boolean;
    hasFinished: boolean;
    currentRound: number;
    playersCount: number;
    dices: DiceStateDefinition;
    isSuspended: boolean;
    scores: Record<string, number>;
    clientsReady: number;
  };

  [ServerEvents.GAME_MESSAGE]: {
    message: string;
    color?: "green" | "red" | "blue" | "orange";
  };
};
