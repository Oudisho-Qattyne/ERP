import { z } from "zod"

const errorCodes = {
    // USERNAME_INVALID: 'Username invalid. Only letters, numbers, underscore(_) and hyphen(-) allowed, and no spaces allowed'
    USERNAME_INVALID: 'USERNAME_INVALID'
}

export const UsernameSchema = z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, errorCodes.USERNAME_INVALID)
    .regex(/^\S+$/, errorCodes.USERNAME_INVALID);


export type Username = z.infer<typeof UsernameSchema>

export const createUsername = (username: string): Username => {
    username = username.trim()
    return UsernameSchema.parse(username)
}