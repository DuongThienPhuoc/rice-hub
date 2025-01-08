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
    importPrice: number;
    image: string;
    categoryId: string;
    categoryName: string;
    supplierId: number;
    supplierName?: string;
    unitOfMeasureId: number;
    warehouseId: null;
    unitWeightPairsList: UnitWeightPairsList[];
}

export interface UnitWeightPairsList {
    productUnit: string;
    weightPerUnit: number;
    quantity: number;
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
    categoryName = null,
    name
}: {
    pageNumber?: number;
    pageSize?: number;
    forceFirstAndLastRels?: boolean;
    categoryName?: string | null;
    name?: string | null;
}) {
    try {
        return axios.get('/products/customer/products', {
            params: {
                pageNumber,
                pageSize,
                categoryName,
                forceFirstAndLastRels,
                name
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        throw new Error('Something went wrong');
    }
}

export async function getProductListByAdmin({
    pageNumber = 1,
    pageSize = 5,
    forceFirstAndLastRels = true,
    categoryName = null,
    supplierName = null,
    id = null,
    name
}: {
    pageNumber?: number;
    pageSize?: number;
    forceFirstAndLastRels?: boolean;
    categoryName?: string | null;
    supplierName?: string | null;
    id?: number | null;
    name?: string | null;
}) {
    try {
        return axios.get('/products/admin/order/products', {
            params: {
                pageNumber,
                pageSize,
                categoryName,
                supplierName,
                forceFirstAndLastRels,
                id,
                name
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        throw new Error('Something went wrong');
    }
}

export async function getProductAndIngredientListByAdmin({
    pageNumber = 1,
    pageSize = 5,
    forceFirstAndLastRels = true,
    categoryName = null,
    supplierName = null,
    id = null,
    name
}: {
    pageNumber?: number;
    pageSize?: number;
    forceFirstAndLastRels?: boolean;
    categoryName?: string | null;
    supplierName?: string | null;
    id?: number | null;
    name?: string | null;
}) {
    try {
        return axios.get('/products/admin/order/productsAndIngredients', {
            params: {
                pageNumber,
                pageSize,
                categoryName,
                supplierName,
                forceFirstAndLastRels,
                id,
                name
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        throw new Error('Something went wrong');
    }
}

