export interface CustomerResponse {
    _embedded: Embedded;
    _links:    Links;
    page:      Page;
}
interface Embedded {
    customerList: Customer[];
}
interface Links {
    self: Self;
}

interface Page {
    size:          number;
    totalElements: number;
    totalPages:    number;
    number:        number;
}

interface Self {
    href: string;
}

export interface Customer {
    id:        number;
    fullName:  string;
    image:     null | string;
    username:  string;
    password:  string;
    phone:     string;
    email:     string;
    address:   string;
    createAt:  Date;
    updateAt:  Date | null;
    active:    boolean;
    userType:  string;
    dob:       Date;
    gender:    boolean;
    name:      string;
    contracts: Contract[];
    supporter: boolean;
}

export interface Contract {
    id:               number;
    contractNumber:   string;
    contractTime:     Date;
    contractDuration: number;
    amount:           number;
    pdfFilePath:      string;
    imageFilePath:    string;
    confirmed:        boolean;
    confirmationDate: Date;
}