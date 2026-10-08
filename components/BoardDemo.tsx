"use client"

import { useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"

/**
 * Interactive chessboard using react-chessboard v5 API (options prop).
 * Blocks moves once the game is over.
 */
export default function BoardDemo() {
  const [game, setGame] = useState(new Chess())
  const [status, setStatus] = useState<string>("Trait aux blancs")
  const [gameOver, setGameOver] = useState(false)

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string
    targetSquare: string | null
  }): boolean => {
    if (!targetSquare || gameOver) return false
    const gameCopy = new Chess(game.fen())
    try {
      const result = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      })
      if (result) {
        setGame(gameCopy)
        setStatus(getStatus(gameCopy))
        if (gameCopy.isGameOver()) setGameOver(true)
        return true
      }
    } catch {
      return false
    }
    return false
  }

  const reset = () => {
    const fresh = new Chess()
    setGame(fresh)
    setStatus("Trait aux blancs")
    setGameOver(false)
  }

  return (
    <div className="w-full max-w-md space-y-3">
      <div
        style={{
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          border: gameOver ? "2px solid #d47862" : "2px solid var(--accent)",
        }}
      >
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop,
            allowDragging: !gameOver,
            darkSquareStyle: { backgroundColor: "#b58863" },
            lightSquareStyle: { backgroundColor: "#f0d9b5" },
          }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <div
          style={{
            color: gameOver ? "#d47862" : "var(--text-secondary)",
            fontWeight: gameOver ? 700 : 400,
          }}
        >
          {gameOver ? `Partie terminée · ${status}` : status}
        </div>
        <button
          onClick={reset}
          className="px-3 py-1 border text-[10px] uppercase tracking-widest"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

function getStatus(game: Chess): string {
  if (game.isCheckmate())
    return `Échec et mat — les ${game.turn() === "w" ? "noirs" : "blancs"} gagnent`
  if (game.isStalemate()) return "Pat — nulle"
  if (game.isInsufficientMaterial()) return "Matériel insuffisant — nulle"
  if (game.isThreefoldRepetition()) return "Triple répétition — nulle"
  if (game.isDraw()) return "Nulle"
  if (game.isCheck())
    return `Échec — trait aux ${game.turn() === "w" ? "blancs" : "noirs"}`
  return `Trait aux ${game.turn() === "w" ? "blancs" : "noirs"}`
}
