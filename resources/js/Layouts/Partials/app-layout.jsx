import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import React from 'react'; // Penting untuk JSX

export default ({ children, breadcrumbs, ...props }) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
