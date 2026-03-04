import { useEffect, useState } from "react";

function Postaukset() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
        );

        // TARKISTUS: Jos HTTP-status ei ole ok, heitetään virhe
        if (!response.ok) {
          throw new Error(`Haku epäonnistui: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        // VIRHEEN KÄSITTELY: Tallennetaan virheviesti tilaan
        setError(err.message);
      } finally {
        // LATAUKSEN LOPETUS: finally suoritetaan aina (onnistui haku tai ei)
        // Tämä korjaa bugin, jossa lataus jäi ikuisesti päälle
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Postaukset</h2>

      {loading && <p>Ladataan...</p>}

      {error && <p style={{ color: "red" }}>Virhe: {error}</p>}

      {!loading && !error && (
        <ul>
          {posts.slice(0, 10).map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Postaukset;
