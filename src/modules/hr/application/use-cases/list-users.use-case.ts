import { User } from "../../domain/entities/user.entity";
import { PaginatedResult, UserQuery, UserRepository } from "../../domain/repositories/user.repository";

export type ListUsersInput = UserQuery;

export type ListUsersResult = PaginatedResult<User>;

export const listUsersUseCase = async (
  repo: UserRepository,
  query: ListUsersInput
): Promise<ListUsersResult> => {
  return await repo.findMany(query);
};