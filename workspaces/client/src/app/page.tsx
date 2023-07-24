"use client";
import GameManager from "@/components/GameManager";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <GameManager />
    </main>
  );
}
