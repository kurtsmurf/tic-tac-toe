import * as preact from 'preact'
import * as hooks from 'preact/hooks'

const Cell = ({value, position, onClick}) => (
  preact.h(
    'div',
    {
      id: position,
      className: `cell pos-${position}`,
      onClick
    },
    value
  )
)

const Board = ({ board, play }) => (
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
        onClick: value === "" ? () => play(position) : null
      }
    ))
  )
)

const emptyBoard = new Array(9).fill("")

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
]

const didWin = (player, board) => {
  const playerHasCombo = combo => combo
    .map(position => board[position])
    .every(value => value === player)

  return winningCombos.some(playerHasCombo)
}

const App = () => {
  const [board, setBoard] = hooks.useState(emptyBoard)
  const [player, setPlayer] = hooks.useState("X")

  const togglePlayer = () => setPlayer(player === "X" ? "O" : "X")

  const getNextBoard = position => {
    return [
      ...board.slice(0, position),
      player,
      ...board.slice(position + 1)
    ]
  }

  const play = position => {
    const nextBoard = getNextBoard(position)

    if (didWin(player, nextBoard)) {
      console.log(`Player ${player} wins!`)
    } else {
      togglePlayer()
    }

    setBoard(nextBoard)
  }

  return preact.h(Board, { board, play })
}

preact.render(
  preact.h(App),
  document.getElementById('app')
)