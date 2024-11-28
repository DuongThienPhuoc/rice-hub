import React, { createContext, ReactNode, useContext } from 'react';

type BreadcrumbContextType = {
    breadcrumb: ReactNode;
    setBreadcrumb: (breadcrumb: ReactNode) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
    const [breadcrumb, setBreadcrumb] = React.useState<ReactNode>(null);
    return (
        <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
    }
    return context;
};