import { Component } from 'react';

// Change from named export to default export
export default class ErrorBoundary extends Component {
  state = { error: null };
  
  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <div className="p-4 text-red-500">Error: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}