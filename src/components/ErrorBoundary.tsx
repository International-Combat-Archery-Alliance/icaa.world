import { Component, type ReactNode, type ErrorInfo } from 'react';
import { trackError } from '@/lib/newrelic';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });

    // Report to New Relic
    trackError(error, {
      componentStack: errorInfo.componentStack || 'N/A',
      errorBoundary: 'ErrorBoundary',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a1c4a] p-4">
          <div className="w-full max-w-2xl rounded-lg border border-[#ff5722]/30 bg-[#0a1c4a]/80 p-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-[#ff5722]">
              Something went wrong
            </h1>
            <p className="mb-6 text-white/80">
              We apologize for the inconvenience. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mb-6 rounded bg-[#ff5722] px-6 py-2 text-white transition-colors hover:bg-[#ff5722]/90"
            >
              Refresh Page
            </button>

            {(this.state.error || this.state.errorInfo) && (
              <div className="mt-4 text-left">
                <button
                  onClick={() =>
                    this.setState({ showDetails: !this.state.showDetails })
                  }
                  className="text-sm text-[#ff5722] underline hover:text-[#ff5722]/80"
                >
                  {this.state.showDetails ? 'Hide' : 'Show'} error details
                </button>

                {this.state.showDetails && (
                  <pre className="mt-3 max-h-96 overflow-auto rounded bg-black/50 p-4 text-left text-xs break-words whitespace-pre-wrap text-red-300">
                    {this.state.error?.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
