export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-left">Evaluate Model</h1>
        <p className="text-xl text-left">
          Look at the clips and select the one in which better things happen.
          Only decide on events you actually witness in the clip.
        </p>
        <p>
          <span className="font-bold">Desired Behavior:</span> We want the agent
          to backflip. The backflip should be as smooth as possible and the
          agent should land on its "feet".
        </p>
      </div>
      <div className="max-w-5xl flex md:flex-row flex-col space-y-8 md:space-y-0 md:space-x-8 w-full mx-auto my-16">
        <div className="w-1/2 flex flex-col space-y-6">
          <div className="bg-red-400 h-64 rounded-lg w-full"></div>
          {/* button here */}
          <div className="bg-purple-400/20 h-64 rounded-lg hover:bg-purple-400/40 transition-all duration-100 px-2 py-2 mx-auto w-fit h-fit text-xl hover:cursor-pointer">
            Left is Better
          </div>
        </div>
        <div className="w-1/2 flex flex-col space-y-6">
          <div className="bg-yellow-400 h-64 rounded-lg w-full"></div>
          {/* button here */}
          <div className="bg-purple-400/20 h-64 rounded-lg hover:bg-purple-400/40 transition-all duration-100 px-2 py-2 mx-auto w-fit h-fit text-xl hover:cursor-pointer">
            Right is Better
          </div>
        </div>
      </div>
    </main>
  );
}
