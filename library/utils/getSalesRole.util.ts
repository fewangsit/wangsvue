export type SalesRole = {
  sales: boolean;
  seniorSales: boolean;
  admin: boolean;
  elsa: boolean;
  licenseTrial: boolean;
  incentive: boolean;
  priceInformation: boolean;
  referenceNumber: boolean;
  manageDistributor: boolean;
  managePartner: boolean;
  manageProduct: boolean;
  settingsUser: boolean;
  settingsApproval: boolean;
  settingsRole: boolean;
  settingsExpiredTime: boolean;
  settingsPPN: boolean;
  settingsCustomField: boolean;
  settingsTermAndCondition: boolean;
  approvalProduct: boolean;
  approvalLicenseTrial: boolean;
  approvalSPRF: boolean;
  approvalQuotation: boolean;
  approvalBillingForm: boolean;
  approvalCashback: boolean;
  approvalElsa: boolean;
  approvalQRF: boolean;
};

const getSalesRole = (): SalesRole => {
  const { permissions } = JSON.parse(localStorage.getItem('user') ?? '{}');
  return permissions.sales;
};

export default getSalesRole;
