import { z } from "zod"

const errorCodes = {
    // JOB_TITLE_INVALID: 'Job title invalid. Only letters allowed'
    JOB_TITLE_INVALID: 'JOB_TITLE_INVALID'
}

export const jobTitleSchema = z.
    string()
    .min(3)
    .max(30)
    .regex(/^[\p{L}\p{M}]+$/u, errorCodes.JOB_TITLE_INVALID)


export type jobTitle = z.infer<typeof jobTitleSchema>

export const createjobTitle = (jobTitle: string): jobTitle => {
    jobTitle = jobTitle.trim()
    return jobTitleSchema.parse(jobTitle)
}