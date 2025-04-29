# Contributing to Luminae

Thank you for your interest in contributing to Luminae! We aim to make this Discord bot platform better with your contributions.

By participating in this project, you agree to maintain a respectful and inclusive environment.

## Development Setup

**Prerequisites:**

- Node.js 18 or higher
- Bun runtime
- PostgreSQL database
- Redis (optional, for caching)
- A Discord application and bot token
- Your favorite code editor (VS Code recommended)

## When Contributing

1. **Create a new branch:**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Run:**

   ```bash
   # API development
   cd apps/api
   bun run dev

   # Bot development
   cd apps/bot
   bun run dev

   # Web dashboard
   cd apps/web
   bun run dev
   ```

3. **Format and Lint Code:**

To format and lint the code, run the following commands:

- Format code: `bun run format`
- Fix lint issues: `bun run lint `

4. **Create Pull Request:**

   - Use the PR template
   - Link related issues
   - Describe your changes
   - List any breaking changes

5. **Review Process:**

   - Address review comments
   - Keep the PR updated with the main branch
   - Squash commits if requested

6. **After Merge:**
   - Delete your branch
   - Update related documentation
   - Close related issues

## Getting Help

- Join our [Community server](https://discord.gg/CG6W5txMqu)
- Check existing issues and discussions
- Create a new issue for questions

Thank you for contributing to Luminae! 🎉
