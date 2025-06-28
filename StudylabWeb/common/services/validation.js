export function isEmptyString(input) {
    return !input || (typeof input === "string" && input.trim() === "");
}
