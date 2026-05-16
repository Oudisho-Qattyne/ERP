// modules/users/application/usecases/UpdateUserUseCase.ts

import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.updateUser(id, data);
  }

  async updateSignature(file: File): Promise<User> {
    return this.userRepository.updateSignature(file);
  }
}
