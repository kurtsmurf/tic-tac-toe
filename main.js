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

const App = () => {
  const [board, setBoard] = hooks.useState(emptyBoard)
  const [player, setPlayer] = hooks.useState("X")

  console.log(player)

  const togglePlayer = () => setPlayer(player === "X" ? "O" : "X")

  const getNextBoard = position => {
    return [
      ...board.slice(0, position),
      player,
      ...board.slice(position + 1)
    ]
  }

  const play = position => {
    setBoard(getNextBoard(position))
    togglePlayer()
  }

  return preact.h(Board, { board, play })
}

preact.render(
  preact.h(App),
  document.getElementById('app')
)