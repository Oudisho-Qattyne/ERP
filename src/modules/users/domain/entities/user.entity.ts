import { z } from "zod";
import { randomUUID } from "crypto";
import { UsernameSchema } from "../../../shared/domain/value-objects/username.user.value-object";
import { UserIdSchema } from "../value-objects/user-id.value-object";
import { EmailSchema } from "../../../shared/domain/value-objects/email.value-object";
import { nameSchema } from "../../../shared/domain/value-objects/name.value-object";
import { roleSchema } from "../value-objects/role.value-object";
import { jobTitleSchema } from "../value-objects/job-title.value-object";
import { statusSchema } from "../value-objects/status.value-object";

export const UserSchema = z.object({
    id: UserIdSchema,
    username: UsernameSchema,
    email: EmailSchema,
    first_name: nameSchema,
    middle_name: nameSchema,
    last_name: nameSchema,
    role: roleSchema,
    job_title: jobTitleSchema,
    status: statusSchema
});

export type User = z.infer<typeof UserSchema>;

// create user
export const CreateUserInputSchema = UserSchema.omit({ id: true }).extend({
    role:z.string()
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const createUser = (input: CreateUserInput): User => {
    return UserSchema.parse({
        id: randomUUID(),
        ...input,
        middle_name: input.middle_name ?? ""
    });
};


// edit user
export const EditUserInputSchema = CreateUserInputSchema.extend({
    role : z.string()
}).partial();

export type EditUserInput = z.infer<typeof EditUserInputSchema>;

export const editUser = (user: User, input: EditUserInput): User => {
    return UserSchema.parse({
        ...user,
        ...input,
        middle_name: input.middle_name ?? user.middle_name
    });
};