export interface IClient{
    id: number,
    name: string,
    account: string,
    dni: string,
    password: string,
    email?: string,
    lat?: number,
    lng?: number
}