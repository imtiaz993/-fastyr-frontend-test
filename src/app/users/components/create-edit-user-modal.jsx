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
import { useMutation } from "@apollo/client";
import { ADD_USER, UPDATE_USER } from "@/graphql/mutations";

export function CreateEditUserModal({ user, setOpen }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [username, setUsername] = useState(user?.username || "");
  const [website, setWebsite] = useState(user?.website || "");

  const [addUser, { loading: loadingAdd, error: errorAdd }] = useMutation(
    ADD_USER,
    {
      onCompleted: (data) => {
        resetForm();
        setOpen(false);
      },
      onError: (err) => {
        console.error("Error adding user:", err);
      },
    }
  );

  const [updateUser, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(UPDATE_USER, {
      onCompleted: (data) => {
        resetForm();
        setOpen(false);
      },
      onError: (err) => {
        console.error("Error updating user:", err);
      },
    });

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setUsername("");
    setWebsite("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = {
      name,
      email,
      phone,
      username,
      website,
    };

    if (user) {
      await updateUser({ variables: { id: user.id, input } });
    } else {
      await addUser({ variables: { input } });
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        <DialogDescription>
          {user ? "Update" : "Add"} user profile details here. Click save when
          you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Phone
          </Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="website" className="text-right">
            Website
          </Label>
          <Input
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={
              loadingAdd ||
              loadingUpdate ||
              !name ||
              !email ||
              !username ||
              !phone ||
              !website
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
