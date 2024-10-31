"use client";

import { gql, useQuery } from "@apollo/client";
import { RotatingLines } from "react-loader-spinner";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateEditUserModal } from "../components/create-edit-user-modal";
import { useState } from "react";
import { DeleteUserModal } from "../components/delete-user-modal";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      username
      website
    }
  }
`;

const UserPage = ({ params }) => {
  const { id } = params;
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
  });

  if (loading)
    return (
      <div className="mt-20 flex justify-center">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          strokeColor="black"
          strokeWidth="2"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = () => {};

  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl mb-2">{data.user.name}</h1>
        <div className="flex gap-x-2">
          <Dialog open={isOpenEditPopup} onOpenChange={setIsOpenEditPopup}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit User</Button>
            </DialogTrigger>
            <CreateEditUserModal
              user={data.user}
              setOpen={setIsOpenEditPopup}
            />
          </Dialog>
          <Dialog open={isOpenDeletePopup} onOpenChange={setIsOpenDeletePopup}>
            <DialogTrigger asChild>
              <Button variant="destructive"> Delete User</Button>
            </DialogTrigger>
            <DeleteUserModal user={data.user} setOpen={setIsOpenDeletePopup} />
          </Dialog>
        </div>
      </div>
      <p>Email: {data.user.email}</p>
      <p>Username: {data.user.username}</p>
      <p>Phone: {data.user.phone}</p>
      <p>Website: {data.user.website}</p>
    </Card>
  );
};

export default UserPage;
