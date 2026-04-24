import lGameSource from '../../L-Game.py?raw'
import type { LGameState, LGameWorkerRequest, LGameWorkerResponse } from '../types/lgame'

type JsonBridge = {
  newGame: () => string
  resetGame: () => string
  renderTerminal: (stateJson: string) => string
  getHint: (stateJson: string) => string
  submitCommand: (stateJson: string, command: string) => string
}

type PyodideInstance = {
  runPythonAsync: (code: string) => Promise<unknown>
  globals: {
    get: (name: string) => PyodideCallable
  }
}

type PyodideCallable = ((...args: unknown[]) => unknown) & {
  destroy?: () => void
}

type PyodideModule = {
  loadPyodide: (options: { indexURL: string }) => Promise<PyodideInstance>
}

const workerScope = globalThis as unknown as {
  postMessage: (message: LGameWorkerResponse) => void
  onmessage: ((event: MessageEvent<LGameWorkerRequest>) => void) | null
}

let bridgePromise: Promise<JsonBridge> | null = null

async function createBridge(): Promise<JsonBridge> {
  const pyodideUrl = new URL('/pyodide/pyodide.mjs', self.location.origin).href
  const pyodideModule = (await import(/* @vite-ignore */ pyodideUrl)) as PyodideModule
  const pyodide = await pyodideModule.loadPyodide({ indexURL: '/pyodide/' })

  await pyodide.runPythonAsync(lGameSource)
  await pyodide.runPythonAsync(`
import json

def _browser_new_game_json():
    return json.dumps(new_game())

def _browser_reset_game_json():
    return json.dumps(reset_game())

def _browser_render_terminal_json(state_json):
    return render_terminal(json.loads(state_json))

def _browser_get_hint_json(state_json):
    return get_hint(json.loads(state_json))

def _browser_submit_command_json(state_json, command):
    return json.dumps(submit_command(json.loads(state_json), command))
`)

  const newGame = pyodide.globals.get('_browser_new_game_json')
  const resetGame = pyodide.globals.get('_browser_reset_game_json')
  const renderTerminal = pyodide.globals.get('_browser_render_terminal_json')
  const getHint = pyodide.globals.get('_browser_get_hint_json')
  const submitCommand = pyodide.globals.get('_browser_submit_command_json')

  return {
    newGame: () => newGame() as string,
    resetGame: () => resetGame() as string,
    renderTerminal: (stateJson: string) => renderTerminal(stateJson) as string,
    getHint: (stateJson: string) => getHint(stateJson) as string,
    submitCommand: (stateJson: string, command: string) =>
      submitCommand(stateJson, command) as string,
  }
}

async function getBridge() {
  if (bridgePromise === null) {
    bridgePromise = createBridge()
  }
  return bridgePromise
}

function postMessageSafe(message: LGameWorkerResponse) {
  workerScope.postMessage(message)
}

function parseState(stateJson: string): LGameState {
  return JSON.parse(stateJson) as LGameState
}

function handleRunningState(state: LGameState | null) {
  postMessageSafe({
    terminalText: state ? '' : 'Loading Python runtime…',
    serializedState: state,
    status: 'running',
  })
}

workerScope.onmessage = async (event: MessageEvent<LGameWorkerRequest>) => {
  const message = event.data

  try {
    if (message.type === 'init') {
      postMessageSafe({
        terminalText: 'Loading Python runtime…',
        serializedState: null,
        status: 'loading',
      })

      const bridge = await getBridge()
      const serializedState = parseState(bridge.newGame())
      postMessageSafe({
        terminalText: bridge.renderTerminal(JSON.stringify(serializedState)),
        serializedState,
        status: 'awaiting_input',
      })
      return
    }

    const bridge = await getBridge()

    if (message.type === 'reset') {
      handleRunningState(null)
      const serializedState = parseState(bridge.resetGame())
      postMessageSafe({
        terminalText: bridge.renderTerminal(JSON.stringify(serializedState)),
        serializedState,
        status: 'awaiting_input',
      })
      return
    }

    if (message.type === 'hint') {
      const hint = bridge.getHint(JSON.stringify(message.state))
      postMessageSafe({
        terminalText: '',
        serializedState: message.state,
        status: 'awaiting_input',
        hint,
      })
      return
    }

    handleRunningState(message.state)
    const result = JSON.parse(
      bridge.submitCommand(JSON.stringify(message.state), message.command),
    ) as {
      state: LGameState
      terminal_text: string
      status: LGameWorkerResponse['status']
    }

    postMessageSafe({
      terminalText: result.terminal_text,
      serializedState: result.state,
      status: result.status,
    })
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Unknown worker error'
    postMessageSafe({
      terminalText: '',
      serializedState: null,
      status: 'error',
      error: messageText,
    })
  }
}

export {}
