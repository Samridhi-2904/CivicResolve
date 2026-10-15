# CivicTrack --- Complete Implementation Specification

**Document type:** Product requirements, system design, database
specification, API contract, and implementation roadmap\
**Project type:** Resume-focused full-stack civic technology
application\
**Working title:** CivicTrack\
**Tagline:** Report. Track. Resolve.

------------------------------------------------------------------------

## 1. Executive Summary

CivicTrack is a web platform through which citizens can report local
infrastructure problems---such as potholes, overflowing garbage bins,
broken streetlights, blocked drains, and water leaks---and follow the
progress of each report. Municipal administrators can review, route,
prioritize, and assign reports to field workers. Workers can update work
status and submit evidence of completed work. Citizens can then confirm
whether the issue has actually been fixed or reopen it if the evidence
does not match reality.

The central product principle is:

> **Report → Review → Assign → Work → Submit evidence → Verify → Close**

CivicTrack is a portfolio project, not an official government service.
Unless a formal integration is obtained, municipal departments, workers,
maps, notifications, and complaint data used in demonstrations should be
clearly identified as a prototype or sample environment.

### 1.1 Problem statement

Citizens may have difficulty finding the correct place to report local
infrastructure issues. Even when a complaint is submitted, the person
reporting it may not know whether it was reviewed, who is responsible,
what work is happening, or whether the issue was genuinely resolved.
Municipal teams also need a structured way to categorize, route,
prioritize, assign, and monitor reports.

CivicTrack aims to provide one understandable workflow for reporting and
tracking local issues, together with an auditable record of status
changes and resolution evidence.

### 1.2 Proposed solution

The platform provides:

-   A simple citizen reporting form.
-   A category, description, photograph, and optional GPS location for
    each issue.
-   A unique ticket number and complaint detail page.
-   A role-based administrator workflow for review and assignment.
-   A worker interface for updating progress and uploading completion
    evidence.
-   A status timeline and notification system.
-   Citizen confirmation or reopening of a claimed resolution.
-   A public map and aggregate dashboard, with privacy-conscious display
    rules.
-   Administrative reporting for workload, resolution time, and
    service-level target breaches.

### 1.3 Product positioning

CivicTrack does not claim to invent civic reporting. Existing public
grievance systems already support various forms of complaint
registration and tracking. The portfolio project's value is to
demonstrate a cohesive, well-engineered workflow with evidence-based
closure, transparent history, access control, geospatial reporting, and
measurable operational insights.

------------------------------------------------------------------------

## 2. Goals and Non-Goals

### 2.1 Goals

1.  Make it possible to submit a useful issue report in a small number
    of steps.
2.  Store reports reliably and give each report a unique ticket number.
3.  Make complaint status and history understandable.
4.  Route reports to a department using configurable category mappings.
5.  Restrict administrative and worker actions using backend-enforced
    permissions.
6.  Maintain a record of status changes and assignments.
7.  Require completion evidence before a worker can submit a resolution.
8.  Let the citizen confirm or dispute the claimed resolution.
9.  Support map-based discovery and aggregate statistics.
10. Provide a maintainable codebase, automated tests, documentation, and
    a deployable demo.

### 2.2 Non-goals for the first release

-   Direct integration with a real municipal government system.
-   Guaranteed response or repair by a real authority.
-   Native Android and iOS applications.
-   Microservices, Kubernetes, or a distributed event platform.
-   AI-based image classification or severity assessment.
-   Facial recognition or identity inference from photographs.
-   Payments, fines, or enforcement workflows.
-   Public display of citizens' phone numbers, email addresses, or
    precise home locations.
-   Claims of production-grade scale without load testing and
    operational evidence.

------------------------------------------------------------------------

## 3. Users and Roles

Use three application roles in the MVP.

### 3.1 Citizen

A citizen can:

-   Register, log in, and log out.
-   Create a report with a category, title, description, and optional
    image.
-   Provide a location using the browser's location permission or by
    selecting a point on a map.
-   View reports they created.
-   View permitted public reports.
-   See a ticket number and status timeline.
-   Add comments where enabled.
-   Support an existing report to indicate that the issue affects them.
-   Receive in-app notifications.
-   Confirm a resolution or request reopening with a reason and optional
    new evidence.

A citizen must not be able to assign workers, change administrative
priority, or arbitrarily change complaint status.

### 3.2 Administrator

An administrator can:

-   Review incoming reports.
-   Mark reports as verified or reject invalid reports with a reason.
-   Select or confirm the responsible department.
-   Set priority and due dates according to policy.
-   Assign or reassign a worker.
-   Perform allowed status transitions.
-   Review completion evidence.
-   Monitor overdue reports and department workload.
-   View aggregate analytics and the status audit trail.

An administrator should only access the administrative functions granted
to their account. A future multi-tenant production version should scope
administrators to their municipality, zone, or department.

### 3.3 Field worker

A field worker can:

-   View reports assigned to them.
-   See relevant issue details and location.
-   Accept an assignment if acceptance is part of the configured
    workflow.
-   Mark work as started.
-   Add progress notes and progress photographs.
-   Submit a resolution with an after-photo and work summary.
-   See the current state and due date of their assignments.

A worker must not modify reports assigned to another worker unless an
explicit supervisor permission allows it.

### 3.4 Public visitor

A visitor may browse approved public reports and aggregate statistics
without logging in. Private details, contact information, internal
notes, and sensitive exact locations must not be exposed.

------------------------------------------------------------------------

## 4. Functional Requirements

Use stable identifiers such as `FR-001` so requirements can be traced to
implementation and tests.

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-001                  A user can register     MVP
                          with name, email, and   
                          password.               

  FR-002                  A user can log in and   MVP
                          log out securely.       

  FR-003                  The server enforces     MVP
                          role-based              
                          authorization.          

  FR-004                  A citizen can submit a  MVP
                          report with title,      
                          description, category,  
                          and location when       
                          known.                  

  FR-005                  A citizen can attach an MVP
                          image using validated   
                          upload handling.        

  FR-006                  Each report receives a  MVP
                          unique human-readable   
                          ticket number.          

  FR-007                  Citizens can list and   MVP
                          view their own reports. 

  FR-008                  A permitted public      MVP
                          endpoint exposes only   
                          public-safe report      
                          fields.                 

  FR-009                  Administrators can      MVP
                          review, verify, or      
                          reject reports.         

  FR-010                  Administrators can      MVP
                          assign a department and 
                          worker.                 

  FR-011                  Workers can update work MVP
                          progress using valid    
                          transitions.            

  FR-012                  Workers can submit      MVP
                          resolution evidence and 
                          a work summary.         

  FR-013                  Citizens can confirm a  MVP
                          resolution or request   
                          reopening.              

  FR-014                  Status changes and      MVP
                          assignments are         
                          recorded in an audit    
                          history.                

  FR-015                  The system creates      MVP
                          in-app notifications    
                          for important events.   

  FR-016                  Users can filter and    MVP
                          paginate report lists.  

  FR-017                  Users can see reports   MVP
                          on a map, subject to    
                          privacy rules.          

  FR-018                  Administrators can view MVP
                          counts and basic        
                          resolution statistics.  

  FR-019                  The system calculates   MVP/basic
                          target due dates and    
                          flags overdue reports.  

  FR-020                  The system sends email  Later MVP enhancement
                          notifications.          

  FR-021                  Potential duplicate     Phase 2
                          reports can be          
                          suggested based on      
                          category, distance, and 
                          time.                   

  FR-022                  Citizens can support an Phase 2
                          existing report once    
                          per account.            

  FR-023                  The system can escalate Phase 2
                          overdue reports         
                          automatically.          

  FR-024                  AI can suggest a        Future
                          category from text or   
                          image.                  

  FR-025                  The system can          Future, dependent on
                          integrate with an       access
                          official municipal API. 
  -----------------------------------------------------------------------

### 4.1 Core user stories

-   As a citizen, I want to report a pothole with a photo and location
    so the responsible team can find it.
-   As a citizen, I want a ticket number and a timeline so I can track
    progress.
-   As an administrator, I want reports categorized and routed so they
    reach the right team.
-   As a worker, I want to see my assignments and due dates so I can
    organize field work.
-   As a citizen, I want to challenge a resolution if the issue still
    exists.
-   As an administrator, I want to identify overdue reports and workload
    patterns.

------------------------------------------------------------------------

## 5. Non-Functional Requirements

  -----------------------------------------------------------------------
  Area                                Requirement
  ----------------------------------- -----------------------------------
  Security                            Passwords are hashed; private
                                      routes require authentication;
                                      sensitive actions require
                                      server-side authorization.

  Privacy                             Do not expose email, phone,
                                      password hashes, internal notes, or
                                      precise sensitive locations
                                      publicly.

  Reliability                         A report and its initial status
                                      history are created atomically.
                                      Notification failure must not erase
                                      a saved report.

  Performance                         Paginate lists and add indexes for
                                      frequent filters. Define measurable
                                      performance targets only after
                                      testing.

  Maintainability                     Keep routes, controllers, services,
                                      validation, and data access
                                      separated.

  Accessibility                       Forms have labels, keyboard
                                      navigation, useful error messages,
                                      and sufficient contrast.

  Usability                           Reporting should be concise,
                                      mobile-friendly, and resilient to
                                      upload errors.

  Auditability                        Status transitions, assignment
                                      changes, rejection, and resolution
                                      decisions have timestamps and actor
                                      IDs.

  Portability                         Secrets and environment-specific
                                      configuration are not committed to
                                      source control.

  Observability                       Log unexpected errors with a
                                      request ID without logging
                                      passwords, tokens, or sensitive
                                      personal data.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 6. Recommended Technology Stack

