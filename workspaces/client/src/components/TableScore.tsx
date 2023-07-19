import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

interface TableScoreProps {
  rows: {
    name: string;
    description: string;
    score: number;
    isFilled: boolean;
  }[];
  scores?: any;
  results?: any;
  setPlayerScore: any;
  setRound: any;
  setFinishRound: any;
  setEnterScore: any;
  enterScore: any;
}

function TableScore({
  rows,
  results,
  setPlayerScore,
  setRound,
  setFinishRound,
  setEnterScore,
  enterScore,
}: TableScoreProps) {
  const handleSave = (index: number) => {
    setPlayerScore((prev: any) => {
      return [
        ...prev.map((el: any, i: number) => {
          if (i === index) {
            return {
              ...el,
              score: results.get(index + 1),
              isFilled: true,
            };
          }
          return el;
        }),
      ];
    });

    setRound((prev: number) => prev + 1);
    // setFinishRound(false);
    setFinishRound(true);
    setEnterScore(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell variant="head">Category</TableCell>
            <TableCell variant="head" align="center">
              Description
            </TableCell>
            <TableCell variant="head" align="right">
              Score
            </TableCell>
            <TableCell variant="head" align="right">
              Earned
            </TableCell>
            <TableCell variant="head" align="right">
              Save
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.name}
              hover
              selected
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.description}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
              <TableCell align="right">
                +{results ? results.get(index + 1) : 0}
              </TableCell>
              {rows.length - 1 !== index && (
                <TableCell align="right">
                  <Button
                    disabled={row.score !== 0 || !enterScore}
                    onClick={() => handleSave(index)}
                  >
                    Save
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableScore;
