"use client";

import { useMemo, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button"; // Adjust import path for your Button component
import { Card } from "@/components/ui/card"; // Adjust import path
import Link from "next/link";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { DataTable } from "@/components/DataTable";

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

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id) {
      id
    }
  }
`;

const AlbumsPage = () => {
  const { loading, error, data } = useQuery(GET_ALBUMS);
  const [selectedAlbums, setSelectedAlbums] = useState([]);

  const handleBulkDelete = async () => {
    await Promise.all(
      selectedAlbums.map((id) => {
        return deleteAlbum({ variables: { id } });
      })
    );
    // Refresh the data or handle the state update here
  };

  const handleImport = (importData) => {
    // Handle import data validation and updates
    console.log(importData);
  };
  console.log(data?.albums?.data);

  const tableData = useMemo(() => {
    if (data && data?.albums)
      return data.albums.data.map((album) => ({
        ...album,
        select: false, // Add select property for checkbox
      }));
    return [];
  }, [data, data?.albums]);

  const columns = useMemo(
    () => [
      // {
      //   id: "select", // Unique ID for the column
      //   Header: "Select",
      //   accessor: "select",
      //   Cell: ({ row }) => (
      //     <input
      //       type="checkbox"
      //       onChange={() => {
      //         if (selectedAlbums.includes(row.original.id)) {
      //           setSelectedAlbums(
      //             selectedAlbums.filter((id) => id !== row.original.id)
      //           );
      //         } else {
      //           setSelectedAlbums([...selectedAlbums, row.original.id]);
      //         }
      //       }}
      //       checked={selectedAlbums.includes(row.original.id)}
      //     />
      //   ),
      // },
      {
        id: "title", // Unique ID for the column
        Header: "Title",
        accessor: "title",
      },
      // {
      //   id: "actions", // Unique ID for the column
      //   Header: "Actions",
      //   accessor: "id",
      //   Cell: ({ value }) => (
      //     <Link href={`/albums/${value}`} className="text-blue-500">
      //       View
      //     </Link>
      //   ),
      // },
    ],
    [selectedAlbums]
  );

  console.log(columns);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const workbook = XLSX.read(text, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        handleImport(sheetData);
      } else if (file.type === "text/csv") {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            handleImport(results.data);
          },
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Albums</h1>
      <Link
        href="/albums/new"
        className="mb-4 inline-block bg-blue-500 text-white p-2 rounded"
      >
        Create New Album
      </Link>
      <div className="mb-4">
        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleFileUpload}
          className="border rounded p-2"
        />
      </div>
      <Button onClick={handleBulkDelete} className="bg-red-500 text-white mb-4">
        Delete Selected
      </Button>
      <DataTable
        data={tableData}
        columns={columns}
        loading={loading}
        error={error}
        onRowSelect={(id) => {
          if (selectedAlbums.includes(id)) {
            setSelectedAlbums(
              selectedAlbums.filter((albumId) => albumId !== id)
            );
          } else {
            setSelectedAlbums([...selectedAlbums, id]);
          }
        }}
        selectedRows={selectedAlbums}
      />
    </div>
  );
};

export default AlbumsPage;
