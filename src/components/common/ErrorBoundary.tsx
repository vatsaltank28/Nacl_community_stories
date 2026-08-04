"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 rounded-3xl bg-secondary/5 border border-red-500/30 text-center my-6">
          <div className="text-xl font-bold text-white mb-2">Something went wrong</div>
          <p className="text-xs text-additional/80 mb-4 max-w-sm mx-auto">
            {this.state.error?.message || "An unexpected error occurred in this component."}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-accent text-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
