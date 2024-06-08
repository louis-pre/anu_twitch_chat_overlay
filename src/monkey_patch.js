(function () {
    // Save the original WebSocket constructor
    const OriginalWebSocket = window.WebSocket;

    // Create a new WebSocket constructor
    function PatchedWebSocket(url, protocols) {
        console.log('WebSocket is being created:', url, protocols);

        // Create an instance of the original WebSocket
        const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

        // const originalSend = ws.send;
        // ws.send = function (data) {
        //     if (data.includes("JOIN")) {
        //         console.log(printStackTrace().join('\n\n'));
        //     }
        //     originalSend.apply(ws, arguments);
        // };
        const originalSend = ws.send;
        ws.send = function (data) {
            if (data.includes("JOIN")) {
                console.log((new Error()).stack);
            }
            originalSend.apply(ws, arguments);
        };

        // Save the chat websocket reference
        if (url === 'wss://irc-ws.chat.twitch.tv:443') {
            window.chat_websocket = ws;
        }
        return ws;
    }

    // Copy the original WebSocket properties to the new constructor
    const propertyDescriptors = Object.getOwnPropertyDescriptors(OriginalWebSocket);
    Object.defineProperties(PatchedWebSocket, propertyDescriptors);

    // Replace the original WebSocket with the patched one
    window.WebSocket = PatchedWebSocket;
})();