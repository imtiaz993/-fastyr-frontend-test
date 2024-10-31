"use client";

import { useQuery } from "@apollo/client";
import { useState } from "react";
import ActionBar from "./components/action-bar";
import UserListing from "./components/user-listing";
import Spinner from "@/components/spinner";
import { GET_USERS } from "@/graphql/queries";

const UsersPage = () => {
  const [isOpenCreatePopup, setIsOpenCreatePopup] = useState(false);
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ActionBar
        isOpenCreatePopup={isOpenCreatePopup}
        setIsOpenCreatePopup={setIsOpenCreatePopup}
      />
      <UserListing data={data} />
    </div>
  );
};

export default UsersPage;
