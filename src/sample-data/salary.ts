export type Job = {
    date: string;
    mass: string;
};

export type Employee = {
    id: string;
    name: string;
    role: string;
    jobs: Job[];
};

export const Employees: Employee[] = [
    {
        id: '1',
        name: 'Dương Thiện Phước',
        role: 'Nhân viên dỡ hàng',
        jobs: [
            {
                date: '10/11/2024',
                mass: '10 Tấn',
            },
            {
                date: '10/13/2024',
                mass: '50 Tấn',
            },
            {
                date: '10/15/2024',
                mass: '10 Tấn',
            },
            {
                date: '10/21/2024',
                mass: '20 Tấn',
            },
            {
                date: '10/25/2024',
                mass: '30 Tấn',
            },
        ],
    },
    {
        id: '2',
        name: 'Trần Văn A',
        role: 'Nhân viên dỡ hàng',
        jobs: [
            {
                date: '10/13/2024',
                mass: '10 Tấn',
            },
            {
                date: '10/23/2024',
                mass: '20 Tấn',
            },
            {
                date: '10/25/2024',
                mass: '30 Tấn',
            },
        ],
    },
    {
        id: '3',
        name: 'Trần Văn B',
        role: 'Nhân viên dỡ hàng',
        jobs: [
            {
                date: '10/14/2024',
                mass: '10 Tấn',
            },
            {
                date: '10/22/2024',
                mass: '20 Tấn',
            },
            {
                date: '10/24/2024',
                mass: '30 Tấn',
            },
        ],
    },
    {
        id: '4',
        name: 'Trần Văn C',
        role: 'Nhân viên dỡ hàng',
        jobs: [
            {
                date: '10/16/2024',
                mass: '10 Tấn',
            },
            {
                date: '10/20/2024',
                mass: '20 Tấn',
            },
            {
                date: '10/23/2024',
                mass: '30 Tấn',
            },
        ],
    },
    {
        id: '5',
        name: 'Trần Văn F',
        role: 'Nhân viên dỡ hàng',
        jobs: [
            {
                date: '10/17/2024',
                mass: '10 Tấn',
            },
            {
                date: '10/19/2024',
                mass: '20 Tấn',
            },
            {
                date: '10/22/2024',
                mass: '30 Tấn',
            },
        ],
    },
];
