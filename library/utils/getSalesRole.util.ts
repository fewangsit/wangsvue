export type SalesRole = {
  sales: boolean;
  seniorSales: boolean;
  admin: boolean;
  elsa: boolean;
  licenseTrial: boolean;
  incentive: boolean;
  priceInformation: boolean;
  referenceNumber: boolean;
  settingsUser: boolean;
  settingsApproval: boolean;
  settingsRole: boolean;
  settingsExpiredTime: boolean;
  settingsCustomField: boolean;
  settingsTermAndCondition: boolean;
};

const getSalesRole = (): SalesRole => {
  const { permissions } = JSON.parse(localStorage.getItem('user') ?? '{}');
  return permissions.sales;
};

export default getSalesRole;
