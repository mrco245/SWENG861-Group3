import { describe, it, test, expect } from "vitest";
import { renderWithProviders } from "./utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

describe("App", () => {
  it("renders App with store", () => {
    renderWithProviders(
        <App />
    );
    // check if App component render
  });

  test("navigates to the Home page", async () => {
    renderWithProviders(
        <App />
    );
    const homeLink = screen.getByTestId("home");
    await userEvent.click(homeLink);
    expect(screen.getByTestId("home")).toBeInTheDocument();
  });

  test("navigates to the About page", async () => {
    renderWithProviders(
        <App />
    );
    const aboutLink = screen.getByText("About");
    await userEvent.click(aboutLink);
    expect(screen.getByTestId("about")).toBeInTheDocument();
  });

});
