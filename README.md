# Smart Goal Planner

A modern, responsive web application for Finntech Company for managing savings goals with deposits, progress tracking, and deadline management. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Goal Management**: Create, edit, and delete savings goals with ease
- **Progress Tracking**: Visual progress bars and percentage completion
- **Deposit System**: Add deposits to goals and track savings progress
- **Category Organization**: Organize goals by categories (Emergency, Travel, Home, etc.)
- **Deadline Tracking**: Set and monitor goal deadlines with status indicators
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant UI updates when data changes
- **Statistics Dashboard**: Overview of all goals with key metrics

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

```bash
# 1) Clone and install
git clone <YOUR_REPO_URL>
cd <YOUR_PROJECT_DIR>
npm install

# 2) Start the mock API (Terminal 1)
npx json-server --watch db.json --port 3000

# 3) Start the web app (Terminal 2, in project dir)
npm run dev
# open http://localhost:8080

# 4) Build & preview (optional)
npm run build
npm run preview
```

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Notifications**: Sonner toast system
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Project Structure

```
src/
├── api/                 # API hooks and services
│   └── goals.ts        # Goal-related API calls
├── components/         # Reusable UI components
│   ├── goals/         # Goal-specific components
│   │   ├── GoalCard.tsx      # Individual goal display
│   │   ├── GoalForm.tsx      # Create/edit goal form
│   │   ├── DepositDialog.tsx # Deposit money dialog
│   │   └── OverviewStats.tsx # Summary statistics
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
│   ├── Index.tsx      # Main dashboard page
│   └── NotFound.tsx   # 404 error page
├── types/             # TypeScript type definitions
│   └── goal.ts        # Goal-related types
└── main.tsx          # Application entry point
```

## Goal Schema

```typescript
interface Goal {
  id: string;           // Unique identifier
  name: string;         // Goal name/description
  targetAmount: number; // Target savings amount
  savedAmount: number;  // Current saved amount
  category: string;     // Goal category
  deadline: string;     // Target completion date (YYYY-MM-DD)
  createdAt: string;    // Creation date (YYYY-MM-DD)
}
```

## API Endpoints

The application uses a mock JSON server with these endpoints:

- `GET /goals` - Fetch all goals
- `POST /goals` - Create a new goal
- `PUT /goals/:id` - Update a goal
- `DELETE /goals/:id` - Delete a goal
- `PATCH /goals/:id` - Partial update (for deposits)

## Component Documentation

### GoalCard Component
- **Purpose**: Displays individual savings goal with all relevant information
- **Features**: Progress visualization, status indicators, action buttons
- **Props**: goal object, onUpdate, onDelete, onDeposit handlers

### GoalForm Component
- **Purpose**: Reusable form for creating and editing goals
- **Features**: Form validation, date picker, category selection
- **Modes**: Create new goals or edit existing ones

### DepositDialog Component
- **Purpose**: Modal for making deposits to goals
- **Features**: Amount validation, loading states, success feedback
- **Usage**: Triggered from GoalCard component

### OverviewStats Component
- **Purpose**: Displays summary statistics for all goals
- **Features**: Total goals, total saved, progress percentage, completed goals
- **Responsive**: Grid layout that adapts to screen size

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Comprehensive error handling

### Best Practices
- Memoized calculations for performance
- Responsive design principles
- Accessibility considerations
- Clean component architecture

## Troubleshooting

### Common Issues
1. **API not responding**: Ensure json-server is running on port 3000
2. **Build errors**: Check for TypeScript errors with `npm run lint`
3. **Styling issues**: Verify Tailwind CSS is properly configured

### Debug Commands
```bash
# Check for linting errors
npm run lint

# Start development with debug info
npm run dev -- --host

# Build and preview
npm run build && npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on the GitHub repository.
