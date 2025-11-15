import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the application title', () => {
    render(<App />);
    expect(screen.getByText('Cooperative Society Management')).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<App />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Manage your cooperative society efficiently')).toBeInTheDocument();
  });

  it('displays formatted currency', () => {
    render(<App />);
    expect(screen.getByText(/Sample formatted amount:/)).toBeInTheDocument();
    expect(screen.getByText(/\$1,000\.00/)).toBeInTheDocument();
  });
});
