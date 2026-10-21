const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* =========================
   BASIC TEST
========================= */

app.get("/", (req, res) => {
    res.json({
        message: "CREMS Backend is running!"
    });
});

/* =========================
   USERS
========================= */

app.get("/api/users", (req, res) => {
    db.query(
        "SELECT user_id, user_name, email, role, created_at FROM users",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch users"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   PRODUCTS
========================= */

app.get("/api/products", (req, res) => {
    db.query(
        "SELECT * FROM products",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch products"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   MANUFACTURING ACTIVITIES
========================= */

app.get("/api/activities", (req, res) => {
    db.query(
        "SELECT * FROM manufacturing_activities",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch activities"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   CLEANROOMS
========================= */

app.get("/api/cleanrooms", (req, res) => {
    db.query(
        "SELECT * FROM cleanrooms",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch cleanrooms"
                });
            }

            res.json(results);
        }
    );
});
/* =========================
   SENSOR READINGS
========================= */

app.get("/api/sensor-readings", (req, res) => {
    const sql = `
        SELECT
            sr.reading_id,
            sr.session_id,
            sr.sensor_id,
            s.room_id,
            sr.parameter_id,
            p.parameter_name,
            p.unit,
            sr.reading_value,
            sr.reading_timestamp
        FROM sensor_readings sr
        JOIN parameters p
            ON sr.parameter_id = p.parameter_id
        JOIN sensors s
            ON sr.sensor_id = s.sensor_id
        ORDER BY sr.reading_timestamp DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch sensor readings:", err);
            return res.status(500).json({
                error: "Failed to fetch sensor readings"
            });
        }

        res.json(results);
    });
});

/* =========================
   PARAMETERS
========================= */

app.get("/api/parameters", (req, res) => {
    db.query(
        "SELECT * FROM parameters",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch parameters"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   ENVIRONMENTAL PROFILES
========================= */

app.get("/api/profiles", (req, res) => {
    db.query(
        "SELECT * FROM environmental_profiles",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch profiles"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   PROFILE PARAMETERS
========================= */

app.get("/api/profile-parameters", (req, res) => {
    db.query(
        "SELECT * FROM profile_parameters",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch profile parameters"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   PROFILE ASSIGNMENTS
========================= */

app.get("/api/assignments", (req, res) => {
    db.query(
        "SELECT * FROM profile_assignments",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch assignments"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   MONITORING SESSIONS
========================= */

app.get("/api/sessions", (req, res) => {
    db.query(
        "SELECT * FROM monitoring_sessions",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch sessions"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   SENSORS
========================= */

app.get("/api/sensors", (req, res) => {
    db.query(
        "SELECT * FROM sensors",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch sensors"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   SENSOR READINGS
========================= */

app.get("/api/readings", (req, res) => {
    db.query(
        "SELECT * FROM sensor_readings ORDER BY reading_timestamp DESC",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch readings"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   DOOR EVENTS
========================= */

app.get("/api/door-events", (req, res) => {
    db.query(
        "SELECT * FROM door_events ORDER BY event_timestamp DESC",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch door events"
                });
            }

            res.json(results);
        }
    );
});

/* =========================
   EVENTS
========================= */

app.get("/api/events", (req, res) => {
    const sql = `
        SELECT
            e.event_id,
            e.session_id,
            e.parameter_id,
            e.event_type,
            e.severity,
            e.event_start,
            e.event_end,
            e.status,

            p.parameter_name,
            p.unit,

            ms.assignment_id,
            pa.room_id,

            c.room_name,

           pp.min_value,
pp.max_value,
pp.target_value,

(
    SELECT sr.reading_value
    FROM sensor_readings sr
    WHERE sr.session_id = e.session_id
      AND sr.parameter_id = e.parameter_id
    ORDER BY ABS(
        TIMESTAMPDIFF(
            SECOND,
            sr.reading_timestamp,
            e.event_start
        )
    )
    LIMIT 1
) AS detected_value

FROM events e
        JOIN parameters p
            ON e.parameter_id = p.parameter_id

        JOIN monitoring_sessions ms
            ON e.session_id = ms.session_id

        JOIN profile_assignments pa
            ON ms.assignment_id = pa.assignment_id

        JOIN cleanrooms c
            ON pa.room_id = c.room_id

        JOIN profile_parameters pp
            ON pa.profile_id = pp.profile_id
            AND e.parameter_id = pp.parameter_id

        ORDER BY e.event_start DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch events:", err);
            return res.status(500).json({
                error: "Failed to fetch events"
            });
        }

        console.log("Events loaded from database:", results);

        res.json(results);
    });
});
/* =========================
   CORRECTIVE ACTIONS
========================= */

app.get("/api/corrective-actions", (req, res) => {
    db.query(
        "SELECT * FROM corrective_actions ORDER BY triggered_at DESC",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch corrective actions"
                });
            }

            res.json(results);
        }
    );
});

app.post("/api/corrective-actions", (req, res) => {
    const {
        event_id,
        action_type,
        action_description
    } = req.body;

    const sql = `
        INSERT INTO corrective_actions
        (event_id, action_type, action_description, triggered_at, action_status)
        VALUES (?, ?, ?, NOW(), 'PENDING')
    `;

    db.query(
        sql,
        [event_id, action_type, action_description],
        (err, result) => {
            if (err) {
                console.error("Failed to save corrective action:", err);
                return res.status(500).json({
                    error: "Failed to save corrective action"
                });
            }

            res.status(201).json({
                message: "Corrective action saved successfully",
                action_id: result.insertId
            });
        }
    );
});


/* =========================
   DIAGNOSES
========================= */

