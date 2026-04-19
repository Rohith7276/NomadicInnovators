import { doc, getDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

import { fireDB } from "@/app/firebase/firebaseConfig"
import { createCacheKey, getCachedJSON, setCachedJSON } from "@/app/lib/redisCache"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

 
export async function GET(req, {params}) {
  let {id} = params
  try {
    const cacheKey = createCacheKey("state", id)
    const cachedData = await getCachedJSON(cacheKey)

    if (cachedData !== null) {
      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
        },
      })
    }

    const docRef = doc(fireDB, "state", id)
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "State not found" }, { status: 404 })
    }   

    const data = snapshot.data()

    await setCachedJSON(cacheKey, data)

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
      },
    }) 
  } catch (error) {
    console.error("Error fetching data: ", error);
    return NextResponse.json({ error: "Failed to fetch state" }, { status: 500 })
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