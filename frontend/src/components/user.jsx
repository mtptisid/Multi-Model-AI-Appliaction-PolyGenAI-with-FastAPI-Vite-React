import React, { useEffect, useState } from "react";
import axios from "axios";

function User() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/user/all")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError("Unexpected response format");
          console.error("Response is not an array:", response.data);
        }
      })
      .catch((error) => {
        setError("Failed to fetch users");
        console.error("API error:", error);
      });
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {Array.isArray(users) && users.map(user => (
          <li key={user.id}>
            <strong>ID:</strong> {user.id} | <strong>Email:</strong> {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default User;