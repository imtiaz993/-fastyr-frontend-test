import Link from "next/link";
import { Card } from "@/components/ui/card";

const UserListing = ({data}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.users.data.map((user) => (
        <Card key={user.id} className="p-4">
          <h2 className="font-bold">{user.name}</h2>
          <p>{user.email}</p>
          <Link href={`/users/${user.id}`} className="text-blue-500">
            View Details
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default UserListing;
