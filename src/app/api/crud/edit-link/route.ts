import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  console.log("API Route Hit - Edit Link");
  try {
    const { id, name, url }: { id: string; name: string; url: string } =
      await request.json();

    const linkDoc = doc(db, "links", id);

    const docSnapshot = await getDoc(linkDoc);
    if (!docSnapshot.exists()) {
      console.error(`Document with ID ${id} does not exist.`);
      return new NextResponse("Document not found", { status: 404 });
    }

    await updateDoc(linkDoc, { name, url });

    return NextResponse.json({ id, name, url }, { status: 200 });
  } catch (error) {
    console.error("Error updating document: ", error);
    return new NextResponse("Error updating document", { status: 500 });
  }
}
