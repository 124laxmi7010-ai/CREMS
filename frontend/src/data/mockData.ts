import {
  Cleanroom,
  EnvironmentalProfile,
  Sensor,
  SensorReading,
  MonitoringSession,
  EnvironmentalEvent,
  CorrectiveAction,
  Diagnosis,
  UserProfile,
} from '../types';

export const mockCurrentUser: UserProfile = {
  username: 'schen@biopharm-solutions.com',
  name: 'Dr. Sarah Chen, Ph.D.',
  role: 'Senior QA / Environmental Compliance Officer',
  department: 'Quality Assurance & Sterility Assurance',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
};

export const sampleUsers = [
  {
    username: 'schen@biopharm-solutions.com',
    name: 'Dr. Sarah Chen',
    role: 'QA / Sterility Assurance Lead',
    dept: 'Quality Assurance',
  },
  {
    username: 'mstevens@biopharm-solutions.com',
    name: 'Mark Stevens',
    role: 'Cleanroom Production Operator',
    dept: 'Sterile Manufacturing',
  },
  {
    username: 'erostova@biopharm-solutions.com',
    name: 'Elena Rostova',
    role: 'Facility HVAC & Engineering Manager',
    dept: 'Facilities & Metrology',
  },
];

export const mockProfiles: EnvironmentalProfile[] = [
  {
    id: 'prof-grade-a',
    name: 'EU GMP Grade A / ISO 5 Aseptic Filling',
    isoGrade: 'ISO 14644-1 Class 5',
    description: 'Ultra-clean sterile processing zone for high-risk operations such as vial filling, stopper bowl, and open ampoules.',
    targetApplication: 'Sterile Vial & Syringe Aseptic Core Filling',
    createdAt: '2025-01-15',
    thresholds: {
      temperature: {
        parameter: 'temperature',
        label: 'Temperature',
        min: 18.0,
        max: 22.0,
        unit: '°C',
        nominal: 20.0,
        description: 'Controlled room temperature to prevent operator perspiration and preserve heat-sensitive biologics.',
      },
      humidity: {
        parameter: 'humidity',
        label: 'Relative Humidity',
        min: 35.0,
        max: 50.0,
        unit: '% RH',
        nominal: 42.0,
        description: 'Maintained below 50% to inhibit microbial spore revival while preventing static electricity charges.',
      },
      pressure: {
        parameter: 'pressure',
        label: 'Differential Pressure',
        min: 15.0,
        max: 35.0,
        unit: 'Pa',
        nominal: 25.0,
        description: 'Positive pressure cascade relative to adjacent lower-grade corridors to prevent particulate ingress.',
      },
      
      pm25: {
        parameter: 'pm25',
        label: 'PM2.5 (Fine Particulate)',
        min: 0.0,
        max: 0.5,
        unit: 'µg/m³',
        nominal: 0.1,
        description: 'Continuous non-viable airborne particle count monitoring for particles ≥ 0.5 µm.',
      },
      pm10: {
        parameter: 'pm10',
        label: 'PM10 (Macro Particulate)',
        min: 0.0,
        max: 1.0,
        unit: 'µg/m³',
        nominal: 0.2,
        description: 'Monitoring for macro-particles ≥ 5.0 µm indicating glove or garment shed.',
      },
    },
  },
  {
    id: 'prof-grade-b',
    name: 'EU GMP Grade B / ISO 7 Background & Compounding',
    isoGrade: 'ISO 14644-1 Class 7',
    description: 'Background environment immediately surrounding the Grade A zone during aseptic preparation and compounding.',
    targetApplication: 'Sterile Compounding, Filtration & Formulation',
    createdAt: '2025-01-15',
    thresholds: {
      temperature: {
        parameter: 'temperature',
        label: 'Temperature',
        min: 17.5,
        max: 22.5,
        unit: '°C',
        nominal: 20.0,
        description: 'Comfortable operating range for full cleanroom gowning suits.',
      },
      humidity: {
        parameter: 'humidity',
        label: 'Relative Humidity',
        min: 30.0,
        max: 55.0,
        unit: '% RH',
        nominal: 45.0,
        description: 'Moisture control for API solubility and sterile bulk powder blending.',
      },
      pressure: {
        parameter: 'pressure',
        label: 'Differential Pressure',
        min: 10.0,
        max: 25.0,
        unit: 'Pa',
        nominal: 18.0,
        description: 'Differential positive pressure cascade step relative to Grade C zones.',
      },
      
      pm25: {
        parameter: 'pm25',
        label: 'PM2.5 (Fine Particulate)',
        min: 0.0,
        max: 2.0,
        unit: 'µg/m³',
        nominal: 0.4,
        description: 'Class 7 particulate limits during active compounding operations.',
      },
      pm10: {
        parameter: 'pm10',
        label: 'PM10 (Macro Particulate)',
        min: 0.0,
        max: 4.0,
        unit: 'µg/m³',
        nominal: 0.8,
        description: 'Macro particle control for equipment transfer and sanitization.',
      },
    },
  },
  {
    id: 'prof-grade-c',
    name: 'EU GMP Grade C / ISO 8 Gowning & Secondary Processing',
    isoGrade: 'ISO 14644-1 Class 8',
    description: 'Clean area for carrying out less critical stages in the manufacture of sterile products and material airlocks.',
    targetApplication: 'Personnel Gowning, Component Wash & Staging',
    createdAt: '2025-02-01',
    thresholds: {
      temperature: {
        parameter: 'temperature',
        label: 'Temperature',
        min: 17.0,
        max: 24.0,
        unit: '°C',
        nominal: 20.5,
        description: 'Thermal comfort in multi-stage gowning airlocks.',
      },
      humidity: {
        parameter: 'humidity',
        label: 'Relative Humidity',
        min: 30.0,
        max: 60.0,
        unit: '% RH',
        nominal: 46.0,
        description: 'Standard pharmaceutical controlled atmosphere.',
      },
      pressure: {
        parameter: 'pressure',
        label: 'Differential Pressure',
        min: 5.0,
        max: 18.0,
        unit: 'Pa',
        nominal: 12.0,
        description: 'Airlock buffer pressure against non-classified exterior hallway.',
      },
      
      pm25: {
        parameter: 'pm25',
        label: 'PM2.5 (Fine Particulate)',
        min: 0.0,
        max: 5.0,
        unit: 'µg/m³',
        nominal: 1.2,
        description: 'General particulate limits for classified preparation.',
      },
      pm10: {
        parameter: 'pm10',
        label: 'PM10 (Macro Particulate)',
        min: 0.0,
        max: 12.0,
        unit: 'µg/m³',
        nominal: 2.5,
        description: 'Macro particulate limits in gowning transitions.',
      },
    },
  },
  {
    id: 'prof-cold-bio',
    name: 'Cold Biologics Lyophilization & Cryo Quarantine',
    isoGrade: 'ISO 14644-1 Class 7 (Low Temp)',
    description: 'Specialized low-temperature cleanroom suite for freeze-drying and cold bio-formulation.',
    targetApplication: 'Lyophilization Bay & Cold Chain Intermediate Hold',
    createdAt: '2025-02-10',
    thresholds: {
      temperature: {
        parameter: 'temperature',
        label: 'Temperature',
        min: 2.0,
        max: 8.0,
        unit: '°C',
        nominal: 4.5,
        description: 'Strict 2°C to 8°C chilled holding envelope for protein stability.',
      },
      humidity: {
        parameter: 'humidity',
        label: 'Relative Humidity',
        min: 20.0,
        max: 45.0,
        unit: '% RH',
        nominal: 32.0,
        description: 'Ultra-low humidity to prevent condensation on cryogenic vessels.',
      },
      pressure: {
        parameter: 'pressure',
        label: 'Differential Pressure',
        min: 15.0,
        max: 30.0,
        unit: 'Pa',
        nominal: 22.0,
        description: 'Positive pressure isolation against warm external moisture air.',
      },
     
      pm25: {
        parameter: 'pm25',
        label: 'PM2.5 (Fine Particulate)',
        min: 0.0,
        max: 1.5,
        unit: 'µg/m³',
        nominal: 0.3,
        description: 'Aerosol condensation suppression.',
      },
      pm10: {
        parameter: 'pm10',
        label: 'PM10 (Macro Particulate)',
        min: 0.0,
        max: 3.0,
        unit: 'µg/m³',
        nominal: 0.6,
        description: 'Macro particulate monitoring in cold lyophilization bays.',
      },
    },
  },
];

