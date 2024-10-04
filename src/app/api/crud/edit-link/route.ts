import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const {
      id,
      name,
      url,
      order,
    }: { id: string; name: string; url: string; order: number } =
      await request.json();

    const linkDoc = doc(db, "links", id);

    const docSnapshot = await getDoc(linkDoc);
    if (!docSnapshot.exists()) {
      console.error(`Document with ID ${id} does not exist.`);
      return new NextResponse("Document not found", { status: 404 });
    }

    await updateDoc(linkDoc, { name, url, order });

    return NextResponse.json({ id, name, url, order }, { status: 200 });
  } catch (error) {
    console.error("Error updating document: ", error);
    return new NextResponse("Error updating document", { status: 500 });
  }
}
