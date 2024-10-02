import { describe, it } from 'vitest';
import { renderWithProviders } from '../utils';

import Home from '../../pages/Home';

describe('Home', () => {
  it('renders Home with store', () => {
    renderWithProviders(<Home />)
    // check if App component render
  });
});