export const mockCleanrooms: Cleanroom[] = [
  {
    id: 'cr-101',
    name: 'Aseptic Filling Suite 1',
    code: 'CR-101',
    location: 'Building B - Sterile Core Block',
    building: 'Building B (Sterile Biologics)',
    floor: 'Floor 2 (Clean Sector)',
    profileId: 'prof-grade-a',
    status: 'warning', // Active differential pressure excursion demo
    monitoringStatus: 'active',
    dimensions: '14.5m x 9.0m x 3.4m',
    airChangesPerHour: 60,
    classification: 'EU GMP Grade A / ISO 5',
    leadSpecialist: 'Dr. Sarah Chen',
  },
  {
    id: 'cr-102',
    name: 'Formulation & Compounding Lab',
    code: 'CR-102',
    location: 'Building B - Formulation Wing',
    building: 'Building B (Sterile Biologics)',
    floor: 'Floor 2 (Clean Sector)',
    profileId: 'prof-grade-b',
    status: 'normal',
    monitoringStatus: 'active',
    dimensions: '18.0m x 12.0m x 3.2m',
    airChangesPerHour: 42,
    classification: 'EU GMP Grade B / ISO 7',
    leadSpecialist: 'Mark Stevens',
  },
  {
    id: 'cr-103',
    name: 'Primary Personnel Gowning Airlock',
    code: 'AL-103',
    location: 'Building B - Central Entry Air Barrier',
    building: 'Building B (Sterile Biologics)',
    floor: 'Floor 2 (Clean Sector)',
    profileId: 'prof-grade-c',
    status: 'normal',
    monitoringStatus: 'active',
    dimensions: '8.0m x 5.0m x 3.0m',
    airChangesPerHour: 30,
    classification: 'EU GMP Grade C / ISO 8',
    leadSpecialist: 'Elena Rostova',
  },
  {
    id: 'cr-104',
    name: 'Lyophilization & Freeze Dry Bay',
    code: 'CR-104',
    location: 'Building B - Sub-zero Cryo Corridor',
    building: 'Building B (Sterile Biologics)',
    floor: 'Floor 1 (Cryo Processing)',
    profileId: 'prof-cold-bio',
    status: 'critical', // Temperature excursion demo
    monitoringStatus: 'active',
    dimensions: '12.0m x 7.5m x 3.5m',
    airChangesPerHour: 48,
    classification: 'ISO 7 Chilled Biologics Zone',
    leadSpecialist: 'Dr. Aris Thorne',
  },
  {
    id: 'cr-105',
    name: 'QC Sterility Microbiology Suite',
    code: 'CR-105',
    location: 'Building C - Analytical Quality Wing',
    building: 'Building C (Testing & Analytics)',
    floor: 'Floor 3 (Microbiology)',
    profileId: 'prof-grade-b',
    status: 'normal',
    monitoringStatus: 'active',
    dimensions: '15.0m x 10.0m x 3.0m',
    airChangesPerHour: 38,
    classification: 'EU GMP Grade B / ISO 7',
    leadSpecialist: 'Maria Gonzalez',
  },
  {
    id: 'cr-106',
    name: 'Sterile Inspection & Capping Cell',
    code: 'CR-106',
    location: 'Building B - Secondary Core Block',
    building: 'Building B (Sterile Biologics)',
    floor: 'Floor 2 (Clean Sector)',
    profileId: 'prof-grade-c',
    status: 'normal',
    monitoringStatus: 'calibrating',
    dimensions: '16.0m x 8.5m x 3.2m',
    airChangesPerHour: 35,
    classification: 'EU GMP Grade C / ISO 8',
    leadSpecialist: 'Mark Stevens',
  },
];

