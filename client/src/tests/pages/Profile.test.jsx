import { describe, it, test, expect } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from "../../pages/Profile";

describe("Profile", () => {
  it("renders Singup with store", () => {
    const testUser = {
      createdAt: "2024-09-29T00:36:38.129Z",
      email: "madcheertatter@gmail.com",
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "mrco245",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    renderWithProviders(
      <MemoryRouter>
        <Profile />
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
      email: "testuser@test.com",
      updatedAt: "2024-09-29T00:36:38.129Z",
      username: "testuser",
      __v: 0,
      _id: "66f8a11623a2d6fa6ca9fa1c",
    };

    renderWithProviders(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { currentUser: testUser, loading: false, error: false },
        },
      }
    );
      // Find the form elements
      const usernameInput = screen.getByPlaceholderText('Username');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: "Update" });
  
      // Fill in the form
      await userEvent.type(passwordInput, 'password123');

      // Assert that the form was submitted with the correct values
      expect(usernameInput).toHaveValue('testuser');
      expect(emailInput).toHaveValue('testuser@test.com')
      expect(passwordInput).toHaveValue('password123');
  
      // Submit the form
      await userEvent.click(submitButton);
      
  });
});
