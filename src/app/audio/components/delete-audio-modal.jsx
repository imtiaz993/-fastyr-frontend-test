import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteRecordingModal({ handleDelete, setOpen }) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Recording</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the recording? This action
          cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            handleDelete();
            setOpen(false);
          }}
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
