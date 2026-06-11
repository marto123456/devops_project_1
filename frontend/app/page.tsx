export default async function Home() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/hello",
    { cache: "no-store" }
  );

  const data = await res.json();

  return (
    <main>
      <h1>Frontend (Next.js)</h1>
      <p>Message from backend: {data.message}</p>
    </main>
  );
}