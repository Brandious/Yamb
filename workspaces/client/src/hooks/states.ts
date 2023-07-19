import { atom } from "recoil";
import { ServerEvents } from "@yamb/shared/server/ServerEvents";
import { ServerPayloads } from "@yamb/shared/server/ServerPayloads";

export const CurrentLobbyState = atom<
  ServerPayloads[ServerEvents.LOBBY_STATE] | null
>({
  key: "CurrentLobbyState",
  default: null,
});
