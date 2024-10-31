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

const ADD_USER = gql`
  mutation AddUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      phone
      username
      website
    }
  }
`;

export function CreateEditUserModal({ user,setOpen }) {
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);
  const [username, setUsername] = useState(user?.username);
  const [website, setWebsite] = useState(user?.website);

  const [addUser, { loading, error }] = useMutation(ADD_USER, {
    onCompleted: (data) => {
      setName("");
      setEmail("");
      setPhone("");
      setUsername("");
      setWebsite("");
      setOpen(false)
    },
    onError: (err) => {
      console.error("Error adding user:", err);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser({
      variables: {
        input: {
          name,
          email,
          phone,
          username,
          website,
        },
      },
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        <DialogDescription>
          {user ? "Update" : "Add"} user profile details here. Click save when
          you're done.
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
              loading || !name || !email || !username || !phone || !website
            }
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </DialogContent>
  );
}
