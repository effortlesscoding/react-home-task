import React, { useContext } from 'react';
import { Sensor } from '../../common/types';
import { WebsocketContext } from '../../common/websocketsContext';

interface Props {
  sensor: Sensor;
}

const SensorDisplay = ({
    sensor,
}: Props) => {
  const ws = useContext(WebsocketContext);

  const onConnect = () => {
    ws?.sendMessage(JSON.stringify({ command: "connect", id: sensor.id }));
  }

  const onDisconnect = () => {
    ws?.sendMessage(JSON.stringify({ command: "disconnect", id: sensor.id }));
  }

  return (
    <div>
      {JSON.stringify(sensor)}
      <p>#{sensor.id} {sensor.name}</p>
      <div>
        Connection: <div className={sensor.connected ? 'connected' : 'disconnected'} >{sensor.connected ? '+' : '-'}</div>
      </div>
      <p>{sensor.value}{sensor.unit}</p>
      <button type="button" onClick={onDisconnect}>Disconnect</button>
      <button type="button" onClick={onConnect}>Connect</button>
    </div>
  )
}

export default SensorDisplay;
