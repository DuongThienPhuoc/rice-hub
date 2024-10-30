export type Job = {
    date: string;
    detail?: string;
};

export type Employee = {
    id: string;
    name: string;
    role: string;
    activeDates?: Job[];
};

export const PorterEmployees: Employee[] = [
    {
        id: '1',
        name: 'Dương Thiện Phước',
        role: 'porter',
        activeDates: [
            {
                date: '2024-10-11T00:00:00.000Z',
                detail: '10 Tấn',
            },
            {
                date: '2024-10-13T00:00:00.000Z',
                detail: '50 Tấn',
            },
            {
                date: '2024-10-15T00:00:00.000Z',
                detail: '10 Tấn',
            },
            {
                date: '2024-10-21T00:00:00.000Z',
                detail: '20 Tấn',
            },
            {
                date: '2024-10-25T00:00:00.000Z',
                detail: '30 Tấn',
            },
        ],
    },
    {
        id: '2',
        name: 'Trần Văn A',
        role: 'porter',
        activeDates: [],
    },
    {
        id: '3',
        name: 'Trần Văn B',
        role: 'porter',
        activeDates: [],
    },
    {
        id: '4',
        name: 'Trần Văn C',
        role: 'porter',
        activeDates: [],
    },
    {
        id: '5',
        name: 'Trần Văn F',
        role: 'porter',
        activeDates: [],
    },
];
export const DriverEmployees: Employee[] = [
    {
        id: '6',
        name: 'Nguyễn Văn D',
        role: 'driver',
        activeDates: [
            {
                date: '2024-10-01T13:48:19.027Z',
            },
            {
                date: '2024-10-02T13:48:19.027Z',
            },
            {
                date: '2024-10-03T13:48:19.027Z',
            },
            {
                date: '2024-10-14T13:48:19.027Z',
            },
            {
                date: '2024-10-15T13:48:19.027Z',
            },
            {
                date: '2024-10-16T13:48:19.027Z',
            },
            {
                date: '2024-10-27T13:48:19.027Z',
            }
        ],
    },
    {
        id: '7',
        name: 'Nguyễn Văn E',
        role: 'driver',
        activeDates: [],
    },
];
