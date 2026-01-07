"use client";

import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { User } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

export default function UserManagement() {
    const { results, status, loadMore } = usePaginatedQuery(
        api.users.list,
        {},
        { initialNumItems: 20 }
    );
    const setRole = useMutation(api.users.setRole);

    const handleToggleRole = async (userId: Id<"users">, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
            await setRole({ id: userId, role: newRole as "admin" | "user" });
        }
    };

    if (status === "LoadingFirstPage") {
        return <div style={{ color: "var(--text-muted)", padding: "2rem" }}>Loading users...</div>;
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Access Level</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {results?.map((user) => (
                        <tr key={user._id}>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        background: "var(--secondary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "1px solid var(--border)"
                                    }}>
                                        <User size={16} />
                                    </div>
                                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                                </div>
                            </td>
                            <td>
                                {user.role === "admin" ? (
                                    <span className="badge badge-admin">Admin</span>
                                ) : (
                                    <span className="badge">User</span>
                                )}
                            </td>
                            <td style={{ color: "var(--text-muted)" }}>
                                {user.role === "admin" ? "Full Access" : "Basic Access"}
                            </td>
                            <td style={{ textAlign: "right" }}>
                                <button
                                    className={user.role === "admin" ? "btn btn-outline" : "btn btn-primary"}
                                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem" }}
                                    onClick={() => handleToggleRole(user._id, user.role)}
                                >
                                    {user.role === "admin" ? "Demote" : "Promote"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {status === "CanLoadMore" && (
                <div style={{ padding: "1rem", display: "flex", justifyContent: "center", borderTop: "1px solid var(--border)" }}>
                    <button
                        className="btn btn-outline"
                        onClick={() => loadMore(10)}
                    >
                        Load More Users
                    </button>
                </div>
            )}
        </div>
    );
}
