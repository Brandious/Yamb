import { ServerExceptionResponse } from "@yamb/shared/server/types";
import { SetterOrUpdater } from "recoil";
import { ClientEvents } from "@yamb/shared/client/ClientEvents";
import { Socket, io } from "socket.io-client";
import { SocketState } from "./SocketState";
import { ServerEvents } from "@yamb/shared/server/ServerEvents";
import { Listener } from "./types";

type EmitOptions<T> = {
  event: ClientEvents;
  data?: T;
};

export default class SocketManager {
  public readonly socket: Socket;

  public setSocketState: SetterOrUpdater<SocketState> = () => {};

  private connectionLost = false;

  constructor() {
    this.socket = io(process.env.NEXT_PUBLIC_WS_API_URL as string, {
      autoConnect: false,
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    this.onConnect();
    this.onDisconnect();
    this.onException();
  }

  emit<T>(options: EmitOptions<T>): this {
    this.socket.emit(options.event, options.data);
    return this;
  }

  getSocketId(): string | null {
    if (!this.socket.connected) return null;
    return this.socket.id;
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  registerListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.on(event, listener);

    return this;
  }

  removeListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.off(event, listener);

    return this;
  }

  private onConnect(): void {
    this.socket.on("connect", () => {
      if (this.connectionLost) {
        console.log("Connection restored");
        this.connectionLost = false;
      }

      this.setSocketState((currValue) => {
        return { ...currValue, connected: false };
      });
    });
  }

  private onDisconnect(): void {
    this.socket.on("disconnect", async (reason: Socket.DisconnectReason) => {
      if (reason === "io client disconnect") {
        console.log("Disconnected successfully!");
      }

      if (reason === "io server disconnect") {
        console.log("You got disconnect by server");
      }

      if (
        reason === "ping timeout" ||
        reason === "transport close" ||
        reason === "transport error"
      ) {
        console.log("Connection lost to the server");
        this.connectionLost = true;
      }

      this.setSocketState((currValue) => {
        return { ...currValue, connected: false };
      });
    });
  }

  private onException(): void {
    this.socket.on("exception", (data: ServerExceptionResponse) => {
      if (typeof data.exception === "undefined") {
        console.log("Unexpected error from server");
        return;
      }

      let body = `Error: ${data.exception}`;

      if (data.message) {
        if (typeof data.message === "string") {
          body += ` | Message: "${data.message}"`;
        } else if (typeof data.message === "object") {
          body += ` | Message: "${JSON.stringify(data.message)}"`;
        }
      }
    });
  }
}
