import { describe, it } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";

import SingleExercise from "../../components/SingleExercise";

describe("SingleExercise", () => {
  it("renders Singup with store", () => {
    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      cardio: [],
      resistence: [],
      email: "madcheertatter@gmail.com",
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "mrco245",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    fetch.mockResponse(JSON.stringify({ type: "cardio", name: "running", distance: 1, duration: 60, date: new Date(), userId: '66f8a11623a2d6fa6ca9fa1c' }));

    renderWithProviders(
      <MemoryRouter>
        <SingleExercise />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
    // check if App component render
  });
});
