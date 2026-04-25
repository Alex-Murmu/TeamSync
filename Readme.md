
# TeamSync

## Project Purpose
TeamSync is a collaborative team management and communication platform designed to streamline project workflows and enhance team productivity through real-time collaboration tools.

## Use Cases
- Team project management and task tracking
- Real-time communication between team members
- File sharing and document collaboration
- Progress monitoring and reporting

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Hosting**: AWS / Vercel

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB account (local or cloud)

### Clone Repository
```bash
git clone https://github.com/yourusername/TeamSync.git
cd TeamSync
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with DB_URL, JWT_SECRET, etc.
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Server Access
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## Contributing
Pull requests are welcome. For major changes, open an issue first.

## License
MIT
