/**
 * Invoicing Module Routes
 */

export const routes = {
  list: '/modules/invoicing',
  create: '/modules/invoicing/create',
  detail: (id: number | string) => `/modules/invoicing/${id}`,
  edit: (id: number | string) => `/modules/invoicing/${id}/edit`,
  preview: (id: number | string) => `/modules/invoicing/${id}/preview`,
  pdf: (id: number | string) => `/modules/invoicing/${id}/pdf`,
};

export default routes;

