import { Role } from "../../models/role.model";

export const DEFAULT_ROLES: Omit<Role, 'id'>[] = [
    { label: 'Admin' },
    { label: 'User' }
];