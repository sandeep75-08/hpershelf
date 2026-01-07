import { Id } from "../../convex/_generated/dataModel";

export interface Rec {
    _id: Id<"recommendations">;
    title: string;
    type: string;
    link: string;
    blurb: string;
    authorName: string;
    userId: string;
    isStaffPick: boolean;
    imageUrl?: string;
}


