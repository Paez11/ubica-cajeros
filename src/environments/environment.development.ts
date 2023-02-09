export const environment = {
    production: false,
    api:{
        url:'https://localhost:4200',  //hay que poner url del server y quitar el proxy >>ng serve --proxy-config proxy.conf.json --ssl
        endpoint:{
            cashiersbyradius:'/api/cashiers/distance',
            cashiersbycp:'/api/cashiers/cp',
            cashiersbydefaultradius:'/api/cashiers/distancedefault',
            transactions:'/api/transactions'
        }
    }
};
