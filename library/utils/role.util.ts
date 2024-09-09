import { navigateToUrl } from 'single-spa';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const checkRouteAccess = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void => {
  const { hasAccess } = to.meta;
  if (hasAccess) next();
  else navigateToUrl('/not-found');
};

export { checkRouteAccess };
