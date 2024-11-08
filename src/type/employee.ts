export interface Employee {
    id: number;
    phone: string;
    email: string;
    address: string;
    fullName: string;
    bankName: string;
    bankNumber: string;
    dob: Date;
    gender: boolean;
    image: string;
    employeeRole: string;
    dayActive: DayActive[];
}

export interface DayActive {
    id: number;
    dayActive: Date;
    mass: string | null;
    note: string | null;
}
