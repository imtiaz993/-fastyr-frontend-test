"use client";

import { use } from "react";
import { useQuery } from "@apollo/client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Spinner from "@/components/spinner";
import ActionBar from "./components/action-bar";
import UserDetails from "./components/user-details";
import { GET_USER } from "@/graphql/queries";

const UserPage = ({ params }) => {
  const { id } = use(params);
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);

  const { loading, error, data } = useQuery(GET_USER, {
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
      <UserDetails data={data} />
    </Card>
  );
};

export default UserPage;
