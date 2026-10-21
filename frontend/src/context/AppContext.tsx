import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  EnvironmentalParameter,
  CleanroomStatus,
  SensorStatus,
  CorrectiveActionStatus,
} from '../types';
import {
  mockCleanrooms,
  mockProfiles,
  mockSensors,
  initialCleanroomReadings,
  mockMonitoringSessions,
  mockEvents,
  mockCorrectiveActions,
  mockDiagnoses,
  mockCurrentUser,
  sampleUsers,
  generateSensorReadingsTable,
} from '../data/mockData';

export type NavigationPage =
  | 'dashboard'
  | 'cleanrooms'
  | 'cleanroom-details'
  | 'monitoring'
  | 'profiles'
  | 'sensors'
  | 'events'
  | 'corrective-actions'
  | 'diagnoses';

interface AppContextType {
  // Navigation & User
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  selectedCleanroomId: string;
  setSelectedCleanroomId: (id: string) => void;
  navigateToCleanroomDetails: (cleanroomId: string) => void;
  
  // Auth
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  switchUserRole: (email: string) => void;

  // Data Collections
  cleanrooms: Cleanroom[];
  profiles: EnvironmentalProfile[];
  sensors: Sensor[];
  readings: Record<string, Record<string, number>>; // cleanroomId -> param -> value
  recentReadingsTable: SensorReading[];
  sessions: MonitoringSession[];
  events: EnvironmentalEvent[];
  correctiveActions: CorrectiveAction[];
  diagnoses: Diagnosis[];

  // Simulation
  triggerManualExcursion: (cleanroomId: string, param: EnvironmentalParameter, value: number, note: string) => void;
  resetAllReadingsToNominal: () => void;

  // Mutations
  addCorrectiveAction: (action: Omit<CorrectiveAction, 'id' | 'actionCode' | 'date'>) => CorrectiveAction;
  updateCorrectiveActionStatus: (actionId: string, newStatus: CorrectiveActionStatus, verificationNotes?: string) => void;
  addDiagnosis: (diag: Omit<Diagnosis, 'id' | 'diagnosisId' | 'date'>) => Diagnosis;
  updateSensorStatus: (sensorId: string, newStatus: SensorStatus) => void;
  addSensor: (sensor: Omit<Sensor, 'id'>) => void;
  resolveEvent: (eventId: string) => void;
  acknowledgeEvent: (eventId: string) => void;
  saveProfile: (profile: EnvironmentalProfile) => void;
  addNewCleanroom: (cr: Omit<Cleanroom, 'id'>) => void;
  startNewSession: (session: Omit<MonitoringSession, 'id' | 'startTime' | 'sampleCount' | 'excursionCount'>) => void;
  completeSession: (sessionId: string) => void;

