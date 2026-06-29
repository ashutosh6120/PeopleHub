## PeopleHub - Microfrontend HR Portal

PeopleHub is a role-based HR management platform built using a microfrontend architecture.  
It includes employee directory management, leave application workflows, and admin approval flows.

### Architecture

- **Frontend (Microfrontends via single-spa)**
  - `root-config` (shell): login, navbar, route orchestration, auth state distribution
  - `peoplehub-employee-app`: employee directory, profile, add/edit/delete (admin)
  - `peoplehub-leave-app`: leave dashboard, apply leave, leave approval/status workflows

- **Backend**
  - Node.js + Express REST APIs
  - MongoDB + Mongoose models
  - JWT authentication + role-based authorization

- **Database Collections**
  - `users` (auth identity, role)
  - `employees` (employee master data)
  - `leaves` (leave applications and status workflow)

---

## API Flow (High Level)

1. User logs in from `root-config` using backend auth API.
2. JWT token and user profile are stored in localStorage and exposed to MFEs.
3. Each microfrontend service injects `Authorization: Bearer <token>` in API requests.
4. Backend verifies JWT and applies role checks:
   - `admin`: employee management + leave approvals
   - `employee`: self-service leave requests and personal visibility
5. Leave apply flow resolves employee identity from authenticated user context.

---

## Role Matrix

| Feature | Admin | Employee |
|---|---|---|
| Login | Yes | Yes |
| View employee directory | Yes | Yes |
| Add/Edit/Delete employee | Yes | No |
| View employee profile | Yes | Yes |
| Apply leave | Yes (if needed) | Yes |
| Approve/Reject leave | Yes | No |
| View own leave history | Yes | Yes |

---

## Key Logic Implemented

- Migrated frontend from mock data to real backend APIs.
- Implemented robust token-based auth propagation across microfrontends.
- Added server-side pagination/search integration for employee listing.
- Added loading/error handling for async component flows.
- Fixed identity resolution for leave submission so employee requests map correctly.
- Improved backend leave creation logic for authenticated employee users.

---

## Tech Stack

- Angular 20 (standalone components)
- single-spa
- AG Grid
- Node.js, Express
- MongoDB, Mongoose
- JWT, bcrypt
- Postman (API validation)

---

## Demo Notes

- Supports two primary roles: **Admin** and **Employee**
- Admin can manage employees and leave approvals
- Employee can view directory/profile and submit leave requests
- All major flows are API-driven (no frontend mock data)

---

## Local Run (Example)

### Backend
```bash
cd PeopleHub-main/backend
npm install
npm run dev

[watch demo] (https://github.com/ashutosh6120/PeopleHub/releases/download/v1.0.0/peopleHub-Demo.mov)
