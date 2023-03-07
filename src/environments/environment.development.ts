export const environment = {
    production: false,
    api:{
        url:'http://vps-3fdb8b00.vps.ovh.net',  //hay que poner url del server y quitar el proxy >>ng serve --proxy-config proxy.conf.json --ssl
        endpoint:{
            cashiersbyradius:'/api/cashiers/distance',
            cashiersbycp:'/api/cashiers/cp',
            cashiersbystreet:'/api/cashiers/address',
            cashiersbydefaultradius:'/api/cashiers/distancedefault',
            transactions:'/api/transactions',
            incidences:'/api/incidences',
            cashiersAll:'/api/cashiers',
            clientAll:'/api/client',
            clientbydni:'/api/client/dni',
            clientbyid:'/api/client',
            newclient:'/api/client'     
        }
    },
    nominatimAPI:{
        url:'https://nominatim.openstreetmap.org/'
    }
};
