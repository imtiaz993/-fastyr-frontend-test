import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

export function DeleteAlbumModal({ album, setOpen }) {
  const router = useRouter();
  const [deleteAlbum, { loading, error }] = useMutation(DELETE_ALBUM, {
    onCompleted: () => {
      setOpen(false);
      router.replace("/albums");
    },
    onError: (err) => {
      console.error("Error deleting album:", err);
    },
  });

  const handleDelete = async () => {
    await deleteAlbum({
      variables: {
        id: album.id,
      },
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Album</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the album titled{" "}
          <strong>{album.title}</strong>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </DialogContent>
  );
}
