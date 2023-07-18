export enum ServerEvents {
  Pong = "server.pong",
  LOBBY_STATE = "server.lobby.state",
  GAME_MESSAGE = "server.game.message",
  GAME_START = "server.game.start",
  GAME_END = "server.game.end",
  GAME_TURN_START = "server.game.turn.start",
  GAME_TURN_END = "server.game.turn.end",
  GAME_ROLL_DICE = "server.game.roll.dice",
  GAME_END_TURN = "server.game.end.turn",
  GAME_END_ROUND = "server.game.end.round",
  GAME_END_GAME = "server.game.end.game",
}
