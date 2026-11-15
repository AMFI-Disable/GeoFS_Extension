// Procedural data shared by the archived V3.9 and V4.0 Checklist System scripts.
export interface ChecklistProcedure {
  title: string;
  items: Array<{ text: string; desc: string; sync?: string }>;
}

export const ARCHIVED_PROCEDURES: Record<string, ChecklistProcedure[]> = {
    "boeing 737": [
        {
            title: "COCKPIT PREPARATION",
            items: [
                { text: "Parking Brake - SET", desc: "Ensure the aircraft does not roll during power-up.", sync: "parkingBrake" },
                { text: "Battery Switch - ON/GUARD", desc: "Main DC power is required for all systems." },
                { text: "Standby Power - AUTO", desc: "Backup power for critical instruments." },
                { text: "L/R Fuel Pumps - ON", desc: "Provides fuel pressure to the APU." },
                { text: "APU - START", desc: "Wait for 'APU GEN OFF BUS' light before continuing." }
            ]
        },
        {
            title: "BEFORE TAXI",
            items: [
                { text: "Generators 1 & 2 - ON", desc: "Transfer power from APU to engine generators." },
                { text: "Probe Heat - ON", desc: "Prevents ice buildup on speed sensors." },
                { text: "Flaps - 5", desc: "Standard takeoff configuration for 737.", sync: "flaps:2" },
                { text: "Flight Controls - CHECK", desc: "Move stick and rudder to ensure full travel." }
            ]
        },
        {
            title: "DESCENT & APPROACH",
            items: [
                { text: "Altimeter - SET", desc: "Update barometric pressure to local airport setting." },
                { text: "Auto-brake - 2", desc: "Sets the automatic braking intensity for landing." },
                { text: "Speed Brake - ARMED", desc: "Spoilers will deploy automatically upon touchdown.", sync: "airbrakes" },
                { text: "Landing Gear - DOWN", desc: "Must be confirmed down before 1,000ft AGL." }
            ]
        }
    ],
    "airbus a320": [
        {
            title: "PRELIMINARY COCKPIT PREP",
            items: [
                { text: "Batteries 1 & 2 - ON", desc: "Check voltage is above 25.5V." },
                { text: "External Power - AS REQ", desc: "Use ground power if available to save fuel." },
                { text: "ADIRS 1, 2, 3 - NAV", desc: "Aligns the Inertial Reference System (takes 7-10 mins)." },
                { text: "Crew Oxygen - CHECK", desc: "Ensure pressure is sufficient for the flight." }
            ]
        },
        {
            title: "AFTER START",
            items: [
                { text: "APU Bleed - OFF", desc: "Engines now provide air pressure for air conditioning." },
                { text: "Engine Anti-ice - AS REQ", desc: "Turn ON if OAT is below 10°C in visible moisture." },
                { text: "ECAM Status - CHECK", desc: "Ensure no 'BLUE' items remain on the status page." }
            ]
        },
        {
            title: "LANDING CONFIG",
            items: [
                { text: "Auto-land - MONITOR", desc: "Confirm CAT III status if performing an auto-land." },
                { text: "Flaps - FULL", desc: "Landing configuration for shortest rollout.", sync: "flaps:full" },
                { text: "Cabin - READY", desc: "Confirm cabin crew have secured the galley." }
            ]
        }
    ],
    "cessna 172": [
        {
            title: "PRE-FLIGHT",
            items: [
                { text: "Fuel Selector - BOTH", desc: "Ensure fuel flows from both wing tanks." },
                { text: "Mixture - RICH", desc: "Maximum fuel flow for engine start." },
                { text: "Master Switch - ON", desc: "Activates the electrical bus." },
                { text: "Beacon Light - ON", desc: "Warns ground crew that engine is about to start." }
            ]
        },
        {
            title: "BEFORE TAKEOFF",
            items: [
                { text: "Elevator Trim - TAKEOFF", desc: "Set neutral pitch for rotation." },
                { text: "Magnetos - CHECK", desc: "Run-up at 1800 RPM to check ignition systems." },
                { text: "Carb Heat - COLD", desc: "Ensure full engine power for takeoff." }
            ]
        }
    ],
    "generic": [
        {
            title: "PRE-FLIGHT",
            items: [
                { text: "Parking Brake - SET", desc: "Prevent uncommanded movement.", sync: "parkingBrake" },
                { text: "Fuel Level - CHECK", desc: "Verify sufficient fuel for planned route." },
                { text: "Instruments - SET", desc: "Check PFD and Navigation displays." }
            ]
        },
        {
            title: "TAKEOFF",
            items: [
                { text: "Lights - ON", desc: "Landing and Strobe lights for visibility." },
                { text: "Flaps - SET", desc: "Standard takeoff flap setting.", sync: "flaps" },
                { text: "Throttle - MAX", desc: "Apply full power smoothly." }
            ]
        },
        {
            title: "LANDING",
            items: [
                { text: "Gear - DOWN", desc: "Confirm three green lights." },
                { text: "Flaps - FULL", desc: "Increase drag and lower stall speed.", sync: "flaps:full" },
                { text: "Airspeed - VREF", desc: "Maintain stable approach speed." }
            ]
        }
    ]
};
