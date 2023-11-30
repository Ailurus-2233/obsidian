import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"

export default (() => {
  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text
    if (text) {
      const segments: string[] = []
      const { text: timeTaken, words: words, minutes: mins } = readingTime(text)

      if (fileData.dates) {
        segments.push(formatDate(getDate(cfg, fileData)!))
      }
      segments.push(`共${words}字 `)
      segments.push(`阅读需要${mins}分钟`)
      return <p class={`content-meta ${displayClass ?? ""}`}>{segments.join(" ")}</p>
    } else {
      return null
    }
  }

  ContentMetadata.css = `
  .content-meta {
    margin-top: 0;
    color: var(--gray);
  }
  `
  return ContentMetadata
}) satisfies QuartzComponentConstructor
