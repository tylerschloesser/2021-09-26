import { css } from '@emotion/react'

function times(n: number) {
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push(i)
  }
  return arr
}

export function App() {
  return (
    <>
      <div
        css={css`
          display: flex;
        `}
      >
        <div
          css={css`
            padding: 10vmin;
          `}
        >
          <div
            data-beacon="a"
            css={css`
              width: 33vmin;
              height: 33vmin;
              background-color: #aaa;
              border-radius: 100%;
            `}
          />
        </div>
        <div
          css={css`
            flex: 1;
            padding: 10vmin;
            padding-left: 0;
          `}
        >
          <div
            data-beacon="b"
            css={css`
              width: 100%;
              height: 33vmin;
              background-color: #aaa;
            `}
          />
        </div>
      </div>
      {times(4).map((i) => (
        <div
          key={i}
          css={css`
            padding: 10vmin;
            padding-top: 0;
          `}
        >
          <div
            data-beacon={`c${i}`}
            css={css`
              width: 100%;
              height: 33vmin;
              background-color: #aaa;
            `}
          />
        </div>
      ))}
    </>
  )
}