export const mockSensors: Sensor[] = [
  // CR-101 Sensors (Grade A)
  {
    id: 'sens-101-tmp',
    sensorTag: 'SENS-TMP-101A',
    type: 'RTD Platinum Pt100 4-Wire Probe',
    parameter: 'temperature',
    cleanroomId: 'cr-101',
    status: 'normal',
    installationDate: '2024-03-10',
    lastCalibrated: '2025-11-04',
    nextCalibrationDue: '2026-11-04',
    accuracy: '±0.05 °C',
    vendor: 'Vaisala Instruments Inc.',
    firmwareVersion: 'v4.2.1-GMP',
  },
  {
    id: 'sens-101-hum',
    sensorTag: 'SENS-HUM-101A',
    type: 'Capacitive Thin-Film Polymer Hygrometer',
    parameter: 'humidity',
    cleanroomId: 'cr-101',
    status: 'normal',
    installationDate: '2024-03-10',
    lastCalibrated: '2025-11-04',
    nextCalibrationDue: '2026-11-04',
    accuracy: '±0.8 % RH',
    vendor: 'Rotronic AG',
    firmwareVersion: 'v3.8.0',
  },
  {
    id: 'sens-101-prs',
    sensorTag: 'SENS-PRS-101A',
    type: 'Piezo-Resistive Differential Diaphragm Transducer',
    parameter: 'pressure',
    cleanroomId: 'cr-101',
    status: 'warning', // Warning due to pressure differential drop
    installationDate: '2024-03-12',
    lastCalibrated: '2025-12-18',
    nextCalibrationDue: '2026-06-18',
    accuracy: '±0.2 Pa',
    vendor: 'Dwyer Instruments',
    firmwareVersion: 'v5.1.4',
  },
 
  {
    id: 'sens-101-pm25',
    sensorTag: 'SENS-PRT-101A',
    type: 'Optical Laser Diode Particle Counter (0.5µm Channel)',
    parameter: 'pm25',
    cleanroomId: 'cr-101',
    status: 'normal',
    installationDate: '2024-03-15',
    lastCalibrated: '2025-11-20',
    nextCalibrationDue: '2026-05-20',
    accuracy: '±2.5% count efficiency',
    vendor: 'Particle Measuring Systems (PMS)',
    firmwareVersion: 'v6.3.0',
  },
  {
    id: 'sens-101-pm10',
    sensorTag: 'SENS-PRT-101B',
    type: 'Optical Laser Diode Particle Counter (5.0µm Channel)',
    parameter: 'pm10',
    cleanroomId: 'cr-101',
    status: 'normal',
    installationDate: '2024-03-15',
    lastCalibrated: '2025-11-20',
    nextCalibrationDue: '2026-05-20',
    accuracy: '±3.0% count efficiency',
    vendor: 'Particle Measuring Systems (PMS)',
    firmwareVersion: 'v6.3.0',
  },

  // CR-102 Sensors (Grade B)
  {
    id: 'sens-102-tmp',
    sensorTag: 'SENS-TMP-102A',
    type: 'RTD Platinum Pt100 4-Wire Probe',
    parameter: 'temperature',
    cleanroomId: 'cr-102',
    status: 'normal',
    installationDate: '2024-02-14',
    lastCalibrated: '2025-10-05',
    nextCalibrationDue: '2026-10-05',
    accuracy: '±0.05 °C',
    vendor: 'Vaisala Instruments Inc.',
    firmwareVersion: 'v4.2.1-GMP',
  },
  {
    id: 'sens-102-hum',
    sensorTag: 'SENS-HUM-102A',
    type: 'Capacitive Thin-Film Polymer Hygrometer',
    parameter: 'humidity',
    cleanroomId: 'cr-102',
    status: 'normal',
    installationDate: '2024-02-14',
    lastCalibrated: '2025-10-05',
    nextCalibrationDue: '2026-10-05',
    accuracy: '±0.8 % RH',
    vendor: 'Rotronic AG',
    firmwareVersion: 'v3.8.0',
  },
  {
    id: 'sens-102-prs',
    sensorTag: 'SENS-PRS-102A',
    type: 'Piezo-Resistive Differential Diaphragm Transducer',
    parameter: 'pressure',
    cleanroomId: 'cr-102',
    status: 'normal',
    installationDate: '2024-02-14',
    lastCalibrated: '2025-11-15',
    nextCalibrationDue: '2026-11-15',
    accuracy: '±0.2 Pa',
    vendor: 'Dwyer Instruments',
    firmwareVersion: 'v5.1.4',
  },
 
  {
    id: 'sens-102-pm25',
    sensorTag: 'SENS-PRT-102A',
    type: 'Optical Laser Diode Particle Counter (0.5µm Channel)',
    parameter: 'pm25',
    cleanroomId: 'cr-102',
    status: 'normal',
    installationDate: '2024-02-20',
    lastCalibrated: '2025-10-25',
    nextCalibrationDue: '2026-04-25',
    accuracy: '±2.5% count efficiency',
    vendor: 'Particle Measuring Systems (PMS)',
    firmwareVersion: 'v6.3.0',
  },
  {
    id: 'sens-102-pm10',
    sensorTag: 'SENS-PRT-102B',
    type: 'Optical Laser Diode Particle Counter (5.0µm Channel)',
    parameter: 'pm10',
    cleanroomId: 'cr-102',
    status: 'normal',
    installationDate: '2024-02-20',
    lastCalibrated: '2025-10-25',
    nextCalibrationDue: '2026-04-25',
    accuracy: '±3.0% count efficiency',
    vendor: 'Particle Measuring Systems (PMS)',
    firmwareVersion: 'v6.3.0',
  },

  // CR-104 Sensors (Cryo Lyophilization - Critical Temp excursion)
  {
    id: 'sens-104-tmp',
    sensorTag: 'SENS-TMP-104A',
    type: 'Cryogenic Precision Thermistor Probe',
    parameter: 'temperature',
    cleanroomId: 'cr-104',
    status: 'warning',
    installationDate: '2024-05-10',
    lastCalibrated: '2025-12-01',
    nextCalibrationDue: '2026-06-01',
    accuracy: '±0.08 °C',
    vendor: 'Endress+Hauser Inc.',
    firmwareVersion: 'v3.1.2-CRYO',
  },
  {
    id: 'sens-104-hum',
    sensorTag: 'SENS-HUM-104A',
    type: 'Chilled Mirror Dew Point Transmitter',
    parameter: 'humidity',
    cleanroomId: 'cr-104',
    status: 'normal',
    installationDate: '2024-05-10',
    lastCalibrated: '2025-12-01',
    nextCalibrationDue: '2026-06-01',
    accuracy: '±0.5 % RH',
    vendor: 'Michell Instruments',
    firmwareVersion: 'v2.4.8',
  },
  {
    id: 'sens-104-prs',
    sensorTag: 'SENS-PRS-104A',
    type: 'Differential Pressure Transducer',
    parameter: 'pressure',
    cleanroomId: 'cr-104',
    status: 'normal',
    installationDate: '2024-05-12',
    lastCalibrated: '2025-11-19',
    nextCalibrationDue: '2026-11-19',
    accuracy: '±0.2 Pa',
    vendor: 'Dwyer Instruments',
    firmwareVersion: 'v5.1.4',
  },
 
  {
    id: 'sens-104-pm25',
    sensorTag: 'SENS-PRT-104A',
    type: 'Aerosol Particle Counter',
    parameter: 'pm25',
    cleanroomId: 'cr-104',
    status: 'normal',
    installationDate: '2024-05-15',
    lastCalibrated: '2025-10-18',
    nextCalibrationDue: '2026-04-18',
    accuracy: '±2.5%',
    vendor: 'Particle Measuring Systems (PMS)',
    firmwareVersion: 'v6.3.0',
  },
  {
    id: 'sens-104-pm10',
    sensorTag: 'SENS-PRT-104B',
    type: 'Aerosol Particle Counter',
    parameter: 'pm10',
    cleanroomId: 'cr-104',
    status: 'normal',
    installationDate: '2024-05-15',
    lastCalibrated: '2025-10-18',
    nextCalibrationDue: '2026-04-18',
    accuracy: '±3.0%',
    vendor: 'Particle Measuring Systems (PMS)',
    firmwareVersion: 'v6.3.0',
  },

  // CR-103 Sensors (Airlock AL-103)
  {
    id: 'sens-103-prs',
    sensorTag: 'SENS-PRS-103A',
    type: 'Differential Pressure Transducer',
    parameter: 'pressure',
    cleanroomId: 'cr-103',
    status: 'normal',
    installationDate: '2024-01-20',
    lastCalibrated: '2025-10-22',
    nextCalibrationDue: '2026-10-22',
    accuracy: '±0.2 Pa',
    vendor: 'Dwyer Instruments',
    firmwareVersion: 'v5.1.4',
  },
  {
    id: 'sens-103-tmp',
    sensorTag: 'SENS-TMP-103A',
    type: 'Standard RTD Cleanroom Probe',
    parameter: 'temperature',
    cleanroomId: 'cr-103',
    status: 'normal',
    installationDate: '2024-01-20',
    lastCalibrated: '2025-10-22',
    nextCalibrationDue: '2026-10-22',
    accuracy: '±0.1 °C',
    vendor: 'Vaisala Instruments Inc.',
    firmwareVersion: 'v4.2.1-GMP',
  },

  // CR-106 Offline Sensor (Demo offline sensor status)
  {
    id: 'sens-106-pm25',
    sensorTag: 'SENS-PRT-106A',
    type: 'Optical Laser Diode Particle Counter',
    parameter: 'pm25',
    cleanroomId: 'cr-106',
    status: 'offline', // Demostrates 'offline' status
    installationDate: '2024-06-01',
    lastCalibrated: '2025-08-14',
    nextCalibrationDue: '2026-02-14',
    accuracy: '±2.5%',
    vendor: 'Particle Measuring Systems (PMS)',
    firmwareVersion: 'v6.3.0',
  },
];

