"use client";
import AddLinkDialog from "@/components/add-link-dialog";
import DeleteLinkDialog from "@/components/delete-link-dialog";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Link {
  id: string;
  name: string;
  url: string;
}

function Admin() {
  const { data: session } = useSession();
  const [links, setLinks] = useState<Link[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedUrl, setEditedUrl] = useState<string>("");

  useEffect(() => {
    const fetchLinks = async () => {
      const response = await fetch("/api/crud/get-links");
      if (response.ok) {
        const linksList = await response.json();
        setLinks(linksList);
      } else {
        console.error("Failed to fetch links");
      }
    };

    fetchLinks();
  }, []);

  const handleEdit = (id: string, name: string, url: string) => {
    setEditingId(id);
    setEditedName(name);
    setEditedUrl(url);
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch("/api/crud/edit-link", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name: editedName,
          url: editedUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save link");
      }

      const updatedLink = await response.json();
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === id
            ? { ...link, name: updatedLink.name, url: updatedLink.url }
            : link
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error saving link:", error);
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center bg-[url('../assets/sato-bg-desktop.png')] bg-cover bg-center min-h-screen min-w-full">
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-[url('../assets/sato-bg-desktop.png')] bg-cover bg-center min-h-screen min-w-full">
      <div className="w-2/5 p-4">
        {/* Add Link Button with Dialog */}

        <AddLinkDialog links={links} setLinks={setLinks} />
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
                    onClick={() => handleEdit(link.id, link.name, link.url)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-sm"
                  >
                    Edit
                  </button>
                  <DeleteLinkDialog
                    links={links}
                    setLinks={setLinks}
                    linkId={link.id}
                    linkName={link.name}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