### 6.1 Selected stack

  --------------------------------------------------------------------------
  Layer                   Recommendation             Reason
  ----------------------- -------------------------- -----------------------
  Frontend                React + TypeScript         Component-based UI with
                                                     compile-time type
                                                     checking. JavaScript is
                                                     acceptable if it
                                                     matches the learner's
                                                     current level.

  Build tool              Vite                       Fast development server
                                                     and straightforward
                                                     production build.

  Styling                 Tailwind CSS               Rapid, consistent
                                                     responsive layouts.

  Routing                 React Router               Client-side route
                                                     handling and
                                                     role-specific layouts.

  API client              Axios or native `fetch`    Centralized API calls
                                                     and error handling.
                                                     Choose one
                                                     consistently.

  Forms                   React Hook Form + Zod, or  Validation and
                          controlled forms + Zod     manageable form state.

  Backend                 Node.js + Express          Familiar
                                                     JavaScript/TypeScript
                                                     ecosystem and REST API
                                                     support.

  API validation          Zod or express-validator   Validate request
                                                     bodies, params, and
                                                     query strings on the
                                                     server.

  Database                PostgreSQL                 Relational data,
                                                     constraints,
                                                     transactions, and
                                                     strong query support.

  Database access         Prisma ORM with            Prisma is
                          migrations, or `pg` with   beginner-friendly; SQL
                          SQL migrations             is useful to learn
                                                     deeply. Pick one for
                                                     the MVP.

  Authentication          Secure server-side session Avoid exposing
                          or short-lived JWT in an   long-lived bearer
                          HttpOnly cookie            tokens to JavaScript.
                                                     If using JWT, define
                                                     expiry,
                                                     revocation/logout
                                                     behavior, and refresh
                                                     strategy.

  Password hashing        Argon2id or bcrypt         Passwords must never be
                                                     stored in plaintext.

  Image storage           Cloudinary, S3-compatible  Store image bytes
                          storage, or Supabase       outside relational
                          Storage                    tables; keep object
                                                     keys/URLs and metadata
                                                     in PostgreSQL.

  Maps                    Leaflet +                  Cost-conscious
                          OpenStreetMap-compatible   interactive maps.
                          tiles                      Review tile-provider
                                                     usage policies before
                                                     deployment.

  Geocoding               A geocoding provider with  Convert coordinates to
                          usage limits and a privacy a human-readable
                          policy                     address when needed. Do
                                                     not assume a free
                                                     public endpoint is
                                                     unlimited.

  Email                   A transactional email      Email is useful but
                          provider, added after      should not block the
                          in-app notifications       core workflow.

  Testing                 Vitest/Jest, Supertest,    Unit, API integration,
                          and Playwright             and browser workflow
                                                     testing.

  Version control         Git + GitHub               Collaboration, history,
                                                     issues, and portfolio
                                                     visibility.

  Deployment              Vercel/Netlify for         Simple initial
                          frontend; Render/Railway   deployment; review
                          or a cloud provider for    pricing, sleep
                          API; managed PostgreSQL    behavior, and free-tier
                                                     limits.
  --------------------------------------------------------------------------

### 6.2 Architectural decision

Use a **modular monolith** for the MVP. One backend deployment contains
modules such as authentication, complaints, assignments, evidence,
notifications, and analytics. Modules have clear boundaries but share a
database and deployment pipeline.

Do not begin with microservices. They introduce networking, deployment,
observability, and data-consistency overhead that is not justified for a
student MVP.

------------------------------------------------------------------------

## 7. High-Level Architecture

``` text
Citizen / Admin / Worker browser
              |
              | HTTPS
              v
       React + TypeScript
              |
              | REST / JSON
              v
       Node.js + Express
       ├── Authentication & authorization
       ├── Complaint service
       ├── Workflow/state-transition service
       ├── Assignment service
       ├── Evidence/upload service
       ├── Notification service
       └── Analytics service
              |
       ┌──────┼─────────────┐
       v      v             v
 PostgreSQL Object storage  Map/geocoding provider
       |
       └── users, reports, assignments,
           status history, evidence metadata,
           comments, notifications, SLA data
```

### 7.1 Request flow

1.  The browser submits a request over HTTPS.
2.  Express applies request-size limits, request ID, CORS policy, and
    rate limiting.
3.  Authentication middleware identifies the current user.
4.  Authorization middleware checks the required role and resource
    ownership.
5.  Request validation checks the body, path parameters, and query
    parameters.
6.  The controller calls a service that implements the business rule.
7.  The service performs database work through a transaction when
    multiple writes must succeed together.
8.  The server returns a documented response shape.
9.  Notification work is queued or recorded after the main business
    transaction succeeds.

### 7.2 Frontend/backend boundary

The frontend is not trusted. Any rule enforced only in React can be
bypassed by calling the API directly. The backend is the source of truth
for roles, allowed status transitions, assignment permissions, priority
changes, and closure rules.

------------------------------------------------------------------------

## 8. Repository Structure

A monorepo is convenient for a solo project.

``` text
civictrack/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── complaints/
│   │   │   ├── map/
│   │   │   ├── admin/
│   │   │   ├── worker/
│   │   │   └── notifications/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── categories/
│   │   │   ├── departments/
│   │   │   ├── complaints/
│   │   │   ├── assignments/
│   │   │   ├── evidence/
│   │   │   ├── comments/
│   │   │   ├── notifications/
│   │   │   └── analytics/
│   │   ├── db/
│   │   ├── jobs/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/ or migrations/
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── workflows.md
│   └── threat-model.md
├── screenshots/
├── .gitignore
├── README.md
└── package.json (optional workspace root)
```

Use a consistent naming convention. A module can contain `routes`,
`controller`, `service`, `repository`/`data-access`, and `schema` files.
Avoid putting all business logic in route handlers.

------------------------------------------------------------------------

## 9. Domain Model and Database Design

### 9.1 Design principles

-   Use a primary key for every entity.
-   Use foreign keys to preserve referential integrity.
-   Use `NOT NULL`, `CHECK`, and `UNIQUE` constraints where applicable.
-   Store timestamps in UTC using `TIMESTAMPTZ`.
-   Use migrations rather than manually changing a shared database
    schema.
-   Store image bytes in object storage, not as large database blobs.
-   Keep current status on the complaint for fast reads and also
    preserve every transition in history.
-   Use a database transaction for related writes.
-   Use soft deletion only where there is a clear requirement; do not
    use it to hide audit records.

### 9.2 Enumerated values

Recommended complaint statuses:

``` text
SUBMITTED
UNDER_REVIEW
VERIFIED
REJECTED
ASSIGNED
IN_PROGRESS
RESOLUTION_SUBMITTED
AWAITING_CITIZEN_VERIFICATION
CLOSED
REOPENED
```

Recommended roles:

``` text
CITIZEN
ADMIN
WORKER
```

Recommended priorities:

``` text
LOW
MEDIUM
HIGH
CRITICAL
```

Recommended image/evidence types:

``` text
BEFORE
PROGRESS
AFTER
REOPENING
```

PostgreSQL enums are suitable when values change infrequently. A lookup
table is preferable if administrators must configure values dynamically.

### 9.3 `users`

  -----------------------------------------------------------------------
  Column                  Type                    Rules / purpose
  ----------------------- ----------------------- -----------------------
  `id`                    UUID                    Primary key

  `name`                  VARCHAR(120)            Required

  `email`                 CITEXT or normalized    Required, unique,
                          VARCHAR(255)            normalized to lowercase

  `password_hash`         TEXT                    Required; never return
                                                  from API

  `role`                  user-role enum          Required; default
                                                  `CITIZEN`; privileged
                                                  roles assigned only by
                                                  trusted admin/seed
                                                  process

  `phone`                 VARCHAR(30)             Optional; keep private

  `is_active`             BOOLEAN                 Required, default true

  `created_at`            TIMESTAMPTZ             Required

  `updated_at`            TIMESTAMPTZ             Required
  -----------------------------------------------------------------------

Indexes/constraints: - Unique normalized email. - Index on
`(role, is_active)` if role-based user listing is common.

### 9.4 `departments`

  Column          Type           Rules / purpose
  --------------- -------------- ------------------
  `id`            UUID           Primary key
  `name`          VARCHAR(120)   Required
  `code`          VARCHAR(40)    Required, unique
  `description`   TEXT           Optional
  `is_active`     BOOLEAN        Default true
  `created_at`    TIMESTAMPTZ    Required
  `updated_at`    TIMESTAMPTZ    Required

Example departments: Roads, Sanitation, Electrical, Water, Drainage,
Public Works.

### 9.5 `categories`

  ---------------------------------------------------------------------------
  Column                      Type                    Rules / purpose
  --------------------------- ----------------------- -----------------------
  `id`                        UUID                    Primary key

  `name`                      VARCHAR(100)            Required

  `code`                      VARCHAR(40)             Required, unique

  `description`               TEXT                    Optional

  `default_department_id`     UUID                    FK to departments; may
                                                      be nullable if routing
                                                      is manual

  `default_priority`          priority enum           Default MEDIUM

  `target_resolution_hours`   INTEGER                 Positive value; target,
                                                      not a guarantee

  `is_active`                 BOOLEAN                 Default true

  `created_at`                TIMESTAMPTZ             Required

  `updated_at`                TIMESTAMPTZ             Required
  ---------------------------------------------------------------------------

