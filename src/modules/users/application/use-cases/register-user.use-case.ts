import { CreateUserInput , createUser } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

export type RegisterUserResult =
  | { success: true; userId: string }
  | { success: false; error: "EMAIL_ALREADY_EXISTS" | "INVALID_INPUT" };

export const registerUserUseCase = async (
  repo: UserRepository,
  input: CreateUserInput
): Promise<RegisterUserResult> => {

    const existing = await repo.findByEmail(input.email);
  if (existing) {
    return { success: false, error: "EMAIL_ALREADY_EXISTS" };
  }

  const user = createUser(input);

  await repo.save(user);

  return { success: true, userId: user.id };
};