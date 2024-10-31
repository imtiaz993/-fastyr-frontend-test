import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateEditUserModal } from "../../components/create-edit-user-modal";
import { DeleteUserModal } from "./delete-user-modal";

const ActionBar = ({
  data,
  isOpenEditPopup,
  setIsOpenEditPopup,
  isOpenDeletePopup,
  setIsOpenDeletePopup,
}) => {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-between">
      <h1 className="text-2xl mb-2">{data.user.name}</h1>
      <div className="flex gap-x-2 mb-5 md:mb-0">
        <Dialog open={isOpenEditPopup} onOpenChange={setIsOpenEditPopup}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit User</Button>
          </DialogTrigger>
          <CreateEditUserModal user={data.user} setOpen={setIsOpenEditPopup} />
        </Dialog>
        <Dialog open={isOpenDeletePopup} onOpenChange={setIsOpenDeletePopup}>
          <DialogTrigger asChild>
            <Button variant="destructive"> Delete User</Button>
          </DialogTrigger>
          <DeleteUserModal user={data.user} setOpen={setIsOpenDeletePopup} />
        </Dialog>
      </div>
    </div>
  );
};

export default ActionBar;
