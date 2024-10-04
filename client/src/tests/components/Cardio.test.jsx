import { describe, it, test, expect } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cardio from "../../components/Cardio";

describe("Cardio", () => {
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

    renderWithProviders(
      <MemoryRouter>
        <Cardio />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
    // check if App component render
  });

  test("user enters data in form", async () => {
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

    renderWithProviders(
      <MemoryRouter>
        <Cardio />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
      // Find the form elements
      const typeInput = screen.getByPlaceholderText('Running');
      const distInput = screen.getByTestId('distance');
      const durInput = screen.getByTestId('duration');

 
      const submitButton = screen.getByRole('button', { name: "Add" });
  
      // Fill in the form
      await userEvent.type(typeInput, 'running');
      await userEvent.type(distInput, '2');
      await userEvent.type(durInput, '60');
      await userEvent.click(submitButton);

      // Assert that the form was submitted with the correct values
      expect(typeInput).toHaveValue('running');   
      expect(distInput).toHaveValue(2);
      expect(durInput).toHaveValue(60);
  });
});