  // Helpers
  getCleanroomProfile: (cleanroomId: string) => EnvironmentalProfile | undefined;
  getCleanroomStatus: (cleanroomId: string) => { status: CleanroomStatus; message: string };
  getParameterStatus: (cleanroomId: string, param: EnvironmentalParameter, value: number) => CleanroomStatus;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state: stored in localStorage for smooth academic presentation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('crems_auth');
    return saved ? JSON.parse(saved) : true; // Default true so user can test immediately
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('crems_user');
    return saved ? JSON.parse(saved) : mockCurrentUser;
  });

  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [selectedCleanroomId, setSelectedCleanroomId] = useState<string>('1');

  // Core Data
  const [cleanrooms, setCleanrooms] = useState<Cleanroom[]>(mockCleanrooms);
  const [profiles, setProfiles] = useState<EnvironmentalProfile[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
    // Load real data from CREMS backend
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [cleanroomsRes, sensorsRes] = await Promise.all([
          fetch('http://localhost:5000/api/cleanrooms'),
          fetch('http://localhost:5000/api/sensors'),
        ]);

        if (!cleanroomsRes.ok || !sensorsRes.ok) {
          throw new Error('Failed to load backend data');
        }

        const cleanroomData = await cleanroomsRes.json();
        const sensorData = await sensorsRes.json();

        // Convert database cleanrooms to the frontend format
        const frontendCleanrooms: Cleanroom[] = cleanroomData.map((room: any) => ({
  id: String(room.room_id),
  code: room.room_name,
  name: room.location || room.room_name,
  location: room.location || '',
  classification: room.room_type || 'Cleanroom',
profileId: '',
  status: room.status === 'ACTIVE' ? 'normal' : 'offline',
  monitoringStatus: room.status === 'ACTIVE' ? 'live' : 'offline',
  leadSpecialist: 'Not Assigned',
}));

        // Convert database sensors to the frontend format
       const frontendSensors: Sensor[] = sensorData.map((sensor: any) => ({
  id: String(sensor.sensor_id),
  sensorTag: sensor.sensor_name,
  cleanroomId: String(sensor.room_id),

  parameter: sensor.sensor_type
    .toLowerCase()
    .replace(' sensor', '')
    .replace('2.5', 'pm25')
    .replace('10', 'pm10')
    .replace(' ', '_'),

  type: sensor.sensor_type,
  location: sensor.location,

  status:
    sensor.status === 'ACTIVE'
      ? 'normal'
      : sensor.status === 'FAULTY'
      ? 'offline'
      : 'offline',

  firmwareVersion: 'N/A',
  lastCalibrated: 'Database',
  nextCalibrationDue: 'N/A',
  vendor: 'N/A',
  accuracy: 'N/A',
}));
        setCleanrooms(frontendCleanrooms);
        setSensors(frontendSensors);

        console.log('CREMS backend data loaded successfully');
      } catch (error) {
        console.error('Failed to load CREMS backend data:', error);
      }
    };

    loadBackendData();
  }, []);

     // Load environmental profiles from CREMS backend
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const [profilesRes, profileParametersRes, parametersRes, assignmentsRes] =
          await Promise.all([
            fetch('http://localhost:5000/api/profiles'),
            fetch('http://localhost:5000/api/profile-parameters'),
            fetch('http://localhost:5000/api/parameters'),
            fetch('http://localhost:5000/api/assignments'),
          ]);

        if (
          !profilesRes.ok ||
          !profileParametersRes.ok ||
          !parametersRes.ok ||
          !assignmentsRes.ok
        ) {
          throw new Error('Failed to load profile data');
        }

        const profileData = await profilesRes.json();
        const profileParameterData = await profileParametersRes.json();
        const parameterData = await parametersRes.json();
        const assignmentData = await assignmentsRes.json();

        console.log('Profiles:', profileData);
        console.log('Profile Parameters:', profileParameterData);
        console.log('Parameters:', parameterData);
        console.log('Assignments:', assignmentData);

        const roomProfileMap: Record<string, string> = {};

assignmentData.forEach((assignment: any) => {
  roomProfileMap[String(assignment.room_id)] = String(assignment.profile_id);
});

console.log('Room → Profile mapping:', roomProfileMap);

setCleanrooms((prev) =>
  prev.map((room) => ({
    ...room,
    profileId: roomProfileMap[room.id] || '',
  }))
);

        const frontendProfiles: EnvironmentalProfile[] = profileData.map(
          (profile: any) => {
            const profileParameters = profileParameterData.filter(
              (pp: any) => pp.profile_id === profile.profile_id
            );

            const thresholds: Record<
              EnvironmentalParameter,
              ParameterThreshold
            > = {} as Record<
              EnvironmentalParameter,
              ParameterThreshold
            >;

            profileParameters.forEach((pp: any) => {
              const parameter = parameterData.find(
                (p: any) => p.parameter_id === pp.parameter_id
              );

              if (!parameter) return;

              const parameterName = parameter.parameter_name
                .toLowerCase()
                .replace('2.5', 'pm25')
                .replace('10', 'pm10')
                .replace(/\s+/g, '_') as EnvironmentalParameter;

              thresholds[parameterName] = {
                parameter: parameterName,
                label: parameter.parameter_name,
                min: Number(pp.min_value),
                max: Number(pp.max_value),
                unit: parameter.unit,
                nominal: Number(pp.target_value),
                description: '',
              };
            });

            return {
              id: String(profile.profile_id),
              name: profile.profile_name,
              isoGrade: '',
              description: profile.description || '',
              targetApplication: '',
              thresholds,
              createdAt: profile.created_at || '',
            };
          }
        );

        setProfiles(frontendProfiles);

        console.log(
          'Environmental profiles loaded successfully:',
          frontendProfiles
        );
      } catch (error) {
        console.error(
          'Failed to load environmental profiles:',
          error
        );
      }
    };

    loadProfiles();
  }, []);

