export default function Home({ params }: { params: { slug: string } }) {
  const experiment_name = params.slug;
  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-left text-gray-400/80">
          {experiment_name}
        </h1>
        <h1 className="text-4xl font-bold text-left">Historical Stats</h1>
        <p className="text-xl text-left">
          Historical stats from the {experiment_name} experiment.
        </p>
      </div>
    </main>
  );
}
