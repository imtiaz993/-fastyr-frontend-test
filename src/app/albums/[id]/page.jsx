"use client";

import { use } from "react";
import { useQuery } from "@apollo/client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Spinner from "@/components/spinner";
import AlbumDetails from "./components/album-details";
import ActionBar from "./components/action-bar";
import { GET_ALBUM } from "@/graphql/queries";

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
