"use client";

import { gql, useQuery } from "@apollo/client";
import { RotatingLines } from "react-loader-spinner";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateEditAlbumModal } from "../components/create-edit-album-modal";
import { useState } from "react";
import { DeleteAlbumModal } from "../components/delete-album-modal";

const GET_ALBUM = gql`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      title
      user {
        id
        name
      }
    }
  }
`;

const AlbumPage = ({ params }) => {
  const { id } = params;
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);

  const { loading, error, data } = useQuery(GET_ALBUM, {
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

  return (
    <Card className="p-4">
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
            <DeleteAlbumModal
              album={data.album}
              setOpen={setIsOpenDeletePopup}
            />
          </Dialog>
        </div>
      </div>
      <p>Album ID: {data.album.id}</p>
      <p>User: {data.album.user.name}</p>
      <p>User ID: {data.album.user.id}</p>
    </Card>
  );
};

export default AlbumPage;
