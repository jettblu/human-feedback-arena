import { LeaderBoard } from "@/components/experiments/LeaderBoard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* this div content should be centered in the middle of the page vertically and horizontally */}
      {/* ensure centered */}
      <div className="flex flex-col min-h-screen max-w-5xl mx-auto mt-[20vh]">
        <div className="flex flex-col items-center justify-center">
          <h1
            className={`text-4xl font-bold text-left text-green-500 text-center`}
          >
            Preference Arcade
          </h1>
          <p className="text-2xl text-center text-yellow-500">
            Incoporate human preferences into autonomous agents while playing
            online games.
          </p>
          {/* coming soon notification */}
          {/* <div className="text-center text-xl text-gray-400">
            Coming soon (as in a few hours)! 🐍
          </div> */}
          <div className="flex flex flex-col items-center justify-center">
            <Link href="experiments/new">
              <p className="font-semibold underline my-3 hover:text-blue-600 transition duration-100">
                Begin Training
              </p>
            </Link>
            {/* open in new tab */}
            <Link
              href="https://github.com/jettblu/preference-arcade"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="font-semibold underline my-3 hover:text-blue-600 transition duration-100">
                View Code
              </p>
            </Link>

            <Link href="experimentts/pure-rl-agent">
              <p className="font-semibold underline my-3 hover:text-blue-600 transition duration-100">
                View RL Agent
              </p>
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-5xl w-full mt-8 border border-2 px-2 py-2 border-yellow-500/80">
          <LeaderBoard />
        </div>
      </div>
    </main>
  );
}
