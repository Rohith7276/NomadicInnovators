import { collection, getDocs } from "firebase/firestore"
import { fireDB } from "@/app/firebase/firebaseConfig"
import { notFound } from "next/navigation"

export async function GET(req) {
  try {
    const colRef = collection(fireDB, "jsonData")
    const snapshot = await getDocs(colRef)

    if (snapshot.empty) {
      notFound()
    }

    // If you want FIRST document only
    const data = snapshot.docs[0].data()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    console.error("Error fetching data:", error)
    return new Response(
      JSON.stringify({ error: "Failed to fetch data" }),
      { status: 500 }
    )
  }
}
