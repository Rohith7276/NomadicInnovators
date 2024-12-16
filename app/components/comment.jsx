import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { fireDB } from "../firebase/firebaseConfig";
import { useSelector } from "react-redux";
import Link from "next/link";

const CommentForm = () => {
    const counterValue = useSelector(state => state.counter.value);
    const [comment, setComment] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser).name);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.trim() === "") return;


        try {
            await addDoc(collection(fireDB, `comments${counterValue}`), {
                content: comment,
                user: user,
                timestamp: serverTimestamp(),
            });
            setComment("");  
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    };

    return (
        <>
            {user != null ? (
                <>
                    <form onSubmit={handleSubmit}     className="  comment-form px-[1.5rem] m-auto" style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                                className="  comment-input outline-none max-h-[40vh] min-h-[50px] text-black"
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", resize: "none" }}
                        ></textarea>
                       
                        <button type="submit"     className="  curZ  submit-button font-bold dark:hidden dark:bg-[#5e2700]" style={{ padding: "10px", borderRadius: "5px", border: "none", color: "#fff", cursor: "pointer", backgroundColor: "#031a2c" }}>
                            Post Comment
                        </button>
                        <button type="button"     className="  curZ  submit-button font-bold hidden dark:block dark:bg-[#5e2700]" style={{ padding: "10px", borderRadius: "5px", border: "none", color: "#fff", cursor: "pointer" }} onClick={handleSubmit}>
                            Post Comment
                        </button>
                    </form>
                </>
            ) : (
                <h1    className="  curZ  amsterdam bg-origin-border py-4 text-[#031a2c] curZ  dark:text-[#ffd867] mt-50 text-center w-full text-[3rem] mx-auto mt">
                    Please <Link href={"/SignIn"}     className="  text-blue-400 hover:underline  ">SignIn</Link> to comment
                </h1>
            )}
        </>
    );
};

export default CommentForm;
