import { describe, it, test } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BMIHistory from "../../pages/BMIHistory";

describe("BMIHistory", () => {
  it("renders BMIHistory with store", () => {
    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      email: "testUser@gmail.com",
      bmi: [],
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "testUser",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    // Render BMIHistory with preloaded user state
    renderWithProviders(
      <MemoryRouter>
        <BMIHistory />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );

    // Check if the BMI History component renders
    expect(screen.getByText("BMI History")).toBeInTheDocument();
  });
});