Use the category's default department as an initial routing suggestion.
An authorized administrator can override it with an audit record.

### 9.6 `complaints`

  -----------------------------------------------------------------------
  Column                  Type                    Rules / purpose
  ----------------------- ----------------------- -----------------------
  `id`                    UUID                    Primary key

  `ticket_number`         VARCHAR(40)             Required, unique,
                                                  human-readable

  `reporter_id`           UUID                    FK to users; required

  `category_id`           UUID                    FK to categories;
                                                  required

  `department_id`         UUID                    FK to departments;
                                                  nullable until routed

  `assigned_worker_id`    UUID                    FK to users; nullable
                                                  until assigned

  `title`                 VARCHAR(160)            Required

  `description`           TEXT                    Required; enforce a
                                                  reasonable maximum

  `status`                complaint-status enum   Required, default
                                                  SUBMITTED

  `priority`              priority enum           Required, default
                                                  MEDIUM

  `latitude`              NUMERIC(9,6)            Nullable; check -90 to
                                                  90

  `longitude`             NUMERIC(9,6)            Nullable; check -180 to
                                                  180

  `address`               VARCHAR(500)            Optional, user-entered
                                                  or geocoded

  `ward_code`             VARCHAR(80)             Optional; use a real
                                                  ward table if needed

  `is_public`             BOOLEAN                 Default true, subject
                                                  to moderation/privacy
                                                  policy

  `rejection_reason`      TEXT                    Nullable; required when
                                                  rejected

  `resolution_summary`    TEXT                    Nullable until
                                                  resolution submitted

  `submitted_at`          TIMESTAMPTZ             Required

  `due_at`                TIMESTAMPTZ             Nullable until target
                                                  calculated

  `resolved_at`           TIMESTAMPTZ             Nullable

  `closed_at`             TIMESTAMPTZ             Nullable

  `created_at`            TIMESTAMPTZ             Required

  `updated_at`            TIMESTAMPTZ             Required
  -----------------------------------------------------------------------

Important constraints: - `latitude` and `longitude` should either both
be null or both be populated. - Latitude and longitude must be in valid
ranges. - `ticket_number` must be unique. - `assigned_worker_id`, when
set, must reference an active user with role WORKER; enforce in service
logic or with a more advanced database design. - A rejected complaint
must have a rejection reason. - A report must not be considered closed
solely because a worker uploaded an image.

Recommended indexes: - `(reporter_id, created_at DESC)` -
`(status, created_at DESC)` - `(department_id, status)` -
`(assigned_worker_id, status)` - `(category_id, created_at DESC)` -
`(due_at, status)` - `(latitude, longitude)` for small demos; use
PostGIS/geography for serious proximity queries.

### 9.7 `complaint_status_history`

  -----------------------------------------------------------------------
  Column                  Type                    Rules / purpose
  ----------------------- ----------------------- -----------------------
  `id`                    UUID                    Primary key

  `complaint_id`          UUID                    FK to complaints

  `from_status`           complaint-status enum   Nullable for initial
                                                  creation

  `to_status`             complaint-status enum   Required

  `changed_by`            UUID                    FK to users; nullable
                                                  only for a documented
                                                  system action

  `remarks`               TEXT                    Optional, but useful
                                                  for rejection/reopening

  `created_at`            TIMESTAMPTZ             Required
  -----------------------------------------------------------------------

Index `(complaint_id, created_at ASC)`. The API should return history in
chronological order. Treat this as an audit record; do not allow
ordinary users to edit or delete it.

### 9.8 `complaint_images`

  -----------------------------------------------------------------------
  Column                  Type                    Rules / purpose
  ----------------------- ----------------------- -----------------------
  `id`                    UUID                    Primary key

  `complaint_id`          UUID                    FK to complaints

  `uploaded_by`           UUID                    FK to users

  `storage_key`           TEXT                    Object storage key;
                                                  avoid relying only on a
                                                  temporary signed URL

  `image_type`            evidence-type enum      BEFORE, PROGRESS,
                                                  AFTER, REOPENING

  `mime_type`             VARCHAR(100)            Validated server-side

  `size_bytes`            BIGINT                  Positive and below
                                                  configured maximum

  `created_at`            TIMESTAMPTZ             Required
  -----------------------------------------------------------------------

Keep objects private by default if practical. Generate signed URLs or
controlled public URLs according to the access policy. Strip EXIF
metadata when appropriate, especially GPS metadata embedded in images.

### 9.9 `assignments`

Use a separate assignment table so reassignment history is preserved.

  Column            Type          Rules / purpose
  ----------------- ------------- ------------------
  `id`              UUID          Primary key
  `complaint_id`    UUID          FK to complaints
  `worker_id`       UUID          FK to users
  `assigned_by`     UUID          FK to users
  `assigned_at`     TIMESTAMPTZ   Required
  `unassigned_at`   TIMESTAMPTZ   Nullable
  `reason`          TEXT          Optional

Index `(worker_id, assigned_at DESC)` and
`(complaint_id, assigned_at DESC)`. The current worker can also be
duplicated in `complaints.assigned_worker_id` for convenient filtering;
update both inside one transaction.

### 9.10 `comments`

  Column           Type           Rules / purpose
  ---------------- -------------- --------------------------
  `id`             UUID           Primary key
  `complaint_id`   UUID           FK to complaints
  `author_id`      UUID           FK to users
  `body`           TEXT           Required, length-limited
  `visibility`     VARCHAR/enum   PUBLIC or INTERNAL
  `created_at`     TIMESTAMPTZ    Required
  `updated_at`     TIMESTAMPTZ    Required

Only authorized roles can create internal comments. Public APIs must
never return internal comments.

### 9.11 `notifications`

  Column           Type          Rules / purpose
  ---------------- ------------- ---------------------------
  `id`             UUID          Primary key
  `user_id`        UUID          FK to users
  `complaint_id`   UUID          Nullable FK to complaints
  `type`           VARCHAR(60)   Required
  `message`        TEXT          Required
  `read_at`        TIMESTAMPTZ   Nullable
  `created_at`     TIMESTAMPTZ   Required

Index `(user_id, read_at, created_at DESC)`. In-app notifications are
sufficient for the first release.

### 9.12 `complaint_supports` --- Phase 2

  Column           Type          Rules / purpose
  ---------------- ------------- ------------------
  `complaint_id`   UUID          FK to complaints
  `user_id`        UUID          FK to users
  `created_at`     TIMESTAMPTZ   Required

Composite primary key `(complaint_id, user_id)` ensures one support per
user per complaint.

### 9.13 Optional `resolution_reviews`

A separate review table is useful if the system must retain multiple
citizen verification attempts.

  Column           Type           Rules / purpose
  ---------------- -------------- -----------------------
  `id`             UUID           Primary key
  `complaint_id`   UUID           FK to complaints
  `reviewer_id`    UUID           FK to users
  `decision`       VARCHAR/enum   CONFIRMED or DISPUTED
  `reason`         TEXT           Required for dispute
  `created_at`     TIMESTAMPTZ    Required

If only one verification decision per resolution is needed, an initial
implementation can record the decision in status history and a compact
resolution record. Use a separate table when multiple attempts need to
be queried independently.

### 9.14 Relationship summary

``` text
users 1 ─── many complaints (reporter)
users 1 ─── many complaints (assigned worker, current assignment)
categories 1 ─── many complaints
departments 1 ─── many complaints
complaints 1 ─── many complaint_images
complaints 1 ─── many complaint_status_history
complaints 1 ─── many assignments
complaints 1 ─── many comments
users 1 ─── many comments
users 1 ─── many notifications
complaints many ─── many users through complaint_supports (Phase 2)
```

### 9.15 Ticket-number generation

Use a database sequence or another concurrency-safe generator. Do not
create a ticket number by reading the current number of complaints and
adding one; concurrent requests can produce duplicates.

Example format:

``` text
CIV-2026-000421
```

The UUID remains the internal identifier. The ticket number is for
people and support workflows.

------------------------------------------------------------------------

## 10. Complaint State Machine

### 10.1 Valid transitions

  ---------------------------------------------------------------------------------------
  Current state                   Allowed next state              Actor
  ------------------------------- ------------------------------- -----------------------
  SUBMITTED                       UNDER_REVIEW                    Admin/system policy

  UNDER_REVIEW                    VERIFIED                        Admin

  UNDER_REVIEW                    REJECTED                        Admin, with reason

  VERIFIED                        ASSIGNED                        Admin

  ASSIGNED                        IN_PROGRESS                     Assigned worker

  IN_PROGRESS                     RESOLUTION_SUBMITTED            Assigned worker, with
                                                                  required evidence

  RESOLUTION_SUBMITTED            AWAITING_CITIZEN_VERIFICATION   System/service

  AWAITING_CITIZEN_VERIFICATION   CLOSED                          Reporter confirms, or
                                                                  explicit policy-based
                                                                  administrator action

  AWAITING_CITIZEN_VERIFICATION   REOPENED                        Reporter disputes

  REOPENED                        ASSIGNED                        Admin

  REOPENED                        IN_PROGRESS                     Assigned worker/admin
                                                                  policy

  ASSIGNED                        VERIFIED                        Admin only if
                                                                  reassignment/review
                                                                  policy explicitly
                                                                  requires it
  ---------------------------------------------------------------------------------------

