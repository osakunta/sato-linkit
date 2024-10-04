import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { NextResponse } from "next/server";

interface Link {
  name: string;
  url: string;
  order: number;
}

export async function POST(request: Request) {
  try {
    const { name, url, order }: Link = await request.json();

    const linksCollection = collection(db, "links");

    const docRef = await addDoc(linksCollection, { name, url, order });

    return NextResponse.json(
      { id: docRef.id, name, url, order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding document: ", error);

    return new NextResponse("Error adding document", { status: 500 });
  }
}
