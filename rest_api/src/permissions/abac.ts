import { Habit, Tag, User, Logs } from "../config/generated/prisma/client.ts"

// types & permissios 
type Resources = {
    habit: {
        actions: "create" | "delete" | "read" | "update",
        condition:Pick<Habit,"user_id" |"badge" |"sleep" > 
    },

    tag: {
        actions: "create" | "delete" | "read" | "update",
        condition:Pick<Tag,"user_id" | "created_at" > 
    },


    logs: {
        actions: "create" | "delete" | "read" | "update",
        condition:Pick<Logs, "habit_id"|"id"> 
    },
}

type Permissions<Res extends keyof Resources> = {
    actions: Resources[Res]["actions"],
    conditions?: Resources[Res]["condition"]
}

type PermissionStore = {
    [Res in keyof Resources]: Permissions<Res>[];
}