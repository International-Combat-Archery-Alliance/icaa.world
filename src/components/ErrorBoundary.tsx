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
        <div className="min-h-screen flex items-center justify-center bg-[#0a1c4a] p-4">
          <div className="max-w-2xl w-full bg-[#0a1c4a]/80 border border-[#ff5722]/30 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-[#ff5722] mb-4">
              Something went wrong
            </h1>
            <p className="text-white/80 mb-6">
              We apologize for the inconvenience. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#ff5722] text-white rounded hover:bg-[#ff5722]/90 transition-colors mb-6"
            >
              Refresh Page
            </button>

            {(this.state.error || this.state.errorInfo) && (
              <div className="mt-4 text-left">
                <button
                  onClick={() =>
                    this.setState({ showDetails: !this.state.showDetails })
                  }
                  className="text-sm text-[#ff5722] hover:text-[#ff5722]/80 underline"
                >
                  {this.state.showDetails ? 'Hide' : 'Show'} error details
                </button>

                {this.state.showDetails && (
                  <pre className="mt-3 p-4 bg-black/50 rounded text-left text-xs text-red-300 overflow-auto max-h-96 whitespace-pre-wrap break-words">
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
