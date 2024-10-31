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

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export function DeleteUserModal({ user, setOpen }) {
  const router = useRouter();
  const [deleteUser, { loading, error }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setOpen(false);
      router.replace("/users");
    },
    onError: (err) => {
      console.error("Error deleting user:", err);
    },
  });

  const handleDelete = async () => {
    await deleteUser({
      variables: {
        id: user.id,
      },
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the user <strong>{user.name}</strong>?
          This action cannot be undone.
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
