# BlogMVC - Node.js Blog Management System

A Blog Management System built with **Node.js**, **Express**, and **MySQL**, following the **Model-View-Controller (MVC)** architecture.

---

## Key Features

- **User Authentication**: User authentication using `bcrypt` for password hashing and `express-session` for session management.
- **Blog Administration**: CRUD operations for managing blog posts, including image uploads to **Supabase Storage**.
- **Admin Dashboard**: Data visualization with **Chart.js** and data tables with **Grid.js**.
- **Responsive UI**: User interface built with **EJS Templating** and **Tailwind CSS**.
- **Security Features**:
    - **Rate Limiting**: Protection against brute-force attempts.
    - **Input Validation**: Data sanitization using `express-validator`.
- **Caching & Sessions**: Session handling with **Redis**.
- **Email Communications**: Integration with **Resend** for contact forms and notifications.
- **Asset Pipeline**: Asset bundling and font processing using **esbuild**.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js (Express.js) |
| **Database** | MySQL (Sequelize ORM) |
| **Caching** | Redis |
| **Frontend** | EJS, Tailwind CSS, Grid.js, Chart.js |
| **Storage** | Supabase Storage |
| **Email** | Resend API |
| **Bundler** | esbuild |

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **MySQL** (v8.0+)
- **Redis** (Optional, for persistent session management)
- **Docker Desktop** (Optional, for easy environment setup)

### 1. Installation

```bash
git clone https://github.com/TranNhucYen/My-Blog.git
npm install
```

### 2. Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update the variables in `.env` with your database credentials, Redis configuration, Supabase keys, and Resend API keys.

### 3. Setup Development Environment

**Option A: Using Docker (Fastest)**
```bash
docker-compose -f db/docker-compose.yml up -d
```

**Option B: Manual Setup**
- Create a MySQL database named `myblog`.
- Start your local Redis server.

### 4. Database Migrations & Seeding

Sync your database schema and populate it with initial data:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 5. Build Assets

The project compiles Tailwind CSS and bundles vendor JS/Fonts:

```bash
# Build JS & Font bundles
node esbuild.js
node esbuild-font.js

# Build Tailwind CSS
npm run build:tailwind
```

---

## Running the App

### Development Mode
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

### Production Mode
```bash
npm start
```

---

## Project Structure

```text
BlogMVC/
├── db/              # Database configs & Docker Compose
├── frontend/        # Source assets (CSS/JS vendors)
├── src/
│   ├── config/      # Application configurations
│   ├── controllers/ # Business logic handlers
│   ├── middleware/  # Custom Express middlewares
│   ├── models/      # Sequelize database models
│   ├── routes/      # Application routing
│   ├── services/    # Database communication and external service integrations (Supabase, Resend)
│   ├── views/       # EJS templates
│   └── public/      # Static assets (compiled bundles)
```

---

## Available Scripts

- `npm run dev`: Start development server with Nodemon.
- `npm start`: Start production server.
- `npm run build:tailwind`: Compile Tailwind CSS.
- `node esbuild.js`: Bundle vendor libraries.
- `node esbuild-font.js`: Bundle FontAwesome icons.

---

## License

This project is licensed under the **ISC License**.

---