import { CurrentLobbyState } from "@/hooks/states";
import useSocketManager from "@/hooks/useSocketManager";
import { Listener } from "@/websocket/types";
import { ServerEvents } from "@yamb/shared/server/ServerEvents";
import { ServerPayloads } from "@yamb/shared/server/ServerPayloads";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import Introduction from "./Introduction";

import Game from "./Game";

function GameManager() {
  const router = useRouter();

  const { sm } = useSocketManager();
  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);

  useEffect(() => {
    sm.connect();

    const onLobbyState: Listener<
      ServerPayloads[ServerEvents.LOBBY_STATE]
    > = async (data) => {
      setLobbyState(data);

      router.push(`/?${data.lobbyId}`);
    };

    const onGameMessage: Listener<
      ServerPayloads[ServerEvents.GAME_MESSAGE]
    > = ({ color, message }) => {
      console.log(message);
    };

    sm.registerListener(ServerEvents.LOBBY_STATE, onLobbyState);
    sm.registerListener(ServerEvents.GAME_MESSAGE, onGameMessage);

    return () => {
      sm.removeListener(ServerEvents.LOBBY_STATE, onLobbyState);
      sm.removeListener(ServerEvents.GAME_MESSAGE, onGameMessage);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (lobbyState === null) return <Introduction />;

  return <Game />;
}

export default GameManager;
