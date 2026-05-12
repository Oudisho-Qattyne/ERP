import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";


export type GetUserResult =
  | { success: true; user: User }
  | { success: false; error: "USER_NOT_FOUND" };

export const getUserByIdUseCase = async (
  repo: UserRepository,
  userId: string
): Promise<GetUserResult> => {

  const user = await repo.findById(userId);

  if (!user) {
    throw Error("")
  }
  return { success: true, user };
};