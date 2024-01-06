# Genki Study Tool

## Description
An online Japanese study tool that has many activities meant to help you memorize various vocabulary. Content follows and is organized according to the Genki Japanese textbooks. 

View the website at [https://genki-study-tool.vercel.app](https://genki-study-tool.vercel.app)

## Technologies
Built in Typescript utilizing the Next.js React framework. Study material is stored externally on a MongoDB Atlas database. Unit testing is done with Jest and E2E testing with Cypress.

## Running Tests
Running Cypress E2E tests:
1) In one terminal run `npm run build`, then `npm run start`. <br/>
2) In a separate terminal, run `npm run cy:open` to start Cypress and run the E2E tests in your preferred browser. Alternatively, you can run `npm run cy:run` to run the E2E tests in the console.

## Running Locally
1. Clone responsitory

2. Ensure npm or equivalent is installed on your system

3. Open a command line and cd into: `/genki-study-tool/`

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.