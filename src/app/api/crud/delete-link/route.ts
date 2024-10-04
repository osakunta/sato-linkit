import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { id }: { id: string } = await request.json();

    const linkDoc = doc(db, "links", id);

    await deleteDoc(linkDoc);

    return NextResponse.json(
      { message: "Link deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting link: ", error);

    return new NextResponse("Error deleting link", { status: 500 });
  }
}
