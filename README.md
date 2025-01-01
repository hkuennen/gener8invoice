# Gener8Invoice

Gener8Invoice is an Electron application built with React and Django. It allows users to generate and download invoices in PDF format. The application leverages a Django backend to handle the invoice generation and a React frontend for the user interface.

## Features

- Generate invoices with detailed information.
- Download invoices as PDF files.
- Electron-based desktop application.
- React frontend for a modern user interface.
- Django backend for robust server-side processing.
- Integration with Tailwind CSS for styling.
- Uses FontAwesome for icons.

## Getting Started

### Prerequisites

- Node.js
- npm
- Python 3
- virtualenv

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/gener8invoice.git
cd gener8invoice
```

2. Install Node.js dependencies:

```sh
npm install
```

3. Set up the Python virtual environment and install dependencies:

```sh
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

4. Build the React frontend:

```sh
npm run build
```

### Running the Application

1. Start the Django server:

```sh
npm run server
```

2. Start the Electron application:

```sh
npm run electron
```

### Building the Electron Application:

```sh
npm run electron:build
```
