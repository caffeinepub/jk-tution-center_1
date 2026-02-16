# JK Tuition Center - Frontend

A modern web application for managing tuition center operations, built with React, TypeScript, and Tailwind CSS, deployed on the Internet Computer.

## Features

- **Student Management**: Profile creation, editing, and attendance tracking
- **Course Management**: Create and manage courses with schedules
- **Announcements**: Broadcast important updates to students
- **Role-Based Access**: Admin and Student roles with appropriate permissions
- **Internet Identity**: Secure authentication using Internet Identity
- **Attendance System**: Calendar-based attendance tracking
- **Site Customization**: Upload custom logo and manage contact details

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: TanStack Router
- **State Management**: React Query (TanStack Query)
- **Authentication**: Internet Identity
- **Backend**: Motoko (Internet Computer)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- dfx CLI (Internet Computer SDK)

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up the backend canister and generate bindings:
   ```bash
   pnpm run setup
   ```

4. Start the development server:
   ```bash
   pnpm start
   ```

The application will be available at `http://localhost:3000`.

## Admin Bootstrap

The first user to authenticate with Internet Identity is automatically assigned the Admin role. This happens in `frontend/src/hooks/useActor.ts`.

**Important**: Ensure you are the first to log in when deploying to production to claim admin access.

## Authentication Flow

1. **Guest Access**: Unauthenticated users can view the landing page
2. **Sign In**: Click "Sign In" to authenticate with Internet Identity
3. **Profile Setup**: First-time users are prompted to create their student profile
4. **Role-Based Access**:
   - **Admin**: Access to admin dashboard with full management capabilities
   - **Student**: Access to student dashboard with personal data and attendance

## Production Deployment (IC Mainnet)

For detailed production deployment instructions, see [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md).

### Quick Deployment Checklist

- [ ] Build frontend: `pnpm run build`
- [ ] Deploy to IC: `dfx deploy --network ic`
- [ ] Verify landing page loads at production URL
- [ ] Test Internet Identity sign-in
- [ ] Confirm role-based navigation (Admin/Student)
- [ ] Check core data queries (courses, announcements, contact, logo)
- [ ] Review Admin Diagnostics for system health

## Project Structure

