export const environment = {
  production: false,
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1',

  // OpalTrace — IAM
  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',
 
  // OpalTrace — Mineral Extraction
  platformProviderBatchesEndpointPath: '/batches',
  platformProviderAlertsEndpointPath: '/alerts',

  // OpalTrace — Custody Chain
  platformProviderLocationUpdatesEndpointPath: '/locationUpdates',

  // OpalTrace — Refinery Processing
  platformProviderRefineryBatchesEndpointPath: '/refineryBatches',
  platformProviderSublotsEndpointPath: '/sublots',
  platformProviderShrinkageRecordsEndpointPath: '/shrinkageRecords',

  // OpalTrace — Jewelry Inventory
  platformProviderJewelryProductsEndpointPath: '/jewelryProducts',
  platformProviderCertificatesEndpointPath: '/certificates',

  // OpalTrace — Consumer Experience
  platformProviderVerificationEventsEndpointPath: '/verificationEvents',

  // OpalTrace — Subscriptions
  platformProviderSubscriptionsEndpointPath: '/subscriptions',
  platformProviderBillingRecordsEndpointPath: '/billingRecords',

  logoProviderApiBaseUrl: 'https://img.logo.dev.com/'
};
