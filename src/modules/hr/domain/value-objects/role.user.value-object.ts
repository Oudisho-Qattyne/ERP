import { z } from "zod"

const errorCodes = {
    // ROLE_INVALID: 'Role invalid. Only letters allowed'
    ROLE_INVALID: 'ROLE_INVALID'
}

export const roleSchema = z.
    string()
    .min(3)
    .max(30)
    .regex(/^[\p{L}\p{M}]+$/u, errorCodes.ROLE_INVALID)


export type role = z.infer<typeof roleSchema>

export const createrole = (role: string): role => {
    role = role.trim()
    return roleSchema.parse(role)
}