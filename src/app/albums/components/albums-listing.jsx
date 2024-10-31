import { useState, useMemo, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Link from "next/link";
import { Input } from "@/components/ui/input"; 
import Papa from "papaparse";
import * as XLSX from "xlsx"; 

const AlbumsListing = ({ data: dataFromQL }) => {
  const [data, setData] = useState(dataFromQL.albums.data);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState({});
  const [debouncedFilters, setDebouncedFilters] = useState({});
  const [previewData, setPreviewData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const titleInputRef = useRef(null); 

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(columnFilters);
      if (titleInputRef.current) {
        titleInputRef.current.focus(); 
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [columnFilters]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return (
        (!debouncedFilters.title ||
          row.title.includes(debouncedFilters.title)) &&
        true
      );
    });
  }, [data, debouncedFilters]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <div>
            <Input
              ref={titleInputRef}
              placeholder="Search by Title"
              value={columnFilters.title || ""}
              onChange={(e) => {
                const value = e.target.value || undefined;
                setColumnFilters((prev) => ({
                  ...prev,
                  title: value,
                }));
              }}
            />
            Title
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        id: "id",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Link href={`/albums/${row.original.id}`} className="text-blue-500">
              View Details
            </Link>
          </div>
        ),
      },
    ],
    [columnFilters]
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableGlobalFilter: true,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const fileExtension = file.name.split(".").pop();
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;

      if (fileExtension === "csv") {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const validatedData = validateData(results.data);
            console.log("validatedData", validatedData);
            setPreviewData(validatedData);
          },
        });
      } else if (fileExtension === "xlsx") {
        const workbook = XLSX.read(text, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const validatedData = validateData(jsonData);
        setPreviewData(validatedData);
      }
    };

    reader.readAsText(file);
  };

  const validateData = (data) => {
    return data.filter((item) => {
  
      return item.title; 
    });
  };

  const handleFinalizeImport = () => {
    console.log("Finalizing import with data:", previewData);
    bulkUploadAlbums(data);
    setPreviewData([]);
    setSelectedFile(null);
    document.getElementById("fileInput").value = "";
  };

  const bulkUploadAlbums = async (albums) => {
    const createAlbumMutation = `
   mutation CreateAlbum($input: CreateAlbumInput!) {
  createAlbum(input: $input) {
    id
    title
     user {
            id
          }
  }
}
    `;

    for (const album of albums) {
      try {
        const input = {
          title: album.title,
          userId: 1,
        };
        const response = await fetch("https://graphqlzero.almansi.me/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: createAlbumMutation,
            variables: { input },
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Uploaded album:", result.data.createAlbum);
        } else {
          console.error("Error uploading album:", result.errors);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }

    setMessage("Upload complete!");
  };

  const handleBulkDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedRowIds = selectedRows.map((row) => row.original.id);
    const deletePostMutation = `
    mutation DeletePost($id: ID!) {
      deletePost(id: $id)
    }
  `;

    try {
      const responses = await Promise.all(
        selectedRowIds.map(async (id) => {
          const response = await fetch("https://graphqlzero.almansi.me/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: deletePostMutation,
              variables: { id },
            }),
          });
          return response.json();
        })
      );

      console.log("Delete responses:", responses);
    } catch (error) {
      console.error("Error deleting posts:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end">
        <div className="flex items-center mb-4 ">
          <p className="text-sm mr-2">Import CSV File:</p>
          <Input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-60"
          />
        </div>
        {selectedFile && (
          <button
            onClick={handleFinalizeImport}
            className="mb-4 bg-green-500 whitespace-nowrap ml-2 text-white p-2 rounded"
          >
            Finalize Import
          </button>
        )}
      </div>
      {previewData.length > 0 && (
        <div>
          <h3>Preview Imported Albums:</h3>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                {columns.slice(1, 2).map((column) => (
                  <th key={column.id} className="border border-gray-300 p-2">
                    {column.header}
                  </th>
                ))}
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index}>
                  {columns.slice(1, 2).map((column) => (
                    <td key={column.id} className="border border-gray-300 p-2">
                      <Input
                        value={row[column.accessorKey]}
                        onChange={(e) => {
                          const newData = [...previewData];
                          newData[index][column.accessorKey] = e.target.value;
                          setPreviewData(newData);
                        }}
                      />
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2 flex justify-center">
                    <button
                      onClick={() => {
                        const newData = previewData.filter(
                          (_, i) => i !== index
                        );
                        setPreviewData(newData);
                      }}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleBulkDelete}
            className="mb-4 bg-red-500 text-white p-2 rounded"
          >
            Delete Selected
          </button>
        </div>
      )}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 p-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlbumsListing;
