# MedConnect Web & API Monorepo

MedConnect is a modern healthcare platform connecting patients, providers, and admins through a secure web application and robust API backend.

## Features
- **User Authentication**: Secure login and registration (JWT-based)
- **Panels**: Dedicated interfaces for Patient, Provider, and Admin roles
- **Provider Search**: Find healthcare professionals and facilities
- **Appointment Management**: Book, reschedule, and manage appointments
- **Medical Records & Tools**: Access records, use AI-powered symptom checker, and more

---

## Monorepo Structure
```
oldgit/
  frontend/   # Next.js web app (all panels)
    app/
    src/
    public/
    ...
  backend/    # Ruby on Rails API (PostgreSQL)
    ...
```

---

## Getting Started
### Prerequisites
- Node.js (v18+)
- npm (or yarn)
- Ruby (3.0+) & Rails (7+)
- PostgreSQL

### 1. Setup & Run the Frontend (Next.js)
```sh
cd frontend
npm install
npm run dev
```
- App runs at: http://localhost:3000

### 2. Setup & Run the Backend (Rails API)
```sh
cd backend
bundle install
rails db:create db:migrate
rails server -p 5000
```
- API runs at: http://localhost:5000

---

## Panels & Pages
- `/patient` – Patient dashboard & features
- `/provider` – Provider dashboard
- `/admin` – Admin management
- `/auth/login` & `/auth/register` – Authentication
- **Search** features available throughout

---

## API Integration
- All authentication and data requests are handled via the Rails API (port 5000)
- JWT tokens are used for secure communication between frontend and backend

---

## Contributing & Documentation
- Code is organized for clarity and scalability
- For further details, see code comments and in-app documentation

---

© MedConnect – Modern Healthcare Solutions
├── assets/                # Static assets
├── src/                   # Source code
│   ├── api/               # API communication
│   ├── components/        # Reusable components
│   ├── features/          # Feature modules
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # Screen components
│   ├── services/          # Business logic services
│   ├── state/             # State management
│   ├── theme/             # Theming and styling
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── translations/      # Internationalization
│   ├── App.tsx            # Root component
│   └── index.tsx          # Entry point
└── ...                    # Configuration files
```

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Firebase**: Authentication, database, and storage
- **Google Gemini**: AI-powered health tools

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Healthcare professionals who provided domain expertise
- Open-source libraries and tools used in this project
- Contributors and testers who helped improve the application 