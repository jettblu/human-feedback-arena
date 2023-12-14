// loading placeholder for the leaderboard

export default function LeaderBoardLoading() {
  // make a dynamic request to get all experiments... we don't want to cache this
  return (
    <div className="w-full">
      <h1 className="text-xl text-red-500">Experiment Leaderboard</h1>
      <div className="flex flex-row w-full space-x-2">
        <div className="animate-pulse bg-yellow-600/30 h-6 w-6 my-auto"></div>
        <div className="text-xl text-gray-400">Loading experiments...</div>
        {/* square that changes color */}
      </div>
    </div>
  );
}
