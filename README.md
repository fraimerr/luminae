# Luminae

A Discord bot featuring an advanced leveling system, customizable giveaways, and server management utilities with more features to come soon. (In Development)

![Luminae's Tech Stack](https://skillicons.dev/icons?i=bun,discordjs,ts,mongodb,prisma,next,tailwind,redis)

Feel free to contribute!

## Features

- **Leveling System**

  - Customizable level-up messages and channels
  - XP tracking for messages and reactions
  - Voice time tracking

- **Giveaway System**

  - Customizable requirements
  - Customizable multipliers

- **Server Management**
  - Moderation commands
  - User information tracking
  - Server statistics
  
- **... More ccoming soon**

## Project Structure

```
apps/
  ├─ api/      # API for web dashboard using Hono
  ├─ bot/      # Discord bot
  └─ web/      # Web dashboard
packages/
  ├─ db/       # Database utils
  ├─ redis/    # Redis cache layer
  ├─ shared/   # Shared utils
  └─ types/    # Type definitions
```

## Prerequisites

- Node.js 18 or higher
- Bun runtime
- MongoDB database
- Redis (optional, for caching)
- Discord

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fraimerr/luminae.git
   cd luminae
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:
   Create `.env` files in the following locations:

   **Root (.env)**

   ```env
   DATABASE_URL="mongo db uri herer"
   ```

   **Bot (apps/bot/.env)**

   ```env
   BOT_TOKEN="your-discord-bot-token"
   DEBUG="true"
   ```

   **API (apps/api/.env)**

   ```env
   DISCORD_CLIENT_ID="your-client-id"
   DISCORD_CLIENT_SECRET="your-client-secret"
   DISCORD_REDIRECT_URI="http://localhost:5000/v1/auth/callback"
   DISCORD_BOT_TOKEN="your-discord-bot-token"
   JWT_SECRET="your-jwt-secret"
   ```

4. Initialize the database:
   ```bash
   bun run db:generate
   bun run db:push
   ```

## Development

Start individual services:

```bash
# API
cd apps/api
bun run dev

# Bot
cd apps/bot
bun run dev

# Web
cd apps/web
bun run dev
```

## Contributing

Before contributing ensure to follow these steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

Join our [Community server](https://discord.gg/CG6W5txMqu) for support and updates.
