export const VISIT_STATUS = {
    PENDING: 'PENDING',
    CHECKED_IN: 'CHECKED_IN',
    CHECKED_OUT: 'CHECKED_OUT',
    DECLINED: 'DECLINED',
    MISSED: 'MISSED',
} as const;

export type VisitStatus = typeof VISIT_STATUS[keyof typeof VISIT_STATUS];

export const getStatusColor = (status: string) => {
    switch (status) {
        case VISIT_STATUS.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case VISIT_STATUS.CHECKED_IN: return 'bg-green-100 text-green-800 border-green-200';
        case VISIT_STATUS.CHECKED_OUT: return 'bg-gray-100 text-gray-800 border-gray-200';
        case VISIT_STATUS.DECLINED: return 'bg-red-100 text-red-800 border-red-200';
        case VISIT_STATUS.MISSED: return 'bg-orange-100 text-orange-800 border-orange-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const getStatusLabel = (status: string) => {
    switch (status) {
        case VISIT_STATUS.PENDING: return 'Pending';
        case VISIT_STATUS.CHECKED_IN: return 'Going On';
        case VISIT_STATUS.CHECKED_OUT: return 'Concluded';
        case VISIT_STATUS.DECLINED: return 'Cancelled';
        case VISIT_STATUS.MISSED: return 'Missed';
        default: return status;
    }
};

export const STATUS_OPTIONS = [
    { label: 'Pending', value: VISIT_STATUS.PENDING, color: 'bg-yellow-100 border-yellow-200' },
    { label: 'Going On', value: VISIT_STATUS.CHECKED_IN, color: 'bg-green-100 border-green-200' },
    { label: 'Concluded', value: VISIT_STATUS.CHECKED_OUT, color: 'bg-gray-100 border-gray-200' },
    { label: 'Cancelled', value: VISIT_STATUS.DECLINED, color: 'bg-red-100 border-red-200' },
];
