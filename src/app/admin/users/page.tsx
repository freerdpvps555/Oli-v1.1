"use client";

import { useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user" | "viewer";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  { id: "1", username: "admin", email: "admin@oilmonitor.com", role: "admin", status: "active", lastLogin: "2026-03-04 10:30", createdAt: "2026-01-01" },
  { id: "2", username: "user01", email: "user01@example.com", role: "user", status: "active", lastLogin: "2026-03-03 15:45", createdAt: "2026-01-15" },
  { id: "3", username: "viewer01", email: "viewer@example.com", role: "viewer", status: "inactive", lastLogin: "2026-02-20 09:00", createdAt: "2026-01-20" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "user":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">จัดการผู้ใช้งาน</h1>
          <p className="text-slate-400 text-sm mt-1">จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          เพิ่มผู้ใช้
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">ผู้ใช้ทั้งหมด</p>
          <p className="font-jetbrains text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">ผู้ดูแลระบบ</p>
          <p className="font-jetbrains text-2xl font-bold text-amber-400">{users.filter(u => u.role === "admin").length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">ผู้ใช้งาน</p>
          <p className="font-jetbrains text-2xl font-bold text-cyan-400">{users.filter(u => u.role === "user").length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">ผู้ใช้ที่ใช้งานอยู่</p>
          <p className="font-jetbrains text-2xl font-bold text-emerald-400">{users.filter(u => u.status === "active").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ใช้หรืออีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
          >
            <option value="all">ทุกบทบาท</option>
            <option value="admin">ผู้ดูแลระบบ</option>
            <option value="user">ผู้ใช้งาน</option>
            <option value="viewer">ผู้ชม</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ผู้ใช้</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">บทบาท</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">สถานะ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">เข้าสู่ระบบล่าสุด</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">สร้างเมื่อ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/20">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                      {user.role === "admin" ? "ผู้ดูแลระบบ" : user.role === "user" ? "ผู้ใช้งาน" : "ผู้ชม"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(user.status)}`}>
                      {user.status === "active" ? "ใช้งานอยู่" : "ไม่ได้ใช้งาน"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">{user.lastLogin}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">{user.createdAt}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-slate-400 hover:text-amber-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">เพิ่มผู้ใช้ใหม่</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">ชื่อผู้ใช้</label>
                <input type="text" className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">อีเมล</label>
                <input type="email" className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">บทบาท</label>
                <select className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500">
                  <option value="user">ผู้ใช้งาน</option>
                  <option value="viewer">ผู้ชม</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors">
                  ยกเลิก
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors">
                  เพิ่มผู้ใช้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
