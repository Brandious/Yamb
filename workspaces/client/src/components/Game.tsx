import { Box, Button, Typography } from "@mui/material";
import React, { use, useEffect } from "react";
import DiceArray from "./DiceArray";
import TableScore from "./TableScore";

import { categories } from "@/utils/consts";
import useSocketManager from "@/hooks/useSocketManager";
import { CurrentLobbyState } from "@/hooks/states";
import { useRecoilValue } from "recoil";
import { ClientEvents } from "@yamb/shared/client/ClientEvents";

function Game() {
  const { sm } = useSocketManager();

  const currentLobbyState = useRecoilValue(CurrentLobbyState);

  const clientId = sm.getSocketId()!;

  console.log(clientId, currentLobbyState, sm);

  const [results, setResults] = React.useState();
  const [round, setRound] = React.useState(1);
  const [playerScore, setPlayerScore] = React.useState(categories);
  const [finishRound, setFinishRound] = React.useState(false);
  const [userEnteredScore, setEnterScore] = React.useState(false);
  const [diceArray, setDiceArray] = React.useState([0, 0, 0, 0, 0]);

  const clientReady = () => {
    sm.emit({
      event: ClientEvents.CLIENT_READY,
      data: {},
    });
  };

  const startGame = () => {
    sm.emit({
      event: ClientEvents.START_GAME,
      data: {},
    });
  };

  const rollDices = async () => {
    await sm.emit({
      event: ClientEvents.ROLL_DICE,
      data: {},
    });

    console.log(currentLobbyState?.dices);
  };

  const handleFinishRound = () => {
    sm.emit({
      event: ClientEvents.END_ROUND,
      data: {},
    });
  };

  const handleEndGame = () => {
    if (currentLobbyState?.currentRound === 13)
      sm.emit({
        event: ClientEvents.END_GAME,
        data: {},
      });
  };

  useEffect(() => {
    setDiceArray(currentLobbyState?.dices?.dices!);
  }, [currentLobbyState?.dices?.dices]);

  useEffect(() => {
    handleEndGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLobbyState?.currentRound]);

  const copyLobbyLink = async () => {
    const link = `${window.location.origin}?lobby=${currentLobbyState?.lobbyId}`;
    await navigator.clipboard.writeText(link);

    console.log("Copied to clipboard");
  };

  console.log(diceArray);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1"> Yamb </Typography>
      <Typography variant="body1">{round}. round</Typography>
      <Button onClick={clientReady} variant={"contained"}>
        Player ready
      </Button>

      <DiceArray
        rollDice={rollDices}
        setResults={setResults}
        setRound={setRound}
        finishRound={finishRound}
        setFinishRound={setFinishRound}
        enterScore={userEnteredScore}
        setEnterScore={setEnterScore}
        diceArray={diceArray}
        setDiceArray={setDiceArray}
      />

      <TableScore
        rows={playerScore}
        results={results}
        setPlayerScore={setPlayerScore}
        setRound={setRound}
        setFinishRound={handleFinishRound}
        setEnterScore={setEnterScore}
        enterScore={userEnteredScore}
      />

      {!currentLobbyState?.hasStarted && (
        <Box>
          <Button onClick={copyLobbyLink} variant="contained">
            Copy lobby link
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Game;
