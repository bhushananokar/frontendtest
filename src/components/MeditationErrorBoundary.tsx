import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MeditationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Meditation app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center p-8 max-w-md">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Meditation Session Paused
              </h2>
              <p className="text-gray-600 mb-6">
                We encountered a small hiccup in your meditation experience. 
                Please refresh to continue your journey to inner peace.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Restart Meditation
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}