Avoid arbitrary transitions such as `SUBMITTED → CLOSED`.

### 10.2 Transition service

All status changes should go through one service, conceptually:

``` text
transitionComplaint(complaintId, actor, targetStatus, remarks)
```

The service should:

1.  Load the complaint and its current status.
2.  Check the actor's role and relationship to the complaint.
3.  Check whether the transition is allowed.
4.  Check transition-specific requirements.
5.  Update the complaint.
6.  Insert a status-history record.
7.  Create in-app notifications for relevant users.
8.  Commit related database changes in a transaction.
9.  Trigger non-critical email work after commit.

### 10.3 Transition-specific rules

-   `REJECTED` requires a clear reason.
-   `ASSIGNED` requires a department and a valid worker, unless the
    chosen workflow allows department assignment before worker
    assignment.
-   `RESOLUTION_SUBMITTED` requires a work summary and at least one
    valid `AFTER` image.
-   `CLOSED` requires a valid citizen confirmation or an explicitly
    documented fallback policy.
-   `REOPENED` should capture a reason and optionally new evidence.
-   Every transition writes an audit-history row.
-   The API should return `409 Conflict` for a validly shaped request
    that is incompatible with the current state.

### 10.4 Concurrent updates

Two administrators may attempt to update the same report. Use a
transaction and either row locking or optimistic concurrency (such as a
version field) to prevent lost updates. If the current state changed
since the client loaded it, return a conflict and ask the client to
refresh.

------------------------------------------------------------------------

## 11. REST API Specification

Use a versioned base path such as `/api/v1`. Use JSON for ordinary
requests and responses; multipart form data or a signed-upload flow for
image bytes.

### 11.1 Response conventions

Successful resource creation: `201 Created`\
Successful read/update: `200 OK`\
Successful operation with no body: `204 No Content`\
Invalid input: `400 Bad Request`\
Missing/invalid authentication: `401 Unauthorized`\
Authenticated but forbidden: `403 Forbidden`\
Resource not found: `404 Not Found`\
State conflict or duplicate conflict: `409 Conflict`\
Unsupported media type: `415 Unsupported Media Type`\
Rate limit exceeded: `429 Too Many Requests`\
Unexpected server error: `500 Internal Server Error`

Use a consistent error body:

``` json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      { "field": "title", "message": "Title is required." }
    ],
    "requestId": "req_example"
  }
}
```

Do not return stack traces or internal SQL errors to clients.

### 11.2 Authentication endpoints

  --------------------------------------------------------------------------------------
  Method            Path                             Access            Purpose
  ----------------- -------------------------------- ----------------- -----------------
  POST              `/api/v1/auth/register`          Public,           Create a citizen
                                                     rate-limited      account

  POST              `/api/v1/auth/login`             Public,           Authenticate
                                                     rate-limited      

  POST              `/api/v1/auth/logout`            Authenticated     Clear/revoke
                                                                       session

  GET               `/api/v1/auth/me`                Authenticated     Return safe
                                                                       current-user
                                                                       fields

  POST              `/api/v1/auth/forgot-password`   Public,           Start password
                                                     rate-limited;     reset
                                                     optional later    

  POST              `/api/v1/auth/reset-password`    Valid reset token Complete reset
  --------------------------------------------------------------------------------------

Never allow public self-registration to select `ADMIN` or `WORKER`. Seed
or provision privileged accounts through a trusted process.

Example registration request:

``` json
{
  "name": "Asha Sharma",
  "email": "asha@example.com",
  "password": "use-a-strong-password"
}
```

Example safe response:

``` json
{
  "user": {
    "id": "uuid",
    "name": "Asha Sharma",
    "email": "asha@example.com",
    "role": "CITIZEN"
  }
}
```

Do not return `password_hash`.

### 11.3 Category and department endpoints

  ---------------------------------------------------------------------------------------
  Method            Path                              Access            Purpose
  ----------------- --------------------------------- ----------------- -----------------
  GET               `/api/v1/categories`              Public            List active
                                                                        categories

  GET               `/api/v1/departments`             Public or         List public
                                                      authenticated     department
                                                                        metadata

  POST              `/api/v1/admin/categories`        Admin             Create category,
                                                                        if configurable
                                                                        in MVP

  PATCH             `/api/v1/admin/categories/:id`    Admin             Update category
                                                                        routing/SLA

  POST              `/api/v1/admin/departments`       Admin             Create
                                                                        department, if
                                                                        required

  PATCH             `/api/v1/admin/departments/:id`   Admin             Update department
  ---------------------------------------------------------------------------------------

For a small MVP, categories and departments may be created by database
seed scripts rather than a UI.

### 11.4 Complaint endpoints

  -----------------------------------------------------------------------------------------
  Method            Path                                Access            Purpose
  ----------------- ----------------------------------- ----------------- -----------------
  POST              `/api/v1/complaints`                Citizen           Create report

  GET               `/api/v1/complaints/mine`           Citizen           List own reports

  GET               `/api/v1/complaints`                Authenticated,    List reports
                                                        role-scoped       allowed for the
                                                                          caller

  GET               `/api/v1/complaints/:id`            Owner, assigned   Read details
                                                        worker,           
                                                        authorized admin, 
                                                        or public-safe    
                                                        access            

  PATCH             `/api/v1/complaints/:id`            Owner, limited    Edit eligible
                                                        fields only       fields before
                                                                          review

  GET               `/api/v1/complaints/:id/history`    Authorized viewer Get status
                                                                          history

  GET               `/api/v1/complaints/:id/comments`   Authorized viewer Get visible
                                                                          comments

  POST              `/api/v1/complaints/:id/comments`   Authenticated     Add allowed
                                                                          comment

  GET               `/api/v1/public/complaints`         Public            Paginated
                                                                          public-safe list

  GET               `/api/v1/public/complaints/:id`     Public            Public-safe
                                                                          details

  GET               `/api/v1/public/complaints/map`     Public            Map points with
                                                                          filters
  -----------------------------------------------------------------------------------------

List endpoint query parameters should be allowlisted, for example:

``` text
?status=IN_PROGRESS&categoryId=...&priority=HIGH&page=1&limit=20&sort=createdAt&order=desc
```

Do not accept arbitrary SQL column names as sort expressions. Clamp page
size to a sensible maximum.

Example report creation body:

``` json
{
  "title": "Large pothole near the market",
  "description": "The pothole is in the left lane and may be dangerous for two-wheelers.",
  "categoryId": "category-uuid",
  "latitude": 26.9124,
  "longitude": 75.7873,
  "address": "Near the main market",
  "isPublic": true
}
```

Example response:

``` json
{
  "complaint": {
    "id": "complaint-uuid",
    "ticketNumber": "CIV-2026-000421",
    "status": "SUBMITTED",
    "priority": "MEDIUM",
    "submittedAt": "2026-10-11T08:30:00Z"
  }
}
```

### 11.5 Admin endpoints

  -------------------------------------------------------------------------------------------------
  Method            Path                                      Access            Purpose
  ----------------- ----------------------------------------- ----------------- -------------------
  GET               `/api/v1/admin/complaints`                Admin             Administrative
                                                                                queue

  POST              `/api/v1/admin/complaints/:id/verify`     Admin             Verify a report

  POST              `/api/v1/admin/complaints/:id/reject`     Admin             Reject with reason

  POST              `/api/v1/admin/complaints/:id/assign`     Admin             Assign
                                                                                department/worker

  POST              `/api/v1/admin/complaints/:id/reassign`   Admin             Reassign worker

  PATCH             `/api/v1/admin/complaints/:id/priority`   Admin             Change priority

  GET               `/api/v1/admin/analytics/summary`         Admin             Summary metrics

  GET               `/api/v1/admin/analytics/departments`     Admin             Department
                                                                                breakdown

  GET               `/api/v1/admin/sla/overdue`               Admin             Overdue reports
  -------------------------------------------------------------------------------------------------

Assignment request:

``` json
{
  "departmentId": "department-uuid",
  "workerId": "worker-uuid",
  "reason": "Assigned to the road maintenance team."
}
```

The backend must verify that the department exists, the worker is active
and has the WORKER role, and the administrator is allowed to assign this
report.

### 11.6 Worker endpoints

  --------------------------------------------------------------------------------------------------
  Method            Path                                         Access            Purpose
  ----------------- -------------------------------------------- ----------------- -----------------
  GET               `/api/v1/worker/assignments`                 Worker            List caller's
                                                                                   active
                                                                                   assignments

  POST              `/api/v1/worker/complaints/:id/start`        Assigned worker   Start work

  POST              `/api/v1/worker/complaints/:id/progress`     Assigned worker   Add progress
                                                                                   update

  POST              `/api/v1/worker/complaints/:id/resolution`   Assigned worker   Submit summary
                                                                                   and evidence

  GET               `/api/v1/worker/complaints/:id`              Assigned worker   View assigned
                                                                                   report
  --------------------------------------------------------------------------------------------------

The server must verify assignment ownership on every worker action.

### 11.7 Evidence endpoints

Two upload patterns are possible.

