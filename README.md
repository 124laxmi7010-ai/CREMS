Clean Room Environmental Monitoring System (CREMS)
1. Project Synopsis
Project Title
Clean Room Environmental Monitoring System (CREMS)
Introduction
The Clean Room Environmental Monitoring System (CREMS) is a monitoring and response system designed to observe environmental conditions in controlled environments, particularly pharmaceutical cleanrooms. Environmental parameters such as temperature, humidity, pressure, and particulate levels can influence manufacturing conditions and product quality.

The project combines environmental sensors, an ESP32 microcontroller, a web-based dashboard, a backend server, and a database to collect, process, display, and store environmental information. Its main focus is to detect environmental deviations, support corrective actions, and verify whether conditions return to acceptable limits.
Problem Statement
Maintaining suitable environmental conditions is essential in pharmaceutical cleanrooms. However, manual monitoring and separate record-keeping activities can make it difficult to identify environmental deviations promptly, track changes over time, and respond effectively to abnormal conditions. This creates a need for a centralized system that improves environmental visibility and supports systematic monitoring and response.
Objectives
- To develop a centralized environmental monitoring system.
- To monitor environmental parameters using sensors.
- To collect and display environmental readings in a web dashboard.
- To compare sensor readings with predefined environmental limits.
- To detect and classify abnormal environmental conditions.
- To store monitoring data and event records in a database.
- To support probable-cause diagnosis using predefined rules.
- To initiate or support corrective actions.
- To verify whether environmental conditions return to acceptable limits.
- To maintain historical records for analysis and maintenance.
Proposed Solution
CREMS proposes an integrated hardware and software system for environmental monitoring. Sensors collect environmental readings, while the ESP32 supports data acquisition and hardware control. The backend processes monitoring information, and the MySQL database stores readings and associated event records. The dashboard provides users with environmental status and relevant information.

The system follows a closed-loop approach:

Monitor → Detect → Diagnose → Act → Verify → Record

The project demonstrates how environmental monitoring can be connected with corrective response and recovery verification.
2. Project Details
Technologies Used
Component	Technology
Frontend	React.js, HTML, CSS, JavaScript
Backend	Node.js, Express.js
Database	MySQL
Microcontroller	ESP32
Temperature and humidity sensor	DHT22
Particulate sensor	Sharp GP2Y1010AU0F
Door detection	HC-SR04 ultrasonic sensor
Corrective hardware	DC motor and fan
API communication	REST APIs, JSON
Database tool	MySQL Workbench
Development tools	Visual Studio Code, Git, GitHub
The table describes the project technology stack and intended hardware configuration; individual features should be identified as implemented only where verified in the prototype.
Main Modules
1. Environmental Monitoring Module
- Collect environmental readings from connected sensors.
- Monitor temperature and humidity.
- Support particulate monitoring and door-event detection where configured.
- Display the current environmental status.
2. Deviation Detection Module
- Compare readings against configured environmental limits.
- Identify abnormal conditions.
- Classify deviations according to the configured rules.
- Generate event records for detected deviations.
3. Diagnosis Module
- Analyse available readings and contextual information.
- Apply predefined rules to identify possible causes.
- Provide recommended actions based on the detected condition.
4. Corrective Action Module
- Support corrective responses to abnormal conditions.
- Control the configured fan or other prototype actuators.
- Record corrective-action status where implemented.
5. Verification Module
- Monitor environmental conditions after corrective action.
- Check whether readings return to acceptable limits.
- Identify persistent deviations that require further investigation.
6. Dashboard Module
- Display environmental readings and status.
- Present alerts and environmental events.
- Provide historical readings and trend information where implemented.
- Support access to monitoring and maintenance records.
7. Database Management Module
- Store sensor readings and timestamps.
- Maintain monitoring sessions and event records.
- Associate events with diagnoses and corrective actions.
- Retrieve historical information for analysis.
3. Database Concepts — ADBMS
The project demonstrates relational database concepts through MySQL.
- Relational Data Modelling: Organize information into related tables.
- Primary Keys: Uniquely identify records.
- Foreign Keys: Establish relationships between related tables.
- CRUD Operations: Create, read, update, and delete records where supported.
- Data Integrity: Maintain consistency through constraints and relationships.
- Query Processing: Retrieve environmental readings, events, and session information.
- Data Relationships: Connect users, rooms, sensors, monitoring sessions, events, diagnoses, and corrective actions.
- Historical Data Management: Store timestamped readings for reviewing environmental changes.
- Data Retrieval and Analysis: Query stored records to support monitoring and maintenance decisions.
Main Database Tables
- users
- products
- manufacturing_activities
- cleanrooms
- parameters
- environmental_profiles
- profile_parameters
- profile_assignments
- monitoring_sessions
- sensors
- sensor_readings
- door_events
- events
- corrective_actions
- diagnoses
These tables support the organization and management of environmental monitoring data.
4. Web Technology Concepts
The project applies the following web development concepts:
- Client–Server Architecture: Separates the dashboard from backend processing.
- Component-Based Development: Uses React to organize reusable interface components.
- REST API Development: Enables communication between the frontend and backend.
- HTTP Communication: Transfers requests and responses between application components.
- JSON Data Exchange: Supports structured communication between the frontend and backend.
- Backend Processing: Applies application logic and environmental threshold checks.
- Database Integration: Connects backend services with MySQL.
- Dynamic Dashboard: Displays monitoring information obtained from the backend.
- Hardware–Software Integration: Connects sensor readings and actuator control with the monitoring application.
5. System Architecture
CREMS follows a layered architecture connecting hardware, backend services, the database, and the dashboard.
+----------------------------------+
|       Environmental Sensors      |
|  DHT22 | Particulate | Door      |
+----------------+-----------------+
                 |
                 v
