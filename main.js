import * as preact from 'preact'
import * as hooks from 'preact/hooks'

const Cell = (value, position) => (
  preact.h(
    'div',
    {
      id: position,
      className: `cell pos-${position}`
    },
    value
  )
)

const Board = ({ board }) => {
  console.log(board)

  return preact.h(
    'div',
    { className: 'board' },
    board.map(Cell)
  )
}

const emptyBoard = new Array(9).fill("O")

const App = () => {
  const [board, setBoard] = hooks.useState(emptyBoard)

  return preact.h(Board, { board })
}

preact.render(
  preact.h(App),
  document.getElementById('app')
)