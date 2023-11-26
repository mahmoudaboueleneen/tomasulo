function removeLastSymbol(word: string): string {
    return word.replace(/[:,]/g, "");
}

export default removeLastSymbol;
