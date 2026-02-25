"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import api from "../../../../lib/axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/users?page=1&limit=50").then((res) => {
      setUsers(res.data.data);
    });
  }, []);

  const updateRole = async (id: string, role: string) => {
    await api.patch(`/users/${id}`, { role });
    alert("Role Updated");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    defaultValue={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="client">Client</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
