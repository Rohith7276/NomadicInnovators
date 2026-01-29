import { collection, doc } from "firebase/firestore" 
import { fireDB } from "@/app/firebase/firebaseConfig";
import { getDoc, addDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

 
export async function GET(req, {params}) {
  let {id} = params
  try {
    const docRef = doc(fireDB, "state", id)
    const snapshot = await getDoc(docRef);
    if (snapshot.empty) {
      notFound();
    }   
    console.log(snapshot.data())
      return new Response(JSON.stringify(snapshot.data()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }); 
  } catch (error) {
    console.error("Error fetching data: ", error);
    notFound();
  }
}
// export async function GET() {
//   try {
//     const snapshot = await getDocs(collection(fireDB, 'jsonData'));
//     if (snapshot.empty) {
//       notFound();
//     } 
//     let docRef = await addDoc(collection(fireDB, "IndiaPackages"), snapshot.docs[0].data().IndiaPackages)
//     console.log(docRef.id)
     
//     // Return the data of the first document, or notFound if no docs
//     if (snapshot.docs.length > 0) {
//       return new Response(JSON.stringify(snapshot.docs[0].data()), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } else {
//       notFound();
//     }
//   } catch (error) {
//     console.error("Error fetching data: ", error);
//     notFound();
//   }
// }