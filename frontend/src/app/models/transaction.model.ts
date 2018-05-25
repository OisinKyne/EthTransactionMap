
export interface Transaction {
    id: string;
    label: string;
    _id: string;
    hash: string;
    toAddress: string;
    fromAddress:string;
    date: Date;
    eth: Number;
    gasUsed: Number;
    blockNumber: Number;
    info: string;
}