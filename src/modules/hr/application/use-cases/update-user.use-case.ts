import { editUser, EditUserInput } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

export type UpdateUserResult =
  | { success: true; user: ReturnType<typeof editUser> }
  | { success: false; error: "USER_NOT_FOUND" | "EMAIL_ALREADY_EXISTS" | "INVALID_INPUT" };

export const updateUserUseCase = async (
  repo: UserRepository,
  userId: string,
  input: EditUserInput
): Promise<UpdateUserResult> => {

    const existingUser = await repo.findById(userId);
  if (!existingUser) {
    return { success: false, error: "USER_NOT_FOUND" };
  }

  if (input.email && input.email !== existingUser.email) {
    const emailTaken = await repo.findByEmail(input.email);
    if (emailTaken && emailTaken.id !== userId) {
      return { success: false, error: "EMAIL_ALREADY_EXISTS" };
    }
  }

  const updatedUser = editUser(existingUser, input);

  await repo.save(updatedUser);

  return { success: true, user: updatedUser };
};