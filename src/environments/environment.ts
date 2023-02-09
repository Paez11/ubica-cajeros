export const environment = {
    production: false,
    api:{
        url:'http://172.16.16.103:8080',
        endpoint:{
            cashiersbyradius:'/api/cashiers/distance',
            cashiersbycp:'/api/cashiers/cp',
            cashiersbydefaultradius:'/api/cashiers/distancedefault'
        }
    }
};
