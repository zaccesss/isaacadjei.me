import type { TILEntry } from "../index"

const _pymavlink_recv_match_type: TILEntry = {
    id: "pymavlink-recv-match-type",
    title: "pymavlink recv_match can wait for one message type and give up after a timeout",
    date: "2026-10-20",
    category: "Robotics",
    published: true,
    body: "[pymavlink](https://mavlink.io/en/mavgen_python/)'s `recv_match(type=\"GLOBAL_POSITION_INT\", blocking=True, timeout=5)` skips every other message and returns the first matching one. Once the timeout passes it returns `None` instead. `type` also accepts a list and a `condition` string can filter on field values. The same call works on a live link or on a flight log opened with `mavutil.mavlink_connection`, where it returns `None` at the end of the file. On a live link the opposite trick matters: draining with `recv_match(blocking=False)` until it returns `None`, then reading `m.messages[name]`, gives the newest message instead of a stale one from the queue.",
    detail: [
      {
        type: "code",
        lang: "python",
        code: `from pymavlink import mavutil

log = mavutil.mavlink_connection("flight.bin")
while (msg := log.recv_match(type=["GPS", "BARO"])) is not None:
    if msg.get_type() == "GPS":
        print(msg.TimeUS, msg.Lat, msg.Lng, msg.Alt)`,
        caption: "Reading only GPS and barometer records from an ArduPilot DataFlash log",
      },
      {
        type: "note",
        text: "DataFlash `.bin` logs use [ArduPilot's own record names](https://ardupilot.org/copter/docs/logmessages.html) (GPS, BARO, ATT), not MAVLink message names like GLOBAL_POSITION_INT. Telemetry logs (`.tlog`) use the MAVLink names.",
      },
    ],
    tags: ["pymavlink", "MAVLink", "drones", "Python"],
    source: { label: "MAVLink guide: pymavlink", url: "https://mavlink.io/en/mavgen_python/" },
    project: { name: "LidarSAT", url: "https://github.com/ENGNERDS", slug: "lidarsat" },
    series: "Drone simulation with ArduPilot",
    seriesPart: 2,
  }

export default _pymavlink_recv_match_type
