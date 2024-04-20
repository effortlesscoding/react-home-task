import { screen, render, fireEvent } from '@testing-library/react';
import { WebsocketContext } from '../../common/websocketsContext';
import SensorDisplay from '.';
import { Sensor } from '../../common/types';

const defaultSensor: Sensor = {
    id: '1',
    name: 'Temperature',
    connected: true,
    unit: 'C',
    value: '12',
}  

describe('SensorDisplay', () => {
    const setup = (sensor = defaultSensor) => {
        const sendMessage = jest.fn();
        const view = render(
            <WebsocketContext.Provider value={{ sendMessage }}>
                <SensorDisplay
                    sensor={sensor}
                />
            </WebsocketContext.Provider>
        );
        return {
            result: view,
            sendMessage,
        }
    }
    it('should render a connected sensor', () => {
        const { result } = setup({ ...defaultSensor, connected: true });
        expect(screen.getByTestId('sensor-unit')).toBeInTheDocument();
        expect(screen.getByTestId('disconnect-btn')).toBeInTheDocument();
        expect(screen.getByTestId('connect-btn')).toBeInTheDocument();
        expect(result.container.textContent).toMatchInlineSnapshot(`"TemperatureConnected12 CDisconnectConnect"`);
    });

    it('should render a disconnected sensor', () => {
        const { result } = setup({ ...defaultSensor, connected: false });
        expect(screen.getByTestId('sensor-unit')).toBeInTheDocument();
        expect(screen.getByTestId('disconnect-btn')).toBeInTheDocument();
        expect(screen.getByTestId('connect-btn')).toBeInTheDocument();
        expect(result.container.textContent).toMatchInlineSnapshot(`"TemperatureDisconnected12 CDisconnectConnect"`);
    });

    it('should respond to connect click if the sensor is disconnected', () => {
        const { sendMessage } = setup({ ...defaultSensor, connected: false });
        fireEvent.click(screen.getByTestId('connect-btn'));
        expect(sendMessage).toHaveBeenCalledWith(JSON.stringify({
            command: 'connect',
            id: '1',
        }));
    });

    it('should not trigger `sendMessage` when connect is clicked if the sensor is connected', () => {
        const { sendMessage } = setup({ ...defaultSensor, connected: true });
        fireEvent.click(screen.getByTestId('connect-btn'));
        expect(sendMessage).toHaveBeenCalledTimes(0);
    });

    it('should respond to disconnect click if the sensor is connected', () => {
        const { sendMessage } = setup({ ...defaultSensor, connected: true });
        fireEvent.click(screen.getByTestId('disconnect-btn'));
        expect(sendMessage).toHaveBeenCalledWith(JSON.stringify({
            command: 'disconnect',
            id: '1',
        }));
    });

    it('should not trigger `sendMessage` when disconnect is clicked if the sensor is disconnected', () => {
        const { sendMessage } = setup({ ...defaultSensor, connected: false });
        fireEvent.click(screen.getByTestId('disconnect-btn'));
        expect(sendMessage).toHaveBeenCalledTimes(0);
    });
})