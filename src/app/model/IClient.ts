export interface IClient{
    id?: number,
    account: string,
    dni: string,
    password: string,
    email?: string,
    lat?: number,
    lng?: number,
    distance?: number
}