const [readings, setReadings] = useState<Record<string, Record<string, number>>>({});  const [recentReadingsTable, setRecentReadingsTable] = useState<SensorReading[]>(generateSensorReadingsTable);
  const [sessions, setSessions] = useState<MonitoringSession[]>(mockMonitoringSessions);

useEffect(() => {
  const loadSessions = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/sessions'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();

      console.log('Sessions loaded from backend:', data);

      const frontendSessions: MonitoringSession[] = data.map(
        (session: any) => ({
          id: String(session.session_id),
          batchNumber: session.batch_number,
          sessionDate: session.session_date,
          startTime: session.start_time,
          endTime: session.end_time,
          status: session.status.toLowerCase(),
          sampleCount: 0,
          excursionCount: 0,
        })
      );

      setSessions(frontendSessions);
    } catch (error) {
      console.error(
        'Failed to load sessions:',
        error
      );
    }
  };

  loadSessions();
}, []);

const [events, setEvents] = useState<EnvironmentalEvent[]>([]);
useEffect(() => {
  const loadEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();

console.log('Events loaded from backend:', data);


     const frontendEvents: EnvironmentalEvent[] = data.map((event: any) => ({
  id: String(event.event_id),

  cleanroomId: String(event.room_id),
  cleanroomName: event.room_name,

  parameter: event.parameter_name,

detectedValue: Number(event.detected_value),
  expectedMin: Number(event.min_value),
  expectedMax: Number(event.max_value),

  unit: event.unit,

  timestamp: event.event_start,

  severity: event.severity.toLowerCase(),
  status: event.status.toLowerCase(),

  message: event.event_type,

  durationMinutes: event.event_end
    ? Math.round(
        (new Date(event.event_end).getTime() -
          new Date(event.event_start).getTime()) /
          60000
      )
    : 0,

  hasDiagnosis: false,
  hasCorrectiveAction: false,
}));

      setEvents(frontendEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  loadEvents();
}, []);

  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(mockCorrectiveActions);

useEffect(() => {
  const loadCorrectiveActions = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/corrective-actions'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch corrective actions');
      }

      const data = await response.json();

      console.log('Corrective actions loaded from backend:', data);

      const frontendActions: CorrectiveAction[] = data.map((action: any) => ({
        id: String(action.action_id),
        actionCode: `CAPA-${action.action_id}`,
        date: action.triggered_at,
        relatedEventId: String(action.event_id),
        actionType: action.action_type,
        description: action.action_description || '',
        status: action.action_status,
      }));

      setCorrectiveActions(frontendActions);
    } catch (error) {
      console.error(
        'Failed to load corrective actions:',
        error
      );
    }
  };

  loadCorrectiveActions();
}, []);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(mockDiagnoses);
useEffect(() => {
  const loadDiagnoses = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/diagnoses'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch diagnoses');
      }

      const data = await response.json();

      console.log('Diagnoses loaded from backend:', data);

      const frontendDiagnoses: Diagnosis[] = data.map((diag: any) => ({
        id: String(diag.diagnosis_id),
        diagnosisId: `DIAG-${diag.diagnosis_id}`,
        relatedEventId: String(diag.event_id),
        affectedSensorId: diag.affected_sensor_id
          ? String(diag.affected_sensor_id)
          : undefined,
        likelyCause: diag.likely_cause,
        recommendedAction: diag.recommended_action,
        diagnosisLevel: diag.diagnosis_level,
        date: diag.generated_at,
      }));

      setDiagnoses(frontendDiagnoses);
    } catch (error) {
      console.error(
        'Failed to load diagnoses:',
        error
      );
    }
  };

  loadDiagnoses();
}, []);


  // Load real sensor readings from CREMS backend
