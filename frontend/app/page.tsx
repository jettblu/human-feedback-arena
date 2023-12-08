import Image from "next/image";
import Link from "next/link";
import { Game_Font } from "./layout";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* this div content should be centered in the middle of the page vertically and horizontally */}
      {/* ensure centered */}
      <div className="flex flex-col items-center justify-center min-h-screen max-w-5xl mx-auto lg:-mt-16">
        <div className="flex flex-col items-center justify-center">
          <h1
            className={`text-4xl font-bold text-left text-green-500 text-center ${Game_Font.className}`}
          >
            Preference Arcade
          </h1>
          <p className="text-2xl text-center text-yellow-500">
            Incoporate human preferences into autonomous agents while playing
            online games.
          </p>
          <div className="flex flex-col items-center justify-center">
            <Link href="experiments/new">
              <p className="font-semibold underline my-3 hover:text-blue-600 transition duration-100">
                Begin Training
              </p>
            </Link>
            <Link href="experiments/archive">
              <p className="font-semibold underline my-3 hover:text-blue-600 transition duration-100">
                View Old Experiments
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="max-w-4xl mx-auto w-full">
        <h1 className={`text-4xl font-bold text-left ${Game_Font.className}`}>
          RL Arcade
        </h1>
        <p className="text-xl">
          A browser-based version of reinforcement with human feedback.
        </p>
      </div> */}

      {/* <div className="max-w-4xl w-full flex md:flex-row flex-col space-y-8 md:space-y-0 md:space-x-8 w-full mx-auto my-16">
        <div className="flex flex-col">
          <div className="rounded-tl-lg rounded-tr-lg flex flex-col md:flex-row bg-gray-400/20 mx-auto w-full">
            <Image
              src="/demos/Human feedback jump.gif"
              alt="Backflipping agent"
              className="rounded-tl-lg md:rounded-tr-none rounded-tr-lg w-full md:w-1/2"
              width={300}
              height={300}
            />
            <div className="px-2 my-3">
              <h2 className="font-bold text-2xl">Backflip Challenge</h2>
              <p className="text-lg text-gray-700 mt-2">
                Teach a robot to backflip with human feedback and reinforcement
                learning.
              </p>
              <div className="flex flex-col px-3 mt-2">
                <h3>
                  <span className="font-bold text-gray-700">
                    How this works
                  </span>
                </h3>
                <ul className="list-disc">
                  <li>
                    You will see a task description and two videos of agents
                    attempting to backflip
                  </li>

                  <li>
                    Decide which robot is coming closest to performing the
                    backflip
                  </li>

                  <li>Press the appropriate button</li>
                </ul>
              </div>
              <Link href="review">
                <p className="font-semibold underline my-3 hover:text-purple-600 transition duration-100">
                  Begin Training
                </p>
              </Link>
            </div>
          </div>
          <div className="bg-purple-300/20 rounded-bl-lg rounded-br-lg px-4 pb-16">
            <h2 className="font-bold text-xl text-left my-4">
              Old Experiments
            </h2>
            <ul className="">
              <li className="bg-rounded-md py-2 bg-purple-400/10 px-2 hover:brightness-120">
                <Link
                  href="experiments/archive/test-1"
                  className="font-bold text-slate-700"
                >
                  Test 1
                </Link>
              </li>
            </ul>
          </div>
        </div> */}
      {/* </div> */}
    </main>
  );
}
