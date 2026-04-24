export type LGameStatus =
  | 'loading'
  | 'ready'
  | 'awaiting_input'
  | 'running'
  | 'game_over'
  | 'error'
  | 'paused'

export interface LGameState {
  player1: {
    position: [number, number]
    orientation: 'N' | 'E' | 'S' | 'W'
  }
  player2: {
    position: [number, number]
    orientation: 'N' | 'E' | 'S' | 'W'
  }
  neutral: [number, number][]
  turn: 1 | 2
  move_count: number
  last_player_move: string | null
  last_cpu_move: string | null
  result: string | null
  history: string[]
}

export type LGameWorkerRequest =
  | { type: 'init' }
  | { type: 'submit'; command: string; state: LGameState }
  | { type: 'reset' }
  | { type: 'hint'; state: LGameState }

export interface LGameWorkerResponse {
  terminalText: string
  serializedState: LGameState | null
  status: LGameStatus
  hint?: string
  error?: string
}