// Current telemetry values for each cleanroom
export const initialCleanroomReadings: Record<string, Record<string, number>> = {
  'cr-101': {
    temperature: 20.4, // In spec (18 - 22)
    humidity: 43.8,    // In spec (35 - 50)
    pressure: 13.6,    // WARNING: Below min 15.0 Pa threshold! (Currently 13.6 Pa)
    
    pm25: 0.12,        // In spec (0.0 - 0.5)
    pm10: 0.28,        // In spec (0.0 - 1.0)
  },
  'cr-102': {
    temperature: 19.8,
    humidity: 44.2,
    pressure: 19.5,
    
    pm25: 0.65,
    pm10: 1.42,
  },
  'cr-103': {
    temperature: 21.2,
    humidity: 48.0,
    pressure: 11.8,
   
    pm25: 1.80,
    pm10: 3.50,
  },
  'cr-104': {
    temperature: 8.7,  // CRITICAL: Above max 8.0 °C threshold! (Currently 8.7 °C)
    humidity: 34.5,
    pressure: 24.1,
   
    pm25: 0.25,
    pm10: 0.50,
  },
  'cr-105': {
    temperature: 20.1,
    humidity: 41.5,
    pressure: 17.2,
   
    pm25: 0.55,
    pm10: 1.10,
  },
  'cr-106': {
    temperature: 20.8,
    humidity: 46.1,
    pressure: 14.0,
   
    pm25: 2.10,
    pm10: 4.80,
  },
};

