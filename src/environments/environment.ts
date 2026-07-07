export const environment = {
  production: true,
  platformProviderApiBaseUrl: 'https://opaltrace-platform-production.up.railway.app/api/v1',

  // OpalTrace — IAM
  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',
  platformProviderForgotPasswordEndpointPath: '/authentication/forgot-password',
  platformProviderResetPasswordEndpointPath: '/authentication/reset-password',

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
  platformProviderConsumerEndpointPath: '/consumer',

  // OpalTrace — Analytics
  platformProviderAnalyticsEndpointPath: '/analytics',

  // OpalTrace — Subscriptions
  platformProviderSubscriptionsEndpointPath: '/subscriptions',
  platformProviderBillingRecordsEndpointPath: '/billing',

  logoProviderApiBaseUrl: 'https://img.logo.dev.com/'
};
