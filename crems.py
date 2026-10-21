import tkinter as tk
from tkinter import ttk, messagebox
from dataclasses import dataclass
from datetime import datetime


# ============================================================
# CREMS - CLEAN ROOM ENVIRONMENTAL MONITORING SYSTEM
# Competition Prototype - Simulation Version
# ============================================================


@dataclass
class Setpoints:
    temperature_min: float = 21.0
    temperature_max: float = 23.0

    humidity_min: float = 45.0
    humidity_max: float = 55.0

    pressure_min: float = 1.0
    pressure_max: float = 3.0


class CREMSApp:

    def __init__(self, root):

        self.root = root

        self.root.title(
            "CREMS - Clean Room Environmental Monitoring System"
        )

        self.root.geometry("1200x780")
        self.root.minsize(1000, 650)

        # ====================================================
        # SETPOINTS
        # ====================================================

        self.setpoints = Setpoints()

        # ====================================================
        # SIMULATED SENSOR VALUES
        # ====================================================

        self.temperature = 22.0
        self.humidity = 50.0

        self.inside_pressure = 1013.2
        self.outside_pressure = 1011.5

        self.door_open = False

        # ====================================================
        # ACTUATOR STATES
        # ====================================================

        self.tec_state = "OFF"
        self.water_spray = "OFF"
        self.dehumidification = "OFF"

        self.door_led = "GREEN"

        # ====================================================
        # SENSOR HEALTH
        # ====================================================

        self.sensor_health = {
            "DHT22": True,
            "BMP280 Inside": True,
            "BMP280 Outside": True,
            "HC-SR04": True
        }

        # ====================================================
        # SYSTEM INFORMATION
        # ====================================================

        self.last_action = "No corrective action required."

        self.diagnosis = (
            "SYSTEM HEALTHY\n\n"
            "All parameters are within the configured ranges."
        )

        self.event_history = []

        # ====================================================
        # BUILD INTERFACE
        # ====================================================

        self.create_header()

        self.create_tabs()

        self.create_monitoring_tab()

        self.create_control_tab()

        self.create_diagnosis_tab()

        self.create_simulation_tab()

        # ====================================================
        # START SYSTEM
        # ====================================================

        self.update_system()

    # ========================================================
    # HEADER
    # ========================================================

    def create_header(self):

        header = tk.Frame(
            self.root,
            padx=20,
            pady=15
        )

        header.pack(fill="x")

        title = tk.Label(
            header,
            text="CREMS",
            font=("Arial", 25, "bold")
        )

        title.pack(side="left")

        subtitle = tk.Label(
            header,
            text="Clean Room Environmental Monitoring System",
            font=("Arial", 13)
        )

        subtitle.pack(
            side="left",
            padx=20
        )

        self.system_status = tk.Label(
            header,
            text="● SYSTEM ONLINE",
            font=("Arial", 12, "bold"),
            fg="green"
        )

        self.system_status.pack(
            side="right"
        )

    # ========================================================
    # TABS
    # ========================================================

    def create_tabs(self):

        self.tabs = ttk.Notebook(self.root)

        self.tabs.pack(
            fill="both",
            expand=True,
            padx=15,
            pady=5
        )

        self.monitoring_tab = tk.Frame(self.tabs)

        self.control_tab = tk.Frame(self.tabs)

        self.diagnosis_tab = tk.Frame(self.tabs)

        self.simulation_tab = tk.Frame(self.tabs)

        self.tabs.add(
            self.monitoring_tab,
            text="Live Monitoring"
        )

        self.tabs.add(
            self.control_tab,
            text="Setpoints & Actions"
        )

        self.tabs.add(
            self.diagnosis_tab,
            text="Self Diagnosis"
        )

        self.tabs.add(
            self.simulation_tab,
            text="Simulation Controls"
        )

    # ========================================================
    # MONITORING TAB
    # ========================================================

    def create_monitoring_tab(self):

        for column in range(3):

            self.monitoring_tab.columnconfigure(
                column,
                weight=1
            )

        for row in range(4):

            self.monitoring_tab.rowconfigure(
                row,
                weight=1
            )

        # ----------------------------------------------------
        # VARIABLES
        # ----------------------------------------------------

        self.temperature_display = tk.StringVar()

        self.humidity_display = tk.StringVar()

        self.inside_pressure_display = tk.StringVar()

        self.outside_pressure_display = tk.StringVar()

        self.pressure_difference_display = tk.StringVar()

        self.door_display = tk.StringVar()

        # ----------------------------------------------------
        # CARDS
        # ----------------------------------------------------

        self.temperature_status = self.create_card(
            self.monitoring_tab,
            0,
            0,
            "TEMPERATURE",
            self.temperature_display,
            "°C"
        )

        self.humidity_status = self.create_card(
            self.monitoring_tab,
            0,
            1,
            "HUMIDITY",
            self.humidity_display,
            "% RH"
        )

        self.pressure_difference_status = self.create_card(
            self.monitoring_tab,
            0,
            2,
            "PRESSURE DIFFERENTIAL",
            self.pressure_difference_display,
            "hPa"
        )

        self.inside_pressure_status = self.create_card(
            self.monitoring_tab,
            1,
            0,
            "INSIDE PRESSURE",
            self.inside_pressure_display,
            "hPa"
        )

        self.outside_pressure_status = self.create_card(
            self.monitoring_tab,
            1,
            1,
            "OUTSIDE PRESSURE",
            self.outside_pressure_display,
            "hPa"
        )

        self.door_status = self.create_card(
            self.monitoring_tab,
            1,
            2,
            "DOOR",
            self.door_display,
            ""
        )

        # ----------------------------------------------------
        # CURRENT ACTIONS
        # ----------------------------------------------------

        action_frame = tk.LabelFrame(
            self.monitoring_tab,
            text="CURRENT ACTIONS",
            padx=15,
            pady=15
        )

        action_frame.grid(
            row=2,
            column=0,
            columnspan=3,
            padx=10,
            pady=10,
            sticky="nsew"
        )

        self.action_display = tk.StringVar()

        tk.Label(
            action_frame,
            textvariable=self.action_display,
            font=("Arial", 11),
            justify="left",
            anchor="w"
        ).pack(
            fill="both",
            expand=True
        )

        # ----------------------------------------------------
        # LAST UPDATE
        # ----------------------------------------------------

        self.update_display = tk.StringVar()

        tk.Label(
            self.monitoring_tab,
            textvariable=self.update_display,
            anchor="w",
            font=("Arial", 10)
        ).grid(
            row=3,
            column=0,
            columnspan=3,
            padx=15,
            pady=5,
            sticky="ew"
        )

    # ========================================================
    # CREATE CARD
    # ========================================================

    def create_card(
        self,
        parent,
        row,
        column,
        title,
        variable,
        unit
    ):

        frame = tk.LabelFrame(
            parent,
            text=title,
            padx=15,
            pady=10
        )

        frame.grid(
            row=row,
            column=column,
            padx=10,
            pady=10,
            sticky="nsew"
        )

        value = tk.Label(
            frame,
            textvariable=variable,
            font=("Arial", 26, "bold")
        )

        value.pack()

        tk.Label(
            frame,
            text=unit,
            font=("Arial", 10)
        ).pack()

        status = tk.Label(
            frame,
            text="NORMAL",
            font=("Arial", 11, "bold"),
            fg="green"
        )

        status.pack(
            pady=8
        )

        return status

    # ========================================================
    # CONTROL TAB
    # ========================================================

    def create_control_tab(self):

        container = tk.Frame(
            self.control_tab,
            padx=25,
            pady=25
        )

        container.pack(
            fill="both",
            expand=True
        )

        # ----------------------------------------------------
        # SETPOINTS
        # ----------------------------------------------------

        setpoint_frame = tk.LabelFrame(
            container,
            text="SETPOINTS / ACCEPTABLE RANGES",
            padx=20,
            pady=20
        )

        setpoint_frame.pack(
            fill="x"
        )

        fields = [

            ("Temperature minimum (°C)",
             "temperature_min"),

            ("Temperature maximum (°C)",
             "temperature_max"),

            ("Humidity minimum (% RH)",
             "humidity_min"),

            ("Humidity maximum (% RH)",
             "humidity_max"),

            ("Pressure Δ minimum (hPa)",
             "pressure_min"),

            ("Pressure Δ maximum (hPa)",
             "pressure_max")
        ]

        self.setpoint_entries = {}

        for index, (label, attribute) in enumerate(fields):

            row = index // 2

            column = (index % 2) * 2

            tk.Label(
                setpoint_frame,
                text=label
            ).grid(
                row=row,
                column=column,
                padx=10,
                pady=8,
                sticky="w"
            )

            entry = tk.Entry(
                setpoint_frame,
                width=12
            )

            entry.insert(
                0,
                str(
                    getattr(
                        self.setpoints,
                        attribute
                    )
                )
            )

            entry.grid(
                row=row,
                column=column + 1,
                padx=10,
                pady=8
            )

            self.setpoint_entries[attribute] = entry

        tk.Button(
            setpoint_frame,
            text="APPLY SETPOINTS",
            command=self.apply_setpoints,
            font=("Arial", 10, "bold")
        ).grid(
            row=3,
            column=0,
            columnspan=4,
            pady=15
        )

        # ----------------------------------------------------
        # ACTIONS
        # ----------------------------------------------------

        action_frame = tk.LabelFrame(
            container,
            text="CONTROL OUTPUTS",
            padx=20,
            pady=20
        )

        action_frame.pack(
            fill="x",
            pady=20
        )

        self.tec_label = tk.Label(
            action_frame,
            text="TEC1-12705: OFF",
            font=("Arial", 12, "bold")
        )

        self.tec_label.pack(
            anchor="w",
            pady=5
        )

        self.spray_label = tk.Label(
            action_frame,
            text="Water Spray: OFF",
            font=("Arial", 12, "bold")
        )

        self.spray_label.pack(
            anchor="w",
            pady=5
        )

        self.dehumidification_label = tk.Label(
            action_frame,
            text="Dehumidification Command: OFF",
            font=("Arial", 12, "bold")
        )

        self.dehumidification_label.pack(
            anchor="w",
            pady=5
        )

        self.door_led_label = tk.Label(
            action_frame,
            text="Door Indicator: GREEN",
            font=("Arial", 12, "bold")
        )

        self.door_led_label.pack(
            anchor="w",
            pady=5
        )

    # ========================================================
    # SELF DIAGNOSIS TAB
    # ========================================================

    def create_diagnosis_tab(self):

        container = tk.Frame(
            self.diagnosis_tab,
            padx=20,
            pady=20
        )

        container.pack(
            fill="both",
            expand=True
        )

        # ----------------------------------------------------
        # SENSOR HEALTH
        # ----------------------------------------------------

        sensor_frame = tk.LabelFrame(
            container,
            text="SENSOR HEALTH",
            padx=15,
            pady=15
        )

        sensor_frame.pack(
            fill="x"
        )

        self.sensor_labels = {}

        for sensor in self.sensor_health:

            row = tk.Frame(sensor_frame)

            row.pack(
                fill="x",
                pady=4
            )

            tk.Label(
                row,
                text=sensor,
                width=25,
                anchor="w"
            ).pack(
                side="left"
            )

            label = tk.Label(
                row,
                text="✓ OK",
                fg="green",
                font=("Arial", 10, "bold")
            )

            label.pack(
                side="left"
            )

            self.sensor_labels[sensor] = label

        # ----------------------------------------------------
        # DIAGNOSIS
        # ----------------------------------------------------

        diagnosis_frame = tk.LabelFrame(
            container,
            text="DIAGNOSIS REPORT",
            padx=15,
            pady=15
        )

        diagnosis_frame.pack(
            fill="both",
            expand=True,
            pady=15
        )

        self.diagnosis_text = tk.Text(
            diagnosis_frame,
            wrap="word",
            font=("Arial", 11)
        )

        self.diagnosis_text.pack(
            fill="both",
            expand=True
        )

        tk.Button(
            diagnosis_frame,
            text="RUN DIAGNOSTIC CHECK",
            command=self.run_diagnostics,
            font=("Arial", 10, "bold")
        ).pack(
            pady=10
        )

    # ========================================================
    # SIMULATION TAB
    # ========================================================

    def create_simulation_tab(self):

        container = tk.Frame(
            self.simulation_tab,
            padx=25,
            pady=25
        )

        container.pack(
            fill="both",
            expand=True
        )

        tk.Label(
            container,
            text=(
                "Use the controls below to simulate sensor conditions "
                "and demonstrate CREMS automatic response."
            ),
            font=("Arial", 11)
        ).pack(
            anchor="w",
            pady=(0, 15)
        )

        input_frame = tk.LabelFrame(
            container,
            text="SIMULATED SENSOR INPUT",
            padx=20,
            pady=20
        )

        input_frame.pack(
            fill="x"
        )

        # ----------------------------------------------------
        # SENSOR INPUTS
        # ----------------------------------------------------

        self.sim_temperature = tk.StringVar(
            value="22.0"
        )

        self.sim_humidity = tk.StringVar(
            value="50.0"
        )

        self.sim_inside_pressure = tk.StringVar(
            value="1013.2"
        )

        self.sim_outside_pressure = tk.StringVar(
            value="1011.5"
        )

        fields = [

            ("Temperature (°C)",
             self.sim_temperature),

            ("Humidity (% RH)",
             self.sim_humidity),

            ("Inside Pressure (hPa)",
             self.sim_inside_pressure),

            ("Outside Pressure (hPa)",
             self.sim_outside_pressure)
        ]

        for index, (label, variable) in enumerate(fields):

            tk.Label(
                input_frame,
                text=label
            ).grid(
                row=index,
                column=0,
                padx=10,
                pady=8,
                sticky="w"
            )

            tk.Entry(
                input_frame,
                textvariable=variable,
                width=15
            ).grid(
                row=index,
                column=1,
                padx=10,
                pady=8
            )

        # ----------------------------------------------------
        # DOOR
        # ----------------------------------------------------

        tk.Label(
            input_frame,
            text="Door Status"
        ).grid(
            row=4,
            column=0,
            padx=10,
            pady=8,
            sticky="w"
        )

        self.door_selection = ttk.Combobox(
            input_frame,
            values=["CLOSED", "OPEN"],
            state="readonly",
            width=12
        )

        self.door_selection.set("CLOSED")

        self.door_selection.grid(
            row=4,
            column=1,
            padx=10,
            pady=8
        )

        # ----------------------------------------------------
        # APPLY
        # ----------------------------------------------------

        button_frame = tk.Frame(
            container
        )

        button_frame.pack(
            fill="x",
            pady=15
        )

        tk.Button(
            button_frame,
            text="APPLY SIMULATION",
            command=self.apply_simulation,
            font=("Arial", 10, "bold")
        ).pack(
            side="left",
            padx=5
        )

        tk.Button(
            button_frame,
            text="NORMAL CONDITIONS",
            command=self.normal_condition
        ).pack(
            side="left",
            padx=5
        )

        tk.Button(
            button_frame,
            text="LOW TEMPERATURE",
            command=self.low_temperature
        ).pack(
            side="left",
            padx=5
        )

        tk.Button(
            button_frame,
            text="HIGH TEMPERATURE",
            command=self.high_temperature
        ).pack(
            side="left",
            padx=5
        )

        tk.Button(
            button_frame,
            text="LOW HUMIDITY",
            command=self.low_humidity
        ).pack(
            side="left",
            padx=5
        )

        tk.Button(
            button_frame,
            text="HIGH HUMIDITY",
            command=self.high_humidity
        ).pack(
            side="left",
            padx=5
        )

        tk.Button(
            button_frame,
            text="DOOR OPEN",
            command=self.open_door
        ).pack(
            side="left",
            padx=5
        )

        # ----------------------------------------------------
        # EVENT LOG
        # ----------------------------------------------------

        log_frame = tk.LabelFrame(
            container,
            text="EVENT LOG",
            padx=10,
            pady=10
        )

        log_frame.pack(
            fill="both",
            expand=True
        )

        self.log_text = tk.Text(
            log_frame,
            wrap="word",
            font=("Consolas", 10)
        )

        self.log_text.pack(
            fill="both",
            expand=True
        )

    # ========================================================
    # APPLY SETPOINTS
    # ========================================================

    def apply_setpoints(self):

        try:

            new_values = {}

            for attribute, entry in self.setpoint_entries.items():

                new_values[attribute] = float(
                    entry.get()
                )

            if (
                new_values["temperature_min"]
                >=
                new_values["temperature_max"]
            ):

                raise ValueError(
                    "Temperature minimum must be lower than maximum."
                )

            if (
                new_values["humidity_min"]
                >=
                new_values["humidity_max"]
            ):

                raise ValueError(
                    "Humidity minimum must be lower than maximum."
                )

            if (
                new_values["pressure_min"]
                >=
                new_values["pressure_max"]
            ):

                raise ValueError(
                    "Pressure minimum must be lower than maximum."
                )

            for attribute, value in new_values.items():

                setattr(
                    self.setpoints,
                    attribute,
                    value
                )

            self.log(
                "Setpoints successfully updated."
            )

            self.evaluate_conditions()

        except ValueError as error:

            messagebox.showerror(
                "Invalid Setpoint",
                str(error)
            )

    # ========================================================
    # APPLY SIMULATION
    # ========================================================

    def apply_simulation(self):

        try:

            self.temperature = float(
                self.sim_temperature.get()
            )

            self.humidity = float(
                self.sim_humidity.get()
            )

            self.inside_pressure = float(
                self.sim_inside_pressure.get()
            )

            self.outside_pressure = float(
                self.sim_outside_pressure.get()
            )

            self.door_open = (
                self.door_selection.get()
                == "OPEN"
            )

            self.evaluate_conditions()

            self.refresh_interface()

        except ValueError:

            messagebox.showerror(
                "Invalid Input",
                "Please enter valid numerical sensor values."
            )

    # ========================================================
    # PREDEFINED SCENARIOS
    # ========================================================

    def normal_condition(self):

        self.sim_temperature.set("22.0")
        self.sim_humidity.set("50.0")
        self.sim_inside_pressure.set("1013.2")
        self.sim_outside_pressure.set("1011.5")
        self.door_selection.set("CLOSED")

        self.apply_simulation()

    def low_temperature(self):

        self.sim_temperature.set("18.5")
        self.sim_humidity.set("50.0")
        self.sim_inside_pressure.set("1013.2")
        self.sim_outside_pressure.set("1011.5")
        self.door_selection.set("CLOSED")

        self.apply_simulation()

    def high_temperature(self):

        self.sim_temperature.set("26.0")
        self.sim_humidity.set("50.0")
        self.sim_inside_pressure.set("1013.2")
        self.sim_outside_pressure.set("1011.5")
        self.door_selection.set("CLOSED")

        self.apply_simulation()

    def low_humidity(self):

        self.sim_temperature.set("22.0")
        self.sim_humidity.set("35.0")
        self.sim_inside_pressure.set("1013.2")
        self.sim_outside_pressure.set("1011.5")
        self.door_selection.set("CLOSED")

        self.apply_simulation()

    def high_humidity(self):

        self.sim_temperature.set("22.0")
        self.sim_humidity.set("70.0")
        self.sim_inside_pressure.set("1013.2")
        self.sim_outside_pressure.set("1011.5")
        self.door_selection.set("CLOSED")

        self.apply_simulation()

    def open_door(self):

        self.sim_temperature.set("22.0")
        self.sim_humidity.set("50.0")
        self.sim_inside_pressure.set("1013.2")
        self.sim_outside_pressure.set("1011.5")
        self.door_selection.set("OPEN")

        self.apply_simulation()

    # ========================================================
    # MAIN DECISION LOGIC
    # ========================================================

    def evaluate_conditions(self):

        pressure_difference = (
            self.inside_pressure
            -
            self.outside_pressure
        )

        # Reset outputs

        self.tec_state = "OFF"

        self.water_spray = "OFF"

        self.dehumidification = "OFF"

        self.last_action = (
            "No corrective action required."
        )

        events = []

        # ----------------------------------------------------
        # TEMPERATURE
        # ----------------------------------------------------

        if (
            self.temperature
            <
            self.setpoints.temperature_min
        ):

            self.tec_state = "HEATING"

            self.last_action = (
                "TEC1-12705 → HEATING"
            )

            events.append(
                f"TEMPERATURE LOW: "
                f"{self.temperature:.1f} °C"
            )

        elif (
            self.temperature
            >
            self.setpoints.temperature_max
        ):

            self.tec_state = "COOLING"

            self.last_action = (
                "TEC1-12705 → COOLING"
            )

            events.append(
                f"TEMPERATURE HIGH: "
                f"{self.temperature:.1f} °C"
            )

        # ----------------------------------------------------
        # HUMIDITY
        # ----------------------------------------------------

        if (
            self.humidity
            <
            self.setpoints.humidity_min
        ):

            self.water_spray = "ON"

            self.last_action = (
                "Water Spray → ON"
            )

            events.append(
                f"HUMIDITY LOW: "
                f"{self.humidity:.1f}%"
            )

        elif (
            self.humidity
            >
            self.setpoints.humidity_max
        ):

            self.dehumidification = "ON"

            self.last_action = (
                "Dehumidification Command → ON"
            )

            events.append(
                f"HUMIDITY HIGH: "
                f"{self.humidity:.1f}%"
            )

        # ----------------------------------------------------
        # PRESSURE
        # ----------------------------------------------------

        if (
            pressure_difference
            <
            self.setpoints.pressure_min
        ):

            events.append(
                f"PRESSURE DIFFERENTIAL LOW: "
                f"{pressure_difference:.2f} hPa"
            )

        elif (
            pressure_difference
            >
            self.setpoints.pressure_max
        ):

            events.append(
                f"PRESSURE DIFFERENTIAL HIGH: "
                f"{pressure_difference:.2f} hPa"
            )

        # ----------------------------------------------------
        # DOOR
        # ----------------------------------------------------

        if self.door_open:

            self.door_led = "RED"

            events.append(
                "DOOR OPEN: RED LED ON"
            )

        else:

            self.door_led = "GREEN"

        # ----------------------------------------------------
        # DIAGNOSIS
        # ----------------------------------------------------

        self.diagnosis = self.generate_diagnosis(
            pressure_difference
        )

        # ----------------------------------------------------
        # EVENT LOG
        # ----------------------------------------------------

        for event in events:

            self.log(event)

    # ========================================================
    # SELF DIAGNOSIS
    # ========================================================

    def generate_diagnosis(
        self,
        pressure_difference
    ):

        problems = []

        # ----------------------------------------------------
        # TEMPERATURE DIAGNOSIS
        # ----------------------------------------------------

        if (
            self.temperature
            <
            self.setpoints.temperature_min
        ):

            problems.append(
                "TEMPERATURE LOW\n"
                f"Current: {self.temperature:.1f} °C\n"
                f"Required: "
                f"{self.setpoints.temperature_min:.1f}–"
                f"{self.setpoints.temperature_max:.1f} °C\n"
                "Action: TEC1-12705 → HEATING\n"
                "Possible causes: low ambient temperature, "
                "HVAC issue, TEC control issue, or sensor error.\n"
                "Recommended solution: Check TEC driver, "
                "power supply, thermal contact and DHT22."
            )

        elif (
            self.temperature
            >
            self.setpoints.temperature_max
        ):

            problems.append(
                "TEMPERATURE HIGH\n"
                f"Current: {self.temperature:.1f} °C\n"
                f"Required: "
                f"{self.setpoints.temperature_min:.1f}–"
                f"{self.setpoints.temperature_max:.1f} °C\n"
                "Action: TEC1-12705 → COOLING\n"
                "Possible causes: heat load, HVAC issue, "
                "TEC control issue, or sensor error.\n"
                "Recommended solution: Check TEC driver, "
                "power supply and DHT22."
            )

        # ----------------------------------------------------
        # HUMIDITY DIAGNOSIS
        # ----------------------------------------------------

        if (
            self.humidity
            <
            self.setpoints.humidity_min
        ):

            problems.append(
                "HUMIDITY LOW\n"
                f"Current: {self.humidity:.1f}% RH\n"
                "Action: Water spray → ON\n"
                "Possible causes: insufficient moisture "
                "or humidification system problem.\n"
                "Recommended solution: Check water supply, "
                "pump and spray mechanism."
            )

        elif (
            self.humidity
            >
            self.setpoints.humidity_max
        ):

            problems.append(
                "HUMIDITY HIGH\n"
                f"Current: {self.humidity:.1f}% RH\n"
                "Action: Dehumidification command → ON\n"
                "Prototype representation: indicator output.\n"
                "Possible causes: excess moisture, "
                "water spray, HVAC imbalance.\n"
                "Recommended solution: Check airflow and "
                "dehumidification system."
            )

        # ----------------------------------------------------
        # PRESSURE DIAGNOSIS
        # ----------------------------------------------------

        if (
            pressure_difference
            <
            self.setpoints.pressure_min
        ):

            problems.append(
                "PRESSURE DIFFERENTIAL LOW\n"
                f"Current ΔP: {pressure_difference:.2f} hPa\n"
                "Possible causes: door opening, air leakage "
                "or HVAC/airflow problem.\n"
                "Recommended solution: Check door sealing, "
                "room leakage and airflow."
            )

        elif (
            pressure_difference
            >
            self.setpoints.pressure_max
        ):

            problems.append(
                "PRESSURE DIFFERENTIAL HIGH\n"
                f"Current ΔP: {pressure_difference:.2f} hPa\n"
                "Possible cause: excessive positive airflow.\n"
                "Recommended solution: Check HVAC airflow "
                "and pressure control."
            )

        # ----------------------------------------------------
        # DOOR
        # ----------------------------------------------------

        if self.door_open:

            problems.append(
                "DOOR OPEN\n"
                "Action: RED LED → ON\n"
                "Possible effect: pressure disturbance "
                "and clean-room contamination risk.\n"
                "Recommended solution: Close the door."
            )

        # ----------------------------------------------------
        # SENSOR HEALTH
        # ----------------------------------------------------

        failed_sensors = []

        for sensor, status in self.sensor_health.items():

            if not status:

                failed_sensors.append(sensor)

        if failed_sensors:

            problems.append(
                "SENSOR FAILURE\n"
                "Failed: "
                + ", ".join(failed_sensors)
                + "\n"
                "Recommended solution: Check power, "
                "ground, signal wiring and sensor connection."
            )

        # ----------------------------------------------------
        # FINAL RESULT
        # ----------------------------------------------------

        if not problems:

            return (
                "✓ SYSTEM HEALTHY\n\n"
                "All monitored parameters are within "
                "their configured ranges.\n\n"
                "No corrective action required."
            )

        return (
            "⚠ ABNORMAL EVENT DETECTED\n\n"
            + "\n\n".join(
                problems
            )
        )

    # ========================================================
    # DIAGNOSTIC REPORT
    # ========================================================

    def run_diagnostics(self):

        pressure_difference = (
            self.inside_pressure
            -
            self.outside_pressure
        )

        report = ""

        report += (
            "CREMS SELF-DIAGNOSTIC REPORT\n"
        )

        report += (
            "=" * 55
            + "\n\n"
        )

        # Sensor status

        report += "SENSOR STATUS\n"

        report += "-" * 55 + "\n"

        for sensor, status in self.sensor_health.items():

            if status:

                report += (
                    f"✓ {sensor}: OK\n"
                )

            else:

                report += (
                    f"✗ {sensor}: FAILURE\n"
                )

        # Current readings

        report += "\nCURRENT READINGS\n"

        report += "-" * 55 + "\n"

        report += (
            f"Temperature: "
            f"{self.temperature:.1f} °C\n"
        )

        report += (
            f"Humidity: "
            f"{self.humidity:.1f} % RH\n"
        )

        report += (
            f"Inside Pressure: "
            f"{self.inside_pressure:.1f} hPa\n"
        )

        report += (
            f"Outside Pressure: "
            f"{self.outside_pressure:.1f} hPa\n"
        )

        report += (
            f"Pressure Differential: "
            f"{pressure_difference:+.2f} hPa\n"
        )

        report += (
            f"Door: "
            f"{'OPEN' if self.door_open else 'CLOSED'}\n"
        )

        # Actions

        report += "\nCONTROL OUTPUTS\n"

        report += "-" * 55 + "\n"

        report += (
            f"TEC1-12705: "
            f"{self.tec_state}\n"
        )

        report += (
            f"Water Spray: "
            f"{self.water_spray}\n"
        )

        report += (
            f"Dehumidification: "
            f"{self.dehumidification}\n"
        )

        report += (
            f"Door LED: "
            f"{self.door_led}\n"
        )

        # Diagnosis

        report += "\nDIAGNOSIS\n"

        report += "-" * 55 + "\n"

        report += self.diagnosis

        # Display

        self.diagnosis_text.delete(
            "1.0",
            "end"
        )

        self.diagnosis_text.insert(
            "end",
            report
        )

    # ========================================================
    # REFRESH INTERFACE
    # ========================================================

    def refresh_interface(self):

        pressure_difference = (
            self.inside_pressure
            -
            self.outside_pressure
        )

        # ----------------------------------------------------
        # SENSOR VALUES
        # ----------------------------------------------------

        self.temperature_display.set(
            f"{self.temperature:.1f}"
        )

        self.humidity_display.set(
            f"{self.humidity:.1f}"
        )

        self.inside_pressure_display.set(
            f"{self.inside_pressure:.1f}"
        )

        self.outside_pressure_display.set(
            f"{self.outside_pressure:.1f}"
        )

        self.pressure_difference_display.set(
            f"{pressure_difference:+.2f}"
        )

        self.door_display.set(
            "OPEN"
            if self.door_open
            else
            "CLOSED"
        )

        # ----------------------------------------------------
        # STATUS
        # ----------------------------------------------------

        self.update_status(
            self.temperature_status,
            (
                self.temperature
                <
                self.setpoints.temperature_min
                or
                self.temperature
                >
                self.setpoints.temperature_max
            )
        )

        self.update_status(
            self.humidity_status,
            (
                self.humidity
                <
                self.setpoints.humidity_min
                or
                self.humidity
                >
                self.setpoints.humidity_max
            )
        )

        self.update_status(
            self.pressure_difference_status,
            (
                pressure_difference
                <
                self.setpoints.pressure_min
                or
                pressure_difference
                >
                self.setpoints.pressure_max
            )
        )

        self.inside_pressure_status.config(
            text="MEASURED",
            fg="black"
        )

        self.outside_pressure_status.config(
            text="MEASURED",
            fg="black"
        )

        # ----------------------------------------------------
        # DOOR STATUS
        # ----------------------------------------------------

        if self.door_open:

            self.door_status.config(
                text="OPEN",
                fg="red"
            )

        else:

            self.door_status.config(
                text="CLOSED",
                fg="green"
            )

        # ----------------------------------------------------
        # ACTION DISPLAY
        # ----------------------------------------------------

        action_text = (
            f"TEC1-12705: "
            f"{self.tec_state}\n\n"

            f"Water Spray: "
            f"{self.water_spray}\n\n"

            f"Dehumidification Command: "
            f"{self.dehumidification}\n\n"

            f"Door Indicator: "
            f"{self.door_led}\n\n"

            f"Last Action: "
            f"{self.last_action}"
        )

        self.action_display.set(
            action_text
        )

        # ----------------------------------------------------
        # CONTROL TAB
        # ----------------------------------------------------

        self.tec_label.config(
            text=(
                f"TEC1-12705: "
                f"{self.tec_state}"
            )
        )

        self.spray_label.config(
            text=(
                f"Water Spray: "
                f"{self.water_spray}"
            )
        )

        self.dehumidification_label.config(
            text=(
                f"Dehumidification Command: "
                f"{self.dehumidification}"
            )
        )

        self.door_led_label.config(
            text=(
                f"Door Indicator: "
                f"{self.door_led}"
            )
        )

        # ----------------------------------------------------
        # SENSOR HEALTH
        # ----------------------------------------------------

        for sensor, status in self.sensor_health.items():

            if status:

                self.sensor_labels[sensor].config(
                    text="✓ OK",
                    fg="green"
                )

            else:

                self.sensor_labels[sensor].config(
                    text="✗ FAILURE",
                    fg="red"
                )

        # ----------------------------------------------------
        # DIAGNOSIS DISPLAY
        # ----------------------------------------------------

        self.diagnosis_text.delete(
            "1.0",
            "end"
        )

        self.diagnosis_text.insert(
            "end",
            self.diagnosis
        )

        # ----------------------------------------------------
        # UPDATE TIME
        # ----------------------------------------------------

        current_time = datetime.now().strftime(
            "%H:%M:%S"
        )

        self.update_display.set(
            f"Last system update: {current_time}"
        )

    # ========================================================
    # STATUS COLOR
    # ========================================================

    def update_status(
        self,
        label,
        abnormal
    ):

        if abnormal:

            label.config(
                text="ABNORMAL",
                fg="red"
            )

        else:

            label.config(
                text="NORMAL",
                fg="green"
            )

    # ========================================================
    # EVENT LOG
    # ========================================================

    def log(self, message):

        timestamp = datetime.now().strftime(
            "%H:%M:%S"
        )

        event = (
            f"[{timestamp}] "
            f"{message}"
        )

        self.event_history.append(
            event
        )

        if hasattr(
            self,
            "log_text"
        ):

            self.log_text.insert(
                "end",
                event + "\n"
            )

            self.log_text.see(
                "end"
            )

    # ========================================================
    # SYSTEM UPDATE LOOP
    # ========================================================

    def update_system(self):

        self.evaluate_conditions()

        self.refresh_interface()

        self.root.after(
            1000,
            self.update_system
        )


# ============================================================
# START APPLICATION
# ============================================================

if __name__ == "__main__":

    root = tk.Tk()

    application = CREMSApp(
        root
    )

    root.mainloop()
