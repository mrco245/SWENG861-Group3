// eslint-disable-next-line no-unused-vars
import React from "react";
import AddFriend from "../components/AddFriend";
import { useState } from "react";

export default function Friends() {
    const [friends, setFriends] = useState([]);

    function addFriend(name) {
        setFriends(friends => [...friends, {id: Date.now(), username}]);
    }
  return (
    <div className="container">
        <AddFriend onAddFriend={addFriend}/>
    </div>
  );
}
