# Task Manager Happy

## Prerequisites
Before starting, ensure you have: node.js, git

## Step-by-Step Setup
### Step 1: clone this repo
### Step 2: Install Dependencies: npm install
### Step 3: create .env.local copy from `..env.local.example` to use credential from backendless.com
### Step 4: Run the Development Server: npm run dev
### Step 5: Test the Application
#### Sign Up & Login
#### Create a Task
#### Update a Task
#### Change Task Status
#### Delete a Task
### Step 6: Run Unit Tests: npm run test
## Understanding the Application Flow
1. Presentation Layer (UI)
   1. Dashboard
   2. Auth Pages (Login & Registration)
   3. Components Folder
2. AuthContext State (Global State) 
3. Application Layer (Logic)
   1. Use Cases (Business Logic)
      1. AuthUseCase
      2. TaskUseCase
   2. Domain Layer (Business Rules & Entities)
      1. User Entity 
      2. Task Entity
   3. Repository Interfaces (Abstraction Layer)
      1. IAuthRepository
      2. ITaskRepository
   4. Data Layer (Implementation)
      1. Repository Implementations
         1. AuthRepository -> backendless user
         2. TaskRepository -> backendless table Tasks
### Signup Flow
```
User Input (Email, Password, Name)
    ↓
Presentation Component
    ↓
AuthUseCase.signup()
    ↓
Validate email/password/name
    ↓
AuthRepository.signup()
    ↓
Store in backendless authentication user
    ↓
Return User object
    ↓
Update AuthContext
    ↓
Navigate to Dashboard
```
### Create Task Flow
```
User Input (Title, Description, Status)
    ↓
TaskDialog Component
    ↓
TaskUseCase.createTask()
    ↓
Validate userId, title, description
    ↓
TaskRepository.createTask()
    ↓
Store in backendless Task table
    ↓
Return Task object
    ↓
Update task list in UI
```

## Technology Stack

- **Frontend:** React, Next.js, Tailwind CSS
- **State Management:** Context API
- **Testing:** Jest, React Testing Library
- **Data:** use external API backendless.com
- **Architecture Pattern:** Clean Architecture with Dependency Injection

## Live Demo Link
[DEMO](https://task-manager-happy.vercel.app/)
