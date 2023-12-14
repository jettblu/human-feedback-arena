export default function DisplayExperimentLoading() {
  return (
    <div>
      <div className="flex flex-row w-full space-x-2">
        <div className="animate-pulse bg-yellow-600/30 h-6 w-6 my-auto"></div>
        <div className="text-xl text-gray-400">Loading experiment data...</div>
      </div>
      <p className="text-gray-200">
        This may take a few seconds as the server wakes up.
      </p>
    </div>
  );
}