export const mockMonitoringSessions: MonitoringSession[] = [
  {
    id: 'sess-801',
    cleanroomId: 'cr-101',
    sessionName: 'Batch 2026-BLX42 Aseptic Fill Run',
    batchLotNumber: 'LOT-2026-0914-A',
    startTime: '2026-08-29 08:00:00',
    status: 'active',
    recordedBy: 'Dr. Sarah Chen',
    sampleCount: 1440,
    excursionCount: 1,
  },
  {
    id: 'sess-802',
    cleanroomId: 'cr-102',
    sessionName: 'Biologic Formulation Buffer Prep',
    batchLotNumber: 'LOT-2026-BUF-88',
    startTime: '2026-08-29 06:30:00',
    status: 'active',
    recordedBy: 'Mark Stevens',
    sampleCount: 1620,
    excursionCount: 0,
  },
  {
    id: 'sess-803',
    cleanroomId: 'cr-104',
    sessionName: 'Lyophilization Cycle Phase 2 Secondary Drying',
    batchLotNumber: 'LOT-2026-LYO-04',
    startTime: '2026-08-28 22:00:00',
    status: 'active',
    recordedBy: 'Dr. Aris Thorne',
    sampleCount: 2640,
    excursionCount: 2,
  },
  {
    id: 'sess-804',
    cleanroomId: 'cr-105',
    sessionName: 'Microbial Environmental Bio-Burden Sampling',
    batchLotNumber: 'QC-ENV-2026-W34',
    startTime: '2026-08-29 07:00:00',
    status: 'active',
    recordedBy: 'Maria Gonzalez',
    sampleCount: 1560,
    excursionCount: 0,
  },
  {
    id: 'sess-805',
    cleanroomId: 'cr-103',
    sessionName: 'Shift Turnover Personnel Air Flow Audit',
    batchLotNumber: 'FAC-AUDIT-441',
    startTime: '2026-08-29 05:00:00',
    endTime: '2026-08-29 13:00:00',
    status: 'completed',
    recordedBy: 'Elena Rostova',
    sampleCount: 960,
    excursionCount: 0,
  },
];

