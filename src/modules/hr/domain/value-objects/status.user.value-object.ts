import { z } from "zod"

const errorCodes = {
    // STATUS_INVALID: 'status invalid.'
    STATUS_INVALID: 'STATUS_INVALID'
}

export const statusSchema = z
    .enum(["active" , "unactive"] , errorCodes.STATUS_INVALID)

export type status = z.infer<typeof statusSchema>

export const createstatus = (status: string): status => {
    status = status.trim()
    return statusSchema.parse(status)
}