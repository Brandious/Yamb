"use client";
import styles from "./page.module.css";
import { Button, Typography } from "@mui/material";

export default function Home() {
  return (
    <main className={styles.main}>
      <Typography variant="h1" component="h1" gutterBottom>
        Welcome to YAMB!
      </Typography>

      <Button variant="contained" onClick={() => alert("Hello there")}>
        Click to play!
      </Button>
    </main>
  );
}
