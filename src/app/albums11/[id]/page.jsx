"use client";

import { gql, useQuery } from "@apollo/client";
import { Card } from "@/components/ui/card"; // Adjust import path

const GET_ALBUM = gql`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      title
    }
  }
`;

const AlbumPage = ({ params }) => {
  const { id } = params;
  const { loading, error, data } = useQuery(GET_ALBUM, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = () => {
    // Implement delete logic here
  };

  return (
    <Card className="p-4">
      <h1 className="text-2xl mb-2">{data.album.title}</h1>
      <button onClick={handleDelete} className="text-red-500">
        Delete Album
      </button>
    </Card>
  );
};

export default AlbumPage;
