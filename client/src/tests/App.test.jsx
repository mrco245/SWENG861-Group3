
import { describe, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils';

import App from '../App';

describe('App', () => {
  it('renders App with store', () => {
    renderWithProviders(<App />)
    screen.debug();
    // check if App component render
  });
});
