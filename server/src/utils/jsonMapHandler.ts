import RegisterFile from "../main/RegisterFile";
import DataCache from "../main/caches/DataCache";
import DataCacheCellInstance from "../types/DataCacheCellInstance";
import RegisterFileCellInstance from "../types/RegisterFileCellInstance";

export function mapToRegisterArray(registerFile: RegisterFile): RegisterFileCellInstance[] {
    let result: RegisterFileCellInstance[] = [];
    for (let [key, value] of registerFile.getRegisters().entries()) {
        result.push({
            name: key,
            value: value.content,
            qi: value.qi!
        });
    }
    return result;
}

export function mapToDataArray(dataCache: DataCache): DataCacheCellInstance[] {
    let result: DataCacheCellInstance[] = [];
    for (let [key, value] of dataCache.getData().entries()) {
        result.push({
            address: key,
            value
        });
    }
    return result;
}
