export const environment = {
    production: false,
    api:{
        url:'http://localhost:8080',
        endpoint:{
            cashiersbyradius:'/api/cashiers/distance',
            cashiersbycp:'/api/cashiers/cp',
            cashiersbystreet:'/api/cashiers/street',
            cashiersbydefaultradius:'/api/cashiers/distancedefault',
            transactions:'/api/transactions',
            incidences:'/api/incidences',
            cashiersAll:'/api/cashiers'
        }
    }
};
