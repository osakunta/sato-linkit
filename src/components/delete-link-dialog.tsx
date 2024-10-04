import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Link {
  id: string;
  name: string;
  url: string;
}

interface DeleteLinkProps {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
  linkId: string;
  linkName: string;
}

const DeleteLinkDialog = ({
  links,
  setLinks,
  linkId,
  linkName,
}: DeleteLinkProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleDeleteLink = async () => {
    try {
      const response = await fetch("/api/crud/delete-link", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: linkId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete link");
      }

      const updatedLinks = links.filter((link) => link.id !== linkId);
      setLinks(updatedLinks);
      setIsDialogOpen(false);
      alert("Link deleted successfully!");
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  return (
    <div className="flex justify-end">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-sm text-white"
          >
            Delete
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this link? ({linkName})
              <br />
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteLink}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-sm"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteLinkDialog;
