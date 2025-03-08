import React, { useState } from "react";
import { Plus, X } from "lucide-react";

function CreateTableModal({ onClose }) {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("text");

  const handleAddColumn = () => {
    if (columnName.trim()) {
      setColumns([
        ...columns,
        {
          id: Date.now().toString(),
          name: columnName,
          type: columnType,
        },
      ]);
      setColumnName("");
      setColumnType("text");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tableName && columns.length > 0) {
      const headers = columns.map((col) => `${col.name}:${col.type}`);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/tables/createTable`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2FiNzg1MmQ1OTc3M2I5NmNiMWM0ZCIsImlhdCI6MTc0MTMzODYyNSwiZXhwIjoxNzQ5MTE0NjI1fQ.uwhITRq-WgSO9q1jhnO9oXwO1ppoDM8OkbbMQhmODgs`,
            },
            body: JSON.stringify({ tableName, headers }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data, "success data");
        } else {
          console.error("Failed to create table");
        }
        onClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Table</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Table Name
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add Columns
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                placeholder="Column name"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <select
                value={columnType}
                onChange={(e) => setColumnType(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="text">Text</option>
                <option value="date">Date</option>
              </select>
              <button
                type="button"
                onClick={handleAddColumn}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {columns.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Columns:</h3>
              <ul className="mt-2 divide-y divide-gray-200">
                {columns.map((column) => (
                  <li
                    key={column.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span>
                      {column.name} ({column.type})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setColumns(columns.filter((c) => c.id !== column.id))
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={!tableName || columns.length === 0}
              onClick={handleSubmit}
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTableModal;
