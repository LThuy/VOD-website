import React, { useState, useEffect } from "react";
import "../../Style/Parts/Comments.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CommentSection = ({ userId, filmId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    // Check if the user is logged in
    const isLoggedIn = !!userId;
    console.log(filmId)

    // Fetch comments when the component mounts
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/comments/${filmId}`);
                const result = await response.json();
                if (response.ok) {
                    console.log("Fetched comments:", result.comments); // Debug log
                    setComments(result.comments || []); // Ensure comments is always an array
                    console.log(comments[0])
                } else {
                    console.error("Error fetching comments:", result.message);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [filmId]);

    const handleInputChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If the user is not logged in, show a toast reminder
        if (!isLoggedIn) {
            toast.error("Please log in to post a comment!");
            return;
        }
        if (newComment.trim()) {
            try {
                const response = await fetch("http://localhost:5000/comments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        filmId: filmId,
                        content: newComment,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    setComments([result.comment, ...comments]);
                    setNewComment("");
                    toast.success("Comment posted successfully!"); // Show success toast
                } else {
                    toast.error(result.message || "Failed to post comment."); // Show error toast
                }
            } catch (error) {
                console.error("Error submitting comment:", error);
                toast.error("An error occurred while posting the comment.");
            }
        }
    };

    return (
        <div className="comment-section">
            <div className="comment-container">
                <div className="comment-container-grid">
                    <div className="row comment-header">
                        <p>
                            <span id="cmt-amount">{comments.length}</span> comments
                        </p>
                    </div>

                    <div className="row comment-content mt-4">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                name="cmt"
                                id="cmt-box"
                                cols="100"
                                rows="4"
                                placeholder="Write your comment here"
                                value={newComment}
                                onChange={handleInputChange}
                            ></textarea>
                            <button className="submit-comment-btn" type="submit">
                                Post
                            </button>
                        </form>
                    </div>

                    {/* Display Comments */}
                    <div className={`comments-container ${comments.length > 0 ? 'haveComments' : ''}`}>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="comment">
                                    <p style={{display: "inline-block"}}><strong>{comment.user?.username || "Anonymous"}</strong>:</p>
                                    <p style={{display: "inline-block", marginLeft: "16px"}}>{comment.content}</p>
                                    <p style={{marginTop: '-16px'}}><small>{new Date(comment.createdAt).toLocaleString()}</small></p>
                                </div>
                            ))
                        ) : (
                            <p>No comments available</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CommentSection;
