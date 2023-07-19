"use client";
import { io } from "socket.io-client";
import styles from "./page.module.css";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import GameManager from "@/components/GameManager";

export default function Home() {
  const [openGame, setOpenGame] = useState(false);

  return (
    <main className={styles.main}>
      <GameManager />
    </main>
  );
}
