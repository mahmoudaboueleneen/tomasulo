import Instructions from "../types/Instructions";

export const parseInstructions = async (input: Instructions | null | undefined): Promise<string[]> => {
    if (typeof input === "string") {
        return input.split("\n");
    }
    if (input instanceof File) {
        return await readFileContent(input);
    }
    return [];
};

const readFileContent = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve((event.target?.result as string).split(/\r\n|\r|\n/));
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};
