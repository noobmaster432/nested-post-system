"use client";

import { useState } from "react";

export default function PostComment({ parentId, setFetchAgain, fetchAgain }) {
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Handle form submission to create a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, parentId }),
      });

      const createdPost = await response.json();
      setTitle(""); // Reset title field
      setShowForm(false); // Hide form after submission
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <div className="">
      {/* Button to show the form */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Comment
        </button>
      )}

      {/* Form to add a comment */}
      {showForm && (
        <div className="mt-4">
          <h1 className="text-2xl font-bold mb-4">Add a comment</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                Comment Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter comment title"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Comment
            </button>

            {/* Cancel button */}
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
