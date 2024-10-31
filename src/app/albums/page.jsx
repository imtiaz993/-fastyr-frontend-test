"use client";

import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { RotatingLines } from "react-loader-spinner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateEditAlbumModal } from "./components/create-edit-album-modal";
import { useState } from "react";

const GET_ALBUMS = gql`
  query GetAlbums {
    albums {
      data {
        id
        title
      }
    }
  }
`;

const AlbumPage = () => {
  const [isOpenCreatePopup, setIsOpenCreatePopup] = useState(false);
  const { loading, error, data } = useQuery(GET_ALBUMS);

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
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl mb-4">Albums</h1>
        <Dialog open={isOpenCreatePopup} onOpenChange={setIsOpenCreatePopup}>
          <DialogTrigger asChild>
            <Button>Create New Album</Button>
          </DialogTrigger>
          <CreateEditAlbumModal setOpen={setIsOpenCreatePopup} />
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.albums.data.map((album) => (
          <Card key={album.id} className="p-4">
            <h2 className="font-bold">{album.title}</h2>
            <Link href={`/albums/${album.id}`} className="text-blue-500">
              View Details
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;
