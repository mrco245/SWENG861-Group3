import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";
import { useSelector } from "react-redux";

const Friends = forwardRef((props, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getCookie = async () => {
    const token = await fetch("/api/csrf-token");
    return token.json();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const csrfToken = await getCookie();
        if (!csrfToken) return false;

        const response = await fetch(`/api/user/details/${currentUser._id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "x-csrf-token": csrfToken.csrfToken,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const user = await response.json();
        if (user) {
          const friendsUsernames = await Promise.all(
            user.friends.map(async (friendId) => {
              const friendResponse = await fetch(
                `/api/user/search/${encodeURIComponent(friendId)}`,
                {
                  method: "GET",
                  credentials: "include",
                  headers: {
                    "x-csrf-token": csrfToken.csrfToken,
                  },
                }
              );
              if (friendResponse.ok) {
                const friendData = await friendResponse.json();
                return friendData.length > 0 ? friendData[0].username : null;
              }
              return null;
            })
          );

          setAddedFriends(friendsUsernames.filter((username) => username));
          setIncomingRequests(user.friendRequests || []);
          setFriendRequests(user.sentFriendRequests || []);
        }
      } catch (err) {
        StatusAlertService.showError(
          err.message || "Error fetching user data."
        );
      }
    };

    fetchUserData();
  }, [currentUser._id]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      StatusAlertService.showError("Please enter a username to search.");
      return;
    }

    setLoading(true);
    const csrfToken = await getCookie();
    if (!csrfToken) return false;

    try {
      const res = await fetch(
        `/api/user/search/${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "x-csrf-token": csrfToken.csrfToken,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data || "Error fetching usernames");
      }

      if (data.length === 0) {
        StatusAlertService.showError("User Not Found");
        setSearchResults([]);
      } else {
        const usernames = data.map((user) => user.username);
        setSearchResults(usernames);
      }
    } catch (err) {
      StatusAlertService.showError(err.message || "Error searching usernames.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (name) => {
    setLoading(true);
    try {
      const csrfToken = await getCookie();
      const res = await fetch("/api/user/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken.csrfToken,
        },
        body: JSON.stringify({ friendUsername: name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || data || "Error sending friend request."
        );
      }

      setFriendRequests((prev) => [...prev, name]);
      StatusAlertService.showSuccess("Friend request sent successfully.");
    } catch (err) {
      StatusAlertService.showError(
        err.message || "Error sending friend request."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (friendName) => {
    setLoading(true);
    try {
      const csrfToken = await getCookie();
      const res = await fetch("/api/user/accept-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken.csrfToken,
        },
        body: JSON.stringify({ friendUsername: friendName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || data || "Error accepting friend request"
        );
      }

      setAddedFriends((prev) => [...prev, friendName]);
      setIncomingRequests((prev) => prev.filter((f) => f !== friendName));

      StatusAlertService.showSuccess("Friend request accepted.");
    } catch (err) {
      StatusAlertService.showError(
        err.message || "Error accepting friend request."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendName) => {
    setLoading(true);
    try {
      const csrfToken = await getCookie();
      const res = await fetch("/api/user/remove-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken.csrfToken,
        },
        body: JSON.stringify({ friendUsername: friendName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data || "Error removing friend");
      }

      setAddedFriends((prev) => prev.filter((f) => f !== friendName));
      setFriendRequests((prev) => prev.filter((f) => f !== friendName));

      StatusAlertService.showSuccess("Friend removed successfully.");
    } catch (err) {
      StatusAlertService.showError(err.message || "Error removing friend.");
    } finally {
      setLoading(false);
    }
  };

  // Expose the handlers using useImperativeHandle
  useImperativeHandle(ref, () => ({
    handleAddFriend,
    handleAcceptRequest,
    handleRemoveFriend,
  }));

  return (
    <div>
      <StatusAlert />
      <div className="titleContainer">
        <h2 className="title">Manage Friends List</h2>
      </div>
      <div className="friendWrapper">
        {/* Section 1: Search for a Friend */}
        <div className="friend-div">
          <div className={"titleContainer"}>
            <div className="home-title">Add New Friend</div>
          </div>
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a username"
            />
            <div className={"buttonContainer"}>
              <button className="home-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
          <div>
            <ul
              className={
                searchResults.length > 0 ? "searchResultList" : "emptyResults"
              }
            >
              {searchResults.map((name, index) => (
                <li key={index}>
                  <span className="friend">{name}</span>
                  {!addedFriends.includes(name) &&
                    !friendRequests.includes(name) &&
                    !incomingRequests.includes(name) && (
                      <button
                        className="add-btn"
                        onClick={() => handleAddFriend(name)}
                      >
                        Add Friend
                      </button>
                    )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 2: Friend Requests */}
        <div className="friend-div">
          <div className={"titleContainer"}>
            <div className="home-title">Friend Requests</div>
          </div>
          <div>
            <ul className="resultList">
              {incomingRequests
                .filter((friend) => !addedFriends.includes(friend))
                .map((friend, index) => (
                  <li key={index}>
                    <span className="friend">{friend}</span>
                    <button
                      className="add-btn"
                      onClick={() => handleAcceptRequest(friend)}
                    >
                      Accept
                    </button>
                    <button
                      className="small-delete-btn"
                      onClick={() => handleRemoveFriend(friend)}
                    >
                      Decline
                    </button>
                  </li>
                ))}

              {friendRequests
                .filter((friend) => !addedFriends.includes(friend))
                .map((friend, index) => (
                  <li key={index}>
                    <span className="friend">{friend}</span>
                    <button
                      className="small-delete-btn"
                      onClick={() => handleRemoveFriend(friend)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Section 3: Added Friends */}
        <div className="friend-div">
          <div className={"titleContainer"}>
            <div className="home-title">Added Friends</div>
          </div>
          <div>
            <ul className="resultList">
              {addedFriends.length > 0 ? (
                addedFriends.map((friend, index) => (
                  <li key={index}>
                    <span className="friend">{friend}</span>
                    <button
                      className="small-delete-btn"
                      onClick={() => handleRemoveFriend(friend)}
                    >
                      Remove
                    </button>
                  </li>
                ))
              ) : (
                <div className="emptyResults"></div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Friends;