**Simpler MVP:** send a multipart request to the backend. The backend
validates and streams the image to object storage.

**More scalable pattern:** backend issues a short-lived signed upload
URL; browser uploads directly to object storage; backend then
validates/records the uploaded object. This requires careful validation
of object ownership, content type, size, and upload completion.

Example metadata registration request:

``` json
{
  "storageKey": "complaints/complaint-uuid/after-image.jpg",
  "imageType": "AFTER"
}
```

Never trust an arbitrary URL supplied by the browser as proof that a
file belongs to the complaint. The server should issue or validate
storage keys.

### 11.8 Resolution review endpoints

  ---------------------------------------------------------------------------------------------------
  Method            Path                                          Access            Purpose
  ----------------- --------------------------------------------- ----------------- -----------------
  POST              `/api/v1/complaints/:id/confirm-resolution`   Reporter          Confirm work

  POST              `/api/v1/complaints/:id/reopen`               Reporter          Dispute claimed
                                                                                    resolution
  ---------------------------------------------------------------------------------------------------

Reopen request:

``` json
{
  "reason": "The pothole is still present.",
  "imageIds": ["image-uuid"]
}
```

The server verifies that the caller is the report's owner, the report is
awaiting verification, and any supplied evidence belongs to that report.

### 11.9 Notification endpoints

  ----------------------------------------------------------------------------------------
  Method            Path                               Access            Purpose
  ----------------- ---------------------------------- ----------------- -----------------
  GET               `/api/v1/notifications`            Authenticated     List caller's
                                                                         notifications

  POST              `/api/v1/notifications/:id/read`   Owner             Mark as read

  POST              `/api/v1/notifications/read-all`   Authenticated     Mark all caller
                                                                         notifications as
                                                                         read
  ----------------------------------------------------------------------------------------

### 11.10 API documentation

Document every endpoint with: - Method and path. - Required role. -
Request schema. - Response schema. - Validation rules. - Error codes. -
Side effects and status transitions. - Pagination behavior. - Example
requests.

Use an OpenAPI specification or an equivalent API reference once the
routes stabilize.

------------------------------------------------------------------------

## 12. Authentication and Authorization

### 12.1 Password handling

-   Hash passwords using Argon2id or bcrypt.
-   Never log passwords.
-   Never return hashes.
-   Use a minimum password length and reasonable password policy.
-   Rate-limit login and registration.
-   Return generic login errors to reduce account enumeration.
-   Add password reset using short-lived, single-use tokens if included
    in scope.

### 12.2 Session/JWT choice

For a browser-based application, a server-side session or short-lived
token in an `HttpOnly`, `Secure`, appropriately configured `SameSite`
cookie can reduce exposure to token theft through JavaScript.
Cookie-based authentication requires CSRF protections for state-changing
requests. If bearer JWTs are used, avoid storing long-lived tokens in
`localStorage`; define expiry, revocation/logout behavior, and
refresh-token rotation if refresh tokens are implemented.

Do not copy an authentication design without understanding the
tradeoffs.

### 12.3 Role-based access control (RBAC)

Example policy:

  -------------------------------------------------------------------------
  Action                      Citizen             Worker              Admin
  ---------------- ------------------ ------------------ ------------------
  Create report                   Yes           Optional           Optional

  View own report                 Yes        If assigned  Yes, within scope

  View public-safe                Yes                Yes                Yes
  report                                                 

  Verify/reject                    No                 No                Yes
  report                                                 

  Assign worker                    No                 No                Yes

  Start assigned                   No      Assigned only   Policy-dependent
  work                                                   

  Submit                           No      Assigned only   Policy-dependent
  completion                                             
  evidence                                               

  Confirm/reopen        Reporter only                 No         Only under
  own resolution                                          explicit override
                                                                     policy

  View internal                    No           Relevant   Authorized scope
  comments                              assignments only 
  -------------------------------------------------------------------------

Authentication middleware answers "who is this user?" Authorization
answers "may this user perform this action on this resource?" Both
checks are required.

------------------------------------------------------------------------

## 13. Complaint Submission, Images, and Geolocation

### 13.1 Report form fields

Required: - Title. - Description. - Category.

Optional or conditionally required: - Image. - Location. - Address. -
Additional accessibility notes.

A report should not be impossible to submit merely because GPS
permission is denied. Let the user place a marker on a map or enter a
nearby landmark.

### 13.2 Geolocation flow

1.  User chooses "Use my location."
2.  Browser asks for permission.
3.  The browser returns latitude/longitude.
4.  The UI displays the selected point and allows correction.
5.  The frontend sends coordinates to the backend.
6.  The backend validates coordinate ranges.
7.  Reverse geocoding may produce a readable address.
8.  The user confirms the location before submission.

Do not request location access before it is needed. Explain why location
is useful. Never assume that browser geolocation is exact.

### 13.3 Map display and privacy

-   Do not expose reporter contact details.
-   Consider showing approximate public map points rather than exact
    coordinates for sensitive issues.
-   Do not publish reports containing personal data or images of
    identifiable people without an appropriate moderation/privacy
    policy.
-   Keep internal worker notes and internal evidence access-controlled.
-   Review the selected map tile and geocoding provider's attribution
    and usage rules.

### 13.4 Image upload rules

-   Allow only required image types, such as JPEG, PNG, or WebP.
-   Verify file signatures/content where possible; do not trust only the
    filename or client MIME type.
-   Enforce maximum file size and image dimensions.
-   Generate storage keys on the server.
-   Use random names; do not use the original filename as a storage
    path.
-   Consider resizing/compressing images and removing EXIF metadata.
-   Keep object storage credentials server-side.
-   Use signed URLs or a controlled access layer for private images.
-   Define cleanup behavior for abandoned uploads.
-   Do not allow arbitrary file uploads.

### 13.5 Upload consistency

If the image uploads successfully but report creation fails, the file
may become orphaned. Options include: - Upload to a temporary prefix and
move/mark it after report creation. - Record upload state and
periodically clean abandoned objects. - Create the report first in a
draft state, then attach the file. - Use a compensating cleanup action
if the database transaction fails.

A relational database transaction cannot atomically commit a remote
object-storage upload. Design for that boundary rather than assuming
both systems share one transaction.

------------------------------------------------------------------------

## 14. Department Routing and Worker Assignment

### 14.1 MVP routing

Map each category to a default department:

``` text
POTHOLE       -> ROADS
GARBAGE       -> SANITATION
STREETLIGHT   -> ELECTRICAL
WATER_LEAK    -> WATER
BLOCKED_DRAIN -> DRAINAGE
```

The mapping should be stored in `categories.default_department_id`, not
scattered across many frontend components.

### 14.2 Assignment workflow

1.  Admin opens the review queue.
2.  Admin checks the report and category.
3.  System suggests a department from the category.
4.  Admin confirms or changes department.
5.  Admin chooses an active worker.
6.  Backend validates the assignment.
7.  In one database transaction, backend updates the complaint's current
    assignment, inserts an assignment history record, writes status
    history, and creates an in-app notification.
8.  A notification/email delivery failure is retried separately and does
    not roll back the assignment.

### 14.3 Future assignment improvements

Later, worker assignment can consider ward, skills, active workload,
availability, and travel distance. Start with manual assignment plus
category-to-department mapping; it is easier to test and explain.

------------------------------------------------------------------------

## 15. Priority, SLA, and Escalation

### 15.1 Priority

Use `LOW`, `MEDIUM`, `HIGH`, and `CRITICAL`. In the MVP, the
administrator can set priority, with a category-based default. A clear
policy is preferable to an unexplained score.

A later rule-based score might combine: - Reported severity. - Road type
or location risk. - Number of independent supporting reports. - Time
waiting. - Safety-sensitive category.

Document the score and thresholds. Do not claim a score objectively
measures danger unless it has been validated.

### 15.2 SLA/target due date

An SLA in this portfolio system is a configured target, not a promise
that a real municipal authority will complete work by that time.

When a report enters the appropriate workflow state: 1. Read the
configured target hours for the category. 2. Calculate `due_at`. 3.
Store the target deadline. 4. Compare the current time with `due_at` and
the current status to determine whether it is overdue. 5. Display
overdue status to authorized administrators.

Example targets for a demo only:

  Category          Example target
  --------------- ----------------
  Garbage                 24 hours
  Water leakage           24 hours
  Streetlight             48 hours
  Pothole                 72 hours

These are configurable demonstration values, not official service
commitments.

### 15.3 Escalation

A later scheduled job can find active reports past their due date and: -
Mark them overdue (or calculate overdue dynamically). - Notify the
assigned worker. - Notify a supervisor after a configured grace
period. - Record the escalation in an audit/event table to prevent
duplicate notifications.

The job must be idempotent. Running it twice should not create duplicate
escalations for the same threshold.

------------------------------------------------------------------------

## 16. Duplicate Reports and Community Support

### 16.1 Phase 2 duplicate suggestions

Potential duplicates can be identified using: - Same or related
category. - Geographic distance within a configurable radius. - Similar
submission time. - Similar text, with optional future image similarity.

A suggestion should not automatically merge reports. The user or
administrator should confirm the relationship because two nearby issues
may be distinct.

For proximity searches at scale, use PostGIS. For a small demo,
approximate distance calculations may be sufficient, but use a proper
geospatial index when the dataset grows.

### 16.2 Supporting an existing report

