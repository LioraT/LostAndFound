import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserPageSize } from "../utils/user";
import styles from "../styles/theme.module.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState("");

  const { token } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    const loadPageSize = async () => {
      const size = await getUserPageSize(token);
      setPageSize(size);
    };
    loadPageSize();
  }, []);

  const handleSearch = async (page = 0) => {
    setError("");
    
    if (!token) {
      navigate(`/login`);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/protected/users?search=${encodeURIComponent(query)}&limit=${pageSize}&skip=${page * pageSize}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Search failed.");
        return;
      }

      setResults(data.users || []);
      setTotal(data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <>
      <div className={styles.userSearchContainer}>
        <h2>Search Users</h2>
        <div className={styles.userSearchInputs}>
          <input
            type="text"
            placeholder="Search by username, name, or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.userSearchInput}
          />
          <button
            onClick={() => handleSearch(0)}
            className={styles.userSearchButton}
          >
            Search
          </button>
        </div>

        {error && <p className={styles.userSearchError}>{error}</p>}

        {results.length > 0 && (
          <table className={styles.userSearchTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {results.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => navigate(`/edit-user/${user._id}`)}
                  className={styles.userRow}
                >
                  <td>{user.username}</td>
                  <td>{user.first_name} {user.family_name}</td>
                  <td>{user.email}</td>
                  <td>{user.is_admin ? "Yes" : "No"}</td>
                  <td>{user._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {results.length > 0 && (
        <div className={styles.userPagination}>
          <button
            onClick={() => handleSearch(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            onClick={() => handleSearch(currentPage + 1)}
            disabled={(currentPage + 1) * pageSize >= total}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
