export enum ClientEvents {
  Ping = "client.ping",

  CREATE_LOBBY = "client.lobby.create", // x
  JOIN_LOBBY = "client.lobby.join", // x
  LEAVE_LOBBY = "client.lobby.leave", //x

  CLIENT_READY = "client.lobby.ready", // x
  
  START_GAME = "client.game.start", // x

  START_ROUND = "client.game.start.round", // x
  ROLL_DICE = "client.game.roll.dice",
  END_ROUND = "client.game.end.round",

  END_GAME = "client.game.end.game",
}
