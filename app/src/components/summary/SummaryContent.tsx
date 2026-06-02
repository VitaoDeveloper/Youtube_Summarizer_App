import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props { content: string }

export function SummaryContent({ content }: Props) {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  )
}
