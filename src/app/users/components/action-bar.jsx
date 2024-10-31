import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateEditUserModal } from "./create-edit-user-modal";

const ActionBar = ({ isOpenCreatePopup, setIsOpenCreatePopup }) => {
  return (
    <div className="flex justify-between">
      <h1 className="text-2xl mb-4">Users</h1>
      <Dialog open={isOpenCreatePopup} onOpenChange={setIsOpenCreatePopup}>
        <DialogTrigger asChild>
          <Button>Create New User</Button>
        </DialogTrigger>
        <CreateEditUserModal setOpen={setIsOpenCreatePopup} />
      </Dialog>
    </div>
  );
};

export default ActionBar;
