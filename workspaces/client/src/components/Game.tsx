import { Box, Button, Typography } from "@mui/material";
import React, { use, useEffect } from "react";
import DiceArray from "./DiceArray";
import TableScore from "./TableScore";

import { categories } from "@/utils/consts";
import useSocketManager from "@/hooks/useSocketManager";
import { CurrentLobbyState } from "@/hooks/states";
import { useRecoilValue } from "recoil";
import { ClientEvents } from "@yamb/shared/client/ClientEvents";
import { Results } from "@yamb/shared/common/Dices";

function Game() {
  const { sm } = useSocketManager();

  const currentLobbyState = useRecoilValue(CurrentLobbyState);

  const clientId = sm.getSocketId()!;

  const [results, setResults] = React.useState<Map<Results, number>>();
  const [round, setRound] = React.useState(1);
  const [playerScore, setPlayerScore] = React.useState(categories);
  const [finishRound, setFinishRound] = React.useState(false);
  const [userEnteredScore, setEnterScore] = React.useState(false);
  const [diceArray, setDiceArray] = React.useState([0, 0, 0, 0, 0]);
  const [holdDice, setHoldDice] = React.useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleDiceHold = (index: number) => {
    setHoldDice((prev) => {
      return [...prev.slice(0, index), !prev[index], ...prev.slice(index + 1)];
    });
  };

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
    if (!currentLobbyState?.dices?.owner) {
      alert("Game didn't start yet");
      return;
    }

    await sm.emit({
      event: ClientEvents.ROLL_DICE,
      data: {
        clientId,
        holdDice,
      },
    });

    // setHoldDice([false, false, false, false, false]);
  };

  const handleFinishRound = (index: number, result: number) => {
    sm.emit({
      event: ClientEvents.END_ROUND,
      data: {
        index: index,
        result: result,
      },
    });

    setHoldDice([false, false, false, false, false]);
  };

  const handleEndGame = () => {
    if (currentLobbyState?.currentRound === 13)
      sm.emit({
        event: ClientEvents.END_GAME,
        data: {},
      });
  };

  const mapArrayToScore = (array: number[]) => {
    const newMap = new Map<Results, number>();
    array &&
      array?.map((item, index) => {
        newMap.set((index + 1) as Results, item);
      });

    return newMap;
  };

  useEffect(() => {
    setDiceArray(currentLobbyState?.dices?.dices!);
    setResults(mapArrayToScore(currentLobbyState?.dices?.scores!)!);
  }, [currentLobbyState?.dices?.dices, currentLobbyState?.dices?.scores]);

  useEffect(() => {
    handleEndGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLobbyState?.currentRound]);

  const copyLobbyLink = async () => {
    const link = `${window.location.origin}?lobby=${currentLobbyState?.lobbyId}`;
    await navigator.clipboard.writeText(link);

    console.log("Copied to clipboard");
  };

  const handleSave = (index: number) => {
    setPlayerScore((prev: any) => {
      return [
        ...prev.map((el: any, i: number) => {
          if (i === index) {
            return {
              ...el,
              score: results?.get(index + 1),
              isFilled: true,
            };
          }
          return el;
        }),
      ];
    });

    // setFinishRound(false);
    handleFinishRound(index, results?.get(index + 1)!);
    setEnterScore(false);
  };

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
      <Typography variant="body1">
        {currentLobbyState?.dices?.round}. round
      </Typography>
      <Button onClick={clientReady} variant={"contained"}>
        Player ready
      </Button>

      {currentLobbyState?.isSuspended && (
        <Typography>Game suspended</Typography>
      )}

      {!currentLobbyState?.hasFinished && currentLobbyState?.dices ? (
        <>
          <DiceArray
            rollDice={rollDices}
            setResults={setResults}
            setRound={setRound}
            finishRound={currentLobbyState?.isSuspended}
            setFinishRound={setFinishRound}
            enterScore={userEnteredScore}
            setEnterScore={setEnterScore}
            diceArray={diceArray}
            setDiceArray={setDiceArray}
            suspended={currentLobbyState?.isSuspended}
            holdDice={holdDice}
            setHoldDice={handleDiceHold}
            handleDiceHold={handleDiceHold}
          />

          <TableScore
            rows={playerScore}
            results={results}
            setPlayerScore={setPlayerScore}
            setRound={setRound}
            setFinishRound={handleFinishRound}
            setEnterScore={setEnterScore}
            enterScore={userEnteredScore}
            handleSave={handleSave}
            scores={currentLobbyState?.dices?.results}
            isSuspended={currentLobbyState?.isSuspended}
          />

          <Box>
            <Typography variant="body1">
              {currentLobbyState?.lobbyId}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {currentLobbyState &&
                currentLobbyState?.scores.map((el: any) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    key={`randomKey${Math.random()}`}
                  >
                    <Typography>{el.key}</Typography>
                    <Typography>{currentLobbyState?.dices?.round}</Typography>
                    <Typography>{el.value}</Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        </>
      ) : (
        <Typography>Game finished</Typography>
      )}
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
