import { useEffect, useRef, useState } from 'react'
import type { LGameState, LGameStatus, LGameWorkerResponse } from '../types/lgame'

const S = 'var(--color-salmon)'
const SD = (opacity: number) => `rgba(232,85,62,${opacity})`

export default function LGameDemo() {
  const workerRef = useRef<Worker | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [terminalText, setTerminalText] = useState('Loading Python runtime…')
  const [status, setStatus] = useState<LGameStatus>('loading')
  const [state, setState] = useState<LGameState | null>(null)
  const [command, setCommand] = useState('')
  const [hint, setHint] = useState('')
  const [paused, setPaused] = useState(false)
  const [fatalError, setFatalError] = useState<string | null>(null)

  useEffect(() => {
    const worker = new Worker(new URL('../workers/lGameWorker.ts', import.meta.url), {
      type: 'module',
    })

    workerRef.current = worker

    worker.onmessage = (event: MessageEvent<LGameWorkerResponse>) => {
      const next = event.data

      if (next.status === 'error') {
        setFatalError(next.error ?? 'Failed to initialize the L-Game worker.')
        setStatus('error')
        return
      }

      if (next.terminalText) {
        setTerminalText(next.terminalText)
      }
      if (next.serializedState) {
        setState(next.serializedState)
      }
      if (next.hint !== undefined) {
        setHint(next.hint)
        setCommand(next.hint)
      } else if (next.serializedState) {
        setHint('')
      }

      setStatus(next.status)
    }

    worker.postMessage({ type: 'init' })

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!state || status === 'loading' || fatalError) {
      return
    }

    if (state.move_count === 0 && !hint) {
      workerRef.current?.postMessage({ type: 'hint', state })
    }
  }, [fatalError, hint, state, status])

  useEffect(() => {
    const pause = () => setPaused(true)

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current) {
        return
      }
      if (event.target instanceof Node && !containerRef.current.contains(event.target)) {
        setPaused(true)
      }
    }

    window.addEventListener('blur', pause)
    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => {
      window.removeEventListener('blur', pause)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [])

  const disabled = paused || status === 'loading' || status === 'running' || fatalError !== null

  const submitCommand = () => {
    if (!state || disabled || !command.trim()) {
      return
    }

    const nextCommand = command
    setCommand('')
    setHint('')
    workerRef.current?.postMessage({ type: 'submit', command: nextCommand, state })
  }

  const requestHint = () => {
    if (!state || disabled) {
      return
    }
    workerRef.current?.postMessage({ type: 'hint', state })
  }

  const resetGame = () => {
    if (disabled) {
      return
    }
    setCommand('')
    setHint('')
    workerRef.current?.postMessage({ type: 'reset' })
  }

  const resume = () => {
    if (!paused) {
      return
    }
    setPaused(false)
    window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-[42rem] overflow-hidden rounded-lg"
      style={{
        background: 'linear-gradient(180deg, rgba(13,13,13,0.96) 0%, rgba(8,8,8,0.98) 100%)',
        border: `1px solid ${SD(0.24)}`,
        boxShadow: `0 24px 60px ${SD(0.08)}`,
      }}
      onPointerDown={resume}
    >
      <div
        className="flex h-full flex-col p-3 transition-all duration-200"
        style={{ filter: paused ? 'blur(6px)' : 'none', opacity: paused ? 0.55 : 1 }}
      >
        <pre
          className="min-h-0 flex-1 overflow-x-auto rounded-md px-4 py-3 text-[12px] leading-5 whitespace-pre-wrap"
          style={{
            fontFamily: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
            color: 'rgba(250,248,245,0.92)',
            background: 'rgba(0,0,0,0.48)',
            border: `1px solid ${SD(0.14)}`,
          }}
        >
          {terminalText}
        </pre>

        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault()
            submitCommand()
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={command}
            disabled={disabled}
            onChange={(event) => setCommand(event.target.value)}
            onFocus={() => setPaused(false)}
            placeholder={hint || ''}
            className="w-full rounded-md px-3 py-2 font-body text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              color: 'rgba(250,248,245,0.94)',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${SD(0.18)}`,
            }}
          />
        </form>

        <div
          className="mt-3 flex items-center justify-between rounded-md px-1 py-1"
          style={{ border: `1px solid ${SD(0.14)}`, background: 'rgba(255,255,255,0.02)' }}
        >
          <button
            type="button"
            aria-label="Reset game"
            title="Reset game"
            disabled={disabled}
            onClick={resetGame}
            className="flex h-8 w-8 items-center justify-center rounded-sm transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: S }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 3-6.708M3 3v6h6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Hint"
            title="Hint"
            disabled={disabled}
            onClick={requestHint}
            className="flex h-8 w-8 items-center justify-center rounded-sm transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: S }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 22h4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5C7.56 13.72 7 12.55 7 11.25a5 5 0 1 1 10 0c0 1.3-.56 2.47-1.5 3.25-.65.54-1.1 1.1-1.28 1.75h-4.44c-.18-.65-.63-1.21-1.28-1.75Z" />
            </svg>
          </button>
        </div>
      </div>

      {paused && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(88,88,88,0.24)' }}
        >
          <div
            className="rounded-full px-5 py-3 font-sans text-[11px] uppercase tracking-[0.22em]"
            style={{
              color: 'rgba(250,248,245,0.92)',
              background: 'rgba(24,24,24,0.72)',
              border: '1px solid rgba(240,240,240,0.16)',
              backdropFilter: 'blur(10px)',
            }}
          >
            Click to demo
          </div>
        </div>
      )}

      {fatalError && (
        <div
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{ background: 'rgba(10,10,10,0.92)' }}
        >
          <div className="max-w-md text-center">
            <p className="font-body text-sm text-cream/70">{fatalError}</p>
          </div>
        </div>
      )}
    </div>
  )
}
