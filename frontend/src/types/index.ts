export type EnvironmentalParameter =
  | 'temperature'
  | 'humidity'
  | 'pressure'
  | 'pm25'
  | 'pm10';
export interface ParameterThreshold {
  parameter: EnvironmentalParameter;
  label: string;
  min: number;
  max: number;
  unit: string;
  nominal: number;
  description: string;
}

export interface EnvironmentalProfile {
  id: string;
  name: string;
  isoGrade: string; // e.g. "ISO 5 / Grade A", "ISO 7 / Grade B"
  description: string;
  targetApplication: string;
  thresholds: Record<EnvironmentalParameter, ParameterThreshold>;
  createdAt: string;
}

export type CleanroomStatus = 'normal' | 'warning' | 'critical';
export type MonitoringStatus = 'active' | 'calibrating' | 'paused' | 'offline';

export interface Cleanroom {
  id: string;
  name: string;
  code: string;
  location: string;
  building: string;
  floor: string;
  profileId: string;
  status: CleanroomStatus;
  monitoringStatus: MonitoringStatus;
  dimensions: string; // e.g. "12m x 8m x 3.2m"
  airChangesPerHour: number; // e.g. 45 ACH
  classification: string; // e.g. "Grade A / ISO 5 Aseptic Core"
  leadSpecialist: string;
}

export type SensorStatus = 'normal' | 'warning' | 'offline';

export interface Sensor {
  id: string;
  sensorTag: string; // e.g. "TT-101A"
  type: string; // e.g. "RTD Platinum Pt100", "Piezo-resistive differential"
  parameter: EnvironmentalParameter;
  cleanroomId: string;
  status: SensorStatus;
  installationDate: string;
  lastCalibrated: string;
  nextCalibrationDue: string;
  accuracy: string; // e.g. "±0.1°C"
  vendor: string;
  firmwareVersion: string;
}

export interface SensorReading {
  id: string;
  cleanroomId: string;
  sensorId: string;
  parameter: EnvironmentalParameter;
  value: number;
  unit: string;
  status: CleanroomStatus;
  timestamp: string; // ISO or formatted
  expectedRange: {
    min: number;
    max: number;
  };
}

export interface MonitoringSession {
  id: string;
  cleanroomId: string;
  sessionName: string;
  batchLotNumber: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'paused';
  recordedBy: string;
  sampleCount: number;
  excursionCount: number;
}

export type EventSeverity = 'warning' | 'critical';
export type EventStatus = 'active' | 'investigating' | 'resolved';

export interface EnvironmentalEvent {
  id: string;
  databaseId?: number;
  cleanroomId: string;
  cleanroomName: string;
  parameter: EnvironmentalParameter;
  detectedValue: number;
  expectedMin: number;
  expectedMax: number;
  unit: string;
  timestamp: string;
  severity: EventSeverity;
  status: EventStatus;
  message: string;
  durationMinutes?: number;
  hasDiagnosis?: boolean;
  hasCorrectiveAction?: boolean;
}

export type CorrectiveActionStatus = 'Open' | 'In Progress' | 'Completed';

export interface CorrectiveAction {
  id: string;
  actionCode: string; // e.g. "CAPA-2026-081"
  relatedEventId: string;
  cleanroomId: string;
  problem: string;
  correctiveActionTaken: string;
  responsibleUser: string;
  status: CorrectiveActionStatus;
  date: string;
  resolvedDate?: string;
  verificationNotes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Diagnosis {
  id: string;
  diagnosisId: string; // e.g. "DIAG-2026-042"
  relatedEventId: string;
  cleanroomId: string;
  diagnosis: string;
  possibleCause: string;
  severity: EventSeverity;
  createdBy: string;
  date: string;
  recommendedPreventiveAction: string;
}

export interface UserProfile {
  username: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
}
