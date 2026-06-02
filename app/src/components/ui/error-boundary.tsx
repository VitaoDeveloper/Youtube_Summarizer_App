import { Component, type ReactNode, type ErrorInfo } from 'react'
import i18n from '@/lib/i18n'

type Props = { children?: ReactNode; fallback?: ReactNode }
type State = { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <h2 className="text-xl font-semibold">{i18n.t('errors.generic')}</h2>
          <p className="text-sm text-muted-foreground">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-primary underline"
          >
            {i18n.t('errors.tryAgain')}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
