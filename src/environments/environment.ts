export const environment = {
  production: false,
  api: {
    url: 'http://localhost:8080',
    endpoint: {
      cashiersbyradius: '/api/cashiers/distance',
      cashiersbycp: '/api/cashiers/cp',
      cashiersbystreet: '/api/cashiers/address',
      cashiersbydefaultradius: '/api/cashiers/distancedefault',
      transactions: '/api/transactions',
      incidences: '/api/incidences',
      cashiersAll: '/api/cashiers',
      clientAll: '/api/client',
      clientbydni: '/api/client/dni',
      clientbyid: '/api/client',
      newclient: '/api/client',
      newPassword: '/api/client/rp',
    },
  },
  nominatimAPI: {
    url: 'https://nominatim.openstreetmap.org/',
  },
};
