# CityShob FrontEnd

This is the frontend application for the CityShob project, built with Angular 19. It uses modern Angular features, Material Design components, and NgRx for state management.

## Table of Contents

- [Development Server](#development-server)
- [Code Scaffolding](#code-scaffolding)
- [Building](#building)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Design Patterns and Best Practices](#design-patterns-and-best-practices)
- [Additional Resources](#additional-resources)

---

## Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

---

## Building

To build the project, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

---

## Project Structure

The project follows a modular structure for scalability and maintainability. Below is an overview of the key directories:

```
src/
├── app/
│   ├── components/       # Reusable components (e.g., TaskListComponent)
│   ├── models/           # TypeScript interfaces and models (e.g., Task)
│   ├── store/            # NgRx state management (actions, reducers, effects, selectors)
│   ├── pages/            # Page-level components
│   ├── guard/            # Route guards
│   ├── interceptors/     # HTTP interceptors
│   ├── config/           # Application configuration
│   ├── shared/constants/        # Shared constants
│   ├── shared/pipes      # Shared date pipe
│   └── app.component.*   # Root component
├── environments/         # Environment-specific configurations
├── styles.scss           # Global styles
└── index.html            # Main HTML file
```

---

## Technologies Used

- **Angular**: Framework for building the application.
- **Angular Material**: UI components for a modern design.
- **NgRx**: State management using Redux principles.
- **RxJS**: Reactive programming for handling asynchronous data streams.
- **SCSS**: Styling with Sass for modular and reusable styles.
- **TypeScript**: Strongly typed JavaScript for better maintainability.

---

## Design Patterns and Best Practices

This project follows modern design patterns and best practices:

1. **Service Pattern**: Services like `TasksService` handle data management and API interactions.
2. **Reactive Programming**: RxJS is used for managing asynchronous data streams.
3. **State Management**: NgRx is used for a unidirectional data flow and centralized state management.
4. **Separation of Concerns**: Components handle UI logic, services handle business logic, and NgRx handles state.
5. **Clean Code Principles**:
   - Descriptive variable and function names.
   - Single Responsibility Principle (SRP).
   - Reusable and modular components.

---

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

For more information on Angular Material, visit the [Angular Material Documentation](https://material.angular.io/).

For more information on NgRx, visit the [NgRx Documentation](https://ngrx.io/).
