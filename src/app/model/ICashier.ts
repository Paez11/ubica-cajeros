export interface ICashier{
    id: number,
    photo: string,
    address: string,
    cp: string,
    locality: string,
    latitude: number,
    longitude: number,
    balance: number,
    available: boolean
}