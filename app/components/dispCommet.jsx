import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
// import { fireDB } from "./firebase";
import { fireDB } from '../firebase/firebaseConfig'
import { useSelector } from 'react-redux'

const CommentList = () => {
    const counterValue = useSelector(state => state.counter.value);
    const [comments, setComments] = useState([]);
    const [user, setuser] = useState(null);

    useEffect(() => {
        const q = query(collection(fireDB, `comments${counterValue}`), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            // console.log(JSON.parse(storedUser).user.email)
            setuser(JSON.parse(storedUser).name);
        }
        return () => unsubscribe(); // Clean up the listener on unmount
    }, [counterValue]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(fireDB, `comments${counterValue}`, id));
        } catch (error) {
            console.error("Error deleting comment: ", error);
        }
    };
    return (
        <div className="comment-list scroll overflow-scroll min-h-[20vh] max-h-[50vh] bg-[#1e0700]   my-11" style={{ padding: "10px" , borderRadius: "5px" }}>
            {comments.length ? comments.map((comment) => (
                <div key={comment.id} className="comment bg-[#2d1000]" style={{ marginBottom: "10px", padding: "10px", border: "1px solid #640303", borderRadius: "5px" }}>
                    {comment.user === user ? <h1 className="text-green-600">You</h1> : <h1 className="text-gray-400">{comment.user}</h1>}
                    <p style={{ margin: "0 0 5px 0" }}>{comment.content}</p>
                    <small className="text-yellow-100" >{comment.timestamp?.toDate().toLocaleString()}</small>
                    {comment.user === user && <button onClick={() => handleDelete(comment.id)}>Delete</button>}
                </div>
            )) : <div className="text-black flex h-[20vh] w-full justify-center items-center"> No comments yet</div>}

        </div>
    );
};

export default CommentList;