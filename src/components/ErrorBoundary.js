import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream dark:bg-charcoal flex items-center justify-center px-4 py-20 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 shadow-2xl">
            <span className="font-serif text-6xl text-gold block mb-6">Oops!</span>
            <h2 className="font-serif text-2xl text-charcoal dark:text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-charcoal/60 dark:text-white/60 mb-8 text-sm">
              We encountered an unexpected error while preparing your culinary journey.
              Our chefs are looking into it.
            </p>
            <button
              onClick={this.handleReset}
              className="btn-primary w-full text-base py-3"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
