import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, gql } from "@apollo/client";

// Mutation for adding or editing an album
const ADD_EDIT_ALBUM = gql`
  mutation AddEditAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
      id
      title
      user {
        id
      }
    }
  }
`;

export function CreateEditAlbumModal({ album, setOpen }) {
  const [title, setTitle] = useState(album?.title || "");
  const [userId, setUserId] = useState(album?.user?.id || ""); // Default user ID

  const [addEditAlbum, { loading, error }] = useMutation(ADD_EDIT_ALBUM, {
    onCompleted: () => {
      setTitle("");
      setUserId("");
      setOpen(false); // Close modal on success
    },
    onError: (err) => {
      console.error("Error adding/editing album:", err);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure userId is set before submitting
    if (!userId) {
      alert("User ID is required");
      return;
    }

    await addEditAlbum({
      variables: {
        input: {
          title,
          userId: parseInt(userId, 10), // Ensure userId is a number
        },
      },
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{album ? "Edit Album" : "Create New Album"}</DialogTitle>
        <DialogDescription>
          {album ? "Update" : "Add"} album details here. Click save when you're
          done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="userId" className="text-right">
            User ID
          </Label>
          <Input
            id="userId"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={loading || !title || !userId}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </DialogContent>
  );
}
