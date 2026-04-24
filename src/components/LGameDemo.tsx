import { useEffect, useRef, useState } from 'react'

const S = 'var(--color-gold)'
const SD = (opacity: number) => `rgba(201,168,108,${opacity})`
const MONO = '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace'

function BoardLine({ line }: { line: string }) {
  if (line === '  +---------+') {
    return <span style={{ color: 'rgba(250,248,245,0.52)' }}>{line}</span>
  }

  if (line === '    1 2 3 4') {
    return (
      <>
        <span style={{ color: 'rgba(250,248,245,0.42)' }}>    </span>
        {[1, 2, 3, 4].map((value, index) => (
          <span key={value}>
            <span style={{ color: 'rgba(250,248,245,0.62)' }}>{value}</span>
            {index < 3 ? <span style={{ color: 'rgba(250,248,245,0.32)' }}> </span> : null}
          </span>
        ))}
      </>
    )
  }

  if (/^[1-4] \| /.test(line)) {
    const rowLabel = line.slice(0, 1)
    const cells = line.slice(4, -2).split(' ')
    return (
      <>
        <span style={{ color: 'rgba(250,248,245,0.62)' }}>{rowLabel}</span>
        <span style={{ color: 'rgba(250,248,245,0.42)' }}> | </span>
        {cells.map((cell, index) => {
          let color = 'rgba(250,248,245,0.5)'
          if (cell === '1') {
            color = 'rgb(232,85,62)'
          } else if (cell === '2') {
            color = 'rgb(89,149,255)'
          } else if (cell === '.' || cell === 'N') {
            color = 'rgba(190,190,190,0.72)'
          }
          return (
            <span key={`${rowLabel}-${index}`}>
              <span style={{ color }}>{cell}</span>
              {index < cells.length - 1 ? <span style={{ color: 'rgba(250,248,245,0.24)' }}> </span> : null}
            </span>
          )
        })}
        <span style={{ color: 'rgba(250,248,245,0.42)' }}> |</span>
      </>
    )
  }

  return <span>{line}</span>
}

function TerminalText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, index) => (
        <div key={`${line}-${index}`}>
          <BoardLine line={line} />
        </div>
      ))}
    </>
  )
}

