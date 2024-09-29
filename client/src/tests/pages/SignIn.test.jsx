import { describe, it, test, expect } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SignIn from "../../pages/SignIn";

describe("SignIn", () => {
  it("renders Singup with store", () => {
    renderWithProviders(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    // check if App component render
    expect(screen.getByRole("heading", {name: "Sign In"})).toBeInTheDocument();
  });

  test("user enters data in form", async () => {
    renderWithProviders(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
      // Find the form elements
      //const usernameInput = screen.getByPlaceholderText('Enter your username');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: "Sign In" });
  
      // Fill in the form
      //await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(emailInput, 'testuser@test.com');
      await userEvent.type(passwordInput, 'password123');

      // Assert that the form was submitted with the correct values
      //expect(usernameInput).toHaveValue('testuser');
      expect(emailInput).toHaveValue('testuser@test.com')
      expect(passwordInput).toHaveValue('password123');
  
      // Submit the form
      await userEvent.click(submitButton);
  });
});
