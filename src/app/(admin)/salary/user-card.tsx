import { Employee } from '@/type/employee';
import React from 'react';
import { cn } from '@/lib/utils';
import { UserCardSkeleton } from '@/app/(admin)/payroll/skeleton';
import { mappingRole } from '@/utils/mapping';

type UserCardContainerProps = {
    employees: Employee[];
    selectedEmployee: Employee | undefined;
    setSelectedEmployee: React.Dispatch<
        React.SetStateAction<Employee | undefined>
    >;
    tab: number;
    setTab: React.Dispatch<React.SetStateAction<number>>;
};
const UserCardContainer: React.FC<UserCardContainerProps> = ({
    employees,
    selectedEmployee,
    setSelectedEmployee,
    tab,
    setTab,
}) => {
    return (
        <div className="p-2 pb-0 border rounded h-[320px] bg-white flex flex-col gap-2">
            <div className="bg-[#4ba94d] text-white p-1 grid grid-cols-2 gap-2 rounded">
                <div
                    className={cn(
                        'flex items-center justify-center rounded h-10 hover:cursor-pointer',
                        tab === 0 && 'bg-white text-black',
                    )}
                    onClick={() => {
                        setTab(0);
                    }}
                >
                    <h1 className="text-sm px-1 font-medium leading-none overflow-hidden text-ellipsis whitespace-nowrap">
                        Thời vụ
                    </h1>
                </div>
                <div
                    className={cn(
                        'flex items-center justify-center rounded h-10 hover:cursor-pointer',
                        tab === 1 && 'bg-white text-black',
                    )}
                    onClick={() => {
                        setTab(1);
                    }}
                >
                    <h1 className="text-sm px-1 font-medium leading-none overflow-hidden whitespace-nowrap">
                        Chính thức
                    </h1>
                </div>
            </div>
            <div className="overflow-y-auto space-y-3">
                {employees.map((employee) => (
                    <React.Fragment key={employee.id}>
                        {selectedEmployee ? (
                            <UserCard
                                employee={employee}
                                selectedEmployee={selectedEmployee}
                                setEmployee={setSelectedEmployee}
                            />
                        ) : (
                            <UserCardSkeleton key={employee.id} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

type UserCardProps = {
    employee: Employee;
    setEmployee: React.Dispatch<React.SetStateAction<Employee | undefined>>;
    selectedEmployee: Employee;
};
const UserCard: React.FC<UserCardProps> = ({
    employee,
    setEmployee,
    selectedEmployee,
}) => {
    return (
        <div
            className={cn(
                'p-2 border rounded hover:cursor-pointer',
                employee.id === selectedEmployee.id && 'bg-green-100',
            )}
            onClick={() => setEmployee(employee)}
        >
            <div>
                <h1 className="text-[16px] font-bold">{employee.fullName}</h1>
                <p className='text-sm text-muted-foreground'>{employee.phone}</p>
                <p className="text-sm text-muted-foreground">
                    {mappingRole[employee.employeeRole]}
                </p>
            </div>
        </div>
    );
};

export default UserCardContainer;
