import { useState, useEffect } from "react";

function UserSearch() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
          fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`),
        ]);

        if (!userRes.ok || !postsRes.ok) {
          throw new Error("Virhe tietojen hakemisessa");
        }

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        setUser(userData);
        setPosts(postsData.slice(0, 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const handleNext = () => {
    if (userId < 10) setUserId((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (userId > 1) setUserId((prev) => prev - 1);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Käyttäjän tiedot ja postaukset</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={handlePrev} disabled={userId <= 1 || loading}>
          Edellinen
        </button>
        <span style={{ margin: "0 15px", fontWeight: "bold" }}>
          ID: {userId}
        </span>
        <button onClick={handleNext} disabled={userId >= 10 || loading}>
          Seuraava
        </button>
      </div>

      <hr />

      {loading && <p>Ladataan tietoja...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && user && (
        <div>
          <h3>{user.name}</h3>
          <p>
            <strong>Kaupunki:</strong> {user.address?.city}
          </p>

          <h4>Postaukset:</h4>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserSearch;