useEffect(() => {
  const loadSensorReadings = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/sensor-readings'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sensor readings');
      }

      const data = await response.json();

      console.log('Sensor readings loaded:', data);
      console.log('FIRST DATABASE READING:', data[0]);

      const latestReadings: Record<string, Record<string, number>> = {};

      data.forEach((reading: any) => {
        const roomId = String(reading.room_id);

        if (!latestReadings[roomId]) {
          latestReadings[roomId] = {};
        }

        const parameter = reading.parameter_name
          .toLowerCase()
          .replace('2.5', 'pm25')
          .replace('10', 'pm10')
          .replace(/\s+/g, '_');

        if (latestReadings[roomId][parameter] === undefined) {
          latestReadings[roomId][parameter] = Number(reading.reading_value);
        }
      });

      setReadings(latestReadings);

     setRecentReadingsTable(
  data.map((reading: any) => {
    const parameter = reading.parameter_name
      .toLowerCase()
      .replace('2.5', 'pm25')
      .replace('10', 'pm10')
      .replace(/\s+/g, '_') as EnvironmentalParameter;

    // Find the environmental profile assigned to this room
    const room = cleanrooms.find(
      (cr) => cr.id === String(reading.room_id)
    );

    const profile = room
      ? profiles.find((p) => p.id === room.profileId) || profiles[0]
      : profiles[0];

    const threshold = profile?.thresholds?.[parameter];

    return {
      id: String(reading.reading_id),
      cleanroomId: String(reading.room_id),
      sensorId: String(reading.sensor_id),
      parameter: reading.parameter_name,
      value: Number(reading.reading_value),
      unit: reading.unit,
      status: threshold
        ? Number(reading.reading_value) < threshold.min ||
          Number(reading.reading_value) > threshold.max
          ? 'warning'
          : 'normal'
        : 'normal',
      timestamp: reading.reading_timestamp,
      expectedRange: {
        min: threshold?.min ?? 0,
        max: threshold?.max ?? 999999,
      },
    };
  })
);

    } catch (error) {
      console.error('Failed to load sensor readings:', error);
    }
  };

  loadSensorReadings();
}, [cleanrooms, profiles]);  
  // Sync auth state
  useEffect(() => {
    localStorage.setItem('crems_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('crems_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const login = (email: string): boolean => {
    const matched = sampleUsers.find((u) => u.username.toLowerCase() === email.toLowerCase());
    const userToSet: UserProfile = matched
      ? {
          username: matched.username,
          name: matched.name,
          role: matched.role,
          department: matched.dept,
          avatar: mockCurrentUser.avatar,
        }
      : {
          username: email,
          name: email.split('@')[0].toUpperCase(),
          role: 'Cleanroom Operator',
          department: 'Sterile Manufacturing',
          avatar: mockCurrentUser.avatar,
        };

    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const switchUserRole = (email: string) => {
    const match = sampleUsers.find((u) => u.username === email);
    if (match) {
      setCurrentUser({
        username: match.username,
        name: match.name,
        role: match.role,
        department: match.dept,
        avatar: mockCurrentUser.avatar,
      });
    }
  };

  const navigateToCleanroomDetails = (cleanroomId: string) => {
    setSelectedCleanroomId(cleanroomId);
    setCurrentPage('cleanroom-details');
  };

  const getCleanroomProfile = useCallback((cleanroomId: string): EnvironmentalProfile | undefined => {
    const cr = cleanrooms.find((c) => c.id === cleanroomId);
    if (!cr) return profiles[0];
    return profiles.find((p) => p.id === cr.profileId) || profiles[0];
  }, [cleanrooms, profiles]);

  const getParameterStatus = useCallback((
    cleanroomId: string,
    param: EnvironmentalParameter,
    value: number
  ): CleanroomStatus => {
    const profile = getCleanroomProfile(cleanroomId);
    if (!profile || !profile.thresholds[param]) return 'normal';

    const threshold = profile.thresholds[param];
    if (value < threshold.min || value > threshold.max) {
      // If critical difference
      const margin = (threshold.max - threshold.min) * 0.25;
      if (value < threshold.min - margin || value > threshold.max + margin) {
        return 'critical';
      }
      return 'warning';
    }
    return 'normal';
  }, [getCleanroomProfile]);

  const getCleanroomStatus = useCallback((cleanroomId: string): { status: CleanroomStatus; message: string } => {
    const roomReadings = readings[cleanroomId];
    if (!roomReadings) return { status: 'normal', message: 'All parameters in specification' };

    let hasCritical = false;
    let hasWarning = false;
    let warningMsg = '';

    const params: EnvironmentalParameter[] = ['temperature', 'humidity', 'pressure',  'pm25', 'pm10'];
    for (const p of params) {
      const val = roomReadings[p];
      if (val !== undefined) {
        const stat = getParameterStatus(cleanroomId, p, val);
        if (stat === 'critical') {
          hasCritical = true;
          warningMsg = `Critical: ${p.toUpperCase()} excursion at ${val}`;
          break;
        } else if (stat === 'warning') {
          hasWarning = true;
          if (!warningMsg) warningMsg = `Warning: ${p.toUpperCase()} out of nominal at ${val}`;
        }
      }
    }

    if (hasCritical) return { status: 'critical', message: warningMsg };
    if (hasWarning) return { status: 'warning', message: warningMsg };
    return { status: 'normal', message: 'All parameters within validated GMP envelope' };
  }, [readings, getParameterStatus]);

  

  // Actions & Mutations
  const addCorrectiveAction = (
  actionData: Omit<CorrectiveAction, 'id' | 'actionCode' | 'date'>
): CorrectiveAction => {
  const newAction: CorrectiveAction = {
    ...actionData,
    id: `capa-${Date.now()}`,
    actionCode: `CAPA-2026-${correctiveActions.length + 90}`,
    date: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  // Update frontend immediately
  setCorrectiveActions((prev) => [newAction, ...prev]);

  // Save to MySQL

console.log('CAPA data being sent:', {
  event_id: actionData.relatedEventId,
  action_type: actionData.correctiveActionTaken,
  action_description: actionData.problem,
}); apirification
  fetch('http://localhost:5000/api/corrective-actions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
  event_id: actionData.relatedEventId,
  action_type: actionData.correctiveActionTaken,
  action_description: actionData.problem,
}),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to save corrective action');
      }

      const result = await response.json();
      console.log('Corrective action saved to database:', result);
    })
    .catch((error) => {
      console.error('Failed to save corrective action:', error);
    });

  // Mark event as having corrective action
  if (actionData.relatedEventId) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === actionData.relatedEventId
          ? { ...e, hasCorrectiveAction: true }
          : e
      )
    );
  }

 return newAction;
};
  const updateCorrectiveActionStatus = (actionId: string, newStatus: CorrectiveActionStatus, notes?: string) => {
    setCorrectiveActions((prev) =>
      prev.map((action) => {
        if (action.id === actionId) {
          return {
            ...action,
            status: newStatus,
            resolvedDate: newStatus === 'Completed' ? new Date().toISOString().replace('T', ' ').slice(0, 19) : action.resolvedDate,
            verificationNotes: notes || action.verificationNotes,
          };
        }
        return action;
      })
    );
  };

 const addDiagnosis = (
  diagData: Omit<Diagnosis, 'id' | 'diagnosisId' | 'date'>
): Diagnosis => {
  const newDiagnosis: Diagnosis = {
    ...diagData,
    id: `diag-${Date.now()}`,
    diagnosisId: `DIAG-2026-${diagnoses.length + 45}`,
    date: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  const selectedEvent = events.find(
    (e) => e.id === diagData.relatedEventId
  );

  if (!selectedEvent) {
    console.error(
      'Cannot save diagnosis: event not found:',
      diagData.relatedEventId
    );
    return newDiagnosis;
  }

  const databaseEventId = Number(selectedEvent.id);

  if (Number.isNaN(databaseEventId)) {
    console.error(
      'Invalid database event ID:',
      selectedEvent.id
    );
    return newDiagnosis;
  }

  console.log('Diagnosis data being sent:', {
    event_id: databaseEventId,
    affected_sensor_id: diagData.affectedSensorId || null,
    likely_cause: diagData.possibleCause,
    recommended_action:
      diagData.recommendedPreventiveAction || null,
    diagnosis_level:
      diagData.severity === 'critical'
        ? 'CRITICAL'
        : 'POSSIBLE',
  });

  fetch('http://localhost:5000/api/diagnoses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_id: databaseEventId,
      affected_sensor_id:
        diagData.affectedSensorId || null,
      likely_cause: diagData.possibleCause,
      recommended_action:
        diagData.recommendedPreventiveAction || null,
      diagnosis_level:
        diagData.severity === 'critical'
          ? 'CRITICAL'
          : 'POSSIBLE',
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.error ||
            'Failed to save diagnosis'
        );
      }

      const result = await response.json();

      console.log(
        'Diagnosis saved to database:',
        result
      );

      setDiagnoses((prev) => [
        newDiagnosis,
        ...prev,
      ]);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === diagData.relatedEventId
            ? {
                ...e,
                hasDiagnosis: true,
              }
            : e
        )
      );
    })
    .catch((error) => {
      console.error(
        'Failed to save diagnosis:',
        error
      );
    });

  return newDiagnosis;
};

 
  const updateSensorStatus = (sensorId: string, newStatus: SensorStatus) => {
    setSensors((prev) =>
      prev.map((s) => (s.id === sensorId ? { ...s, status: newStatus, lastCalibrated: newStatus === 'normal' ? 'Just Now' : s.lastCalibrated } : s))
    );
  };

  const addSensor = (sensorData: Omit<Sensor, 'id'>) => {
    const newSensor: Sensor = {
      ...sensorData,
      id: `sens-${Date.now()}`,
    };
    setSensors((prev) => [...prev, newSensor]);
  };

  const resolveEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, status: 'resolved' } : ev))
    );
  };

  const acknowledgeEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, status: 'investigating' } : ev))
    );
  };

  const saveProfile = (updatedProfile: EnvironmentalProfile) => {
    setProfiles((prev) => {
      const exists = prev.some((p) => p.id === updatedProfile.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p));
      }
      return [...prev, updatedProfile];
    });
  };

  const addNewCleanroom = (crData: Omit<Cleanroom, 'id'>) => {
    const newId = `cr-${Date.now().toString().slice(-4)}`;
    const newCr: Cleanroom = {
      ...crData,
      id: newId,
    };
    setCleanrooms((prev) => [...prev, newCr]);

    // Init nominal readings
    setReadings((prev) => ({
      ...prev,
      [newId]: {
        temperature: 20.0,
        humidity: 45.0,
        pressure: 20.0,
       
        pm25: 0.2,
        pm10: 0.5,
      },
    }));
  };

  const startNewSession = (sessionData: Omit<MonitoringSession, 'id' | 'startTime' | 'sampleCount' | 'excursionCount'>) => {
    const newSession: MonitoringSession = {
      ...sessionData,
      id: `sess-${Date.now().toString().slice(-4)}`,
      startTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sampleCount: 1,
      excursionCount: 0,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const completeSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'completed',
              endTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
            }
          : s
      )
    );
  };

  const triggerManualExcursion = (
    cleanroomId: string,
    param: EnvironmentalParameter,
    value: number,
    note: string
  ) => {
    const cr = cleanrooms.find((c) => c.id === cleanroomId);
    const profile = getCleanroomProfile(cleanroomId);
    const thresh = profile?.thresholds[param];

    // Update telemetry reading
    setReadings((prev) => ({
      ...prev,
      [cleanroomId]: {
        ...(prev[cleanroomId] || {}),
        [param]: value,
      },
    }));

    // Generate new event
    const isCritical = thresh ? Math.abs(value - thresh.nominal) > (thresh.max - thresh.min) : false;
    const newEvent: EnvironmentalEvent = {
      id: `ev-${Date.now()}`,
      cleanroomId,
      cleanroomName: cr ? `${cr.name} (${cr.code})` : cleanroomId,
      parameter: param,
      detectedValue: value,
      expectedMin: thresh?.min || 0,
      expectedMax: thresh?.max || 100,
      unit: thresh?.unit || '',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      severity: isCritical ? 'critical' : 'warning',
      status: 'active',
      message: `${note}: ${param.toUpperCase()} reached ${value} ${thresh?.unit || ''} (Acceptable: ${thresh?.min}-${thresh?.max}).`,
      durationMinutes: 1,
      hasDiagnosis: false,
      hasCorrectiveAction: false,
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const resetAllReadingsToNominal = () => {
    setReadings(initialCleanroomReadings);
  };

   return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCleanroomId,
        setSelectedCleanroomId,
        navigateToCleanroomDetails,
        isAuthenticated,
        currentUser,
        login,
        logout,
        switchUserRole,
        cleanrooms,
        profiles,
        sensors,
        readings,
        recentReadingsTable,
        sessions,
        events,
        correctiveActions,
        diagnoses,
        triggerManualExcursion,
        resetAllReadingsToNominal,
        addCorrectiveAction,
        updateCorrectiveActionStatus,
        addDiagnosis,
        updateSensorStatus,
        addSensor,
        resolveEvent,
        acknowledgeEvent,
        saveProfile,
        addNewCleanroom,
        startNewSession,
        completeSession,
        getCleanroomProfile,
        getCleanroomStatus,
        getParameterStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};