import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const linksCollection = collection(db, "links");

    const linkSnapshot = await getDocs(linksCollection);

    const links = linkSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error("Error fetching links: ", error);

    return new NextResponse("Error fetching links", { status: 500 });
  }
}
