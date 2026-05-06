import { User } from "../entities/user.entity";

export type UserFilter = {
    role?: string;
    status?: string;
    email?: string;
    name?: string;
};

type KeysOfType<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

type SortableUserKeys = KeysOfType<User, string | Date>;

export type UserSort = {
    field: SortableUserKeys;
    order: 'asc' | 'desc';
};

export type Pagination = {
    page: number;
    limit: number;
};

export type UserQuery = {
    filter?: UserFilter;
    sort?: UserSort;
    pagination?: Pagination;
    search?: string;
};


export type PaginatedResult<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type UserRepository = {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findMany(query: UserQuery): Promise<PaginatedResult<User>>;
    count(query?: Omit<UserQuery, 'pagination' | 'sort'>): Promise<number>;
};