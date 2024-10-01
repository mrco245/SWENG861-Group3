import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Friends.css";

// TODO SWENG-50: Update events with calls to the database rather than using Mock Data

const Friends = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currUser = location.state?.user;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);

  const handleSearch = () => {
    const mockResults = ["Alice", "Bob", "Charlie", "David"].filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(mockResults);
  };

  const handleAddFriend = (friend) => {
    if (!addedFriends.includes(friend)) {
      setAddedFriends([...addedFriends, friend]);
    }
  };

  const handleRemoveFriend = (friend) => {
    const updatedFriends = addedFriends.filter((f) => f !== friend);
    setAddedFriends(updatedFriends);
  };

  return (
    <div className="mainWrapper">
      <div className="container1">
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
            <button className="home-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div>
          <ul
            className={searchResults.length > 0 ? "resultList" : "emptyResults"}
          >
            {searchResults.map((name, index) => (
              <li key={index}>
                <span className="friend">{name}</span>
                {!addedFriends.includes(name) && (
                  <button className="add-btn" onClick={() => handleAddFriend(name)}>
                    Add
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container2">
        <div className={"titleContainer"}>
          <div className="home-title">Friends List</div>
        </div>
        <div>
          <ul className="resultList">
            {addedFriends.length === 0 ? (
              <li>No friends added yet!</li>
            ) : (
              addedFriends.map((friend, index) => (
                <li key={index}>
                  <span className="friend">{friend}</span>
                  <button className="small-delete-btn" onClick={() => handleRemoveFriend(friend)}>
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Friends;