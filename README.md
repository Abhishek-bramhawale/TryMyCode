# TryMyCode - Collaborative Code Editor and Interpreter

A modern, realtime collaborative coding platform built with Next.js, TypeScript, and Socket.IO. Create coding rooms, collaborate with others in realtime, and execute code in multiple programming languages.

## Features

### **suppoerted languages**
- **JavaScript** - Full ES6+ support
- **Python** - Python with standard libraries
- **Java** - Java with standard libraries
- **C++** - C++ with standard libraries
- **C** - C with standard libraries
- **TypeScript** - TypeScript with type checking

### **UI**
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Dark/Light Theme**: Toggle between themes
- **Toast Notifications**: Real-time feedback for user actions

### **Code Execution**
- **Live Compilation**: Run code instantly with Judge0 API integration
- **Input/Output Support**: Provide custom input and see program output

## Future improvements -
- **Live voice calling**: voice transfer between peers


## Tech Stack

- **Frontend**: Next.js, TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO
- **Code Editor**: Monaco Editor
- **Code Execution**: Judge0 API
- **Notifications**: React Toasts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trymycode.git
   cd trymycode/judge0-basic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Start the WebSocket server** (in a separate terminal)
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Room

1. **Enter your name** on the home page
2. **Click "Create New Room"** - it may take some time
3. **Wait for room creation** - the system will set up your coding environment
4. **Start coding** - your room is ready for collaboration!

### Joining a Room

1. **Enter your name** and **room ID**
2. **Click "Join Existing Room"**
3. **Start collaborating** with other users

### Real-time Features

- **Code Changes**: Type in the editor and see changes sync instantly
- **User Presence**: See who's online in the sidebar
- **Code Execution**: Run code and see output in real-time



## API Endpoints

### `/api/rooms` - Room management API for creating and managing rooms.

- **POST** - Create a new room
  - Creates a new coding room 
  - Body: `{ userId, userName, userColor, roomIdOverride? }`
  - Returns: `{ room }`

- **GET** - Get room details
  - Retrieves existing room information
  - Query: `?id=ROOM_ID`
  - Returns: `{ room }`

- **PUT** - Update room properties
  - Updates room data (code, language, input, output)
  - Body: `{ roomId, ...updates }`
  - Returns: `{ room }`

- **PATCH** - Manage room users
  - Add or remove users from a room
  - Body: `{ roomId, action: 'add-user' | 'remove-user', user }`
  - Returns: `{ room }`

### `/api/execute`

Code execution API with Judge0 integration.

- **POST** - Execute code
  - Runs code in any supported language
  - Uses async polling for reliable execution
  - Supports custom input (stdin)
  - Falls back to mock execution if API keys aren't configured
  - Body: `{ sourceCode, language, stdin? }`
  - Returns: `{ output, error }` - Detailed output with stdout and stderr

## Links

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Judge0 API](https://judge0.com/) - Code execution
- [Socket.IO](https://socket.io/) - Real-time communication
