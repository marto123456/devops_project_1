export default async function Home() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/hello",
    { cache: "no-store" }
  );

  const data = await res.json();

  return (
    <main>
      <h1>Frontend (Next.js) Test</h1>
      <p>Message from backend: {data.message}</p>
      <p>TESTED MULTISTAGE BUILD</p>
    </main>
  );
}