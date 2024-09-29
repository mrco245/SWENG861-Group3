import { describe, it } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";

import SignUp from "../../pages/SignUp";

describe("SignUp", () => {
  it("renders Singup with store", () => {
    renderWithProviders(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    // check if App component render
  });
});
