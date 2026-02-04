import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore"; 
import { fireDB } from "../app/firebase/firebaseConfig" 
import { useAuth } from "@/app/contexts/authContext";

const CommentList = ({ comments, id}) => { 
    const {currentUser} = useAuth() 
    console.log("comments", comments)
    const handleDelete = async (ids) => {
        try {
            await deleteDoc(doc(fireDB, `comments${id}`, ids));
        } catch (error) {
            console.error("Error deleting comment: ", error);
        }
    };
    return (
<>
        <div     className="  comment-list dark:hidden  lightscroll overflow-scroll min-h-[20vh] max-h-[50vh]  text-black dark:text-white bg-white shdfadow-lg dark:bg-[#1e0700]   my-4" style={{ padding: "10px" , borderRadius: "5px" }}>
            {comments?.length ? comments?.map((comment) => (
                <div key={comment.id}     className="  comment flex  border-black dark:border-[#640303] border justify-between text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700]" style={{ marginBottom: "10px", padding: "10px" , borderRadius: "5px" }}>
                    <div>
                        {comment?.currentUser === currentUser.email ? <h1     className="  text-green-600">You</h1> : <h1     className="  text-gray-400">{comment?.currentUser}</h1>}
                    <p style={{ margin: "0 0 5px 0" }}>{comment.content}</p>
                    <small     className="  text-gray-500" >{comment.timestamp?.toDate().toLocaleString()}</small>
                        </div>
                    {comment?.currentUser === currentUser.email && <button     className="   curZ  " onClick={() => handleDelete(comment.id)}><MdDelete     className="    w-[1.6rem]"/></button>}
                </div>
            )) : <div     className="  text-black flex h-[20vh] w-full justify-center items-center"> No comments yet</div>}

        </div>
        <div     className="  comment-list hidden dark:block scroll overflow-scroll min-h-[20vh] max-h-[50vh]  text-black dark:text-white bg-white shdfadow-lg dark:bg-[#1e0700]   my-4" style={{ padding: "10px" , borderRadius: "5px" }}>
            {comments?.length ? comments?.map((comment) => (
                <div key={comment.id}     className="  comment flex  border-black dark:border-[#640303] border justify-between text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700]" style={{ marginBottom: "10px", padding: "10px" , borderRadius: "5px" }}>
                    <div>
                    {comment?.currentUser === currentUser.email ? <h1     className="  text-green-600">You</h1> : <h1     className="  text-gray-400">{comment?.currentUser}</h1>}
                    <p style={{ margin: "0 0 5px 0" }}>{comment.content}</p>
                    <small     className="  text-yellow-100" >{comment.timestamp?.toDate().toLocaleString()}</small>
                    </div>
                    {comment?.currentUser === currentUser.email && <button     className="   curZ  "  onClick={() => handleDelete(comment.id)}><MdDelete     className="    w-[1.6rem]"/></button>}
                </div>
            )) : <div     className="  text-black flex h-[20vh] w-full justify-center dark:text-white items-center"> No comments yet</div>}

        </div>
        </>
    );
};

export default CommentList;