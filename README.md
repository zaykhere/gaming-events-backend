# gaming-events-backend
Backend for the frontend of Gaming-Events Application

## What's the Repo About?

This is the backend for my sample gaming-events application written in Node.js . The repo for frontend is located at [Gaming Events Frontend](https://github.com/zaykhere/gaming-events)
(which is written using Next.js).

I have used Express for the server. Database being used is postgres. And, the ORM that I'm using is Prisma. 

## Steps to Run on your machine:
Run npm install (or yarn)

    npm install
Add a .env file to your project. Define a ***DATABASE_URL*** variable which should contain your postgresql connection string. Like so:

    DATABASE_URL="postgresql://username:password@host:port/dbname?schema=public"
    

