import { z } from "zod"

const errorCodes = {
    // EMAIL_INVALID: 'Email invalid.'
    EMAIL_INVALID: 'EMAIL_INVALID'
}

export const EmailSchema = z
    .email(errorCodes.EMAIL_INVALID)

export type Email = z.infer<typeof EmailSchema>

export const createEmail = (email: string): Email => {
    email = email.trim()
    return EmailSchema.parse(email)
}