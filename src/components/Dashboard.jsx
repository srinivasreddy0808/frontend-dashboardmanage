import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import TableView from "../components/TableView";
import CreateTableModal from "../components/CreateTableModal";
import io from "socket.io-client";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tables, setTables] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/tables`,
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data, "tabledaat");
          const formattedTables = data.map((table) => ({
            id: table.id,
            name: table.name,
            columns: table.rows[0]
              ? table.rows[0].map((col, index) => ({
                  id: `col${index + 1}`,
                  name: col,
                  type: "text",
                }))
              : [],
            rows: table.rows.slice(1).map((row) => {
              return table.rows[0].reduce((acc, col, index) => {
                acc[`col${index + 1}`] = row[index] || "";
                return acc;
              }, {});
            }),
          }));
          setTables(formattedTables);
          if (formattedTables.length) setSelectedTableId(formattedTables[0].id);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    }

    fetchTables();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.emit("fetchTables");

    socket.on("tablesUpdated", (tableData) => {
      console.log("Tables updated:", tableData);
      setTables(tableData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.data.user.userName}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-indigo-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex space-x-4">
              {tables.map((table) => (
                <div>
                  <button
                    key={table.id}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`rounded-md px-4 py-2 ${
                      selectedTableId === table.id
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {table.name}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Table
            </button>
          </div>

          {selectedTableId && (
            <TableView
              tableId={selectedTableId}
              tables={tables}
              setTables={setTables}
            />
          )}

          {showCreateModal && (
            <CreateTableModal onClose={() => setShowCreateModal(false)} />
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
