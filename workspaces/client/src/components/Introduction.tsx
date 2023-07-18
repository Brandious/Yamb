import useSocketManager from "@/hooks/useSocketManager";
import { Box, Button, Divider, MenuItem, Select } from "@mui/material";
// import { emitEvent } from "@/utils/analytics";

import { ClientEvents } from "@yamb/shared/client/ClientEvents";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

function Introduction() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sm } = useSocketManager();

  const [delayBetweenRounds, setDelayBetweenRounds] = React.useState(2);

  useEffect(() => {
    if (searchParams.has("lobby"))
      sm.emit({
        event: ClientEvents.JOIN_LOBBY,
        data: {
          lobbyId: searchParams.get("lobby")!,
        },
      });
    //  no exhaustive deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onCreateLobby = (mode: "solo" | "multiple") => {
    sm.emit({
      event: ClientEvents.CREATE_LOBBY,
      data: {
        mode: mode,
        delayBetweenRounds: delayBetweenRounds,
      },
    });

    // emitEvent("lobby_create");
  };
  console.log(sm);
  return (
    <div className="mt-4">
      <h2 className="text-2xl">Hello ! 👋</h2>

      <Divider />

      <div>
        <h3 className="text-xl">Game options</h3>

        <Select
          label="Delay between rounds"
          defaultValue="2"
          onChange={(delay) => setDelayBetweenRounds(+delay!)}
        >
          <MenuItem value={"1"}>1 second</MenuItem>
          <MenuItem value={"2"}>2 seconds</MenuItem>
          <MenuItem value={"3"}>3 seconds</MenuItem>
          <MenuItem value={"4"}>4 seconds</MenuItem>
          <MenuItem value={"5"}>5 seconds</MenuItem>
        </Select>
      </div>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Button variant="contained" onClick={() => onCreateLobby("solo")}>
          Create solo lobby
        </Button>
        <Button
          variant="outlined"
          onClick={() => onCreateLobby("multiple")}
          sx={{ background: "white !important" }}
        >
          Create multiple lobby
        </Button>
      </Box>
    </div>
  );
}

export default Introduction;
