document.addEventListener('DOMContentLoaded', () => {
    // Select HTML elements by their IDs
    const generateButton = document.getElementById('generateButton');
    const downloadButton = document.getElementById('downloadButton');
    const embedButton = document.getElementById('embedButton');
    const hideEmbedButton = document.getElementById('hideEmbedButton'); // New button to hide the embed code
    const previewButton = document.getElementById('previewButton');
    const descriptionInput = document.getElementById('description');
    const outputFrame = document.getElementById('outputFrame');
    const embedCodeContainer = document.getElementById('embedCodeContainer');
    const embedCode = document.getElementById('embedCode');
    const downloadMenu = document.getElementById('downloadMenu');
    const downloadHtmlLink = document.getElementById('downloadHtmlLink');
    const downloadCssLink = document.getElementById('downloadCssLink');
    const downloadJsLink = document.getElementById('downloadJsLink');

    // Initialize variables to store generated code
    let generatedHTML = '';
    let separateHTML = '';
    let generatedCSS = '';
    let generatedJS = '';

    // Function to decode HTML entities
    function decodeHTMLEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    // Function to download text as a file
    function download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // Event listener for the generate button
    generateButton.addEventListener('click', () => {
        // Get user input from the description field
        const description = descriptionInput.value;
        console.log('Description:', description); // Debugging output

        // Hide embed code, download, and preview buttons
        embedCodeContainer.style.display = 'none';
        embedButton.style.display = 'none';
        hideEmbedButton.style.display = 'none'; // Initially hide hide button
        downloadButton.style.display = 'none';
        previewButton.style.display = 'none';

        // Show the loading indicator
        const loadingIndicator = document.getElementById('loadingIndicator');
        loadingIndicator.style.display = 'block';

        // Fetch code from the server using the provided API endpoint
        fetch('https://buddhageminiserver.replit.app/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: description, model: 'gemini-1.5-flash' })
        })
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                return response.text();  // Change this from response.json() to response.text()
            })
            .then(text => {
                console.log('Raw response text:', text);
                try {
                    // Parse the JSON response
                    const data = JSON.parse(text);
                    console.log('Parsed data:', data);

                    // Check if the API response contains complete HTML
                    if (data && data.complete_html) {
                        // Decode HTML entities and store the generated HTML
                        generatedHTML = decodeHTMLEntities(data.complete_html);
                        console.log('Decoded HTML Content:', generatedHTML);

                        // Update the iframe with the generated HTML
                        const iframeDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
                        iframeDocument.open();
                        iframeDocument.write(generatedHTML);
                        iframeDocument.close();

                        // Store separate HTML, CSS, and JS content for download
                        separateHTML = data.html;
                        generatedCSS = data.css;
                        generatedJS = data.js;

                        // Show the download, embed, and preview buttons
                        downloadButton.style.display = 'inline-block';
                        embedButton.style.display = 'inline-block';
                        previewButton.style.display = 'inline-block';
                    } else {
                        // Throw an error if the API response is invalid
                        throw new Error('Invalid data received from the API');
                    }
                } catch (error) {
                    // Handle any errors during JSON parsing
                    console.error('Error parsing JSON:', error);
                    throw error;
                }
            })
            .catch(error => {
                // Handle any errors during fetching or displaying code
                console.error('Error fetching or displaying code:', error);
                const iframeDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
                iframeDocument.open();
                iframeDocument.write("<p>An error occurred. Please try again.</p>");
                iframeDocument.write("<p>Error: " + error.message + "</p>");
                iframeDocument.close();
            })
            .finally(() => {
                // Hide the loading indicator
                loadingIndicator.style.display = 'none';
            });
    });

    // Event listeners for showing and hiding the download menu
    downloadButton.addEventListener('mouseenter', () => {
        downloadMenu.style.display = 'block';
    });

    downloadButton.addEventListener('mouseleave', () => {
        downloadMenu.style.display = 'none';
    });

    downloadMenu.addEventListener('mouseenter', () => {
        downloadMenu.style.display = 'block';
    });

    downloadMenu.addEventListener('mouseleave', () => {
        downloadMenu.style.display = 'none';
    });

    // Event listeners for downloading HTML, CSS, and JS files
    downloadHtmlLink.addEventListener('click', (event) => {
        event.preventDefault();
        download('index.html', separateHTML);
    });

    downloadCssLink.addEventListener('click', (event) => {
        event.preventDefault();
        download('style.css', generatedCSS);
    });

    downloadJsLink.addEventListener('click', (event) => {
        event.preventDefault();
        download('script.js', generatedJS);
    });

    // Event listener for the embed button
    embedButton.addEventListener('click', () => {
        // Generate the embed code for an iframe
        const embedCodeHTML = `<iframe srcdoc="${generatedHTML.replace(/"/g, '&quot;')}" width="100%" height="500" frameborder="0"></iframe>`;
        embedCode.value = embedCodeHTML;
        embedCodeContainer.style.display = 'block';
        embedButton.style.display = 'none';
        hideEmbedButton.style.display = 'inline-block'; // Show hide button
    });

    // Event listener for the hide embed button
    hideEmbedButton.addEventListener('click', () => {
        embedCodeContainer.style.display = 'none';
        hideEmbedButton.style.display = 'none';
        embedButton.style.display = 'inline-block'; // Show generate button again
    });

    // Event listener for the preview button
    previewButton.addEventListener('click', () => {
        // Open a new window and display the generated HTML
        const newTab = window.open();
        newTab.document.open();
        newTab.document.write(generatedHTML);
        newTab.document.close();
    });
});
