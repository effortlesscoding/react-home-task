/* eslint-disable import/first */

const mockWebsocket = {
    addNewSensor: jest.fn<void, [Sensor]>(),
}

jest.mock('./hooks', () => ({
    useWebSocket: (_: string, handleMessage: Function) => {
        mockWebsocket.addNewSensor.mockImplementation((sensor) => handleMessage({ data: JSON.stringify(sensor) }));

        return {
            state: 1,
            sendMessage: jest.fn(),
        };
    }
}));

import App from ".";
import { render, screen, act } from '@testing-library/react';
import { Sensor } from "../common/types"

const defaultSensor: Sensor = {
    id: `1`,
    name: `Sensor 1`,
    connected: false,
    unit: 'C',
    value: null,
}

const buildSensor = (sensor: Partial<Sensor>): Sensor => ({
    ...defaultSensor,
    ...sensor,
});

const setup = () => {
    return render(
        <App />
    );
};


describe('App', () => {
    it('should render nothing and then add new sensors as they come from websockets', () => {
        setup();
        expect(screen.queryAllByTestId('sensor-unit')).toHaveLength(0);

        act(() => {
            mockWebsocket.addNewSensor(buildSensor({ id: '1' }));
            mockWebsocket.addNewSensor(buildSensor({ id: '2' }));
        })

        expect(screen.queryAllByTestId('sensor-unit')).toHaveLength(2);
    });

    it('should render nothing, add a sensor and then update it, if it comes again from the websockets', () => {
        const { container } = setup();
        expect(screen.queryAllByTestId('sensor-unit')).toHaveLength(0);

        act(() => {
            mockWebsocket.addNewSensor(buildSensor({ id: '1', connected: false }));
        })

        expect(screen.queryAllByTestId('sensor-unit')).toHaveLength(1);
        expect(container.textContent).toMatchInlineSnapshot(`"Server connection: openSensor 1Disconnected- - CDisconnectConnect"`);

        act(() => {
            mockWebsocket.addNewSensor(buildSensor({ id: '1', connected: true }));
        })

        expect(screen.queryAllByTestId('sensor-unit')).toHaveLength(1);
        expect(container.textContent).toMatchInlineSnapshot(`"Server connection: openSensor 1Connected- - CDisconnectConnect"`);
    });
});

