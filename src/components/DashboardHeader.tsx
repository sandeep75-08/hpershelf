import { Search, Filter } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface DashboardHeaderProps {
    currentView: "recs" | "users" | "genres";
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
}

export default function DashboardHeader({
    currentView,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre
}: DashboardHeaderProps) {
    const genresData = useQuery(api.genres.list);
    const genres = genresData?.map(g => g.name) || [];

    return (
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
                <h2 style={{ fontSize: "1.8rem", margin: 0 }}>
                    {currentView === "recs" ? "Recommendations" : currentView === "users" ? "User Management" : "Genre Management"}
                </h2>
                <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
                    {currentView === "recs" ? "List of recommended movies." : currentView === "users" ? "Manage user roles and access." : "Manage movie genres."}
                </p>
            </div>


            {/* Search & Filter Controls (Only for Recs view) */}
            {currentView === "recs" && (
                <div className="dashboard-controls">
                    <div className="search-input-wrapper">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="form-input search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-select-wrapper">
                        <Filter size={16} className="filter-icon" />
                        <select
                            className="form-select filter-select"
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <option value="">All Genres</option>
                            {genres.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
