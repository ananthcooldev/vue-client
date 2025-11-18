# Vue .NET CRUD Client

Vue.js frontend application for the .NET Core CRUD API.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- VS Code (recommended)

## Getting Started

### 1. Open the Project in VS Code

1. Open VS Code
2. Go to `File` → `Open Folder`
3. Navigate to `C:\Learn\VueNetCrud\vue-client`
4. Click "Select Folder"

Alternatively, you can:
- Right-click the `vue-client` folder and select "Open with Code"
- Or use the command line: `code C:\Learn\VueNetCrud\vue-client`

### 2. Install Dependencies

Open the integrated terminal in VS Code (`Ctrl + ~` or `View` → `Terminal`) and run:

```bash
npm install
```

### 3. Start the Development Server

In the VS Code terminal, run:

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Start the .NET Core API

**Important:** The Vue app requires the .NET Core API to be running.

1. Open a new terminal in VS Code (or another terminal window)
2. Navigate to the API project:
   ```bash
   cd C:\Learn\VueNetCrud\VueNetCrud.Server
   ```
3. Run the API:
   ```bash
   dotnet run
   ```

The API will start on `http://localhost:5280`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
vue-client/
├── src/
│   ├── services/      # API service layer
│   ├── views/         # Vue components/pages
│   ├── router/        # Vue Router configuration
│   ├── types/         # TypeScript type definitions
│   ├── App.vue        # Main app component
│   └── main.ts        # Application entry point
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## API Endpoints

The application connects to the following .NET Core API endpoints:

- **Auth**: `POST /api/Auth/login`
- **Items**: `GET, POST, PUT, DELETE /api/Items` (requires authentication)
- **Products**: `GET, POST, PUT, DELETE /api/Product`

## Default Login Credentials

- Username: `admin`
- Password: `123`

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual port.

### CORS Errors
Make sure the .NET Core API is running and CORS is properly configured to allow `http://localhost:5173`.

### API Connection Issues
- Verify the API is running on `http://localhost:5280`
- Check the API console for any errors
- Ensure the API CORS configuration allows the Vue app origin

## VS Code Extensions (Recommended)

- **Volar** - Vue 3 language support
- **TypeScript Vue Plugin (Volar)** - Enhanced Vue + TypeScript support
- **ESLint** - Code linting
- **Prettier** - Code formatting

