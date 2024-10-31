"use client";

import { use } from "react";
import { gql, useQuery } from "@apollo/client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Spinner from "@/components/spinner";
import AlbumDetails from "./components/album-details";
import ActionBar from "./components/action-bar";

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
  const { id } = use(params);
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);

  const { loading, error, data } = useQuery(GET_ALBUM, {
    variables: { id },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Card className="p-4">
      <ActionBar
        data={data}
        isOpenEditPopup={isOpenEditPopup}
        setIsOpenEditPopup={setIsOpenEditPopup}
        isOpenDeletePopup={isOpenDeletePopup}
        setIsOpenDeletePopup={setIsOpenDeletePopup}
      />
      <AlbumDetails data={data} />
    </Card>
  );
};

export default AlbumPage;
