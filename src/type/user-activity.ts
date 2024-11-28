export interface UserActivityResponse {
    _embedded: Embedded;
    _links:    Links;
    page:      Page;
}

export interface Embedded {
    userActivityList: UserActivity[];
}

export interface UserActivity{
    id:        number;
    username:  string;
    activity:  string;
    object:    string;
    timestamp: string;
}

interface Links {
    first: First;
    self:  First;
    next:  First;
    last:  First;
}

interface First {
    href: string;
}

interface Page {
    size:          number;
    totalElements: number;
    totalPages:    number;
    number:        number;
}
