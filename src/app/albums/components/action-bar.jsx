import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateEditAlbumModal } from "./create-edit-album-modal";

const ActionBar = ({ isOpenCreatePopup, setIsOpenCreatePopup }) => {
  return (
    <div className="flex justify-between">
      <h1 className="text-2xl mb-4">Albums</h1>
      <Dialog open={isOpenCreatePopup} onOpenChange={setIsOpenCreatePopup}>
        <DialogTrigger asChild>
          <Button>Create New Album</Button>
        </DialogTrigger>
        <CreateEditAlbumModal setOpen={setIsOpenCreatePopup} />
      </Dialog>
    </div>
  );
};

export default ActionBar;
