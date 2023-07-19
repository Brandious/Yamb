import { Box, Typography } from "@mui/material";
import React from "react";
import DiceArray from "./DiceArray";
import TableScore from "./TableScore";

import { categories } from "@/utils/consts";

function Game() {
  const [results, setResults] = React.useState();
  const [round, setRound] = React.useState(1);
  const [playerScore, setPlayerScore] = React.useState(categories);
  const [finishRound, setFinishRound] = React.useState(false);
  const [userEnteredScore, setEnterScore] = React.useState(false);

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

      <DiceArray
        setResults={setResults}
        setRound={setRound}
        finishRound={finishRound}
        setFinishRound={setFinishRound}
        enterScore={userEnteredScore}
        setEnterScore={setEnterScore}
      />

      <TableScore
        rows={playerScore}
        results={results}
        setPlayerScore={setPlayerScore}
        setRound={setRound}
        setFinishRound={setFinishRound}
        setEnterScore={setEnterScore}
        enterScore={userEnteredScore}
      />
    </Box>
  );
}

export default Game;
