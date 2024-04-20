import { useEffect, useRef, useState } from "react";
import { config } from "../common/constants/config";
import { ReadyState } from "../common/constants";

export const useWebSocket = (url: string, handleMessage: (evt: MessageEvent<any>) => void) => {
    const [state, setState] = useState(ReadyState.UNINSTANTIATED)
    const wsRef = useRef<WebSocket>();
    const handleRef = useRef(handleMessage);

    useEffect(() => {
        handleRef.current = handleMessage;
    }, [handleMessage]);

    useEffect(() => {
        if (wsRef.current) {
            setState(ReadyState.CLOSING);
            wsRef.current.close();
        }
        const websocket = new WebSocket(config.wsUrl);
        websocket.onclose = () => {
            console.log('onclose');
            setState(ReadyState.CLOSED);
        };
        websocket.onopen = () => {
            console.log('onopen');
            setState(ReadyState.OPEN);
        };
        websocket.onmessage = (evt) => handleRef.current(evt);
        wsRef.current = websocket;
    }, [url]);

    const sendMessage = (msg: string) => {
        if (wsRef.current) {
            wsRef.current.send(msg);
        }
    }
    return {
        state,
        sendMessage,
    };
}