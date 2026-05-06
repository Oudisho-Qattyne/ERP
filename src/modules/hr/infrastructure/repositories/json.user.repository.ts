import fs from 'fs/promises';
import path from 'path';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserQuery, PaginatedResult } from '../../domain/repositories/user.repository';

export const createJsonUserRepository = (filePath?: string): UserRepository => {
  const dataPath = filePath ?? path.join(process.cwd(), 'data', 'users.json');

  const readUsers = async (): Promise<User[]> => {
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      return JSON.parse(data) as User[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        const dir = path.dirname(dataPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(dataPath, '[]', 'utf-8');
        return [];
      }
      throw error;
    }
  };

  const writeUsers = async (users: User[]): Promise<void> => {
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2), 'utf-8');
  };

  return {
    async save(user: User): Promise<void> {
      const users = await readUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }
      await writeUsers(users);
    },

    async findById(id: string): Promise<User | null> {
      const users = await readUsers();
      return users.find(u => u.id === id) ?? null;
    },

    async findByEmail(email: string): Promise<User | null> {
      const users = await readUsers();
      return users.find(u => u.email === email) ?? null;
    },

    async findMany(query: UserQuery): Promise<PaginatedResult<User>> {
      let users = await readUsers();

      if (query.search) {
        const searchLower = query.search.toLowerCase();
        users = users.filter(user =>
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.first_name.toLowerCase().includes(searchLower) ||
          (user.middle_name && user.middle_name.toLowerCase().includes(searchLower)) ||
          user.last_name.toLowerCase().includes(searchLower)
        );
      }

      if (query.filter) {
        const { role, status, email, name } = query.filter;
        users = users.filter(user => {
          if (role && user.role !== role) return false;
          if (status && user.status !== status) return false;
          if (email && user.email !== email) return false;
          if (name) {
            const nameLower = name.toLowerCase();
            const fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();
            if (!fullName.includes(nameLower)) return false;
          }
          return true;
        });
      }

      if (query.sort) {
        const { field, order } = query.sort;
        users.sort((a, b) => {
          let aVal = a[field];
          let bVal = b[field];
          if (aVal == null) aVal = '';
          if (bVal == null) bVal = '';
          if (aVal < bVal) return order === 'asc' ? -1 : 1;
          if (aVal > bVal) return order === 'asc' ? 1 : -1;
          return 0;
        });
      }

      const total = users.length;
      const page = query.pagination?.page ?? 1;
      const limit = query.pagination?.limit ?? 10;
      const start = (page - 1) * limit;
      const paginatedUsers = users.slice(start, start + limit);

      return {
        data: paginatedUsers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    },

    async count(query?: Omit<UserQuery, 'pagination' | 'sort'>): Promise<number> {
      const result = await this.findMany({
        filter: query?.filter,
        search: query?.search,
      });
      return result.total;
    },
  };
};

export const jsonUserRepository = createJsonUserRepository();