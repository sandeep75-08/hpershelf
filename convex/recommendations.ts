import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const recs = await ctx.db.query("recommendations").order("desc").take(args.limit ?? 50);
        return recs;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        type: v.string(),
        link: v.string(),
        blurb: v.string(),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthenticated call to create recommendation");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.insert("recommendations", {
            title: args.title,
            type: args.type,
            link: args.link,
            blurb: args.blurb,
            userId: identity.tokenIdentifier,
            authorName: user.name,
            isStaffPick: false,
            imageUrl: args.imageUrl,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("recommendations"),
        title: v.string(),
        type: v.string(),
        link: v.string(),
        blurb: v.string(),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const { id, ...updates } = args;

        const rec = await ctx.db.get(id);
        if (!rec) {
            throw new Error("Recommendation not found");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) throw new Error("User not found");

        // RBAC: Admin can edit any. User can only edit their own.
        if (user.role !== "admin" && rec.userId !== identity.tokenIdentifier) {
            throw new Error("Unauthorized: You can only edit your own recommendations");
        }

        const updateData: any = {
            title: updates.title,
            type: updates.type,
            link: updates.link,
            blurb: updates.blurb,
        };

        if ('imageUrl' in updates) {
            updateData.imageUrl = updates.imageUrl;
        }

        await ctx.db.patch(id, updateData);
    },
});

export const deleteRec = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const rec = await ctx.db.get(args.id);
        if (!rec) return;

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) throw new Error("User not found");

        // RBAC: Admin can delete any. User can only delete their own.
        if (user.role !== "admin" && rec.userId !== identity.tokenIdentifier) {
            throw new Error("Unauthorized: You can only delete your own recommendations");
        }

        await ctx.db.delete(args.id);
    },
});

export const toggleStaffPick = mutation({
    args: {
        id: v.id("recommendations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated call to toggle staff pick");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user || user.role !== "admin") {
            throw new Error("Unauthorized: Only admins can mark staff picks");
        }

        const rec = await ctx.db.get(args.id);
        if (!rec) {
            throw new Error("Recommendation not found");
        }

        await ctx.db.patch(args.id, { isStaffPick: !rec.isStaffPick });
    },
});
