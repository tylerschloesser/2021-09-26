import ReactDom from 'react-dom'
import { css } from '@emotion/react'

function App() {
  return (
    <div
      css={css`
        color: pink;
      `}
    >
      hi
    </div>
  )
}

ReactDom.render(<App />, document.getElementById('app'))