export const mockEvents: EnvironmentalEvent[] = [
  {
    id: 'ev-301',
    cleanroomId: 'cr-104',
    cleanroomName: 'Lyophilization & Freeze Dry Bay (CR-104)',
    parameter: 'temperature',
    detectedValue: 8.7,
    expectedMin: 2.0,
    expectedMax: 8.0,
    unit: '°C',
    timestamp: '2026-08-29 19:42:15',
    severity: 'critical',
    status: 'active',
    message: 'Chilled environment temperature excursion detected: 8.7°C exceeds maximum allowable threshold of 8.0°C.',
    durationMinutes: 48,
    hasDiagnosis: true,
    hasCorrectiveAction: true,
  },
  {
    id: 'ev-302',
    cleanroomId: 'cr-101',
    cleanroomName: 'Aseptic Filling Suite 1 (CR-101)',
    parameter: 'pressure',
    detectedValue: 13.6,
    expectedMin: 15.0,
    expectedMax: 35.0,
    unit: 'Pa',
    timestamp: '2026-08-29 20:15:30',
    severity: 'warning',
    status: 'investigating',
    message: 'Positive differential pressure dropped to 13.6 Pa (Spec: 15.0 - 35.0 Pa) across Grade A/B barrier.',
    durationMinutes: 20,
    hasDiagnosis: true,
    hasCorrectiveAction: true,
  },
  {
    id: 'ev-303',
    cleanroomId: 'cr-102',
    cleanroomName: 'Formulation & Compounding Lab (CR-102)',
    parameter: 'humidity',
    detectedValue: 56.8,
    expectedMin: 30.0,
    expectedMax: 55.0,
    unit: '% RH',
    timestamp: '2026-08-29 14:10:00',
    severity: 'warning',
    status: 'resolved',
    message: 'Transient humidity spike detected at 56.8% RH during autoclave discharge cycle.',
    durationMinutes: 35,
    hasDiagnosis: true,
    hasCorrectiveAction: true,
  },
  {
    id: 'ev-304',
    cleanroomId: 'cr-101',
    cleanroomName: 'Aseptic Filling Suite 1 (CR-101)',
    parameter: 'pm25',
    detectedValue: 0.62,
    expectedMin: 0.0,
    expectedMax: 0.5,
    unit: 'µg/m³',
    timestamp: '2026-08-28 11:22:00',
    severity: 'warning',
    status: 'resolved',
    message: 'Brief particulate elevation (0.62 µg/m³) near conveyor entry port during sterile vial tray load.',
    durationMinutes: 12,
    hasDiagnosis: true,
    hasCorrectiveAction: true,
  },
  
];

