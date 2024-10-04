import { describe, it, test } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Health from "../../pages/Health";

describe("Health (BMI Calculation)", () => {
  it("renders Health with store", () => {
    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      email: "user@test.com",
      bmi: [],
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "testUser",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    renderWithProviders(
      <MemoryRouter>
        <Health />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
    expect(screen.getByText("BMI Input")).toBeInTheDocument();
  });

  test("User calculates BMI", async () => {
    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      email: "user@test.com",
      bmi: [],
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "testUser",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    renderWithProviders(
      <MemoryRouter>
        <Health />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );

    const weightInput = screen.getByPlaceholderText("Enter your weight (kg)");
    const heightInput = screen.getByPlaceholderText("Enter your height (m)");
    const calculateBtn = screen.getByRole('button', { name: "Calculate BMI" });

    await userEvent.type(weightInput, '70');
    await userEvent.type(heightInput, '1.75');
    await userEvent.click(calculateBtn);

    // Wait for the success message to appear (using a partial match for the text)
    await waitFor(() => {
      expect(screen.getByText(/BMI successfully calculated!/i)).toBeInTheDocument();
    });
  });

  test("Shows error when weight and height are not entered", async () => {
    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      email: "user@test.com",
      bmi: [],
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "testUser",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    renderWithProviders(
      <MemoryRouter>
        <Health />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );

    const calculateBtn = screen.getByRole('button', { name: "Calculate BMI" });
    await userEvent.click(calculateBtn);

    // Wait for the error message to show
    await waitFor(() => {
      expect(screen.getByText("Please enter both weight and height.")).toBeInTheDocument();
    });
  });
});
