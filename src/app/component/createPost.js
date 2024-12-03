"use client";

import { useState, useEffect } from "react";
import PostComment from "./createComment";

export default function PostComponent() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);
  // const [loading, setLoading] = useState(false);

  // Fetch posts from the server
  const fetchPosts = async () => {
    try {
      // setLoading(true);
      const response = await fetch("/api/post");
      const data = await response.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      // setLoading(false);
    }
  };

  // Fetch posts when the component mounts or fetchAgain updates
  useEffect(() => {
    fetchPosts();
  }, [fetchAgain]);

  // Handle new post submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Post title cannot be empty!");
      return;
    }

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setFetchAgain(!fetchAgain);
        setTitle("");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  // Manage the visibility of comments and sub-comments
  const [visibleComments, setVisibleComments] = useState({});

  const toggleComments = (commentId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Recursive function to render nested comments
  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div key={comment._id} className="mt-2 pl-4 border-l-2 border-gray-300">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{comment.title}</p>
          <button
            className="text-blue-500 hover:underline text-xs"
            onClick={() => toggleComments(comment._id)}
          >
            {visibleComments[comment._id] ? "Hide Replies" : "Show Replies"} (
            {comment.subComments?.length || 0})
          </button>
        </div>

        {/* Add Comment for this level */}
        <PostComment
          parentId={comment._id}
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
        />

        {/* Show sub-comments if toggled */}
        {visibleComments[comment._id] &&
          Array.isArray(comment.subComments) &&
          comment.subComments.length > 0 && (
            <div className="mt-2">{renderComments(comment.subComments)}</div>
          )}
      </div>
    ));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create a post</h1>

      {/* Create new post form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add it
        </button>
      </form>

      {/* Posts and comments */}
      <div className="space-y-4">

        {posts.length === 0 && (
          <p className="text-center text-gray-500">loading...</p>
        
        )}


        {posts.map((post) => (
          <div
            key={post._id}
            className="border p-4 rounded bg-white shadow-md space-y-2"
          >
            {/* Post Title */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{post.title}</h2>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-4">
              
              <button
                className="text-blue-500 hover:underline"
                onClick={() => toggleComments(post._id)}
              >
                Comments ({post.comments?.length || 0})
              </button>
            </div>

            {/* Comments */}
            {visibleComments[post._id] && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Comments</h3>
                {renderComments(post.comments || [])}
              </div>
            )}

            {/* Add Comment */}
            <PostComment
              parentId={post._id}
              setFetchAgain={setFetchAgain}
              fetchAgain={fetchAgain}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
