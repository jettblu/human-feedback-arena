"use client";

import { IExperiment } from "@/types";
import { useState, useEffect } from "react";

export default function TrainingPendingView(params: {
  experiment: IExperiment;
}) {
  // we expect the experiment to be done training in three minutes
  const totalExpectedTimeSeconds = 3 * 60;
  const { experiment } = params;
  // this is in the form of hours:minutes:seconds
  const timeSinceUploadedInitial = experiment.training_data_uploaded_at;
  const [hours, minutes, seconds] = timeSinceUploadedInitial.split(":");
  const totalSeconds =
    parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  // evry second add one to the total seconds
  const [currSeconds, setCurrSeconds] = useState(totalSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState(
    totalExpectedTimeSeconds - totalSeconds
  );

  // every second, update the currSeconds
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       const newCurrSeconds = currSeconds + 1;
  //       setCurrSeconds(newCurrSeconds);
  //       setSecondsRemaining(totalExpectedTimeSeconds - newCurrSeconds);
  //     }, 1000);
  //   }, []);

  return (
    <div className="text-left mt-12">
      <h3 className="text-md bg-yellow-500/80 w-fit mb-1">Training Pending</h3>
      <p className="text-lg text-gray-400">
        Autonomous agents are still training on observations of human gameplay.
      </p>
      {secondsRemaining > 0 && (
        <p className="text-lg text-gray-200">
          Expected time remaining:{" "}
          <span className="text-yellow-500">
            {secondsRemaining > 0 ? secondsRemaining : 0} seconds
          </span>
        </p>
      )}
      {secondsRemaining < -60 && (
        <p className="text-sm text-red-500 mt-6">
          This is taking longer than expected. Server resources may have been
          exceeded during training which would result in your models not being
          saved. Please try again later.
        </p>
      )}
      {/* option to refresh the page */}
      <button
        onClick={() => {
          window.location.reload();
        }}
        className="text-lg text-gray-200 hover:underline hover:text-blue-500"
      >
        Refresh Page
      </button>
    </div>
  );
}
