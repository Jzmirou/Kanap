
export class CustomError extends Error {
    /**
     * @param {string} message 
     */
    constructor(message) {
        super()
        this.message = message;
        this.name = "";
    }
}
