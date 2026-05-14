import { AuthResponse, LoginCredentials } from '../../domain/entities/AuthTypes';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { setToken, setAuthUser } from '../../../shared/infrastructure/auth/authStorage';

export interface LoginUseCase {
  execute(credentials: LoginCredentials): Promise<AuthResponse>;
}

export function createLoginUseCase(authRepository: AuthRepository): LoginUseCase {
  return {
    execute: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await authRepository.login(credentials);
      
      // If login is successful and we receive a token, store it
      if (response && response.data && response.data.token) {
        setToken(response.data.token);
        setAuthUser(response.data.user);
      }
      
      return response;
    }
  };
}
