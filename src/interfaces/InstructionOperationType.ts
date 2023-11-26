export interface RType {
    Label?: string;
    Op: string;
    Dest: string;
    Src1: string;
    Src2: string;
}

export interface IType {
    Label?: string;
    Op: string;
    Dest: string;
    Src1: string;
    Immediate: string;
}

export interface LoadType {
    Label?: string;
    Op: string;
    Dest: string;
    Address: number;
}

export interface StoreType {
    Label?: string;
    Op: string;
    Src: string;
    Address: number;
}

export interface BNEZType {
    Op: string;
    Label: string;
}
