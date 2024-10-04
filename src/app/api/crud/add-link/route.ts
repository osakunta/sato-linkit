import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { NextResponse } from "next/server";

interface Link {
  name: string;
  url: string;
}

export async function POST(request: Request) {
  try {
    const { name, url }: Link = await request.json();

    const linksCollection = collection(db, "links");

    const docRef = await addDoc(linksCollection, { name, url });

    return NextResponse.json({ id: docRef.id, name, url }, { status: 201 });
  } catch (error) {
    console.error("Error adding document: ", error);

    return new NextResponse("Error adding document", { status: 500 });
  }
}
