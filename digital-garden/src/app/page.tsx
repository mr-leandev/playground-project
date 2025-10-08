export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight">Digital Garden</h1>
        <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70">
          A relaxing generative playground. Plant seeds with your cursor and watch
          fractal-like branches grow in real time. Built with the Next.js App Router.
        </p>
      </div>

      <div className="flex gap-4 flex-wrap items-center justify-center">
        <a
          href="/garden"
          className="px-5 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition"
        >
          Open the Garden
        </a>
        <a
          href="/api/garden/suggestions"
          className="px-5 py-3 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          Get a random idea
        </a>
      </div>

      <p className="text-xs text-black/50 dark:text-white/50">
        Tip: Try clicking and dragging in the garden. Press R to reset.
      </p>
    </main>
  );
}
