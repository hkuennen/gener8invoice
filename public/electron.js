/**
 * This script is the main process for an Electron application.
 * It sets up the main window, starts a server, and manages the lifecycle of the application.
 */

const { spawn } = require("child_process");
const { app, BrowserWindow } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");

// Keep a reference to the main window to prevent garbage collection
let mainWindow;
let serverProcess;

/**
 * Creates the main application window.
 * Configures the window size, web preferences, and loads the URL.
 */
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      webSecurity: true,
      credentials: "include"
    }
  });

  mainWindow.loadURL("http://localhost:8000");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

/**
 * Checks if the server is running by making an HTTP request.
 * @returns {Promise} Resolves when the server is running, rejects otherwise.
 */
const checkServerRunning = () => {
  return new Promise((resolve, reject) => {
    const options = {
      host: "localhost",
      port: 8000,
      timeout: 2000
    };

    const request = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Server responded with status code ${res.statusCode}: ${data}`));
        }
      });
    });

    request.on("error", (err) => {
      reject(new Error(`HTTP request error: ${err.message}`));
    });
    request.end();
  });
};

app
  .whenReady()
  .then(() => {
    const activateVenvCommand =
      process.platform === "win32" ? "venv\\Scripts\\activate" : "source venv/bin/activate";
    const startServerCommand = "cd api && gunicorn -b 0.0.0.0:8000 api.wsgi:application";

    // Check if the virtual environment exists in the app folder
    const appPath = path.join(process.resourcesPath, "app");
    if (!fs.existsSync(appPath)) {
      console.error("Virtual environment not found:", appPath);
      app.quit();
      return;
    }

    /**
     * Spawns a child process to activate a virtual environment and install requirements.
     *
     * This function uses the `spawn` method to run a shell command that activates a Python virtual environment
     * and installs the necessary requirements from a `requirements.txt` file. The command is executed in the
     * virtual environment directory.
     *
     * @constant {ChildProcess} installRequirements - The spawned child process.
     * @param {string} activateVenvCommand - The command to activate the virtual environment.
     * @param {string} pipCommand - The command to run pip for installing requirements.
     * @property {string} cwd - The current working directory where the command is executed.
     * @property {boolean} shell - Indicates that the command should be run in a shell.
     */
    const installRequirements = spawn(`${activateVenvCommand}`, {
      cwd: appPath,
      shell: true,
      env: {
        ...process.env,
        VIRTUAL_ENV: path.join(appPath, "venv"),
        PATH: `${path.join(appPath, "venv", "bin")}:${process.env.PATH}`
      }
    });

    installRequirements.stdout.on("data", (data) => {
      console.log(`Pip: ${data.toString()}`);
    });

    installRequirements.stderr.on("data", (data) => {
      console.error(`Pip Error: ${data.toString()}`); // Error logs for installRequirements
    });

    installRequirements.on("close", (code) => {
      if (code === 0) {
        console.log("Virtual environment activated successfully.");
        console.log("Starting server...");
        serverProcess = spawn(`${activateVenvCommand} && ${startServerCommand}`, {
          cwd: appPath,
          shell: true,
          env: {
            ...process.env,
            VIRTUAL_ENV: path.join(appPath, "venv"),
            PATH: `${path.join(appPath, "venv", "bin")}:${process.env.PATH}`
          }
        });

        serverProcess.stdout.on("data", (data) => {
          console.log(`Server: ${data.toString()}`);
        });

        serverProcess.stderr.on("data", (data) => {
          console.error(`Server Error: ${data.toString()}`); // Error logs for serverProcess
        });

        serverProcess.on("close", (code) => {
          console.log(`Server process exited with code ${code}`);
        });

        // Poll the server until it is running, then create the main window
        const pollServer = () => {
          checkServerRunning()
            .then(() => {
              console.log("Server is running.");
              createMainWindow();
            })
            .catch((err) => {
              console.error(`Error checking server: ${err.message}`);
              setTimeout(pollServer, 1000);
            });
        };

        pollServer();
      } else {
        console.error(`Failed to install requirements with code ${code}`);
      }
    });
  })
  .catch((err) => {
    console.error(`Error during app initialization: ${err.message}`);
  });

/**
 * Event listener for when all windows are closed.
 * Quits the application unless on macOS.
 */
app.on("window-all-closed", () => {
  // Quit the app unless on macOS
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * Event listener for when the application is activated (e.g., clicking the dock icon on macOS).
 * Recreates the main window if it has been closed.
 */
app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

/**
 * Event listener for when the application is about to quit.
 * Terminates the server process before quitting.
 */
app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill(); // Gracefully terminate the server
  }
});
