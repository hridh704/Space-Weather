# Cosmic Forecast 🌌

**Your daily link to Space weather.**

Cosmic Forecast is a futuristic weather application that visualizes realistic, pre-generated Space weather data. It features a sleek, glassmorphism-inspired UI with neon accents, designed to be a beautiful and educational demonstration.

*Note: You can replace the placeholder below with a screenshot of the running application.*
![Cosmic Forecast Screenshot](placeholder.png)

## ✨ Features

-   **Expanded Space Weather Dashboard:** Dedicated cards for key space weather metrics:
    -   Solar Wind Speed
    -   Kp-Index (Geomagnetic Storm level)
    -   Maximum CME Speed
    -   Maximum X-ray Flux (Solar Flares)
    -   Solar Energetic Particle (SEP) Events
-   **Realistic Demo Data:** The app uses a built-in data generator for a consistent and reliable experience, perfect for demonstrations.
-   **7-Day Space Forecast:** A scrollable strip showing a full week's forecast for space weather conditions.
-   **Interactive Data Visualizer:**
    -   Visualize historical Solar Wind speed.
    -   Track historical Geomagnetic Activity (Kp-Index).
    -   View Solar Activity trends (CME Speed vs. X-ray Flux).
    -   Chart historical Particle Events (SEP counts).
    -   See a Kp-Index forecast gauge for the week ahead.
-   **Educational Content:** Learn how space weather impacts our lives and technology.
-   **Responsive Design:** Looks great on desktops, tablets, and mobile devices.
-   **Animated Background:** Subtle, cosmic particle animations for an immersive experience.

## 🛠️ Tech Stack

-   **Framework:** [React](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
-   **Charting:** [Recharts](https://recharts.org/)
-   **Build:** No build step! Runs directly in the browser with ES Modules and an import map.

## 🚀 Local Development

This project is designed to run directly in the browser without any build steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cosmic-forecast.git
    cd cosmic-forecast
    ```

2.  **Run the application:**
    Since there's no build server, you can simply open the `index.html` file in your browser. For the best experience, it's recommended to serve the directory with a simple local server.

    If you have Python installed:
    ```bash
    # Python 3
    python -m http.server
    ```
    Then, open your browser and navigate to `http://localhost:8000`.

## 🌐 Deployment to GitHub Pages

This application is ready for deployment to GitHub Pages.

1.  **Push to GitHub:** Create a new repository on GitHub and push your local code to it.

2.  **Enable GitHub Pages:**
    -   In your GitHub repository, go to the **Settings** tab.
    -   In the left sidebar, click on **Pages**.
    -   Under the "Build and deployment" section, for the **Source**, select **Deploy from a branch**.
    -   Under "Branch", select your `main` branch (or `master`) and keep the folder as `/(root)`.
    -   Click **Save**.

3.  **Done!** Your site will be deployed. GitHub will provide you with the URL for your live site (e.g., `https://<your-username>.github.io/<your-repo-name>/`). It may take a few minutes for the deployment to complete.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.