import React, { useContext } from 'react';
import { Sensor } from '../../common/types';
import { WebsocketContext } from '../../common/websocketsContext';
import { Container, ConnectionStatus, SensorName, ConnectionBlock } from './styled';
import { Button } from '../../common/ui/button';

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
    <Container>
      <SensorName>{sensor.name}</SensorName>
      <ConnectionBlock>
        <ConnectionStatus className={sensor.connected ? 'connected' : 'disconnected'} /><span>{sensor.connected ? 'Connected' : 'Disconnected'}</span>
      </ConnectionBlock>
      <p>{sensor.value ?? '- -'} {sensor.unit}</p>
      <Button className="secondary" type="button" onClick={onDisconnect}>Disconnect</Button>
      <Button className="primary" type="button" onClick={onConnect}>Connect</Button>
    </Container>
  )
}

export default SensorDisplay;
