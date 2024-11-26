import axios from '@/config/axiosConfig';

export interface Product {
    _embedded: Embedded;
    _links: Links;
    page: Page;
}

export interface Embedded {
    productDtoList: ProductDtoList[];
}

export interface ProductDtoList {
    id: number;
    name: string;
    productCode: string;
    description: string;
    customerPrice: number;
    image: string;
    categoryId: string;
    categoryName: string;
    supplierId: number;
    unitOfMeasureId: number;
    warehouseId: null;
    unitWeightPairsList: UnitWeightPairsList[];
}

export interface UnitWeightPairsList {
    productUnit: string;
    weightPerUnit: number;
    quantity: number
}

export interface Links {
    self: Self;
}

export interface Self {
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
