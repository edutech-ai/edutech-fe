# 🚀 EDUTECH – AI Teaching Assistant System

<div align="center">

![EduTech Banner](./public/Edutech.svg)

**Empowering Secondary School Teachers with AI-Powered Quiz Generation & Auto-Grading**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.7-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-Latest-orange?style=flat-square&logo=bun)](https://bun.sh/)

[Features](#-core-features) • [Installation](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-tech-stack)

</div>

---

## Table of Contents

- [About the Project](#-about-the-project)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Team](#-team)

---

## About the Project

**EduTech** is an AI-powered web application designed to revolutionize teaching workflows for Vietnamese secondary school teachers. By leveraging cutting-edge AI technology, EduTech helps educators:

- **Generate quizzes automatically** from lesson topics
- **Grade student answers instantly** automacally with tech
- **Analyze student performance** with comprehensive analytics
- **Class Management** with User-friendly interface
- **Improve teaching efficiency** through data-driven insights

### Target Users

- **Primary**: Secondary school teachers (Grades 6-12, MVP focus on Math, Literature and English)
- **Secondary**: School administrators
- **Tertiary**: Education Center 
---

## Core Features

### 1. AI Quiz Generation Module
Automatically create customized quizzes based on:
- Lesson topic and learning objectives
- Number of questions (configurable)
- Question types (MCQ, Short Answer, True/False)
- Difficulty levels (Easy, Medium, Hard)
- AI-powered question quality validation

### 2. Auto-Grading Module
Intelligent answer evaluation system:
- Upload student answers (bulk or individual)
- Tech based powered grading with explanations
- Personalized improvement suggestions
- Detailed feedback for teachers

### 3. Quiz Management System
Comprehensive quiz organization:
- Save and categorize quiz templates
- CRUD operations (Create, Read, Update, Delete)
- Search and filter by topic/difficulty
- Clone and modify existing quizzes
- Version control for quiz iterations

### 4. Analytics Dashboard
Data-driven insights for teachers:
- Question difficulty distribution
- Student accuracy rates by topic
- Performance trends over time
- Class-level vs individual metrics
- AI-powered teaching recommendations

### 5. System Settings
Flexible configuration:
- AI model parameters (temperature, max tokens)
- Grading thresholds
- Notification preferences
- Data export/import
- API key management

---

## Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.10 | React framework with App Router |
| **React** | 19.2.1 | UI library |
| **TypeScript** | 5.0 | Type-safe JavaScript |
| **TailwindCSS** | 4.1.7 | Utility-first CSS framework |
| **Zustand** | 5.0.6 | Lightweight state management |
| **TanStack Query** | 5.80.6 | Server state management |
| **Radix UI** | Latest | Headless UI components |

### **Backend Integration**
| Technology | Purpose |
|------------|---------|
| **Axios** | HTTP client for API calls |
| **Prisma** | Type-safe ORM (PostgreSQL) |
| **JWT** | Token-based authentication |
| **WebSocket** | Real-time communication |

### **AI & Document Processing**
| Library | Purpose |
|---------|---------|
| **TipTap** | Rich text editor |
| **docx** | Word document generation |
| **pptxgenjs** | PowerPoint generation |
| **pdfjs-dist** | PDF rendering |
| **xlsx** | Excel file handling |

### **Development Tools**
- **Bun**: Fast JavaScript runtime & package manager
- **ESLint**: Code linting
- **Prettier**: Code formatting (optional)
- **Docker**: Containerization
- **Nginx**: Reverse proxy (production)

---

## Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ or **Bun** latest
- **PostgreSQL** 14+ (or access to database server)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/edutech-ai/edutech-client.git
cd edutech-client
```

### 2. Install Dependencies

**Using Bun (Recommended):**
```bash
bun install
```

**Using npm/yarn/pnpm:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create your environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration

### 4. Database Setup

```bash
# Generate Prisma Client
bun run prisma:generate

# Run database migrations
bunx prisma db push --schema=src/prisma/schema.prisma

# (Optional) Open Prisma Studio
bunx prisma studio --schema=src/prisma/schema.prisma
```

### 5. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

### 6. Build for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

---

## Project Structure

```
edutech-frontend/
├── 📁 src/
│   ├── 📁 app/                        # Next.js App Router
│   │   ├── 📁 (tools)/               # Tool pages (quiz gen, grading)
│   │   │   ├── 📁 lesson-plan/       # Quiz generation
│   │   │   ├── 📁 exam-templates/    # Quiz templates
│   │   │   ├── 📁 exam-instances/    # Quiz sessions
│   │   │   └── 📁 chats/             # AI chat support
│   │   ├── 📁 auth/                  # Authentication pages
│   │   ├── 📁 home/                  # Teacher dashboard
│   │   ├── 📁 my-library/            # Quiz library
│   │   ├── 📁 results/               # Grading results
│   │   └── 📁 admin/                 # Admin panel (future)
│   │
│   ├── 📁 components/                # React Components
│   │   ├── 📁 atoms/                 # Basic UI elements
│   │   ├── 📁 molecules/             # Composite components
│   │   ├── 📁 organisms/             # Complex components
│   │   ├── 📁 templates/             # Page templates
│   │   └── 📁 ui/                    # shadcn/ui components
│   │
│   ├── 📁 hooks/                     # Custom React Hooks
│   │   ├── useAuth.ts                # Authentication
│   │   ├── useQuiz.ts                # Quiz operations
│   │   ├── useGrading.ts             # Grading operations
│   │   └── react-query.ts            # API query factories
│   │
│   ├── 📁 services/                  # API Service Layer
│   │   ├── examTemplateServices.ts   # Quiz templates API
│   │   ├── lessonPlanServices.ts     # Lesson plans API
│   │   ├── questionBankServices.ts   # Question bank API
│   │   └── gradingServices.ts        # Auto-grading API
│   │
│   ├── 📁 store/                     # Zustand State Management
│   │   ├── index.tsx                 # App store (user, theme)
│   │   ├── quizStore.ts              # Quiz state
│   │   └── gradingStore.ts           # Grading state
│   │
│   ├── 📁 types/                     # TypeScript Definitions
│   │   ├── quiz.ts                   # Quiz types
│   │   ├── grading.ts                # Grading types
│   │   └── user.ts                   # User types
│   │
│   ├── 📁 utils/                     # Utility Functions
│   │   ├── authUtils.ts              # Auth helpers
│   │   ├── docxGenerator.ts          # Document export
│   │   ├── pdfGenerator.ts           # PDF export
│   │   └── gradeCalculator.ts        # Grading logic
│   │
│   ├── 📁 constants/                 # App Constants
│   ├── 📁 config/                    # Configuration (axios, etc.)
│   ├── 📁 schemas/                   # Zod validation schemas
│   ├── 📁 prisma/                    # Prisma schema & migrations
│   └── 📁 styles/                    # Global styles
│
├── 📁 public/                        # Static assets
│   ├── 📁 images/                    # Images & icons
│   └── 📁 fonts/                     # Custom fonts
│
├── 📁 docs/                          # Documentation
├── 📄 .env.example                   # Environment template
├── 📄 .gitignore                     # Git ignore rules
├── 📄 package.json                   # Dependencies
├── 📄 bun.lock                       # Bun lock file
├── 📄 next.config.ts                 # Next.js configuration
├── 📄 tailwind.config.js             # TailwindCSS config
├── 📄 tsconfig.json                  # TypeScript config
├── 📄 docker-compose.yml             # Docker setup
└── 📄 README.md                      # This file
```

---

## Development Guide

### Component Architecture

This project follows **Atomic Design Pattern**:

```typescript
// Atoms - Basic building blocks
import { Button, Input, Label } from "@/components/atoms";

// Molecules - Composite components
import { FormField, SearchBox } from "@/components/molecules";

// Organisms - Complex components
import { QuizBuilder, GradingPanel } from "@/components/organisms";

// Templates - Page layouts
import { DashboardLayout } from "@/components/templates";
```

### State Management with Zustand

```typescript
import { useAppStore } from "@/store";

function MyComponent() {
  const { user, isAuthenticated } = useAppStore();

  if (!isAuthenticated()) {
    return <LoginPrompt />;
  }

  return <Dashboard user={user} />;
}
```

### API Integration with React Query

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { useExamTemplatesService } from "@/services/examTemplateServices";

function QuizList() {
  const { data: quizzes, isLoading } = useExamTemplatesService();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {quizzes.map(quiz => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}
```

### Available Scripts

```bash
# Development
bun run dev              # Start dev server with Turbopack
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint

# Database
bun run prisma:generate  # Generate Prisma Client
bunx prisma studio       # Open Prisma Studio GUI
bunx prisma db push      # Push schema to database

# Docker
docker-compose up -d     # Start Docker containers
docker-compose down      # Stop Docker containers
```

---

## Deployment

### VPS Deployment (Ubuntu + Nginx)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js & Bun
curl -fsSL https://bun.sh/install | bash

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (process manager)
bun install -g pm2
```

#### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/edutech-frontend.git
cd edutech-frontend

# Install dependencies
bun install

# Setup environment
cp .env.example .env.production
nano .env.production  # Edit with production values

# Build application
bun run build

# Start with PM2
pm2 start bun --name "edutech-frontend" -- run start
pm2 save
pm2 startup
```

#### 3. Nginx Configuration

Create `/etc/nginx/sites-available/edutech`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/edutech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### Docker Deployment

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

## Testing

### Run Tests

```bash
# Unit tests
bun test

# E2E tests (coming soon)
bun run test:e2e

# Coverage report
bun run test:coverage
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Coding Standards

- Use **TypeScript** for type safety
- Follow **ESLint** rules
- Write **meaningful commit messages**
- Add **JSDoc comments** for functions
- Test your code before submitting

---

## 👥 Team

| Role | Name | Responsibilities |
|------|------|-----------------|
| **Project Manager** | [Name] | Project planning, stakeholder communication |
| **Business Analyst** | [Name] | Requirements gathering, UAT |
| **Developer** | [Name] | Full-stack development |
| **QA Engineer** | [Name] | Testing, quality assurance |

---

## Project Roadmap

### Phase 1: Foundation (Week 1-2)
- [x] Project setup
- [x] Repository structure
- [x] Database design
- [x] Authentication system

### Phase 2: AI Core (Week 3-5)
- [x] Quiz generation API integration
- [x] Auto-grading system
- [x] OpenAI integration
- [ ] Local testing & optimization

### 🔄 Phase 3: UI & Dashboard (Week 6-8)
- [ ] Quiz builder interface
- [ ] Grading dashboard
- [ ] Analytics charts
- [ ] Quiz library management

### 🔜 Phase 4: Testing & Deployment (Week 9-10)
- [ ] System testing
- [ ] UAT with pilot teachers
- [ ] VPS deployment
- [ ] HTTPS & security hardening
- [ ] Performance optimization

### 🚀 Future Enhancements
- Student portal
- Class management
- Real-time quiz hosting
- Mobile app (iOS/Android)
- Multi-language support

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

- **Project Website**: [https://edutech.edu.vn](https://edutech.edu.vn)
- **Email**: edutechteam.work@gmail.com
- **Issues**: [GitHub Issues](https://github.com/edutech-ai/edutech-client/issues)

---

<div align="center">

### 🌟 Star this project if you find it helpful!

**Made with ❤️ by the EduTech Development Team**

[⬆ Back to Top](#-edutech--ai-teaching-assistant-system)

</div>
# edutech-fe
