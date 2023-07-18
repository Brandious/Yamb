import { SocketManagerContext } from "@/websocket/SocketManagerProvider";
import SocketState from "@/websocket/SocketState";
import { useContext } from "react";
import { useRecoilValue } from "recoil";

export default function useSocketManager() {
  const sm = useContext(SocketManagerContext);

  const socket = useRecoilValue(SocketState);

  return { sm, socket };
}
