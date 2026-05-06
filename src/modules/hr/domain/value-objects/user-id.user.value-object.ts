import { z } from "zod"

const errorCodes = {
    // USERID_INVALID: 'User id invalid. Only letters, numbers, underscore(_) and hyphen(-) allowed, and no spaces allowed'
    USERID_INVALID: 'USERID_INVALID'
}

export const UserIdSchema = z
    .string()
    .min(3)
    .max(30)
    .regex(/^\S+$/, errorCodes.USERID_INVALID);


export type UserId = z.infer<typeof UserIdSchema>

export const createUserId = (userId: string): UserId => {
    userId = userId.trim()
    return UserIdSchema.parse(userId)
}