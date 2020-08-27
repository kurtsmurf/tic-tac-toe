import * as preact from 'preact'
import * as hooks from 'preact/hooks'

const Cell = ({ value, position, onClick, highlight }) => (
  preact.h(
    'div',
    {
      id: position,
      className: `cell pos-${position} ${highlight ? 'highlight' : ''}`,
      onClick
    },
    value
  )
)

const Board = ({ board, play, winningCombo }) => (
  preact.h(
    'div',
    {
      className: 'board'
    },
    board.map((value, position) => preact.h(
      Cell,
      {
        value,
        position,
        onClick: value === "" ? () => play(position) : null,
        highlight: winningCombo && winningCombo.includes(position)
      }
    ))
  )
)

const Prompt = ({ gameState, player }) => {
  const prompt =
    gameState === gameStates.playing
      ? `Player ${player}'s turn.`
      : gameState === gameStates.won
        ? `Player ${player} wins!`
        : `It's a draw :/`

  return preact.h('h1', {}, prompt)
}

const gameStates = {
  playing: 0,
  won: 1,
  draw: 2
}

const emptyBoard = new Array(9).fill("")

const getWinningCombo = (player, board) => {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]  

  const playerHasCombo = combo => combo
    .map(position => board[position])
    .every(value => value === player)

  return winningCombos.filter(playerHasCombo)[0]
}

const isDraw = board => !board.includes("")

const App = () => {
  const [board, setBoard] = hooks.useState(emptyBoard)
  const [player, setPlayer] = hooks.useState("X")
  const [gameState, setGameState] = hooks.useState(gameStates.playing)
  const [winningCombo, setWinningCombo] = hooks.useState(null)

  const togglePlayer = () => setPlayer(player === "X" ? "O" : "X")

  const getNextBoard = position => {
    return [
      ...board.slice(0, position),
      player,
      ...board.slice(position + 1)
    ]
  }

  const play = position => {
    if (gameState !== gameStates.playing) return

    const nextBoard = getNextBoard(position)
    const win = getWinningCombo(player, nextBoard)

    if (win) {
      setGameState(gameStates.won)
      setWinningCombo(win)
    } else if (isDraw(nextBoard)) {
      setGameState(gameStates.draw)
    } else {
      togglePlayer()
    }

    setBoard(nextBoard)
  }

  return preact.h(
    preact.Fragment,
    {},
    preact.h(Board, { board, play, winningCombo }),
    preact.h(Prompt, { gameState, player })
  )
}

preact.render(
  preact.h(App),
  document.getElementById('app')
)