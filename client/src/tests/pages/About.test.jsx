import { describe, it } from 'vitest';
import { renderWithProviders } from '../utils';

import About from '../../pages/About';

describe('About', () => {
  it('renders About with store', () => {
    renderWithProviders(<About />)
    // check if App component render
  });
});