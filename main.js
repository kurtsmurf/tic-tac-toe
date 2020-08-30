import * as preact from 'preact'
import * as hooks from 'preact/hooks'

const Cell = ({
  value,
  position,
  onClick,
  highlight
}) => (
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

const Cells = ({
  state,
  dispatch
}) => {
  const { board, winningCombo } = state

  return board.map(
    (value, position) => (
      preact.h(
        Cell,
        {
          value,
          position,
          onClick: () => dispatch({ type: 'play', position }),
          highlight: winningCombo && winningCombo.includes(position)
        }
      )
    )
  )
}

const Board = ({
  state,
  dispatch
}) => (
  preact.h(
    'div',
    { className: 'board' },
    preact.h(Cells, { state, dispatch })
  )
)

const ResetButton = ({
  onClick,
  shouldDisplay
}) => (
  preact.h(
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
  state,
  dispatch
}) => {
  const { gameState, player } = state
  const message =
    gameState === gameStates.playing
      ? `Player ${player}'s turn.`
      : gameState === gameStates.won
        ? `Player ${player} wins! `
        : 'It\'s a draw :/ '

  return (
    preact.h(
      'p',
      { className: 'prompt' },
      message,
      preact.h(
        ResetButton,
        {
          onClick: () => dispatch({ type: 'reset' }),
          shouldDisplay: gameState !== gameStates.playing
        }
      )
    )
  )
}

const Game = ({
  state,
  dispatch
}) => (
  preact.h(
    preact.Fragment,
    {},
    preact.h(Board, { state, dispatch }),
    preact.h(Prompt, { state, dispatch })
  )
)

const gameStates = { playing: 'playing', won: 'won', draw: 'draw' }
const emptyBoard = new Array(9).fill('')

const isDraw = board => !board.includes('')
const isEmpty = board => board === emptyBoard

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

const initialState = {
  board: emptyBoard,
  player: 'X',
  gameState: gameStates.playing,
  winningCombo: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case ('play'): {
      const { board, player, gameState } = state
      const { position } = action
      const gameOver = gameState !== gameStates.playing
      const cellNotEmpty = board[position] !== ''

      if (gameOver || cellNotEmpty) {
        return state
      } else {
        return {
          ...state,
          board: [
            ...board.slice(0, position),
            player,
            ...board.slice(position + 1)
          ]
        }
      }
    }

    case ('toggle_player'):
      return {
        ...state,
        player: state.player === 'X' ? 'O' : 'X'
      }

    case ('win'):
      return {
        ...state,
        gameState: gameStates.won,
        winningCombo: action.winningCombo
      }

    case ('draw'):
      return {
        ...state,
        gameState: gameStates.draw
      }

    case ('reset'):
      return initialState

    default:
      return state
  }
}

const detectWin = (state, dispatch) => {
  const { board, player } = state

  if (isEmpty(board)) return

  const winningCombo = getWinningCombo(player, board)

  if (winningCombo) {
    dispatch({ type: 'win', winningCombo })
  } else if (isDraw(board)) {
    dispatch({ type: 'draw' })
  } else {
    dispatch({ type: 'toggle_player' })
  }
}

const App = () => {
  const [state, dispatch] = hooks.useReducer(reducer, initialState)

  hooks.useEffect(
    () => detectWin(state, dispatch),
    [state.board]
  )

  return preact.h(Game, { state, dispatch })
}

preact.render(
  preact.h(App),
  document.getElementById('app')
)
