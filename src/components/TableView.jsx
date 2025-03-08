import React, { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";

function TableView({ tableId, tables, setTables }) {
  const table = tables.find((t) => t.id === tableId);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");

  if (!table) return null;

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;

    const newColumn = {
      id: `col${Date.now()}`, // Unique ID for the column
      name: newColumnName,
      type: newColumnType,
    };

    // Update the table with the new column
    const updatedTables = tables.map((t) =>
      t.id === tableId ? { ...t, columns: [...t.columns, newColumn] } : t,
    );

    setTables(updatedTables);
    setShowAddColumn(false);
    setNewColumnName("");
    setNewColumnType("text");
  };

  return (
    <div className="overflow-hidden overflow-x-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {table.name}{" "}
          <span>
            <a
              href={`https://docs.google.com/spreadsheets/d/${tableId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-6 text-sm text-indigo-600 hover:text-indigo-900"
            >
              View Sheet
            </a>
          </span>
        </h2>
        <button
          onClick={() => setShowAddColumn(true)}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Column
        </button>
      </div>

      {showAddColumn && (
        <div className="mb-4 rounded-md border bg-gray-50 p-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              className="rounded-md border px-3 py-2"
            />
            <select
              value={newColumnType}
              onChange={(e) => setNewColumnType(e.target.value)}
              className="rounded-md border px-3 py-2"
            >
              <option value="text">Text</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={handleAddColumn}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {table.columns.map((column) => (
              <th
                key={column.id}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.rows.map((row, index) => (
            <tr key={index}>
              {table.columns.map((column) => (
                <td key={column.id} className="whitespace-nowrap px-6 py-4">
                  {column.type === "date"
                    ? format(new Date(row[column.id]), "PP")
                    : row[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