If a report already exists, a citizen can support it rather than
creating a duplicate. A unique `(complaint_id, user_id)` constraint
prevents repeated support by the same account. Support count may
influence prioritization, but it should not be treated as proof of
severity or as a substitute for safety review.

------------------------------------------------------------------------

## 17. Resolution Evidence and Citizen Verification

### 17.1 Worker resolution submission

The worker must submit: - A resolution summary. - At least one valid
`AFTER` image for categories where photographic evidence is required. -
Optional work completion notes.

The backend validates the worker's assignment and the current status. It
then changes the state to `RESOLUTION_SUBMITTED` and/or
`AWAITING_CITIZEN_VERIFICATION`, according to the chosen transition
model, and records the transition.

Choose one canonical transition sequence in code and document it. A
simple MVP can transition directly from `IN_PROGRESS` to
`AWAITING_CITIZEN_VERIFICATION` when evidence is submitted, while
preserving the event as "resolution submitted" in history. If both
statuses are used, define exactly when each is entered.

### 17.2 Citizen decision

The reporter sees: - Original report and before image. - Work summary. -
After image. - "Issue fixed" action. - "Issue is not fixed" action.

On confirmation: - Verify that the user is the reporter. - Verify the
complaint is awaiting verification. - Transition to `CLOSED`. - Set
`closed_at`. - Record history and notify relevant participants.

On dispute: - Require a reason. - Optionally attach new evidence. -
Transition to `REOPENED`. - Clear or preserve resolution timestamps
according to a documented policy; do not erase the previous resolution
history. - Notify the admin/worker queue.

### 17.3 No response policy

Do not silently auto-close in the MVP. If an auto-close policy is later
added, make the deadline visible, notify the citizen, retain the
evidence/history, and allow reopening within a defined window.

------------------------------------------------------------------------

## 18. Notifications

### 18.1 MVP notification events

-   Report created.
-   Report verified or rejected.
-   Department/worker assigned.
-   Work started.
-   Resolution evidence submitted.
-   Resolution confirmed.
-   Report reopened.
-   Report approaching or exceeding due date.

### 18.2 Notification architecture

For the first release: 1. Create an in-app notification record in the
same transaction as the relevant state change where practical. 2.
Display unread count and notification list in the UI. 3. Add email
delivery later using a background job or retryable task. 4. Track
delivery state if email becomes important. 5. Avoid sending email
directly inside a long-running request when it can cause the user
operation to time out.

A database-backed job/outbox table is a possible future improvement for
reliable asynchronous delivery. Do not add a message broker until there
is a demonstrated need.

------------------------------------------------------------------------

## 19. Public Map and Analytics

### 19.1 Public map

Map markers can represent public reports and show: - Category. -
Status. - Priority, if safe and appropriate. - Approximate location. -
Ticket number. - Submission date. - Public-safe description.

Filters: - Category. - Status. - Priority. - Ward/area. - Date range.

Use clustering when many markers are present. Return only the fields
required by the map.

### 19.2 Analytics metrics

Initial admin metrics: - Total reports. - Counts by status. - Counts by
category. - Counts by department. - Active/overdue reports. - Resolution
rate. - Average time from submission to closure. - Reopened-report rate.

Define every metric precisely. For example:

``` text
Resolution rate =
number of reports closed in the selected period
/
number of reports eligible for the selected metric
```

The denominator and date field must be stated; otherwise different
dashboards may show different results. Distinguish "reports submitted in
this period" from "reports closed in this period."

### 19.3 Analytics cautions

-   Exclude test/demo records from production-like summaries.
-   Avoid presenting small sample sizes as definitive department
    rankings.
-   Do not publicly expose worker-level performance without an
    appropriate policy.
-   Do not invent dashboard numbers for the resume. Seeded demo values
    must be labelled as sample data.

------------------------------------------------------------------------

## 20. Validation and Error Handling

### 20.1 Validate on both sides

Frontend validation improves usability. Backend validation enforces
correctness and security.

Validate: - Required fields. - String lengths. - UUID/path parameter
formats. - Category existence and active status. - Latitude/longitude
ranges. - Allowed enum values. - File MIME/signature and size. - Allowed
query parameters and sort fields. - Ownership and role. - Current
complaint status. - Worker assignment ownership.

### 20.2 Error handling

Use centralized Express error middleware. Return a safe, consistent
response with an error code and request ID. Log internal details
server-side, but do not send stack traces, database connection strings,
or secrets to clients.

Use: - `400` for invalid input. - `401` for missing/invalid
authentication. - `403` for forbidden action. - `404` when a resource is
not available to the caller, according to the chosen anti-enumeration
policy. - `409` for invalid state transitions or concurrency
conflicts. - `413` for request/file too large. - `415` for unsupported
file type. - `429` for rate limiting.

------------------------------------------------------------------------

## 21. Security and Privacy

### 21.1 Minimum security checklist

-   HTTPS in deployment.
-   Strong password hashing.
-   Secure cookie configuration if cookie authentication is used.
-   CSRF protection for cookie-authenticated state-changing requests.
-   Strict CORS allowlist.
-   Helmet/security headers.
-   Rate limiting for login, registration, and report creation.
-   Server-side role and ownership checks.
-   Parameterized SQL/ORM-safe queries.
-   Input validation and output encoding.
-   File size/type/content validation.
-   Secrets in environment variables or a secrets manager.
-   `.env` files excluded from Git.
-   Database least-privilege credentials.
-   No sensitive values in logs.
-   Dependency updates and vulnerability checks.
-   Backups and a documented restore approach for a real deployment.

### 21.2 Abuse and moderation

Consider: - Spam and repeated submissions. - Offensive text or images. -
Personal information in descriptions. - Reports containing faces,
license plates, or private property. - Malicious links in comments. -
Attempts to impersonate officials. - Attempts to upload executable
files.

Add reporting/moderation tools if public content is enabled. Do not
assume every user-submitted report should be visible immediately.

### 21.3 Privacy policy

Explain: - What data is collected. - Why location is requested. -
Whether a report is public. - Who can view uploaded images. - How long
records are retained. - How a user can request account/data handling. -
Which external map, geocoding, storage, or email providers receive data.

This is a prototype and should not collect unnecessary sensitive
information.

------------------------------------------------------------------------

## 22. Transactions and Data Consistency

### 22.1 Report creation transaction

The following should succeed or fail together in PostgreSQL: - Insert
complaint. - Insert initial status-history row. - Insert related
metadata records that are already available. - Insert in-app
notification if that is part of the same transactional design.

Do not include remote image storage or email delivery in a PostgreSQL
transaction; they cannot be rolled back atomically with the database.

### 22.2 Assignment transaction

In one transaction: 1. Update `complaints.department_id` and
`assigned_worker_id`. 2. Insert an `assignments` record. 3. Insert
status history for the allowed transition. 4. Insert in-app
notification.

If any database operation fails, roll back the whole transaction.

### 22.3 Resolution transaction

In one transaction: 1. Validate the current status and assigned worker.
2. Verify that the referenced after-image record belongs to the
complaint and uploader. 3. Update resolution summary and status. 4.
Insert history. 5. Insert notification.

Ensure uploaded object storage metadata has been verified before the
resolution transaction commits.

### 22.4 Idempotency

For retryable operations, consider idempotency keys or unique event
constraints. A repeated client request should not create duplicate
support votes, duplicate assignment records, or duplicate resolution
events.

------------------------------------------------------------------------

## 23. Logging, Monitoring, and Operational Concerns

-   Generate a request ID for each request and include it in logs and
    error responses.
-   Log important events: report creation, status transition,
    assignment, rejection, resolution submission, citizen dispute.
-   Log errors with enough context to debug without exposing private
    content.
-   Track API error rate and latency once deployed.
-   Monitor database connectivity, storage failures, and scheduled-job
    execution.
-   Back up the database and test restore procedures if the deployed
    demo contains important data.
-   Use a health endpoint such as `/health` that returns service status
    without exposing secrets.
-   Do not log authorization headers, session cookies, passwords, or
    signed URLs.

------------------------------------------------------------------------

## 24. Testing Strategy

### 24.1 Unit tests

Test business logic in isolation: - Allowed/forbidden status
transitions. - Ticket-number formatting/generation wrapper. - SLA
due-date calculation. - Priority defaults. - Role/ownership policy
helpers. - Public-field filtering. - Validation schemas.

### 24.2 API integration tests

Test endpoints with a test database: - Citizen can register and log
in. - Citizen can create a valid report. - Invalid category is
rejected. - Report creation creates initial history. - Citizen cannot
read another citizen's private report. - Citizen cannot call admin
endpoints. - Worker cannot update an unassigned report. - Admin can
assign a valid worker. - Worker cannot submit resolution without
required evidence. - Citizen can confirm or dispute their own
resolution. - A non-owner cannot confirm or reopen a report. - Invalid
transitions return `409 Conflict`. - Public endpoints do not expose
personal or internal fields.

### 24.3 End-to-end tests

A representative browser test: 1. Log in as citizen. 2. Create a report.
3. Verify ticket number appears. 4. Log in as admin. 5. Verify and
assign the report. 6. Log in as worker. 7. Start work and submit
evidence. 8. Log in as citizen. 9. Confirm or dispute the resolution.
10. Verify the final state and history.

### 24.4 Testing discipline

