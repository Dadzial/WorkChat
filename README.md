# WorkChat

A lightweight and efficient chat application designed for work organization and team collaboration, built with a modern tech stack.

## 🚀 Features

- Real-time messaging
- User authentication
- Modern, responsive UI built with Angular
- RESTful API backend with Node.js and Express
- MongoDB for data storage
- Docker containerization for easy deployment

## 🛠️ Tech Stack

- **Frontend**: Angular 19
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Containerization**: Docker
- **Styling**: css, Angular Material

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v18+)
- npm (v9+)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/WorkChat.git
   cd WorkChat
   ```

2. **Set up environment variables**
   Create a `.env` file in the `backend/api` directory with the following:
   ```
   PORT=3100
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend/api
   npm install
   ```

4. **Run the application**
   - For development:
     ```bash
     # Start frontend
     cd frontend
     ng serve
     
     # In a new terminal, start backend
     cd backend/api
     npm run dev
     ```

### Docker Deployment

1. **Build and run with Docker**
   ```bash
   # Build the Docker image
   docker build -t workchat .
   
   # Run the container
   docker run -p 3100:3100 workchat
   ```

2. **Access the application**
   Open your browser and navigate to: `http://localhost:3100`

## 📂 Project Structure

```
WorkChat/
├── backend/               # Backend source code
│   └── api/              # API server
│       ├── lib/          # Core application code
│       ├── models/       # Database models
│       └── routes/       # API routes
├── frontend/             # Frontend source code
│   ├── src/              # Angular application
│   │   ├── app/         # Application components
│   │   └── assets/      # Static assets
│   └── public/          # Public files
└── Dockerfile           # Docker configuration
```


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Angular](https://angular.io/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
