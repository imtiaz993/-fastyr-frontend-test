import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeleteAlbumModal } from "./delete-album-modal";
import { CreateEditAlbumModal } from "../../components/create-edit-album-modal";

const ActionBar = ({
  data,
  isOpenEditPopup,
  setIsOpenEditPopup,
  isOpenDeletePopup,
  setIsOpenDeletePopup,
}) => {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-between">
      <h1 className="text-2xl mb-2">Album: {data.album.title}</h1>
      <div className="flex gap-x-2 mb-5 md:mb-0">
        <Dialog open={isOpenEditPopup} onOpenChange={setIsOpenEditPopup}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Album</Button>
          </DialogTrigger>
          <CreateEditAlbumModal
            album={data.album}
            setOpen={setIsOpenEditPopup}
          />
        </Dialog>
        <Dialog open={isOpenDeletePopup} onOpenChange={setIsOpenDeletePopup}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Album</Button>
          </DialogTrigger>
          <DeleteAlbumModal album={data.album} setOpen={setIsOpenDeletePopup} />
        </Dialog>
      </div>
    </div>
  );
};

export default ActionBar;
