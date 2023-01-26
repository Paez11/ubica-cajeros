import { ICashier } from "./ICashier";
import { IClient } from "./IClient";

export interface ITransacction{
    id: number,
    qr: string,
    startDate: Date,
    endDate: Date,
    amount: number,
    type: string,
    entity: string,
    client: IClient,
    cashier: ICashier
}