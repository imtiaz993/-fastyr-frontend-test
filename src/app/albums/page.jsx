"use client";

import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import Spinner from "@/components/spinner";
import ActionBar from "./components/action-bar";
import AlbumsListing from "./components/albums-listing";

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

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ActionBar
        isOpenCreatePopup={isOpenCreatePopup}
        setIsOpenCreatePopup={setIsOpenCreatePopup}
      />
      <AlbumsListing data={data} />
    </div>
  );
};

export default AlbumPage;
