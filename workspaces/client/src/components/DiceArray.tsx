import { Box, Button } from "@mui/material";
import React, { useEffect } from "react";
// import Image from "next/image";

// import { One, Two, Three, Four, Five, Six } from "../icons/dice/diceImages";

import { DiceMap } from "../icons/dice/mapDices";
import { Dices, NUMBER_OF_ROLES } from "@yamb/shared/common/Dices";
import { calculateResults } from "@/utils/ResultsCalculator";

function DiceArray({
  setResults,
  setRound,
  finishRound,
  setFinishRound,
  enterScore,
  setEnterScore,
  rollDice,
  diceArray,
  setDiceArray,
  suspended,
  setHoldDice,
  holdDice,
  handleDiceHold,
}: any) {
  const [roles, setRoles] = React.useState(0);

  // useEffect(() => {
  //   setResults(calculateResults(diceArray));

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [diceArray]);

  // const handleDiceRoll = () => {
  //   // setDiceArray((prev) => [...prev.sort(() => Math.random() - 0.5)]);

  //   if (roles >= NUMBER_OF_ROLES || holdDice.every((el) => el)) {
  //     setFinishRound(true);
  //     setHoldDice([true, true, true, true, true]);
  //     setEnterScore(true);
  //     return;
  //   }

  //   setDiceArray((prev) => {
  //     return [
  //       ...prev.map((dice, index) => {
  //         if (holdDice[index]) return dice;
  //         return Math.floor(Math.random() * 6 + 1);
  //       }),
  //     ];
  //   });

  //   setRoles((prev) => prev + 1);

  //   // setHoldDice([false, false, false, false, false]);
  // };

  const handleFinishRound = () => {
    setRoles(0);
    setHoldDice([false, false, false, false, false]);

    setFinishRound(false);
    setEnterScore(false);
    // setRound((prev) => prev + 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "32px",
          padding: "25px",
          margin: "25px",
        }}
      >
        {diceArray &&
          diceArray.map((dice: any, index: number) => {
            return (
              <Box
                key={`diceChange-${dice}-${index}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "25px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "90px",
                    width: "90px",
                  }}
                >
                  {dice ? DiceMap(dice as Dices)() : null}
                </Box>
                {!holdDice[index] && (
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ display: holdDice[index] ? "none" : "inherit" }}
                    onClick={() => handleDiceHold(index)}
                  >
                    Hold
                  </Button>
                )}

                {Boolean(dice) &&
                  holdDice[index] &&
                  !holdDice.every((el: any) => el) && (
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ display: !holdDice[index] ? "none" : "inherit" }}
                      onClick={() => handleDiceHold(index)}
                    >
                      Unhold
                    </Button>
                  )}
              </Box>
            );
          })}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Button
          disabled={suspended}
          variant="contained"
          color="primary"
          onClick={rollDice}
        >
          {roles === 3 ? "Enter Score" : "Roll Dices"}
        </Button>
      </Box>
    </Box>
  );
}

export default DiceArray;
