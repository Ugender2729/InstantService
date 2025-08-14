# Supabase Local Development Setup

This guide will help you set up Supabase locally for the InstantService project.

## Prerequisites

1. **Docker Desktop**: Install Docker Desktop from [https://docs.docker.com/desktop/](https://docs.docker.com/desktop/)
2. **Node.js**: Make sure you have Node.js installed (version 16 or higher)

## Installation Steps

### 1. Install Supabase CLI

The Supabase CLI is already configured in this project. You can run it using npx:

```bash
npx supabase --version
```

### 2. Start Docker Desktop

Make sure Docker Desktop is running on your system before proceeding.

### 3. Start Supabase Local Development

```bash
npx supabase start
```

This command will:
- Start a local PostgreSQL database
- Start the Supabase API server
- Start Supabase Studio (web interface)
- Start the local auth server
- Start the local storage server

### 4. Access Local Services

Once started, you can access:

- **Supabase Studio**: http://localhost:54323
- **API**: http://localhost:54321
- **Database**: localhost:54322
- **Auth**: http://localhost:54321/auth/v1
- **Storage**: http://localhost:54321/storage/v1

### 5. Frontend Configuration

Create a `.env.local` file in the `Frontend/` directory with:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### 6. Install Frontend Dependencies

```bash
cd Frontend
npm install
```

## Database Schema

The project includes a complete database schema with the following tables:

- **users**: User accounts and profiles
- **service_categories**: Available service types
- **providers**: Service provider profiles
- **provider_services**: Many-to-many relationship between providers and services
- **bookings**: Service booking records
- **reviews**: Customer reviews and ratings
- **notifications**: User notifications

## Useful Commands

### Start/Stop Supabase
```bash
npx supabase start    # Start local development
npx supabase stop     # Stop local development
npx supabase status   # Check status of services
```

### Database Management
```bash
npx supabase db reset     # Reset database and run migrations
npx supabase db push      # Push local migrations to remote
npx supabase db diff      # Generate migration from schema changes
```

### Generate TypeScript Types
```bash
npx supabase gen types typescript --local > Frontend/src/lib/database.types.ts
```

### Access Database
```bash
npx supabase db studio   # Open database in browser
```

## Development Workflow

1. **Start Supabase**: `npx supabase start`
2. **Start Frontend**: `cd Frontend && npm run dev`
3. **Make Database Changes**: Edit files in `supabase/migrations/`
4. **Apply Changes**: `npx supabase db reset`
5. **Generate Types**: `npx supabase gen types typescript --local`

## Troubleshooting

### Docker Issues
- Make sure Docker Desktop is running
- Try restarting Docker Desktop
- Check if ports 54321-54329 are available

### Database Connection Issues
- Verify Supabase is running: `npx supabase status`
- Check the database URL in your environment variables
- Ensure the database is accessible on localhost:54322

### Migration Issues
- If migrations fail, try: `npx supabase db reset`
- Check migration files for syntax errors
- Ensure migration files are in the correct format

## Next Steps

1. Set up authentication in your frontend
2. Create API endpoints for your services
3. Implement real-time subscriptions
4. Set up file storage for images
5. Configure email templates

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Local Development Guide](https://supabase.com/docs/guides/local-development)