app.get("/api/diagnoses", (req, res) => {
    db.query(
        "SELECT * FROM diagnoses ORDER BY generated_at DESC",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to fetch diagnoses"
                });
            }

            res.json(results);
        }
    );
});

app.post("/api/diagnoses", (req, res) => {
    const {
        event_id,
        affected_sensor_id,
        likely_cause,
        recommended_action,
        diagnosis_level
    } = req.body;

    const sql = `
        INSERT INTO diagnoses
        (
            event_id,
            affected_sensor_id,
            likely_cause,
            recommended_action,
            diagnosis_level
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            event_id,
            affected_sensor_id || null,
            likely_cause,
            recommended_action,
            diagnosis_level || "POSSIBLE"
        ],
        (err, result) => {
            if (err) {
                console.error("Failed to save diagnosis:", err);
                return res.status(500).json({
                    error: "Failed to save diagnosis"
                });
            }

            res.status(201).json({
                message: "Diagnosis saved successfully",
                diagnosis_id: result.insertId
            });
        }
    );
});

/* =========================
   CREATE CORRECTIVE ACTION
========================= */

app.post("/api/corrective-actions", (req, res) => {
    const {
        event_id,
        action_type,
        action_description
    } = req.body;

    if (!event_id || !action_type) {
        return res.status(400).json({
            error: "event_id and action_type are required"
        });
    }

    const sql = `
        INSERT INTO corrective_actions
        (
            event_id,
            action_type,
            action_description,
            triggered_at,
            action_status
        )
        VALUES (?, ?, ?, NOW(), 'PENDING')
    `;

    db.query(
        sql,
        [
            event_id,
            action_type,
            action_description || null
        ],
        (err, result) => {
            if (err) {
                console.error(
                    "Failed to create corrective action:",
                    err
                );

                return res.status(500).json({
                    error: "Failed to create corrective action"
                });
            }

            console.log(
                "Corrective action created:",
                result.insertId
            );

            res.status(201).json({
                message: "Corrective action created successfully",
                action_id: result.insertId
            });
        }
    );
});

/* =========================
   UPDATE CORRECTIVE ACTION
========================= */

app.put("/api/corrective-actions/:id", (req, res) => {
    const { id } = req.params;
    const {
        action_status,
        completed_at
    } = req.body;

    const sql = `
        UPDATE corrective_actions
        SET
            action_status = ?,
            completed_at = ?
        WHERE action_id = ?
    `;

    db.query(
        sql,
        [action_status, completed_at || null, id],
        (err, result) => {
            if (err) {
                console.error("Failed to update corrective action:", err);
                return res.status(500).json({
                    error: "Failed to update corrective action"
                });
            }

            res.json({
                message: "Corrective action updated successfully"
            });
        }
    );
});


/* =========================
   CREATE DIAGNOSIS
========================= */

app.post("/api/diagnoses", (req, res) => {
    const {
        event_id,
        affected_sensor_id,
        likely_cause,
        recommended_action,
        diagnosis_level
    } = req.body;

    if (!event_id || !likely_cause || !recommended_action) {
        return res.status(400).json({
            error: "event_id, likely_cause and recommended_action are required"
        });
    }

    const sql = `
        INSERT INTO diagnoses
        (
            event_id,
            affected_sensor_id,
            likely_cause,
            recommended_action,
            diagnosis_level
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            event_id,
            affected_sensor_id || null,
            likely_cause,
            recommended_action,
            diagnosis_level || "POSSIBLE"
        ],
        (err, result) => {
            if (err) {
                console.error("Failed to create diagnosis:", err);

                return res.status(500).json({
                    error: "Failed to create diagnosis"
                });
            }

            console.log(
                "Diagnosis created:",
                result.insertId
            );

            res.status(201).json({
                message: "Diagnosis created successfully",
                diagnosis_id: result.insertId
            });
        }
    );
});
/* =========================
   UPDATE SENSOR STATUS
========================= */

app.put("/api/sensors/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = `
        UPDATE sensors
        SET status = ?
        WHERE sensor_id = ?
    `;

    db.query(
        sql,
        [status, id],
        (err, result) => {
            if (err) {
                console.error("Failed to update sensor:", err);
                return res.status(500).json({
                    error: "Failed to update sensor"
                });
            }

            res.json({
                message: "Sensor status updated successfully"
            });
        }
    );
});


/* =========================
   CREATE SENSOR
========================= */

app.post("/api/sensors", (req, res) => {
    const {
        room_id,
        sensor_name,
        sensor_type,
        location,
        status
    } = req.body;

    const sql = `
        INSERT INTO sensors
        (
            room_id,
            sensor_name,
            sensor_type,
            location,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            room_id,
            sensor_name,
            sensor_type,
            location,
            status || "ACTIVE"
        ],
        (err, result) => {
            if (err) {
                console.error("Failed to create sensor:", err);
                return res.status(500).json({
                    error: "Failed to create sensor"
                });
            }

            res.status(201).json({
                message: "Sensor created successfully",
                sensor_id: result.insertId
            });
        }
    );
});


/* =========================
   UPDATE EVENT
========================= */

app.put("/api/events/:id", (req, res) => {
    const { id } = req.params;
    const {
        status,
        event_end
    } = req.body;

    const sql = `
        UPDATE events
        SET
            status = ?,
            event_end = ?
        WHERE event_id = ?
    `;

    db.query(
        sql,
        [status, event_end || null, id],
        (err, result) => {
            if (err) {
                console.error("Failed to update event:", err);
                return res.status(500).json({
                    error: "Failed to update event"
                });
            }

            res.json({
                message: "Event updated successfully"
            });
        }
    );
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
    console.log(`CREMS Backend running on http://localhost:${PORT}`);
});