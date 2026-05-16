// modules/users/application/usecases/GetUsersUseCase.ts

import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class GetUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(page?: number, perPage?: number): Promise<{ data: User[]; total: number }> {
    return this.userRepository.getUsers(page, perPage);
  }
}
