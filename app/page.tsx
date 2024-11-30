export default async function Home() {
  // Pobranie danych z API (SSR - Server-Side Rendering)
  const response = await fetch('http://localhost:4000/user', {
    cache: 'no-store', // Opcja "no-store" wyłącza cache, aby dane zawsze były aktualne
  });
  const users = await response.json();

  return (
      <main>
        <h1>Lista użytkowników</h1>
        <ul>
          {users.map((user: { id: number; name: string; email: string }) => (
              <li key={user.id}>{user.name}, {user.email}</li>
          ))}
        </ul>
      </main>
  );
}