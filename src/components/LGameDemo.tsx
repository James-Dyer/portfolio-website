import { useEffect, useRef, useState } from 'react'
import type { LGameState, LGameStatus, LGameWorkerResponse } from '../types/lgame'

const S = 'var(--color-salmon)'
const SD = (opacity: number) => `rgba(232,85,62,${opacity})`

function statusLabel(status: LGameStatus, paused: boolean) {
  if (paused) {
    return 'Paused'
  }
  switch (status) {
    case 'loading':
      return 'Loading'
    case 'running':
      return 'Thinking'
    case 'game_over':
      return 'Game Over'
    case 'error':
      return 'Error'
    default:
      return 'Ready'
  }
}

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
      type: 'classic',
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
      } else if (next.serializedState?.move_count) {
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
      className="relative overflow-hidden rounded-lg"
      style={{
        background: 'linear-gradient(180deg, rgba(13,13,13,0.96) 0%, rgba(8,8,8,0.98) 100%)',
        border: `1px solid ${SD(0.24)}`,
        boxShadow: `0 24px 60px ${SD(0.08)}`,
      }}
      onPointerDown={resume}
    >
      <div
        className="flex items-center justify-between gap-4 border-b px-4 py-3"
        style={{ borderColor: SD(0.12), background: 'rgba(255,255,255,0.02)' }}
      >
        <div>
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase" style={{ color: SD(0.62) }}>
            Interactive Browser Demo
          </p>
          <p className="font-body text-xs text-cream/60">Human first, deterministic CPU response, typed move entry.</p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.18em]"
          style={{
            color: paused ? 'rgba(250,248,245,0.92)' : SD(0.78),
            background: paused ? 'rgba(160,160,160,0.18)' : SD(0.09),
            border: `1px solid ${paused ? 'rgba(190,190,190,0.24)' : SD(0.22)}`,
          }}
        >
          {statusLabel(status, paused)}
        </span>
      </div>

      <div
        className="space-y-4 p-4 transition-all duration-200"
        style={{ filter: paused ? 'blur(6px)' : 'none', opacity: paused ? 0.55 : 1 }}
      >
        <pre
          className="min-h-[23rem] overflow-x-auto rounded-md p-4 text-[13px] leading-6 whitespace-pre-wrap"
          style={{
            fontFamily: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
            color: 'rgba(250,248,245,0.92)',
            background: 'rgba(0,0,0,0.48)',
            border: `1px solid ${SD(0.14)}`,
          }}
        >
          {terminalText}
        </pre>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={resetGame}
            className="rounded-md px-3 py-2 font-sans text-[11px] uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: S, border: `1px solid ${SD(0.24)}`, background: SD(0.05) }}
          >
            Reset
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={requestHint}
            className="rounded-md px-3 py-2 font-sans text-[11px] uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: S, border: `1px solid ${SD(0.24)}`, background: SD(0.05) }}
          >
            Hint
          </button>
          <button
            type="button"
            disabled={disabled || !hint}
            onClick={() => setCommand(hint)}
            className="rounded-md px-3 py-2 font-sans text-[11px] uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: S, border: `1px solid ${SD(0.24)}`, background: SD(0.05) }}
          >
            Use Hint
          </button>
          <div className="min-w-0 flex-1 rounded-md px-3 py-2 font-body text-sm text-cream/65" style={{ background: 'rgba(255,255,255,0.03)' }}>
            {hint ? (
              <>
                <span className="font-sans text-[10px] uppercase tracking-[0.16em]" style={{ color: SD(0.66) }}>
                  {state?.move_count === 0 ? 'Opening suggestion' : 'Current hint'}
                </span>{' '}
                <span style={{ color: 'rgba(250,248,245,0.92)' }}>{hint}</span>
              </>
            ) : (
              <span className="font-sans text-[10px] uppercase tracking-[0.16em]" style={{ color: SD(0.38) }}>
                Request a hint to preview a legal move.
              </span>
            )}
          </div>
        </div>

        <form
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
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
            placeholder="Enter move, help, or reset"
            className="min-w-0 flex-1 rounded-md px-3 py-3 font-body text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              color: 'rgba(250,248,245,0.94)',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${SD(0.18)}`,
            }}
          />
          <button
            type="submit"
            disabled={disabled || !command.trim()}
            className="rounded-md px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: 'rgba(12,12,12,0.92)', background: S }}
          >
            Submit
          </button>
        </form>

        <p className="font-sans text-[10px] tracking-[0.16em] uppercase" style={{ color: SD(0.48) }}>
          Format: `x y O` or `x y O a b c d`
        </p>
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
            Click anywhere to resume
          </div>
        </div>
      )}

      {fatalError && (
        <div
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{ background: 'rgba(10,10,10,0.92)' }}
        >
          <div className="max-w-md text-center">
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase" style={{ color: SD(0.66) }}>
              Demo failed to load
            </p>
            <p className="mt-3 font-body text-sm text-cream/70">{fatalError}</p>
          </div>
        </div>
      )}
    </div>
  )
}
