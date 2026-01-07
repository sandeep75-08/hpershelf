import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        // Check if we've already stored this identity before.
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (user !== null) {
            // If we've seen this identity before but the name has changed, patch the value.
            if (user.name !== identity.name) {
                await ctx.db.patch(user._id, { name: identity.name });
            }
            return user._id;
        }

        // If it's a new identity, create a new `User`.
        const userId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            name: identity.name!,
            role: "user",
        });
        return userId;
    },
});

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        return user;
    },
});

// Admin Only: List all users (paginated)
export const list = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!currentUser || currentUser.role !== "admin") {
            throw new Error("Unauthorized: Admins only");
        }

        return await ctx.db.query("users").order("desc").paginate(args.paginationOpts);
    },
});

// Admin Only: Set user role
export const setRole = mutation({
    args: {
        id: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("user")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!currentUser || currentUser.role !== "admin") {
            throw new Error("Unauthorized: Admins only");
        }

        await ctx.db.patch(args.id, { role: args.role });
    },
});

