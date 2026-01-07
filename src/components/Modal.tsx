import { X } from "lucide-react";
import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "500px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}>
                <div style={{
                    padding: "1rem 1.5rem",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--secondary)"
                }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button onClick={onClose} className="btn btn-ghost">
                        <X size={20} />
                    </button>
                </div>
                <div style={{ padding: "1.5rem", height: "calc(100vh - 70px)", overflowY: "auto" }} >
                    {children}
                </div>
            </div>
        </div>
    );
}
