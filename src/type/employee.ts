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
    employeeSalaryType: string;
}

export interface DayActive {
    id: number;
    amountPerMass: number | null;
    dayActive: Date;
    amountByTons: number | 0;
    mass: number;
    note: string | null;
    spend: boolean;
}

export interface EmployeeDayActiveBodyRequest {
    employeeId: number;
    dayActive: string;
    amountPerMass: number | 0.0;
    mass: number | null;
    note: string | null;
}

export interface UpdateEmployeeDayActiveBodyRequest {
    employeeId: number;
    dayActive: string;
    amountPerMass: number | 0.0;
    mass: number | null;
    note: string | null;
}



export interface DeleteActiveDayBodyRequest {
    employeeId: number;
    date: string;
}

export interface DailyEmployeePayroll {
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
    dayWorked: number;
    totalMass: number;
}

export interface MonthlyEmployeePayroll {
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
    dailyWage: number;
    dayWorked: number;
    totalSalary: number;
    unpaidSalary: number;
}