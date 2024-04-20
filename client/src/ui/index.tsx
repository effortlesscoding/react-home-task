import { useCallback, useState } from 'react';
import { config } from '../common/constants/config';
import { Sensor } from '../common/types';
import SensorDisplay from './sensor-display';
import { WebsocketContext } from '../common/websocketsContext';
import { SensorsContainer, SensorsHeader } from './styled';
import { useWebSocket } from './hooks';
import { ReadyState } from '../common/constants';

export const readyStateToMessage = {
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  [ReadyState.OPEN]: 'open',
  [ReadyState.CLOSING]: 'open',
  [ReadyState.CLOSED]: 'open',
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
        <SensorsHeader>
          <h3>Server connection: {readyStateToMessage[state]}</h3>
        </SensorsHeader>
        <SensorsContainer>
          {Object.values(sensors).map(sensor => (
            <SensorDisplay
              key={sensor.id}
              sensor={sensor}
            />
          ))}
        </SensorsContainer>
      </div>
    </WebsocketContext.Provider>
  );
}

export default App;