export const mockCorrectiveActions: CorrectiveAction[] = [
  {
    id: 'capa-501',
    actionCode: 'CAPA-2026-089',
    relatedEventId: 'ev-301',
    cleanroomId: 'cr-104',
    problem: 'Lyophilization Bay temperature exceeded 8.0°C critical threshold, climbing to 8.7°C during secondary drying phase.',
    correctiveActionTaken: 'Switched secondary glycol chiller circuit to redundant compressor unit C-2; isolated heat load from auxiliary vial conveyor and recalibrated return air damper.',
    responsibleUser: 'Elena Rostova (Engineering)',
    status: 'In Progress',
    date: '2026-08-29 19:50:00',
    priority: 'urgent',
    verificationNotes: 'Compressor C-2 initialized. Temperature declining; target 4.5°C stabilization in 25 minutes.',
  },
  {
    id: 'capa-502',
    actionCode: 'CAPA-2026-088',
    relatedEventId: 'ev-302',
    cleanroomId: 'cr-101',
    problem: 'Aseptic Filling Suite 1 differential pressure fell from nominal 25 Pa to 13.6 Pa, triggering Grade A containment alert.',
    correctiveActionTaken: 'Inspected transfer airlock interlock pneumatic seal; found magnetic strike plate loose on door D-101B. Re-tightened fastener and re-tested interlock sequence.',
    responsibleUser: 'Mark Stevens (Cleanroom Tech)',
    status: 'Open',
    date: '2026-08-29 20:20:00',
    priority: 'high',
    verificationNotes: 'Pending differential manometer validation and 15-minute steady state hold test.',
  },
  {
    id: 'capa-503',
    actionCode: 'CAPA-2026-084',
    relatedEventId: 'ev-303',
    cleanroomId: 'cr-102',
    problem: 'Relative humidity rose to 56.8% RH for 35 minutes following steam sterilizer unloading.',
    correctiveActionTaken: 'Increased HVAC return air dehumidification wheel speed from 60% to 85% and enforced 10-minute steam condensation purge prior to chamber door opening.',
    responsibleUser: 'Dr. Sarah Chen (QA)',
    status: 'Completed',
    date: '2026-08-29 14:35:00',
    resolvedDate: '2026-08-29 15:10:00',
    priority: 'medium',
    verificationNotes: 'Dehumidification cycle brought humidity back down to 42.1% RH. Standard operating procedure SOP-CR-042 updated with mandatory purge time.',
  },
  {
    id: 'capa-504',
    actionCode: 'CAPA-2026-079',
    relatedEventId: 'ev-304',
    cleanroomId: 'cr-101',
    problem: 'PM2.5 particle counter registered 0.62 µg/m³ near vial tray conveyor in Grade A filling zone.',
    correctiveActionTaken: 'Halted fill line for 15 minutes; wiped down conveyor shroud with sterile 70% IPA; verified laminar flow velocity across HEPA filter ceiling face (0.45 m/s ± 20%).',
    responsibleUser: 'Mark Stevens (Cleanroom Tech)',
    status: 'Completed',
    date: '2026-08-28 11:40:00',
    resolvedDate: '2026-08-28 12:00:00',
    priority: 'high',
    verificationNotes: 'Particle levels dropped back to < 0.08 µg/m³. Environmental settle plates incubated with negative growth.',
  },
];

export const mockDiagnoses: Diagnosis[] = [
  {
    id: 'diag-401',
    diagnosisId: 'DIAG-2026-042',
    relatedEventId: 'ev-301',
    cleanroomId: 'cr-104',
    diagnosis: 'Primary glycol chiller circuit bypass valve solenoid mechanical binding.',
    possibleCause: 'Valve actuator V-312 experienced micro-stiction due to low-temperature seal crystallization, preventing 100% chilled coolant flow through air handling unit cooling coil.',
    severity: 'critical',
    createdBy: 'Elena Rostova (Engineering)',
    date: '2026-08-29 19:48:00',
    recommendedPreventiveAction: 'Replace standard buna-N valve seals with cryogenic PTFE seals during scheduled shutdown maintenance.',
  },
  {
    id: 'diag-402',
    diagnosisId: 'DIAG-2026-041',
    relatedEventId: 'ev-302',
    cleanroomId: 'cr-101',
    diagnosis: 'Dynamic pressure cascade loss via airlock door seal integrity gap.',
    possibleCause: 'Magnetic interlock strike plate misalignment on transfer hatch D-101B allowing 3mm gap, causing supply air bypass into adjacent Grade B corridor.',
    severity: 'warning',
    createdBy: 'Mark Stevens (Cleanroom Tech)',
    date: '2026-08-29 20:25:00',
    recommendedPreventiveAction: 'Implement daily pre-shift tactile check of door strike plates and log in electronic batch record.',
  },
  {
    id: 'diag-403',
    diagnosisId: 'DIAG-2026-038',
    relatedEventId: 'ev-303',
    cleanroomId: 'cr-102',
    diagnosis: 'Thermal and moisture plume overflow from high-capacity autoclave exhaust.',
    possibleCause: 'Autoclave door opened prematurely prior to full internal vacuum dry exhaust phase completion, discharging saturated water vapor into compounding room.',
    severity: 'warning',
    createdBy: 'Dr. Sarah Chen (QA)',
    date: '2026-08-29 14:25:00',
    recommendedPreventiveAction: 'Reprogram autoclave control firmware to lock door interlock until chamber dew point reaches < 15°C.',
  },
  {
    id: 'diag-404',
    diagnosisId: 'DIAG-2026-035',
    relatedEventId: 'ev-304',
    cleanroomId: 'cr-101',
    diagnosis: 'Micro-friction shedding from sterile vial feeder conveyor belt friction rail.',
    possibleCause: 'Mechanical wear on PTFE side guides when loading heavy vial trays, generating non-viable particles caught by localized air isokinetic probe.',
    severity: 'warning',
    createdBy: 'Dr. Sarah Chen (QA)',
    date: '2026-08-28 11:35:00',
    recommendedPreventiveAction: 'Upgrade conveyor side rail liners to electropolished 316L pharmaceutical stainless steel.',
  },
];

