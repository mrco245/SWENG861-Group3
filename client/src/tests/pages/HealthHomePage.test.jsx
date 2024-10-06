import { describe, it } from 'vitest';
import { renderWithProviders } from '../utils';
import { MemoryRouter } from "react-router-dom";
import HealthHomepage from '../../pages/HealthHomepage';

describe('HealthHomePage', () => {
    it('renders Health Homepage with store', () => {
      renderWithProviders(
        <MemoryRouter>
          <HealthHomepage />
          </MemoryRouter>)
    });
  });