"use client";
import { motion } from "framer-motion";

export function SentimentGauge({ score }: { score: number }) {
  const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f97316" : "#22c55e";
  const rotation = -90 + (score / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="70" viewBox="0 0 120 70">
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
        <motion.path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="157"
          initial={{ strokeDashoffset: 157 }}
          animate={{ strokeDashoffset: 157 - (score / 100) * 157 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.line
          x1="60" y1="60" x2="60" y2="18"
          stroke="#374151"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          style={{ transformOrigin: "60px 60px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <circle cx="60" cy="60" r="4" fill="#374151" />
      </svg>
      <div className="text-2xl font-bold" style={{ color }}>{score}</div>
      <div className="text-xs text-gray-500">/ 100 — Nivel de angustia</div>
    </div>
  );
}
