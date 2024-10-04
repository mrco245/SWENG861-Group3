import { describe, it, test } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Fitness from "../../pages/Fitness";

describe("Fitness", () => {
  it("renders Fitness with store", () => {

    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      email: "madcheertatter@gmail.com",
      cardio: [],
      resistence: [],
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "mrco245",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    renderWithProviders(
      <MemoryRouter>
        <Fitness />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
    // check if App component render
  });

  test("User clicks on cardio button", async () => {
    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      email: "madcheertatter@gmail.com",
      cardio: [],
      resistence: [],
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "mrco245",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    renderWithProviders(
      <MemoryRouter>
        <Fitness />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
      const cardioBtn = screen.getByRole('button', { name: "cardio Cardio" });
  
      // Fill in the form
      await userEvent.click(cardioBtn);
  });
  test("User clicks on cardio button", async () => {
    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      email: "madcheertatter@gmail.com",
      cardio: [],
      resistence: [],
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "mrco245",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    renderWithProviders(
      <MemoryRouter>
        <Fitness />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
      const restBtn = screen.getByRole('button', { name: "resistance Resistance" });
  
      // Fill in the form
      await userEvent.click(restBtn);
    

  });
});
