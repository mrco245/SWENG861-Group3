import { describe, it, test } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FitnessHistory from "../../pages/FitnessHistory";

describe("FitnessHistory", () => {
  it("renders FitnessHistory with store", () => {

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
        <FitnessHistory />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
    // check if App component render
  });

  test("User clicks on add exercise button", async () => {
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
        <FitnessHistory />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
      const addExerciseBtn = screen.getByRole('button', { name: "Add Exercise" });
  
      // Fill in the form
      await userEvent.click(addExerciseBtn);
  });
});
