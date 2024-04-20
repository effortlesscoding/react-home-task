import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../common/constants/config';
import { Sensor } from '../common/types';
import SensorDisplay from './sensor-display';
import { WebsocketContext } from '../common/websocketsContext';

enum ReadyState {
  UNINSTANTIATED = -1,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

const readyStateToMessage = {
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  [ReadyState.OPEN]: 'open',
  [ReadyState.CLOSING]: 'open',
  [ReadyState.CLOSED]: 'open',
}

const useWebSocket = (url: string, handleMessage: (evt: MessageEvent<any>) => void) => {
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

const getSensor = (evt: MessageEvent<unknown>): Sensor | null => {
  try {
    const data = JSON.parse(evt.data as string);
    const properties = Object.keys(data);
    const sensorKeys: Array<keyof Sensor> = ['id', 'name', 'connected', 'unit'];
    if (sensorKeys.every(k => properties.includes(k))) {
      return data as Sensor;
    }
  } catch(e) {
    console.error(e);
  }
  return null;
}

function App() {
  const [sensors, setSensors] = useState<Record<string, Sensor>>({});
  const handleMessage = useCallback((evt: MessageEvent) => {
    const s = getSensor(evt)
    if (s) {
      setSensors((state) => ({ ...state, [s.id]: s }));
    }
  }, []);

  const { sendMessage, state } = useWebSocket(config.wsUrl, handleMessage);

  return (
    <WebsocketContext.Provider value={{ sendMessage }}>
      <div className="App">
        <header className="App-header">
          State: {readyStateToMessage[state]}
        </header>
        {Object.values(sensors).map(sensor => (
          <SensorDisplay
            key={sensor.id}
            sensor={sensor}
          />
        ))}
      </div>
    </WebsocketContext.Provider>
  );
}

export default App;
