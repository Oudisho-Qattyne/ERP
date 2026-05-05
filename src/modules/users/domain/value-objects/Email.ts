import { DomainError } from "@/src/modules/shared/domain/errors/DomainError";
import { Email, UserId } from "../types/user";
import { isValidEmail, isValidUsername } from "../validations/userValidation";
import { DomainErrorCodes } from "../errors/errorCodes";

export interface User {
  readonly id: UserId;
  readonly name: string;
  readonly email: Email;
  readonly role: string;
  readonly job_title:string
  readonly status: 'active' | 'inactive';
}

export const createUser = (input :User):User => {
    if(!isValidEmail(input.email)) throw new DomainError(DomainErrorCodes.EMAIL_INVALID_FORMAT)
    if(!isValidUsername(input.name)) throw new DomainError(DomainErrorCodes.NAME_INVALID_LENGTH)
    return(input)
}