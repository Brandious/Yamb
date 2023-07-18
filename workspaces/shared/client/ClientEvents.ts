export enum ClientEvents {
  Ping = "client.ping",
  CREATE_LOBBY = "client.lobby.create",
  JOIN_LOBBY = "client.lobby.join",
  LEAVE_LOBBY = "client.lobby.leave",
  START_GAME = "client.game.start",
  ROLL_DICE = "client.game.roll.dice",
  START_TURN = "client.game.start.turn",
  END_TURN = "client.game.end.turn",
}
