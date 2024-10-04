import { describe, it } from 'vitest';
import { renderWithProviders } from '../utils';
import { MemoryRouter } from "react-router-dom";
import Home from '../../pages/Home';

describe('Home', () => {
  it('renders Home with store', () => {
    renderWithProviders(
      <MemoryRouter>
        <Home />
        </MemoryRouter>)
    // check if App component render
  });
});