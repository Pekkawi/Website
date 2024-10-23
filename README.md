# Web Interface for The Core

This web page is designed in Next.js to help manage access for workshop equipment. It allows administrators to view users, change their roles and permissions, add a new machine type, manage machines and check their usage history.

## Project Overview

This project aims to create an access control system for workshop equipment, providing:

- **User Management**: View registered users and manage their roles and what machines they are allowed to use or delete them.
- **Permission Management**: Easily add new machines as permissions.
- **Monitor Machine Usage**: Check the status of a machine and it's history usage

<!-- ## Features

- **User Interface**: A clean, responsive web interface for managing users,machines and permissions
- **Role-Based Permissions**: Assign different roles and permissions to users to determine which machines they have access to.
- **Dynamic Machine Addition**: Ability to create new permissions for new equipment. -->

## Getting Started

### Prerequisites

To run this project, you will need:

- **Node.js** (v18.17 or above)
- **npm** or **yarn**

### Installation

1. Clone the repository:

   ```bash
   git clone https://gitlab.com/sdu-the-core/Website.git
   cd Website
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root of your project with the following variables:

   ```
   MONGODB_URL=<your-database-url>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-public-key>
   CLERK_SECRET_KEY=<your-clerk-private-key>
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application should be running at `http://localhost:3000`.

## Usage

### Viewing Users

- Navigate to the **Users** page to view a list of all registered users.
- Search and filter users as needed.
- Select a user and manage their permissions/role or delete them from the database.

### Adding New Permissions

- Go to the **Permission** page to add a new machine type to the system.

### Managing and viewing a Machine

- Go to the **Nodes** page and here you can view all working machines, manage them and view their usage history.

## Technologies Used

- **Next.js**: A React framework for building full-stack web applications.
- **MongoDB**: Non-relational Database used for storing data,including file storage using GridFS.
- **Clerk**: For authentication and restricting access to the platform
- **TailwindCSS**: For styling the user interface with utility-first CSS.
- **Framer Motion**: Library for adding smooth animations and transitions.
- **shadcn/ui**: Premade component library using RadixUI, with easely customizable components.
- **Docker**: Containerization platform used to package the application and its dependencies, ensuring consistent environments across different systems.
- **GitLab CI/CD**: Used for continuous integration and deployment, automating the build and deployment processes.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the system.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature-name
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Add new feature"
   ```

4. Push to the branch:

   ```bash
   git push origin feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, feel free to send an email to the following address : edlie22@student.sdu.dk
