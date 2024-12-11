"use client";
import AddLinkDialog from "@/components/add-link-dialog";
import DeleteLinkDialog from "@/components/delete-link-dialog";
import LoadingSpinner from "@/components/loading-spinner";
import { Link, useLinksCollection, withFirebase } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  query,
  orderBy,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useAuth, useFirestoreCollectionData, useSigninCheck } from "reactfire";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const { status, data } = useSigninCheck();
  if (status === "loading") {
    return <LoadingSpinner />;
  }
  if (data.signedIn === false) {
    return (
      <div className="flex justify-center">
        <button
          onClick={() => {
            const provider = new GoogleAuthProvider();
            provider.addScope(
              "https://www.googleapis.com/auth/cloud-identity.groups.readonly"
            );
            signInWithPopup(auth, provider);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    );
  }
  return <>{children}</>;
};

const AdminContent = () => {
  const linksCollection = useLinksCollection();
  const { status, data: links } = useFirestoreCollectionData(
    query(linksCollection, orderBy("order"))
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedUrl, setEditedUrl] = useState<string>("");
  const [editedOrder, setEditedOrder] = useState<number>();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "error" || !links) {
    return <span>Something went wrong</span>;
  }

  const handleEdit = (id: string, name: string, url: string, order: number) => {
    setEditingId(id);
    setEditedName(name);
    setEditedUrl(url);
    setEditedOrder(order);
  };

  const addLink = async (newLink: Omit<Link, "id">) => {
    await addDoc(linksCollection, newLink);
  };

  const deleteLink = async (id: string) => {
    await deleteDoc(doc(linksCollection, id));
  };

  const handleSave = async (id: string) => {
    await setDoc(doc(linksCollection, id), {
      id,
      name: editedName,
      url: editedUrl,
      order: editedOrder || 0, // TODO CHANGE
    });
    setEditingId(null);
  };

  return (
    <>
      <AddLinkDialog links={links} addLink={addLink} />
      {/* Display Links */}
      {links.map((link) => (
        <div
          key={link.id}
          className="flex items-center justify-between bg-gray-50 p-4 mb-2 rounded-lg shadow-md"
        >
          {editingId === link.id ? (
            <div className="flex flex-col">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mb-2 p-2 border border-gray-300 rounded"
                placeholder="Edit name"
              />
              <input
                type="text"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                className="mb-2 p-2 border border-gray-300 rounded"
                placeholder="Edit URL"
              />
              <input
                type="number"
                value={editedOrder}
                onChange={(e) =>
                  setEditedOrder(parseInt(e.target.value, 10) || 0)
                } // Handle order input
                className="mb-2 p-2 border border-gray-300 rounded"
                placeholder="Edit order"
              />
            </div>
          ) : (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {link.name}
            </a>
          )}
          {/* CRUD buttons */}
          <div className=" flex flex-row justify-center items-center gap-4">
            {editingId === link.id ? (
              <button
                onClick={() => handleSave(link.id)}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-sm"
              >
                Save
              </button>
            ) : (
              <div className="flex flex-row justify-center items-center gap-4">
                <button
                  onClick={() =>
                    handleEdit(link.id, link.name, link.url, link.order)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-sm"
                >
                  Edit
                </button>
                <DeleteLinkDialog
                  links={links}
                  deleteLink={deleteLink}
                  linkId={link.id}
                  linkName={link.name}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

function Admin() {
  return (
    <WithAuth>
      <AdminContent />
    </WithAuth>
  );
}

export default withFirebase(Admin);
