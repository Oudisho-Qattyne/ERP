import { z } from "zod"

const errorCodes = {
    NAME_INVALID: 'NAME_INVALID'
    // NAME_INVALID: 'Name invalid. Only letters allowed, and no spaces allowed'
}

export const nameSchema = z.
    string()
    .min(3)
    .max(30)
    .regex(/^[\p{L}\p{M}]+$/u, errorCodes.NAME_INVALID)
    .regex(/^\S+$/, errorCodes.NAME_INVALID);


export type name = z.infer<typeof nameSchema>

export const createname = (name: string): name => {
    name = name.trim()
    return nameSchema.parse(name)
}