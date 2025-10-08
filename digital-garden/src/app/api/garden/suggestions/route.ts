import { NextResponse } from "next/server";

const ideas = [
  "Plant a spiral and follow it with clicks",
  "Switch the color to a deep purple for night mode vibes",
  "Try short quick drags for fuzzy moss",
  "Click around the edges to grow inward",
  "Press R to clear and try a pastel palette",
  "Paint a constellation and then connect it",
  "Draw your initials with tiny taps",
  "Increase device pixel ratio in DevTools to see crisp lines",
];

export function GET() {
  const item = ideas[Math.floor(Math.random() * ideas.length)];
  return NextResponse.json({ idea: item });
}


