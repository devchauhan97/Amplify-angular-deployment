# AngularApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.14.

## Development server

For local development, set `BACKEND_API_URL` and optionally
`BACKEND_API_URL_SLUG` in `.env`. The default slug is `/api`. Start the
development server with:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

Build the project with:

```bash
npm run build
```

Before building, the project generates its API URL from the environment
variables `BACKEND_API_URL` and `BACKEND_API_URL_SLUG` (default `/api`).
Environment variables provided by the build environment take precedence over
values in `.env`. In AWS Amplify, add both variables under the app's environment
variables; the resulting API URL is included in the browser bundle and must not
contain secrets.

The build artifacts are stored in `dist/`. By default, the production build
optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
