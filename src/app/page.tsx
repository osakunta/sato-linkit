"use client";
import Link from "next/link";
import { orderBy, query } from "firebase/firestore";
import { useFirestoreCollectionData } from "reactfire";
import { useLinksCollection, withFirebase } from "@/lib/firebase";
import LoadingSpinner from "@/components/loading-spinner";

function Home() {
  const linksCollection = useLinksCollection();
  const { status, data: links } = useFirestoreCollectionData(
    query(linksCollection, orderBy("order"))
  );

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "error") {
    return <span>Something went wrong</span>;
  }

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          passHref
        >
          <div className="flex items-center justify-between bg-gray-50 p-4 mb-2 rounded-lg shadow-md">
            {link.name}
          </div>
        </Link>
      ))}
    </>
  );
}

export default withFirebase(Home);
