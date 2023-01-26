import { ICashier } from "./ICashier";
import { IClient } from "./IClient";

export interface IIncidence{
    id: number,
    message: string,
    client: IClient,
    cashier: ICashier
}