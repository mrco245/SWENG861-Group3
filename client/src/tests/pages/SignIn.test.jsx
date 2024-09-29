import { describe, it } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";

import SignIn from "../../pages/SignIn";

describe("SignIn", () => {
  it("renders Singup with store", () => {
    renderWithProviders(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    // check if App component render
  });
});
