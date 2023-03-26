# Flow Challenge App

### Technologies Used

- T3 stack
- tRPC
- Prisma
- Planetscale database
- Typescript
- Next.js
- Vitest

### Getting Started

#### Installation

To get started, clone the repository and install the dependencies using the following command:

```bash
git clone https://github.com/imadatt/flow-challenge.git
cd flow-challenge
npm i
```

#### Environment Variables

The project requires the following environment variables to be set:

DATABASE_URL: The URL to connect to the Planetscale database.
You can create a .env file in the root directory of the project with the following contents:

```bash
DATABASE_URL=your-planetscale-database-url
```

#### Database Setup

The project uses Prisma as its ORM to connect to the Planetscale database. To create the necessary tables, run the following command:

```bash
npx prisma db push
npm run db-seed
```

#### Running the Project

To start the development server, run the following command:

```bash
npm run dev
```

To build the project for production, run the following command:

```bash
npm run build
```

#### Testing

The project uses Vitest for testing. To run the tests, use the following command:

```bash
npm run test
```

to see coverage

```bash
npm run coverage
```

### Deployment

The project is deployed to Vercel and has two environments, production and development.

- Development url: [flow-challenge-dev.vercel.app](flow-challenge-dev.vercel.app)
- Production url: [flow-challenge.vercel.app](flow-challenge.vercel.app)
