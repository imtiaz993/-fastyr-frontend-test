import Link from "next/link";
import { Card } from "@/components/ui/card";

const AlbumsListing = ({ data }) => {
  return (
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
  );
};

export default AlbumsListing;
