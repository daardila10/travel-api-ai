"use client";

import { useCompletion } from "ai/react";

export default function Home() {
  const { completion, input, handleSubmit, handleInputChange } = useCompletion({
    api: "/api/completion",
  });
  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          value={input}
          placeholder="What to do where"
          onChange={handleInputChange}
        />
      </form>
      {completion ? (
        <div className="text-lg">{completion}</div>
      ) : (
        <div className="text-lg">No completion yet</div>
      )}
    </div>
  );
}