-   Use separate test credentials and test database.
-   Never run destructive tests against production.
-   Seed deterministic data.
-   Avoid hard-coded real user data.
-   Add tests for every bug fixed.
-   Include accessibility and responsive layout checks.

------------------------------------------------------------------------

## 25. Local Development Setup (macOS)

Commands below are a suggested starting point. Exact commands can change
depending on whether the repository uses npm workspaces, Prisma, or
plain SQL migrations.

### 25.1 Prerequisites

Install: - Git. - Node.js LTS. - npm (bundled with Node.js). -
PostgreSQL locally, or create a managed development database. - VS Code
or another editor.

Check:

``` bash
node --version
npm --version
git --version
```

### 25.2 Create the repository

``` bash
mkdir civictrack
cd civictrack
git init
mkdir frontend backend docs screenshots
```

Create the frontend with Vite:

``` bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Set up the backend in `backend/` using TypeScript or JavaScript
consistently. Install Express, a database client/ORM, validation,
authentication, security middleware, and test tooling based on the final
choices.

### 25.3 Environment files

Frontend `.env.example`:

``` env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_MAP_TILE_URL=
```

Backend `.env.example`:

``` env
NODE_ENV=development
PORT=4000
DATABASE_URL=
SESSION_SECRET=
APP_ORIGIN=http://localhost:5173
UPLOAD_PROVIDER=
UPLOAD_BUCKET_OR_CLOUD_NAME=
UPLOAD_ACCESS_KEY=
UPLOAD_SECRET_KEY=
GEOCODING_PROVIDER=
EMAIL_PROVIDER_API_KEY=
```

Use only the variables required by the selected providers. Never commit
real credentials. The frontend must not contain database credentials,
session secrets, or private storage keys. Vite exposes variables
prefixed with `VITE_` to the browser bundle, so only public
configuration belongs there.

### 25.4 Database setup

1.  Create a development PostgreSQL database.
2.  Configure `DATABASE_URL`.
3.  Add the initial schema migration.
4.  Run migrations.
5.  Seed categories and departments.
6.  Create a development administrator and worker through a safe seed
    script.
7.  Verify foreign keys and indexes.

Do not seed a production administrator with a hard-coded public
password.

### 25.5 Development commands

Document the actual scripts in the README, for example:

``` bash
# In frontend/
npm run dev

# In backend/
npm run dev
```

If using npm workspaces, provide root-level scripts to run both
processes together. Include a health endpoint and verify the frontend
can reach the API.

------------------------------------------------------------------------

## 26. Implementation Roadmap and Acceptance Criteria

Build a vertical slice at each stage. Each phase should leave the
project in a working state.

### Phase 0 --- Product and repository foundation

Deliverables: - Project brief. - Git repository. - README skeleton. -
Chosen stack and architecture note. - Wireframes for citizen, admin, and
worker screens. - Initial ER diagram and state machine.

Acceptance criteria: - Scope and roles are documented. - MVP and future
features are separated. - Repository has a clear structure and
`.gitignore`. - No secrets are committed.

### Phase 1 --- Backend skeleton and database

Deliverables: - Express app. - Central error middleware. - Request ID
and health endpoint. - PostgreSQL connection. - Migration system. - Seed
data for categories/departments.

Acceptance criteria: - API starts from documented commands. - Database
migration works on a fresh database. - Invalid requests return a
consistent error shape. - Health endpoint does not leak sensitive data.

### Phase 2 --- Authentication and RBAC

Deliverables: - Registration/login/logout/current-user endpoints. -
Password hashing. - Protected routes. - Role and ownership middleware. -
Citizen/admin/worker seed accounts for development.

Acceptance criteria: - Registration creates a citizen by default. - A
public request cannot assign itself ADMIN or WORKER. - Password hashes
are never returned. - Unauthorized and forbidden requests are handled
correctly. - Tests cover role boundaries.

### Phase 3 --- Citizen report creation

Deliverables: - Report form. - Category selection. - Title/description
validation. - Ticket number. - Complaint creation service. - Initial
status history. - "My reports" list and detail page.

Acceptance criteria: - A valid report persists in PostgreSQL. - Every
report has a unique ticket number. - Invalid fields are rejected. -
Initial history is created atomically with the report. - A citizen can
see only their private reports unless public access is allowed.

### Phase 4 --- Images and location

Deliverables: - Image upload integration. - Before-image metadata. -
Browser location/map selection. - Coordinate validation. - Public-safe
image display.

Acceptance criteria: - Unsupported and oversized files are rejected. -
Storage keys are generated/validated by the server. - Database stores
metadata, not large image bytes. - Report creation remains
understandable when location permission is denied. - Public endpoints do
not expose private image URLs.

### Phase 5 --- Admin review and assignment

Deliverables: - Admin complaint queue. - Review/verify/reject actions. -
Department routing. - Worker assignment/reassignment. - Assignment
history and audit events.

Acceptance criteria: - Only an authorized admin can review or assign. -
Rejection requires a reason. - Only valid worker accounts can be
assigned. - Complaint update, assignment record, history, and in-app
notification are transactionally consistent.

### Phase 6 --- Worker workflow and evidence

Deliverables: - Worker dashboard. - Assigned-report details. -
Start-work action. - Progress notes. - Resolution summary and
after-image.

Acceptance criteria: - Worker sees their assignments. - Worker cannot
update another worker's report. - Resolution submission requires
evidence according to policy. - Invalid transitions return a conflict
response. - History records every allowed transition.

### Phase 7 --- Citizen verification and notifications

Deliverables: - In-app notification list. - Confirm-resolution action. -
Reopen action with reason. - Complaint timeline.

Acceptance criteria: - Only the reporter can confirm/reopen in the
standard workflow. - Confirmation closes the complaint. - Dispute
reopens it without deleting earlier resolution history. - Notifications
appear for key events. - Notification failure does not undo a committed
report or assignment.

### Phase 8 --- Public map and analytics

Deliverables: - Public map. - Category/status filters. - Paginated
public report list. - Admin summary cards and charts.

Acceptance criteria: - Map API returns only public-safe fields. -
Pagination has a maximum page size. - Metrics use documented
definitions. - Demo/seed data is labelled as sample data. - Large marker
sets are handled with clustering or suitable limits.

### Phase 9 --- SLA, testing, and hardening

Deliverables: - Due-date calculation. - Overdue view. - Unit and API
tests. - E2E happy-path test. - Rate limiting, secure headers, and
production CORS configuration. - Upload and authorization tests.

Acceptance criteria: - SLA behavior is covered by tests. -
Role/ownership failures are tested. - Main workflow passes from citizen
report through closure. - Secrets are excluded from Git. - Error
messages do not reveal stack traces.

### Phase 10 --- Deployment and portfolio polish

Deliverables: - Deployed frontend and API. - Managed PostgreSQL. -
Storage configuration. - CI checks. - Screenshots and a demo
walkthrough. - Complete README and API documentation.

Acceptance criteria: - A new developer can follow the README to run the
project. - Deployment variables are documented without revealing
values. - Public demo clearly identifies prototype/sample data. - Main
workflow can be demonstrated reliably. - Resume claims match implemented
features and measured results.

------------------------------------------------------------------------

## 27. Frontend Screen Specification

### Public pages

-   Landing page explaining the problem and product.
-   Public issue map/list.
-   Public-safe complaint detail.
-   Login and registration.

### Citizen pages

-   Citizen dashboard.
-   New report form.
-   My reports.
-   Complaint detail/timeline.
-   Notifications.
-   Resolution review.

### Admin pages

-   Overview dashboard.
-   Review queue.
-   Complaint detail/review.
-   Assignment/reassignment form.
-   Worker list.
-   Overdue/SLA view.
-   Analytics.

### Worker pages

-   My assignments.
-   Assignment detail/map.
-   Progress update.
-   Resolution evidence submission.

### Shared UI components

-   Header/navigation.
-   Role-aware navigation.
-   Status badge.
-   Priority badge.
-   Complaint card.
-   Timeline.
-   Image uploader.
-   Map picker.
-   Filter bar.
-   Pagination.
-   Confirmation dialog.
-   Loading, empty, and error states.

Do not rely on color alone to communicate status; include text and
accessible labels.

------------------------------------------------------------------------

## 28. Backend Module Responsibilities

### Auth module

Registration, login, logout, current user, password reset if
implemented.

### Users module

User profile, activation state, role provisioning, worker listing.

### Categories/departments module

Reference data and category-to-department routing configuration.

### Complaints module

Creation, retrieval, filtering, public-safe projection, permitted edits.

### Workflow module

Valid state transitions and transition-specific requirements.

### Assignment module

Worker validation, assignment/reassignment history, workload queries.

### Evidence module

Upload validation, object-storage integration, evidence authorization.

### Comments module

Public/internal visibility and permission checks.

### Notifications module

In-app notifications and optional email delivery.

### SLA module

Due-date computation, overdue queries, future escalation jobs.

### Analytics module

Aggregate queries with documented definitions and access control.

------------------------------------------------------------------------

## 29. Performance and Scalability Considerations

For the MVP: - Paginate lists. - Select only needed columns. - Add
indexes to match real query patterns. - Avoid loading all reports into
the browser. - Use thumbnails for map/list previews. - Cache only data
that is safe and appropriate to cache. - Keep map endpoint responses
compact. - Avoid N+1 database queries. - Use connection pooling
appropriate to the deployment environment.

Future improvements, only when justified: - PostGIS spatial indexes. -
Background jobs for emails, image processing, and escalation. -
CDN-backed image delivery. - Read replicas or caching for read-heavy
dashboards. - Separate services for independently scaling subsystems. -
Search engine integration if PostgreSQL search no longer meets
requirements.

Do not claim scalability from architecture diagrams alone. Measure
performance using representative data and record test conditions.

------------------------------------------------------------------------

## 30. Deployment and CI/CD

### 30.1 Deployment topology

``` text
Browser
  |
  v
