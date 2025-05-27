# TaskFlow

TaskFlow is a simple yet powerful task manager app designed to help you organize your tasks, boost productivity, and streamline your workflow. Built with a React frontend, Flask backend, and styled using vanilla CSS, TaskFlow offers a fast and responsive experience for managing your daily tasks.

## Features

- **Add, Edit, and Delete Tasks:** Manage your to-dos easily.
- **Mark Tasks as Complete:** Track your progress with a single click.
- **Due Dates:** Set deadlines to stay on track.
- **Search & Filter:** Quickly find and sort tasks.
- **Responsive Design:** Works seamlessly on desktop and mobile.
- **Simple & Clean UI:** Minimalist design for distraction-free productivity.

## Tech Stack

- **Frontend:** [React](https://react.dev/)
- **Backend:** [Flask](https://flask.palletsprojects.com/)
- **Styling:** Vanilla CSS

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Python 3.x (for backend)
- pip (Python package manager)

### Installation

#### Backend (Flask)

1. Clone the repository and navigate to the backend folder:
    ```bash
    git clone https://github.com/<your-username>/task-manager-app.git
    cd task-manager-app/backend
    ```
2. (Optional) Create and activate a virtual environment:
    ```bash
    py -m venv venv
    #On Mac: source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3. Install the Flask dependencies:
    ```bash
    pip install Flask flask-cors
    ```
4. Start the Flask Backend server:
    ```bash
    py app.py
    ```
   The backend will run on `http://localhost:5000`.

#### Frontend (React)

1. Open a new terminal and navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Install axios for HTTP requests from web browsers:
    ```bash
    npm install axios
    ```
4. Install lucide-react to use Lucide icons in React application :
    ```bash
    npm install lucide-react
    ```
5. Start the React development server:
    ```bash
    npm start
    ```
   The frontend will run on `http://localhost:3000`.

> **Note:** Make sure the backend is running before you start the frontend.

## Folder Structure

```
task-manager-app/
├── backend/        # Flask backend
│   ├── app.py
│   └── ...
└── frontend/       # React frontend
    ├── src/
    ├── public/
    ├── package.json
    └── package.lock.json
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for new features, bug fixes, or improvements.

**TaskFlow** — Take control of your tasks.
