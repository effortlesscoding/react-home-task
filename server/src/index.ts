import rxjs from 'rxjs';
import operators from 'rxjs/operators';
import ws from 'ws';

type Sensor = {
    id: string;
    name: string;
    connected: boolean;
    unit: string;
    value: string | null;
}

type IOTMessage = {
  command: string;
  id: string;
}

const sensors: Sensor[] = [
    { id: "0", name: "Temperature", connected: !1, unit: "°C", value: "15" },
    { id: "1", name: "Pressure", connected: !1, unit: "kPa", value: "101.325" },
    { id: "2", name: "Humidity", connected: !1, unit: "%", value: "45" },
    { id: "3", name: "PM2.5", connected: !1, unit: "PM2.5", value: "50" },
    { id: "4", name: "PM10", connected: !1, unit: "PM10", value: "43" },
    { id: "5", name: "Wind", connected: !1, unit: "m/s", value: "7" },
  ]

const generateSensor = function (e: Sensor): Sensor {
  return {
      id: e.id,
      name: e.name,
      connected: isSensorConnected(e.id),
      unit: e.unit,
      value: isSensorConnected(e.id)
      ? (Math.random() + Number(e.value)).toFixed(3).toString()
      : null,
  };
};

  let connectedSensors: string[] = [];

  const isSensorConnected = function (sensorId: string) {
    return connectedSensors.includes(sensorId);
  };

  const PORT: number = Number(process.env.PORT) || 5001;

  const wss = new ws.Server({ port: PORT });

  let initialized = !1;

  wss.on("connection", function (r) {
    r.on("message", function (n) {
      let t: IOTMessage | null = null;
      try {
        t = JSON.parse(n.toString()) as IOTMessage;
      } catch (e) {
        console.error('error::', e);
        t = n as unknown as IOTMessage;
      }
      console.log("Client -> Server: ", t);

      if (t?.command === 'disconnect' && t.id) {
        connectedSensors = connectedSensors.filter(function (e) {
          return e !== t.id;
        })
      } else if (t?.command === 'disconnect' && t.id) {
        if (!connectedSensors.includes(t.id)) {
          connectedSensors.push(t.id)
        }
      }
    });

    sensors.forEach(function (e) {
        r.send(JSON.stringify(generateSensor(e)));
    });

    if (!initialized) {
      new rxjs.Observable<Sensor>(function (n) {
        const interval = setInterval(function () {
          sensors.forEach(function (e) {
            n.next(generateSensor(e));
          });
        }, 100);
        return function () {
          clearInterval(interval);
        };
      })
        .pipe(
          operators.concatMap((e) => rxjs.of(e).pipe(operators.delay(5 + 5 * Math.random())))
        )
        .subscribe(function (n) {
          if (connectedSensors.includes(n.id)) {
            wss.clients.forEach(function (e) {
              return e.send(JSON.stringify(n));
            });
          }
        });

      initialized = true;
    };
  });
