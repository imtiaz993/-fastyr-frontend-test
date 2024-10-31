"use client";

import { use } from "react";
import { gql, useQuery } from "@apollo/client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Spinner from "@/components/spinner";
import ActionBar from "./components/action-bar";
import UserDetails from "./components/user-details";

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
  const { id } = use(params);
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = () => {};

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
