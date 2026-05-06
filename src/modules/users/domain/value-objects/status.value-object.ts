import { z } from "zod"

const errorCodes = {
    // STATUS_INVALID: 'status invalid.'
    STATUS_INVALID: 'STATUS_INVALID'
}

export const statusSchema = z
    .enum(["active" , "unactive"] , errorCodes.STATUS_INVALID)

export type Status = z.infer<typeof statusSchema>

export const createstatus = (status: string): Status => {
    status = status.trim()
    return statusSchema.parse(status)
}