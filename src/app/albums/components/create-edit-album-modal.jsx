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

const ADD_ALBUM = gql`
  mutation AddAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
      id
      title
      user {
        id
      }
    }
  }
`;

const UPDATE_ALBUM = gql`
  mutation UpdateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
      id
      title
    }
  }
`;

export function CreateEditAlbumModal({ album, setOpen }) {
  const [title, setTitle] = useState(album?.title || "");
  const [userId, setUserId] = useState(album?.user?.id || "");

  const [addAlbum, { loading: loadingAdd, error: errorAdd }] = useMutation(
    ADD_ALBUM,
    {
      onCompleted: () => {
        resetForm();
        setOpen(false);
      },
      onError: (err) => {
        console.error("Error adding album:", err);
      },
    }
  );

  const [updateAlbum, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(UPDATE_ALBUM, {
      onCompleted: () => {
        resetForm();
        setOpen(false);
      },
      onError: (err) => {
        console.error("Error updating album:", err);
      },
    });

  const resetForm = () => {
    setTitle("");
    setUserId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!album) {
      if (!userId) {
        alert("User ID is required");
        return;
      }
    }

    const input = {
      title,
      userId: parseInt(userId, 10),
    };

    if (album) {
      await updateAlbum({ variables: { id: album.id, input } });
    } else {
      await addAlbum({ variables: { input } });
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{album ? "Edit Album" : "Create New Album"}</DialogTitle>
        <DialogDescription>
          {album ? "Update" : "Add"} album details here. Click save when
          you&apos;re done.
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
        {!album && (
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
        )}
        <DialogFooter>
          <Button
            type="submit"
            disabled={
              loadingAdd || loadingUpdate || !title || (!userId && !album)
            }
          >
            {loadingAdd || loadingUpdate ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
      {(errorAdd || errorUpdate) && (
        <p className="text-red-500">
          Error: {errorAdd?.message || errorUpdate?.message}
        </p>
      )}
    </DialogContent>
  );
}