// Generate 24 hours of simulated historical time series data points for charts
export function generateHistoricalReadings(
  cleanroomId: string,
  hours: number = 24
): Array<{
  timestamp: string;
  timeLabel: string;
  temperature: number;
  humidity: number;
  pressure: number;
  pm25: number;
  pm10: number;
}> {
  const points = [];
  const now = new Date();
  const currentVals = initialCleanroomReadings[cleanroomId] || initialCleanroomReadings['cr-101'];

  // Base values adjusted by cleanroom profile
  const baseT = cleanroomId === 'cr-104' ? 5.2 : 20.0;
  const baseH = cleanroomId === 'cr-104' ? 32.0 : 42.0;
  const baseP = cleanroomId === 'cr-101' ? 18.0 : 20.0;
 
  const basePM25 = cleanroomId === 'cr-101' ? 0.15 : 0.6;
  const basePM10 = cleanroomId === 'cr-101' ? 0.35 : 1.2;

  const totalPoints = 24; // one point per hour
  for (let i = totalPoints; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add realistic subtle oscillations and recent excursion for demo rooms
    let t = baseT + Math.sin(i * 0.4) * 0.4;
    let h = baseH + Math.cos(i * 0.3) * 1.5;
    let p = baseP + Math.sin(i * 0.5) * 1.2;
    
    let pm25 = basePM25 + Math.abs(Math.sin(i * 0.6) * 0.08);
    let pm10 = basePM10 + Math.abs(Math.cos(i * 0.4) * 0.15);

    // If cr-101 (pressure excursion in last 2 hours)
    if (cleanroomId === 'cr-101' && i <= 1) {
      p = 13.6 + (i * 0.3);
    }
    // If cr-104 (temp excursion in last 3 hours)
    if (cleanroomId === 'cr-104' && i <= 2) {
      t = 8.7 - (i * 0.4);
    }

    // Set latest point to exact current reading
    if (i === 0) {
      t = currentVals.temperature;
      h = currentVals.humidity;
      p = currentVals.pressure;
      
      pm25 = currentVals.pm25;
      pm10 = currentVals.pm10;
    }

    points.push({
      timestamp: d.toISOString(),
      timeLabel: hourStr,
      temperature: Number(t.toFixed(1)),
      humidity: Number(h.toFixed(1)),
      pressure: Number(p.toFixed(1)),
     
      pm25: Number(pm25.toFixed(2)),
      pm10: Number(pm10.toFixed(2)),
    });
  }

  return points;
}

// Generate realistic log of individual sensor readings for the Monitoring table
export function generateSensorReadingsTable(): SensorReading[] {
  const readings: SensorReading[] = [];
  const params: Array<{ param: any; unit: string; min: number; max: number }> = [
    { param: 'temperature', unit: '°C', min: 18, max: 22 },
    { param: 'humidity', unit: '% RH', min: 35, max: 50 },
    { param: 'pressure', unit: 'Pa', min: 15, max: 35 },
   
    { param: 'pm25', unit: 'µg/m³', min: 0.0, max: 0.5 },
    { param: 'pm10', unit: 'µg/m³', min: 0.0, max: 1.0 },
  ];

  const times = [
    '2026-08-29 20:34:00',
    '2026-08-29 20:32:00',
    '2026-08-29 20:30:00',
    '2026-08-29 20:28:00',
    '2026-08-29 20:25:00',
    '2026-08-29 20:20:00',
    '2026-08-29 20:15:00',
    '2026-08-29 20:10:00',
    '2026-08-29 20:05:00',
    '2026-08-29 20:00:00',
  ];

  let idCounter = 1;
  for (const time of times) {
    for (const room of mockCleanrooms) {
      const paramInfo = params[(idCounter + room.code.length) % params.length];
      const roomVals = initialCleanroomReadings[room.id] || initialCleanroomReadings['cr-101'];
      const rawVal = roomVals[paramInfo.param] ?? 20.0;
      
      let status: 'normal' | 'warning' | 'critical' = 'normal';
      if (rawVal < paramInfo.min || rawVal > paramInfo.max) {
        status = (paramInfo.param === 'temperature' && rawVal > 8.0 && room.id === 'cr-104') ? 'critical' : 'warning';
      }

      readings.push({
        id: `rdg-${idCounter++}`,
        cleanroomId: room.id,
        sensorId: `SENS-${paramInfo.param.toUpperCase().slice(0, 3)}-${room.code}`,
        parameter: paramInfo.param,
        value: Number(rawVal.toFixed(2)),
        unit: paramInfo.unit,
        status: status,
        timestamp: time,
        expectedRange: {
          min: paramInfo.min,
          max: paramInfo.max,
        },
      });
    }
  }

  return readings;
}
