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
import { Link as LinkType } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "reactfire";

interface AddLinkProps {
  links: LinkType[];
  addLink: (link: Omit<LinkType, "id">) => Promise<void>;
}

const AddLinkDialog = ({ addLink }: AddLinkProps) => {
  const auth = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [newOrder, setNewOrder] = useState<number>(0);

  const handleAddLink = async () => {
    const newLink = {
      name: newName,
      url: newUrl,
      order: newOrder,
    };

    await addLink(newLink);
    setNewName("");
    setNewUrl("");
    setNewOrder(0);
    setIsDialogOpen(false);
  };

  const handleSignOut = async () => {
    signOut(auth);
  };

  return (
    <div className="flex justify-end mb-4 gap-4">
      <Link href="/" passHref>
        <button
          onClick={handleSignOut}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg"
        >
          Sign out
        </button>
      </Link>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gray-50 p-4 rounded-lg text-black"
          >
            Add Link
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Link</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Add a new link to the page. Please double check the url and
            spelling.
          </DialogDescription>
          {/* Form Fields Inside the Dialog */}
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(parseInt(e.target.value))}
              placeholder="URL"
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <DialogFooter>
            <button
              onClick={handleAddLink}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-sm"
            >
              Add Link
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddLinkDialog;
