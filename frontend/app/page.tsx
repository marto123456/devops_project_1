export default async function Home() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/hello", 
    { cache: "no-store" }
  );

  const data = await res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center space-y-8 max-w-2xl">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Frontend (Next.js) Test
          </h1>
          <div className="h-1 w-20 bg-black mx-auto rounded-full" />
        </div>

        {/* API Message Section */}
        <div className="space-y-4">
          <p className="text-lg text-gray-500 font-medium uppercase tracking-wide">
            Message from backend
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {data.message}
          </p>
        </div>

        {/* Environment Badge */}
        <div className="pt-12">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            TESTED MULTISTAGE BUILD env
          </span>
        </div>

      </div>
    </main>
  );
}