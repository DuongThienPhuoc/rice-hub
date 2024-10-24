import axios from '@/api/axiosConfig';

export interface Product {
    _embedded: Embedded;
    _links: Links;
    page: Page;
}

export interface Embedded {
    productDtoList: ProductDtoList[];
}

export interface ProductDtoList {
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
    supplierId: number;
    unitOfMeasureId: number;
    warehouseId: null;
    productUnit: null;
}

export interface Links {
    first: First;
    prev: First;
    self: First;
    next: First;
    last: First;
}

export interface First {
    href: string;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export async function getProductList({
    pageNumber = 1,
    pageSize = 5,
    forceFirstAndLastRels = true,
}: {
    pageNumber?: number;
    pageSize?: number;
    forceFirstAndLastRels?: boolean;
}) {
    try {
        return axios.get(
            `/products/customer/products?pageNumber=${pageNumber}&pageSize=${pageSize}&forceFirstAndLastRels=${forceFirstAndLastRels}`,
        );
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        throw new Error('Something went wrong');
    }
}
