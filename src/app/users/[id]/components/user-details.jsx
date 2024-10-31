const UserDetails = ({ data }) => {
  return (
    <div>
      <p>Email: {data.user.email}</p>
      <p>Username: {data.user.username}</p>
      <p>Phone: {data.user.phone}</p>
      <p>Website: {data.user.website}</p>
    </div>
  );
};

export default UserDetails;
