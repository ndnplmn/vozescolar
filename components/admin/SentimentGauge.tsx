"use client";
import { motion } from "framer-motion";

const RANGES = [
  { max: 30,  label: "Tranquilo",    color: "#22c55e", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  { max: 60,  label: "Moderado",     color: "#f97316", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  { max: 100, label: "Alto estrés",  color: "#ef4444", bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200" },
];

function getRange(score: number) {
  return RANGES.find(r => score <= r.max) ?? RANGES[RANGES.length - 1];
}

export function SentimentGauge({ score }: { score: number }) {
  const range = getRange(score);
  const rotation = -90 + (score / 100) * 180;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Gauge SVG */}
      <div className="relative">
        <svg width="140" height="80" viewBox="0 0 140 80">
          {/* Track */}
          <path d="M 15 70 A 55 55 0 0 1 125 70" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
          {/* Low zone */}
          <path d="M 15 70 A 55 55 0 0 1 70 15" fill="none" stroke="#dcfce7" strokeWidth="12" strokeLinecap="round" />
          {/* Mid zone */}
          <path d="M 70 15 A 55 55 0 0 1 125 70" fill="none" stroke="#fff7ed" strokeWidth="12" strokeLinecap="round" />
          {/* Fill */}
          <motion.path
            d="M 15 70 A 55 55 0 0 1 125 70"
            fill="none"
            stroke={range.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="173"
            initial={{ strokeDashoffset: 173 }}
            animate={{ strokeDashoffset: 173 - (score / 100) * 173 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            opacity={0.85}
          />
          {/* Needle */}
          <motion.line
            x1="70" y1="70" x2="70" y2="24"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            style={{ transformOrigin: "70px 70px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <circle cx="70" cy="70" r="5" fill="#1e293b" />
          <circle cx="70" cy="70" r="2.5" fill="white" />
        </svg>

        {/* Score inside gauge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <motion.p
            className="text-2xl font-bold text-gray-900 leading-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.p>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">/ 100</p>
        </div>
      </div>

      {/* Label badge */}
      <span className={`text-xs font-semibold px-3 py-1 border ${range.bg} ${range.text} ${range.border}`}>
        {range.label}
      </span>

      {/* Scale labels */}
      <div className="flex items-center justify-between w-full text-[10px] text-gray-400 px-1">
        <span>Tranquilo</span>
        <span>Nivel de angustia</span>
        <span>Crítico</span>
      </div>
    </div>
  );
}
