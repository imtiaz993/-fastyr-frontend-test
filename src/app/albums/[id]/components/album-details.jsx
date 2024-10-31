const AlbumDetails = ({ data }) => {
  return (
    <div>
      <p>Album ID: {data.album.id}</p>
      <p>User: {data.album.user.name}</p>
      <p>User ID: {data.album.user.id}</p>
    </div>
  );
};

export default AlbumDetails;
