"use client";

import { Id } from "../../convex/_generated/dataModel";
import { Trash2, Star, ExternalLink } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Rec } from "../lib/types";

interface RecommendationTableProps {
    recommendations: Rec[];
    currentUserId?: string;
    isAdmin: boolean;
    onEdit: (rec: Rec) => void;
}

export default function RecommendationTable({ recommendations, currentUserId, isAdmin, onEdit }: RecommendationTableProps) {
    const deleteRec = useMutation(api.recommendations.deleteRec);
    const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);

    const handleDelete = async (id: Id<"recommendations">) => {
        if (confirm("Are you sure you want to delete this recommendation?")) {
            await deleteRec({ id });
        }
    };

    const handleStaffPick = async (id: Id<"recommendations">) => {
        await toggleStaffPick({ id });
    };

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Added By</th>
                        <th>Description</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recommendations.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                                No movies found. Add some!
                            </td>
                        </tr>
                    ) : recommendations.map((rec) => {
                        const isOwner = currentUserId === rec.userId;
                        const canEdit = isAdmin || isOwner;
                        const canDelete = isAdmin || isOwner;

                        return (
                            <tr key={rec._id}>
                                <td style={{ textAlign: "center" }}>
                                    {rec.isStaffPick ? (
                                        <Star size={16} fill="gold" stroke="gold" />
                                    ) : (
                                        <Star size={16} className="text-muted" style={{ opacity: 0.2 }} />
                                    )}
                                </td>
                                <td>
                                    <a href={rec.link} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
                                        {rec.title}
                                        <ExternalLink size={12} className="text-muted" />
                                    </a>
                                </td>
                                <td>
                                    <span className="badge badge-primary">{rec.type}</span>
                                </td>
                                <td>
                                    <span style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>{rec.authorName}</span>
                                </td>
                                <td style={{ maxWidth: "300px" }}>
                                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-muted)" }} title={rec.blurb}>
                                        {rec.blurb}
                                    </div>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleStaffPick(rec._id)}
                                                className="btn btn-ghost"
                                                title={rec.isStaffPick ? "Unmark Staff Pick" : "Mark Staff Pick"}
                                            >
                                                <Star size={16} fill={rec.isStaffPick ? "gold" : "none"} stroke={rec.isStaffPick ? "gold" : "currentColor"} />
                                            </button>
                                        )}
                                        {canEdit && (
                                            <button
                                                onClick={() => onEdit(rec)}
                                                className="btn btn-ghost"
                                                title="Edit"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDelete(rec._id)}
                                                className="btn btn-danger"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
