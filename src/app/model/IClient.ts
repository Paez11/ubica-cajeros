export interface IClient{
    id: number,
    name: string,
    account: string,
    lat?: number,
    lng?: number,
    distance?: number
}