import io from "socket.io-client";

class SocketHelper {
    constructor(ENDPOINT) {
        this.socket = io(ENDPOINT);
    }
    get() {
        return this.socket;
    }
}

export default SocketHelper;
