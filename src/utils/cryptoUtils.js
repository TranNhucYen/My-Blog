exports.generateSecurePassword = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    return Array.from(array, x => chars[x % chars.length]).join("");
}
