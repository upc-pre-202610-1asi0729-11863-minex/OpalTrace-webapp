export const environment = {
  production: false,
  platformProviderApiBaseUrl: 'http://localhost:8080/api/v1',

  // OpalTrace — IAM
  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',

  // OpalTrace — Mineral Extraction
  platformProviderBatchesEndpointPath: '/mineral-batches',
  platformProviderAlertsEndpointPath: '/mineral-batches',

  // OpalTrace — Custody Chain
  platformProviderLocationUpdatesEndpointPath: '/mineral-batches',

  // OpalTrace — Refinery Processing
  platformProviderRefineryBatchesEndpointPath: '/refinery/batches',
  platformProviderSublotsEndpointPath: '/refinery/batches',
  platformProviderShrinkageRecordsEndpointPath: '/refinery/batches',

  // OpalTrace — Jewelry Inventory
  platformProviderJewelryProductsEndpointPath: '/jewelry-inventory',
  platformProviderCertificatesEndpointPath: '/jewelry-inventory',

  // OpalTrace — Consumer Experience
  platformProviderVerificationEventsEndpointPath: '/verify',

  // OpalTrace — Subscriptions
  platformProviderSubscriptionsEndpointPath: '/subscriptions',
  platformProviderBillingRecordsEndpointPath: '/billing',

  logoProviderApiBaseUrl: 'https://img.logo.dev.com/'
};