const FRAME_TEXT = [
  `--------------------
Turn 1

Computer 1's turn...

    1 2 3 4
  +---------+
1 | N 1 1 . |
2 | . 2 1 . |
3 | . 2 1 . |
4 | . 2 2 N |
  +---------+`,
  `--------------------
Turn 1

Computer 1's turn...

    1 2 3 4
  +---------+
1 | N 1 1 . |
2 | . 2 1 . |
3 | . 2 1 . |
4 | . 2 2 N |
  +---------+

Computer 1's move:
3 3 E 4 4 1 4

Computer 2's turn...

    1 2 3 4
  +---------+
1 | N . 1 . |
2 | . 2 1 . |
3 | . 2 1 1 |
4 | N 2 2 . |
  +---------+`,
  `--------------------
Turn 1

Computer 1's turn...

    1 2 3 4
  +---------+
1 | N 1 1 . |
2 | . 2 1 . |
3 | . 2 1 . |
4 | . 2 2 N |
  +---------+

Computer 1's move:
3 3 E 4 4 1 4

Computer 2's turn...

    1 2 3 4
  +---------+
1 | N . 1 . |
2 | . 2 1 . |
3 | . 2 1 1 |
4 | N 2 2 . |
  +---------+

Computer 2's move:
2 3 W 1 1 3 4

--------------------
Turn 2

Computer 1's turn...

    1 2 3 4
  +---------+
1 | . 2 1 . |
2 | . 2 1 . |
3 | 2 2 1 1 |
4 | N . N . |
  +---------+`,
  `--------------------
Turn 1

Computer 1's turn...

    1 2 3 4
  +---------+
1 | N 1 1 . |
2 | . 2 1 . |
3 | . 2 1 . |
4 | . 2 2 N |
  +---------+

Computer 1's move:
3 3 E 4 4 1 4

Computer 2's turn...

    1 2 3 4
  +---------+
1 | N . 1 . |
2 | . 2 1 . |
3 | . 2 1 1 |
4 | N 2 2 . |
  +---------+

Computer 2's move:
2 3 W 1 1 3 4

--------------------
Turn 2

Computer 1's turn...

    1 2 3 4
  +---------+
1 | . 2 1 . |
2 | . 2 1 . |
3 | 2 2 1 1 |
4 | N . N . |
  +---------+

Computer 1's move:
3 1 E

Computer 2's turn...

    1 2 3 4
  +---------+
1 | . 2 1 1 |
2 | . 2 1 . |
3 | 2 2 1 . |
4 | N . N . |
  +---------+`,
  `--------------------
Turn 1

Computer 1's turn...

    1 2 3 4
  +---------+
1 | N 1 1 . |
2 | . 2 1 . |
3 | . 2 1 . |
4 | . 2 2 N |
  +---------+

Computer 1's move:
3 3 E 4 4 1 4

Computer 2's turn...

    1 2 3 4
  +---------+
1 | N . 1 . |
2 | . 2 1 . |
3 | . 2 1 1 |
4 | N 2 2 . |
  +---------+

Computer 2's move:
2 3 W 1 1 3 4

--------------------
Turn 2

Computer 1's turn...

    1 2 3 4
  +---------+
1 | . 2 1 . |
2 | . 2 1 . |
3 | 2 2 1 1 |
4 | N . N . |
  +---------+

Computer 1's move:
3 1 E

Computer 2's turn...

    1 2 3 4
  +---------+
1 | . 2 1 1 |
2 | . 2 1 . |
3 | 2 2 1 . |
4 | N . N . |
  +---------+

Computer 2's move:
2 1 W 1 4 4 3

--------------------
Turn 3

Computer 1's turn...

    1 2 3 4
  +---------+
1 | 2 2 1 1 |
2 | . 2 1 . |
3 | . 2 1 N |
4 | . . N . |
  +---------+`,
  `--------------------
Turn 1

Computer 1's turn...

    1 2 3 4
  +---------+
1 | N 1 1 . |
2 | . 2 1 . |
3 | . 2 1 . |
4 | . 2 2 N |
  +---------+

Computer 1's move:
3 3 E 4 4 1 4

Computer 2's turn...

    1 2 3 4
  +---------+
1 | N . 1 . |
2 | . 2 1 . |
3 | . 2 1 1 |
4 | N 2 2 . |
  +---------+

Computer 2's move:
2 3 W 1 1 3 4

--------------------
Turn 2

Computer 1's turn...

    1 2 3 4
  +---------+
1 | . 2 1 . |
2 | . 2 1 . |
3 | 2 2 1 1 |
4 | N . N . |
  +---------+

Computer 1's move:
3 1 E

Computer 2's turn...

    1 2 3 4
  +---------+
1 | . 2 1 1 |
2 | . 2 1 . |
3 | 2 2 1 . |
4 | N . N . |
  +---------+

Computer 2's move:
2 1 W 1 4 4 3

--------------------
Turn 3

Computer 1's turn...

    1 2 3 4
  +---------+
1 | 2 2 1 1 |
2 | . 2 1 . |
3 | . 2 1 N |
4 | . . N . |
  +---------+

Computer 1's move:
1 4 E 3 4 3 2

Computer 2's turn...

    1 2 3 4
  +---------+
1 | 2 2 . . |
2 | 1 2 N . |
3 | 1 2 . N |
4 | 1 1 . . |
  +---------+`,
  `--------------------
Turn 1

Computer 1's turn...

    1 2 3 4
  +---------+
1 | N 1 1 . |
2 | . 2 1 . |
3 | . 2 1 . |
4 | . 2 2 N |
  +---------+

Computer 1's move:
3 3 E 4 4 1 4

Computer 2's turn...

    1 2 3 4
  +---------+
1 | N . 1 . |
2 | . 2 1 . |
3 | . 2 1 1 |
4 | N 2 2 . |
  +---------+

Computer 2's move:
2 3 W 1 1 3 4

--------------------
Turn 2

Computer 1's turn...

    1 2 3 4
  +---------+
1 | . 2 1 . |
2 | . 2 1 . |
3 | 2 2 1 1 |
4 | N . N . |
  +---------+

Computer 1's move:
3 1 E

Computer 2's turn...

    1 2 3 4
  +---------+
1 | . 2 1 1 |
2 | . 2 1 . |
3 | 2 2 1 . |
4 | N . N . |
  +---------+

Computer 2's move:
2 1 W 1 4 4 3

--------------------
Turn 3

Computer 1's turn...

    1 2 3 4
  +---------+
1 | 2 2 1 1 |
2 | . 2 1 . |
3 | . 2 1 N |
4 | . . N . |
  +---------+

Computer 1's move:
1 4 E 3 4 3 2

Computer 2's turn...

    1 2 3 4
  +---------+
1 | 2 2 . . |
2 | 1 2 N . |
3 | 1 2 . N |
4 | 1 1 . . |
  +---------+

Computer 2's move:
2 1 E 3 2 3 4

--------------------
Turn 4

Computer 1's turn...

    1 2 3 4
  +---------+
1 | . 2 2 . |
2 | 1 2 . . |
3 | 1 2 . N |
4 | 1 1 N . |
  +---------+

Player 1 has run out of moves. Player 2 wins.`,
]

export default function LGameDemo() {
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight })
  }, [frameIndex])

  const isFirstFrame = frameIndex === 0
  const isLastFrame = frameIndex === FRAME_TEXT.length - 1

  return (
    <div
      className="aspect-square w-full max-w-[42rem]"
      style={{
        background: 'linear-gradient(180deg, rgba(13,13,13,0.96) 0%, rgba(8,8,8,0.98) 100%)',
        border: `1px solid ${SD(0.24)}`,
        boxShadow: `0 24px 60px ${SD(0.08)}`,
      }}
    >
      <div
        ref={terminalRef}
        className="h-[calc(100%-2.5rem)] overflow-y-auto overflow-x-auto px-4 py-3 text-[12px] leading-5 whitespace-pre-wrap"
        style={{
          fontFamily: MONO,
          color: 'rgba(250,248,245,0.92)',
          background: 'rgba(0,0,0,0.48)',
        }}
      >
        <TerminalText text={FRAME_TEXT[frameIndex]} />
      </div>

      <div
        className="flex h-10 items-center justify-start gap-1 px-1"
        style={{
          borderTop: `1px solid ${SD(0.14)}`,
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <button
          type="button"
          aria-label="Previous move"
          title="Previous move"
          disabled={isFirstFrame}
          onClick={() => setFrameIndex((index) => Math.max(0, index - 1))}
          className="flex h-8 w-8 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-30"
          style={{ color: S }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next move"
          title="Next move"
          disabled={isLastFrame}
          onClick={() => setFrameIndex((index) => Math.min(FRAME_TEXT.length - 1, index + 1))}
          className="flex h-8 w-8 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-30"
          style={{ color: S }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Reset demo"
          title="Reset demo"
          disabled={isFirstFrame}
          onClick={() => setFrameIndex(0)}
          className="flex h-8 w-8 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-30"
          style={{ color: S }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 3-6.708M3 3v6h6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
