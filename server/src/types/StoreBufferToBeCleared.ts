import Tag from "./Tag";
import V from "./V";

type StoreBufferToBeCleared = {
    tag: Tag;
    address: number | null;
    v: V;
};

export default StoreBufferToBeCleared;
