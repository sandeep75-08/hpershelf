"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Trash2, Edit2, PlusCircle } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

interface Genre {
    _id: Id<"genres">;
    name: string;
}

export default function GenresTable() {
    const genres = useQuery(api.genres.list);
    const createGenre = useMutation(api.genres.create);
    const updateGenre = useMutation(api.genres.update);
    const deleteGenre = useMutation(api.genres.remove);

    const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
    const [newGenreName, setNewGenreName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    if (genres === undefined) return <div>Loading genres...</div>;

    const handleCreate = async () => {
        if (!newGenreName.trim()) return;
        try {
            await createGenre({ name: newGenreName.trim() });
            setNewGenreName("");
            setIsCreating(false);
        } catch (error: any) {
            alert("Error creating genre: " + error.message);
        }
    };

    const handleUpdate = async () => {
        if (!editingGenre || !newGenreName.trim()) return;
        try {
            await updateGenre({ id: editingGenre._id, name: newGenreName.trim() });
            setEditingGenre(null);
            setNewGenreName("");
        } catch (error: any) {
            alert("Error updating genre: " + error.message);
        }
    };

    const handleDelete = async (id: Id<"genres">) => {
        if (confirm("Delete this genre?")) {
            await deleteGenre({ id });
        }
    };

    return (
        <div className="data-table-container">
            <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>All Genres</h3>
                <button className="btn btn-primary" onClick={() => setIsCreating(true)} disabled={isCreating || !!editingGenre}>
                    <PlusCircle size={16} /> Add Genre
                </button>
            </div>

            {(isCreating || editingGenre) && (
                <div style={{ padding: "1rem", background: "var(--secondary)", display: "flex", gap: "1rem", alignItems: "center" }}>
                    <input
                        className="form-input"
                        style={{ width: "auto", flexGrow: 1 }}
                        placeholder="Genre Name"
                        value={newGenreName}
                        onChange={(e) => setNewGenreName(e.target.value)}
                        autoFocus
                    />
                    <button className="btn btn-primary" onClick={editingGenre ? handleUpdate : handleCreate}>Save</button>
                    <button className="btn btn-ghost" onClick={() => { setIsCreating(false); setEditingGenre(null); setNewGenreName(""); }}>Cancel</button>
                </div>
            )}

            <table className="data-table">
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>Name</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {genres.length === 0 ? (
                        <tr><td colSpan={2} style={{ padding: "1rem", textAlign: "center" }}>No genres found.</td></tr>
                    ) : genres.map(g => (
                        <tr key={g._id}>
                            <td>{g.name}</td>
                            <td style={{ textAlign: "right" }}>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => {
                                            setEditingGenre(g);
                                            setNewGenreName(g.name);
                                            setIsCreating(false);
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(g._id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
