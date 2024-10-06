import { describe, test, expect, vi } from "vitest";
import { renderWithProviders } from "../utils";
import { MemoryRouter } from "react-router-dom";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Friends from "../../pages/Friends";
import React from "react";

describe("Friends Page", () => {
  // Mock fetch using vi.fn()
  global.fetch = vi.fn((url) => {
    if (url === "/api/csrf-token") {
      return Promise.resolve({
        ok: true,
        json: async () => ({ csrfToken: "mockCsrfToken" }),
      });
    }
    if (url === "/api/user/add-friend") {
      return Promise.resolve({
        ok: true,
        json: async () => ({ message: "Friend request sent successfully" }),
      });
    }
    if (url === "/api/user/details/mockUserId") {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          friends: [],
          friendRequests: [],
          sentFriendRequests: [],
        }),
      });
    }
    return Promise.reject("Unknown API call");
  });

  test("Friends page renders correctly with store", () => {
    renderWithProviders(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>,
      {
        preloadedState: {
          user: {
            currentUser: { _id: "mockUserId" },
          },
        },
      }
    );
    // Check if the Manage Friends List title is rendered
    expect(screen.getByText(/Manage Friends List/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search for a username")
    ).toBeInTheDocument();
  });

  test("user enters search term and clicks search", async () => {
    renderWithProviders(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>,
      {
        preloadedState: {
          user: {
            currentUser: { _id: "mockUserId" },
          },
        },
      }
    );

    // Find the search input and button
    const searchInput = screen.getByPlaceholderText("Search for a username");
    const searchButton = screen.getByRole("button", { name: /search/i });

    // Fill in the search form
    await userEvent.type(searchInput, "testuser");
    expect(searchInput).toHaveValue("testuser");

    // Click the search button
    await userEvent.click(searchButton);

    // Ensure fetch is called with the correct API endpoint
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/user/search/testuser", {
        method: "GET",
        credentials: "include",
        headers: {
          "x-csrf-token": "mockCsrfToken",
        },
      });
    });
  });

  test("user sends a friend request", async () => {
    const ref = React.createRef();

    renderWithProviders(
      <MemoryRouter>
        <Friends ref={ref} />
      </MemoryRouter>,
      {
        preloadedState: {
          user: {
            currentUser: { _id: "mockUserId" },
          },
        },
      }
    );

    const testuser = "testuser";

    // Call the handleAddFriend function directly with the testuser
    // Use waitFor to ensure ref is available
    await waitFor(() => {
      expect(ref.current).not.toBeNull();
    });

    await act(async () => {
      await ref.current.handleAddFriend("testuser");
    });

    // Ensure fetch is called with the correct API endpoint
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/user/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": "mockCsrfToken",
        },
        body: JSON.stringify({ friendUsername: testuser }),
      });
    });
  });

  test("user accepts a friend request", async () => {
    const ref = React.createRef();

    renderWithProviders(
      <MemoryRouter>
        <Friends ref={ref} />
      </MemoryRouter>,
      {
        preloadedState: {
          user: {
            currentUser: { _id: "mockUserId" },
          },
        },
      }
    );

    const testuser = "testuser";

    // Ensure ref is available
    await waitFor(() => {
      expect(ref.current).not.toBeNull();
    });

    await act(async () => {
      await ref.current.handleAcceptRequest(testuser);
    });

    // Ensure fetch is called with the correct API endpoint
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/user/accept-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": expect.any(String),
        },
        body: JSON.stringify({ friendUsername: testuser }),
      });
    });
  });

  test("user removes a friend", async () => {
    const ref = React.createRef();

    renderWithProviders(
      <MemoryRouter>
        <Friends ref={ref} />
      </MemoryRouter>,
      {
        preloadedState: {
          user: {
            currentUser: { _id: "mockUserId" },
          },
        },
      }
    );

    const testuser = "testuser";

    // Ensure ref is available
    await waitFor(() => {
      expect(ref.current).not.toBeNull();
    });

    await act(async () => {
      await ref.current.handleRemoveFriend(testuser);
    });

    // Ensure fetch is called with the correct API endpoint
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/user/remove-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": expect.any(String),
        },
        body: JSON.stringify({ friendUsername: testuser }),
      });
    });
  });
});
