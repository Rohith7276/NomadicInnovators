import { fireDB } from "@/app/firebase/firebaseConfig";
import { getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";

const dataFetch = async () => {
    try {
      let x = await getDocs(collection(fireDB, 'jsonData')); 
      if (x.empty) {
        notFound(); 
      } 
    } catch (error) {
      console.error("Error fetching data: ", error);
      notFound();
    }
    return x.docs[0]
  }
const getComments = async(num)=>{
    let comment
    try{
         comment = comment + num.toString()
        let x = await getDocs(collection(fireDB, 
            comment
         ))
         if(x.empty) notFound()

    } catch(error){
        console.error("Error fetching data: ", error);
        notFound();
      }
      return comment
}

export {dataFetch, getComments}