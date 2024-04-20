import { createContext } from 'react';

interface WebSocketInterface {
  sendMessage: (evt: string) => void;
}

export const WebsocketContext = createContext<WebSocketInterface | null>(null);