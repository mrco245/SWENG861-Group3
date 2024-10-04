import { describe, it, test, expect, beforeEach, vi } from "vitest";
import { renderWithProviders } from "../utils"; 
import { MemoryRouter } from "react-router-dom";
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Friends from "../../pages/Friends";

describe("Friends", () => {
  beforeEach(() => {
    // Mock the fetch API for different scenarios
    global.fetch = vi.fn();
  });

  it("renders Friends component with store", () => {
    renderWithProviders(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );
    // Check if the main heading renders
    expect(screen.getByRole("heading", { name: "Manage Friends List" })).toBeInTheDocument();
  });

  test("user searches for a friend", async () => {
    // Mock the fetch response for the CSRF token and search results
    fetch.mockImplementationOnce((url) => {
      if (url.endsWith("/api/csrf-token")) {
        return Promise.resolve({ json: () => Promise.resolve({ csrfToken: "mockToken" }) });
      }
      if (url.includes("/api/user/search/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ username: "newFriend" }]),
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    renderWithProviders(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    // User enters a username to search
    const searchInput = screen.getByPlaceholderText("Search for a username");
    const searchButton = screen.getByRole("button", { name: "Search" });

    await userEvent.type(searchInput, "newFriend");
    await userEvent.click(searchButton);

    // Wait for search results to be displayed
    await waitFor(() => expect(screen.getByText("newFriend")).toBeInTheDocument());
  });

  test("user adds a friend", async () => {
    fetch.mockImplementationOnce((url) => {
      if (url.endsWith("/api/csrf-token")) {
        return Promise.resolve({ json: () => Promise.resolve({ csrfToken: "mockToken" }) });
      }
      if (url.includes("/api/user/search/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ username: "newFriend" }]),
        });
      }
      if (url === "/api/user/add-friend") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Friend request sent successfully." }),
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    renderWithProviders(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    // User searches for a friend
    const searchInput = screen.getByPlaceholderText("Search for a username");
    const searchButton = screen.getByRole("button", { name: "Search" });

    await userEvent.type(searchInput, "newFriend");
    await userEvent.click(searchButton);

    // Wait for the search result to appear
    await waitFor(() => expect(screen.getByText("newFriend")).toBeInTheDocument());

    // User adds the friend
    const addButton = screen.getByRole("button", { name: "Add Friend" });
    await userEvent.click(addButton);

    // Check that the friend request was sent successfully
    expect(await screen.findByText("Friend request sent successfully.")).toBeInTheDocument();
  });

  test("user accepts a friend request", async () => {
    // Mock necessary fetch calls
    fetch.mockImplementationOnce((url) => {
      if (url.endsWith("/api/csrf-token")) {
        return Promise.resolve({ json: () => Promise.resolve({ csrfToken: "mockToken" }) });
      }
      if (url.endsWith("/api/user/details/1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            friends: [],
            friendRequests: ["incomingFriend"],
            sentFriendRequests: [],
          }),
        });
      }
      if (url === "/api/user/accept-request") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Friend request accepted." }),
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    renderWithProviders(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    // Wait for the incoming friend request to appear
    await waitFor(() => expect(screen.getByText("incomingFriend")).toBeInTheDocument());

    // User accepts the friend request
    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await userEvent.click(acceptButton);

    // Check that the friend request was accepted successfully
    expect(await screen.findByText("Friend request accepted.")).toBeInTheDocument();
  });

  test("user removes a friend", async () => {
    fetch.mockImplementationOnce((url) => {
      if (url.endsWith("/api/csrf-token")) {
        return Promise.resolve({ json: () => Promise.resolve({ csrfToken: "mockToken" }) });
      }
      if (url.endsWith("/api/user/details/1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            friends: ["friendToRemove"],
            friendRequests: [],
            sentFriendRequests: [],
          }),
        });
      }
      if (url === "/api/user/remove-friend") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Friend removed successfully." }),
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    renderWithProviders(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    // Wait for the added friend to appear
    await waitFor(() => expect(screen.getByText("friendToRemove")).toBeInTheDocument());

    // User removes the friend
    const removeButton = screen.getByRole("button", { name: "Remove" });
    await userEvent.click(removeButton);

    // Check that the friend was removed successfully
    expect(await screen.findByText("Friend removed successfully.")).toBeInTheDocument();
  });
});
