import type { TILEntry } from "../index"

const _ardupilot_sitl_default_cmac: TILEntry = {
    id: "ardupilot-sitl-default-cmac",
    title: "ArduPilot SITL starts at CMAC near Canberra unless you give it a location",
    date: "2026-10-17",
    category: "Robotics",
    published: true,
    body: "Run [`sim_vehicle.py`](https://ardupilot.org/dev/docs/using-sitl-for-ardupilot-testing.html) without `-L` and the simulated drone appears at CMAC, a model aircraft field outside Canberra, because the SITL start position parameters default to -35.363261, 149.165230. `-L` picks a named site from [`Tools/autotest/locations.txt`](https://github.com/ArduPilot/ardupilot/blob/master/Tools/autotest/locations.txt) and `-l` takes a raw latitude, longitude, altitude and heading. For terrain matching this matters a lot: a LiDAR map of England is no use to a vehicle that thinks it is in Australia.",
    detail: [
      {
        type: "code",
        lang: "bash",
        code: `# default start: CMAC, Australia
sim_vehicle.py -v ArduCopter --console --map

# a named site from locations.txt
sim_vehicle.py -v ArduCopter -L Ballarat --console --map

# a custom start: lat,lon,alt (metres above sea level),heading
sim_vehicle.py -v ArduCopter -l 52.4862,-1.8904,140,0 --console --map`,
        caption: "Three ways to choose where the simulated vehicle starts",
      },
      {
        type: "note",
        text: "Your own named sites can live in `~/.config/ardupilot/locations.txt` on Linux, using the same `NAME=lat,lon,alt,heading` format, so they survive a fresh clone of ArduPilot.",
      },
      {
        type: "link",
        url: "https://github.com/ArduPilot/ardupilot/blob/master/Tools/autotest/locations.txt",
        label: "ArduPilot: locations.txt",
        description: "Every named start location, CMAC first.",
      },
    ],
    tags: ["ArduPilot", "SITL", "drones", "simulation"],
    source: { label: "ArduPilot Dev docs: using SITL", url: "https://ardupilot.org/dev/docs/using-sitl-for-ardupilot-testing.html" },
    project: { name: "LidarSAT", url: "https://github.com/ENGNERDS", slug: "lidarsat" },
    series: "Drone simulation with ArduPilot",
    seriesPart: 1,
  }

export default _ardupilot_sitl_default_cmac
