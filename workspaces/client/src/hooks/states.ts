import { atom } from "recoil";
import { ServerEvents } from "../../../shared/server/ServerEvents";
import { ServerPayloads } from "./../../../shared/server/ServerPayloads";

export const CurrentLobbyState = atom<
  ServerPayloads[ServerEvents.LOBBY_STATE] | null
>({
  key: "CurrentLobbyState",
  default: null,
});
