# Frontend Code Generator 

This is a simple web application that uses Google's Gemini API to generate HTML, CSS, and JavaScript code from natural language descriptions. 
Demo: https://geminigenerative-cloudcorprecord.replit.app/

## Features

- **Easy to Use:** Describe what you want to build in plain English.
- **Powered by Gemini:** Leverages the capabilities of Google's Gemini large language model.
- **Dynamic Rendering:**  See the generated code rendered in real-time within an iframe.

## How it Works

1. **Input:** Enter a description of the frontend elements you want in the text area (e.g., "a button that changes color on hover").
2. **API Request:** The frontend sends a request to a backend server running the Gemini API.
3. **Code Generation:** The Gemini model generates HTML, CSS, and JavaScript code based on your description.
4. **Rendering:** The generated code is rendered dynamically in an iframe, allowing you to see the results immediately.

## Setup

**Requirements:**

- **Replit Account:** You need a free Replit account ([https://replit.com/](https://replit.com/)).
- **Gemini API Key:** Get your API key and some free credits by following these steps:
    1. **Try Gemini:** Visit [https://aistudio.google.com/app/prompts/new_chat](https://aistudio.google.com/app/prompts/new_chat) to experiment with Gemini.
    2. **Get an API Key:** Visit [https://developers.generativeai.google.com/](https://developers.generativeai.google.com/) to create a project, enable the Gemini API, and get your key. 

**Steps:**

1. **Set up the Backend Server:**
   - **Fork the Repository:**  Go to [https://github.com/CloudCorpRecords/Geminiserver](https://github.com/CloudCorpRecords/Geminiserver) and click the "Fork" button to create your own copy of the repository.
   - **Create a Replit Project:** Import your forked repository into Replit.
   - **Add Your API Key:** Create a Replit Secret named `GEMINI_API_KEY` and store your Gemini API key as its value.
   - **Deploy:**  Click the "Deploy" button in your Replit project to fully deploy the backend server.  You will get a URL similar to this: `https://your-backend-server.repl.co`. 

2. **Set up the Frontend:**
   - **Create a Replit Project:** Create a new Replit HTML/CSS/JS project.
   - **Paste the Code:**  Paste the provided `index.html` code into your project.
   - **Update the API URL:** Replace `https://geminiserver-cloudcorprecord.replit.app/generate` in your `index.html` code with the URL of your deployed backend server (e.g., `https://your-backend-server.repl.co/generate`).
   - **Run the Frontend:** Run the frontend project. 

## Usage

1. **Go to the Frontend:** Open the URL for your frontend Replit project in your web browser.
2. **Describe Your Element:**  In the text area, enter a clear description of the frontend code you want to generate (e.g., "a button that changes color on hover"). 
3. **Click "Generate Code":**  The application will send your description to the backend server, and the generated code will be displayed in the iframe.

## Example Prompt

"Generate HTML and CSS for a webpage with a button that changes color on hover."

## Customization

You can customize this project by:

- **Modifying the Prompts:** Experiment with different prompts to get better code generation results from Gemini. 
- **Using AI for Rewriting:**  Leverage the power of Gemini in AI Studio to rewrite the code and tailor it to your specific needs.

## About the Author

Rene Turcios is the creator of this project as part of the OpenGenApps initiative. For more information, visit [reneturcios.com](reneturcios.com).

## Contributing

Contributions are welcome!  Please see the `CONTRIBUTING.md` file for guidelines.

## License

This project is licensed under the MIT License.
