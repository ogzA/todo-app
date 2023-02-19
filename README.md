## Configuration

Install npm packages

```
npm install
```

### Set up a Postgres database

Set up a Postgres database locally or use your favorite provider.

### Configure environment variables

Copy the `.env.local.example` file in this directory to `.env.local` (this will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set the `DATABASE_URL` variable in `.env.local` to the connection uri of your postgres database.

**Example usage:**

```
DATABASE_URL=postgresql://dbusername:dbpassword@host/dbname
```

### Apply migrations

To setup up the migrations, use:

```bash
npm run migrate:up
```

### Start the Todo App in development mode

```bash
npm run dev
```
