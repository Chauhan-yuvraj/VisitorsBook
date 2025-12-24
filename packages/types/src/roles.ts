import { UserRole } from "./user";


export const ROLE_PERMISSIONS = {
    [UserRole.ADMIN]: ['all'],
    [UserRole.HR]: [
        'manage_employees',
        'manage_visitors',
        'manage_deliveries',
        'view_reports',
        'manage_visits'
    ],
    [UserRole.EMPLOYEE]: [
        'view_self_data',
        'view_self_visits',
        'view_self_records',
        'view_self_deliveries',
        'manage_self_deliveries',
        'view_active_employees'
    ],
    [UserRole.EXECUTIVE]: [
        'manage_employees',
        'manage_visitors',
        'manage_deliveries',
        'manage_reports',
        'manage_visits'
    ],
};
