import { QuartzComponentConstructor } from "../types"

function NotFound() {
  return (
    <article class="popover-hint">
      <h1>404</h1>
      <p>这篇文章不存在</p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