Frontend hosting (static React build)
  |
  | HTTPS
  v
Backend hosting (Node/Express)
  |             \
  v              v
Managed         Object storage
PostgreSQL      for images
  |
  v
Scheduled job runner (optional for SLA/email)
```

### 30.2 Production configuration

-   Configure exact frontend origin in CORS.
-   Enable HTTPS.
-   Set secure cookie flags if cookies are used.
-   Use managed secrets/environment variables.
-   Apply database migrations in a controlled release step.
-   Create least-privilege database credentials.
-   Configure storage access and upload size limits.
-   Configure logs and health checks.
-   Set up backups and document recovery if needed.
-   Review hosting provider limits and costs.

### 30.3 CI pipeline

A simple GitHub Actions pipeline can: 1. Install dependencies. 2. Run
formatting/lint checks. 3. Run frontend tests. 4. Run backend unit and
integration tests. 5. Build frontend and backend. 6. Optionally deploy
after checks pass.

Never print secrets in CI logs.

------------------------------------------------------------------------

## 31. Documentation Deliverables

The repository should include:

### `README.md`

-   Project summary.
-   Problem statement.
-   Features.
-   Screenshots.
-   Tech stack.
-   Architecture diagram.
-   Local setup.
-   Environment variables.
-   Database migration/seed instructions.
-   Test commands.
-   Deployment link.
-   Demo accounts only if they are safe and intended for public use.
-   Limitations and future work.

### `docs/architecture.md`

-   Architecture overview.
-   Module boundaries.
-   Data flow.
-   Design decisions and tradeoffs.

### `docs/database.md`

-   ER diagram.
-   Table descriptions.
-   Keys, indexes, and constraints.
-   Migration strategy.

### `docs/api.md`

-   Endpoint list.
-   Schemas.
-   Auth/role requirements.
-   Errors and examples.

### `docs/workflows.md`

-   Complaint lifecycle.
-   Assignment workflow.
-   Resolution/reopening workflow.
-   SLA policy.

### `docs/threat-model.md`

-   Assets.
-   Trust boundaries.
-   Likely abuse cases.
-   Mitigations.

------------------------------------------------------------------------

## 32. Risks and Design Tradeoffs

  -----------------------------------------------------------------------
  Risk/tradeoff                       Mitigation
  ----------------------------------- -----------------------------------
  Citizens submit false or abusive    Rate limits, moderation, report
  reports                             history, admin review

  GPS is inaccurate                   Let user adjust the pin and enter a
                                      landmark

  Duplicate reports inflate counts    Suggest duplicates and allow
                                      support votes in Phase 2

  Worker closes issue without fixing  Require evidence and citizen
  it                                  verification

  User never responds to verification Do not auto-close silently; define
                                      a visible policy later

  Image storage succeeds but DB write Temporary upload keys, cleanup, and
  fails                               compensating actions

  Notification provider fails         Persist in-app notification; retry
                                      email separately

  Admin changes status incorrectly    State machine, audit trail,
                                      permission checks

  Public map exposes sensitive        Approximate coordinates or restrict
  location                            visibility

  Demo metrics are mistaken for real  Label seeded/sample data clearly
  data                                

  Real municipality is not integrated Describe it as a prototype and
                                      avoid claims of official adoption

  Scope grows too large               Deliver the end-to-end MVP before
                                      advanced features
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 33. Future Enhancements

Only pursue these after the core workflow is stable.

### Phase 2

-   Duplicate-report suggestions.
-   Citizen support/upvotes.
-   Email notifications.
-   Configurable SLA and escalation.
-   Ward boundaries and PostGIS proximity search.
-   Better admin filters and CSV export.
-   Moderation queue.
-   More complete audit/event reporting.

### Phase 3

-   AI-assisted category suggestions.
-   Image-based issue classification.
-   Similarity-assisted duplicate detection.
-   Suggested priority with a human reviewer.
-   Multilingual interface.
-   Progressive Web App/offline draft support.
-   Accessibility improvements based on testing.

### Long-term

-   Official municipal integration, only with permission and documented
    APIs.
-   Multiple municipalities with tenant-scoped data and permissions.
-   Contractor workflows.
-   More advanced operational analytics.
-   Public transparency reports with privacy safeguards.

AI suggestions must remain advisory. A model should not automatically
reject a citizen report or make high-impact safety decisions without
appropriate validation and human review.

------------------------------------------------------------------------

## 34. Resume and Interview Preparation

### 34.1 Resume bullet template

Use only features that are actually implemented and verified.

> **CivicTrack --- Civic Issue Reporting and Resolution Platform**\
> Built a full-stack civic issue reporting platform using React,
> Node.js/Express, and PostgreSQL, enabling citizens to submit
> geo-tagged infrastructure reports with photographic evidence and track
> progress through role-based workflows. Implemented complaint lifecycle
> validation, administrator/worker assignment, audit history, resolution
> evidence, and citizen verification.

Add a second bullet only for implemented and testable features, for
example: - Designed relational tables and REST APIs for complaint,
assignment, evidence, and status-history workflows. - Added map-based
issue discovery and aggregate analytics. - Implemented automated tests
for authorization boundaries and invalid state transitions.

Do not claim X users, Y% improvement, or production adoption unless
measured and substantiated.

### 34.2 Questions you should be able to answer

1.  Why did you choose PostgreSQL rather than a document database?
2.  Why is this a modular monolith rather than microservices?
3.  How do you prevent a citizen from calling an admin API?
4.  How do you ensure that only the assigned worker can update a report?
5.  Why store current status and status history separately?
6.  How do you prevent duplicate ticket numbers under concurrent
    requests?
7.  What happens if the image upload succeeds but report creation fails?
8.  How do you prevent an invalid transition such as SUBMITTED → CLOSED?
9.  How do you make assignment and audit-history writes consistent?
10. How do you define resolution rate and average resolution time?
11. What information is safe to expose on the public map?
12. How would you handle duplicate reports?
13. What would you change if the system supported many municipalities?
14. How would you test role-based access control?
15. What are the limitations of browser GPS and reverse geocoding?
16. How would you design reliable notification retries?
17. What is an SLA, and how is it represented in the database?
18. How would you measure the system's performance?
19. What are the biggest security risks in image uploads?
20. Which feature would you implement next, and why?

### 34.3 Project demonstration script

1.  Show the public map and filters.
2.  Log in as a citizen and create a report with location and image.
3.  Show the ticket number and initial timeline.
4.  Log in as admin and verify/assign it.
5.  Log in as worker and start work.
6.  Submit resolution evidence.
7.  Return to the citizen account and dispute the resolution.
8.  Show the reopened state and retained history.
9.  Submit valid evidence again and confirm resolution.
10. Show admin analytics and tests that cover key permissions.

This demonstration tells a coherent end-to-end story.

------------------------------------------------------------------------

## 35. Definition of Done

The MVP is ready for a portfolio demonstration when:

-   [ ] Citizen registration/login works.
-   [ ] Role and resource authorization are enforced by the backend.
-   [ ] A citizen can create a report with category, description, and
    optional image/location.
-   [ ] Ticket numbers are unique.
-   [ ] The report and initial history are stored consistently.
-   [ ] An administrator can verify/reject and assign reports.
-   [ ] A worker can access only permitted assignments.
-   [ ] The worker can submit resolution evidence.
-   [ ] A citizen can confirm or reopen a claimed resolution.
-   [ ] Status history is visible and cannot be edited by ordinary
    users.
-   [ ] Public endpoints expose only approved fields.
-   [ ] Basic map, filters, and analytics work.
-   [ ] Important authorization and state-transition tests pass.
-   [ ] File upload limits and validation are enforced.
-   [ ] Environment secrets are not committed.
-   [ ] README contains reproducible setup and test instructions.
-   [ ] The deployed demo is labelled accurately and does not imply
    official municipal integration.
-   [ ] Resume claims reflect real implementation and measured results.

------------------------------------------------------------------------

## 36. Recommended Build Order

Follow this order rather than attempting all features at once:

1.  Finalize scope, screens, data model, and state machine.
2.  Create repository and frontend/backend skeletons.
3.  Configure PostgreSQL and migrations.
4.  Implement authentication and RBAC.
5.  Implement complaint creation and listing.
6.  Add ticket number and status history.
7.  Add image storage and location selection.
8.  Implement admin review and worker assignment.
9.  Implement worker progress and resolution evidence.
10. Implement citizen confirmation/reopening.
11. Add in-app notifications.
12. Add public map and filtering.
13. Add analytics and SLA visibility.
14. Add tests, security hardening, and accessibility checks.
15. Deploy and document the application.
16. Only then consider duplicate detection, escalation jobs, email, or
    AI.

**Final product principle:** CivicTrack should prove that a report can
move through a secure, traceable, evidence-based workflow---not merely
that a form can save a row in a database.
