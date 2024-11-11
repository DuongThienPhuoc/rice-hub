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
}

export interface DayActive {
    id: number;
    dayActive: Date;
    mass: number | null;
    note: string | null;
}

export interface EmployeeDayActiveBodyRequest {
    employeeId: number;
    dayActive: string;
    mass: number | null;
    note: string | null;
}

export interface UpdateEmployeeDayActiveBodyRequest {
    employeeId: number;
    dayActive: string;
    mass: number | null;
    note: string | null;
}



export interface DeleteActiveDayBodyRequest {
    employeeId : number;
    date: string;
}