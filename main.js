import { h, Fragment, render } from './web_modules/preact.js'
import * as hooks from './web_modules/preact/hooks.js'

const Cell = ({
  value,
  position,
  onClick,
  shouldHighlight
}) => (
    h(
      'div',
      {
        id: position,
        className:
          `cell ` +
          `pos-${position} ` +
          (shouldHighlight ? 'highlight ' : ' '),
        onClick
      },
      value
    )
  )

const Cells = ({
  board,
  play,
  winningCombo
}) => (
    board.map(
      (value, position) => (
        h(
          Cell,
          {
            value,
            position,
            onClick: () => play(position),
            shouldHighlight:
              winningCombo && winningCombo.includes(position)
          }
        )
      )
    )
  )

const Board = ({
  board,
  play,
  winningCombo
}) => (
    h(
      'div',
      { className: 'board' },
      h(Cells, { board, play, winningCombo })
    )
  )

const ResetButton = ({
  onClick,
  shouldDisplay
}) => (
    h(
      'button',
      {
        onClick,
        className: 'reset',
        style: shouldDisplay ? '' : 'display: none'
      },
      'Reset'
    )
  )

const Prompt = ({
  gameState,
  player,
  reset
}) => {
  const message =
      gameState === gameStates.playing ? `Player ${player}'s turn.`
    : gameState === gameStates.won ? `Player ${player} wins! `
    : `It's a draw :/ `

  return (
    h(
      'p',
      { className: 'prompt' },
      message,
      h(
        ResetButton,
        {
          onClick: reset,
          shouldDisplay: gameState !== gameStates.playing
        }
      )
    )
  )
}

const gameStates = {
  playing: 0,
  won: 1,
  draw: 2
}

const emptyBoard = new Array(9).fill('')

const getWinningCombo = (player, board) => {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  const playerHasCombo = combo => combo
    .map(position => board[position])
    .every(value => value === player)

  return winningCombos.find(playerHasCombo)
}

const isDraw = board => !board.includes('')

const App = () => {
  const [board, setBoard] = hooks.useState(emptyBoard)
  const [player, setPlayer] = hooks.useState('X')
  const [gameState, setGameState] = hooks.useState(gameStates.playing)
  const [winningCombo, setWinningCombo] = hooks.useState(null)

  const togglePlayer = () => setPlayer(player === 'X' ? 'O' : 'X')

  const getNextBoard = position => [
    ...board.slice(0, position),
    player,
    ...board.slice(position + 1)
  ]

  const play = position => {
    const gameIsOver = gameState !== gameStates.playing
    const cellIsNotEmpty = board[position] !== ''

    if (gameIsOver || cellIsNotEmpty) return

    const nextBoard = getNextBoard(position)
    const combo = getWinningCombo(player, nextBoard)

    if (combo) {
      setGameState(gameStates.won)
      setWinningCombo(combo)
    } else if (isDraw(nextBoard)) {
      setGameState(gameStates.draw)
    } else {
      togglePlayer()
    }

    setBoard(nextBoard)
  }

  const reset = () => {
    setBoard(emptyBoard)
    setPlayer('X')
    setGameState(gameStates.playing)
    setWinningCombo(null)
  }

  return (
    h(
      Fragment,
      {},
      h(Board, { board, play, winningCombo }),
      h(Prompt, { gameState, player, reset })
    )
  )
}

render(
  h(App),
  document.getElementById('app')
)
