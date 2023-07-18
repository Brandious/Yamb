"use client";
import { io } from "socket.io-client";
import styles from "./page.module.css";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Introduction from "@/components/Introduction";
import GameManager from "@/components/GameManager";

const socket = io(process.env.NEXT_PUBLIC_WS_API_URL as string, {
  autoConnect: true,
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
});

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [openGame, setOpenGame] = useState(false);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      receiveMessage(msg);
    });

    getInitialMessages();
  }, []);

  function getInitialMessages() {
    axios(`${process.env.NEXT_PUBLIC_WS_API_URL}/api/messages`)
      .then((response: any) => {
        console.log(response.data);
        return response.data;
      })
      .then((data: any) => {
        setMessages(data);
      })
      .catch((err: any) => console.log(err));
  }

  function receiveMessage(msg: string) {
    setMessages((messages) => [...messages, msg]);
  }

  function sendMessage() {
    console.log("sending message", newMessage);

    socket.emit("sendMessage", newMessage);

    setNewMessage("");
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  return (
    <main className={styles.main}>
      <Typography variant="h1" component="h1" gutterBottom>
        Welcome to YAMB!
      </Typography>
      <Button variant="contained" onClick={() => setOpenGame(true)}>
        EnterGame
      </Button>
      <Box>
        <Stack direction="row">
          <TextField onChange={handleChange} variant="filled" />
          <Button onClick={sendMessage} variant="contained">
            Send
          </Button>
        </Stack>
        <Stack direction="column">
          {messages &&
            messages?.map((el, i) => (
              <Typography
                variant="body1"
                component="p"
                gutterBottom
                key={`message-${i}}`}
              >
                {el.content}
              </Typography>
            ))}
        </Stack>
      </Box>

      {openGame && <GameManager />}
    </main>
  );
}