+----------------------------------+
|          ESP32 Controller        |
|   Data Acquisition / Actuation   |
+----------------+-----------------+
                 |
                 v
+----------------------------------+
|          Backend Server          |
|       Node.js + Express.js        |
| Processing, Rules and APIs        |
+----------------+-----------------+
                 |
                 v
+----------------------------------+
|           MySQL Database         |
| Readings, Sessions, Events,       |
| Diagnoses and Corrective Actions  |
+----------------+-----------------+
                 |
                 v
+----------------------------------+
|          CREMS Dashboard         |
| Status, Alerts and History        |
+----------------+-----------------+
                 |
                 v
+----------------------------------+
| Detection → Diagnosis → Action   |
|       → Verification             |
+----------------------------------+


The exact hardware-to-backend communication method depends on the implemented firmware and integration.
6. Project Structure
The repository can be organized into the following directories:
CREMS/
├── README.md
├── docs/
│   ├── CREMS_Project_Report.pdf
│   ├── CREMS_Project_Synopsis.pdf
│   └── CREMS_Presentation.pptx
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── sample_data.sql
│
├── hardware/
│   ├── esp32_code/
│   ├── circuit_connections.md
│   └── components.md
│
└── .gitignore


This is a recommended repository layout; adjust the directory names to match your actual files.
7. Expected Outcomes
- Centralized display of environmental information.
- Automated detection of configured environmental deviations.
- Improved visibility of abnormal conditions.
- Historical storage of sensor readings and events.
- Rule-based support for identifying probable causes.
- Support for corrective actions through connected hardware.
- Verification of environmental recovery after corrective action.
- Organized records to support environmental analysis and maintenance.
- Practical demonstration of database, web development, and hardware integration concepts.
8. Future Scope
- Integration of industrial-grade environmental sensors.
- Monitoring of multiple cleanrooms and manufacturing areas.
- Integration with HVAC, PLC, and building management systems.
- Mobile application and remote notifications.
- Advanced environmental trend analysis.
- AI/ML-assisted diagnosis and predictive maintenance.
- Improved sensor calibration and system reliability.
- Enhanced security, auditability, and access control.
- Industrial testing and validation.
9. Academic Relevance
CREMS demonstrates the practical application of Advanced Database Management Systems (ADBMS), Web Technology, and embedded systems.

ADBMS concepts are applied through relational data modelling, database constraints, SQL queries, and management of related records. Web Technology concepts are applied through frontend development, backend APIs, client–server communication, and database integration. Embedded systems concepts are demonstrated through sensor acquisition and actuator control using an ESP32.

The project brings these concepts together in an environmental monitoring application based on a pharmaceutical cleanroom use case.
10. Conclusion
The Clean Room Environmental Monitoring System provides a prototype approach to centralized environmental monitoring and response. By combining sensors, an ESP32 controller, a web dashboard, backend services, and a MySQL database, the project demonstrates how environmental readings can be collected, analysed, stored, and presented to users.

Its key concept is the integration of monitoring with deviation detection, probable-cause diagnosis, corrective action, and recovery verification. The prototype establishes a foundation for future development toward more reliable and scalable environmental monitoring systems.
11. Project Team
- Upasana Kundan Meher
- Ritika Mukesh Chaurasiya
- Laxmi Asaram Dhaytadak
