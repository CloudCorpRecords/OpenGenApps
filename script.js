document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the necessary DOM elements
    const generateButton = document.getElementById('generateButton');
    const downloadButton = document.getElementById('downloadButton');
    const embedButton = document.getElementById('embedButton');
    const hideEmbedButton = document.getElementById('hideEmbedButton'); // New button
    const previewButton = document.getElementById('previewButton');
    const descriptionInput = document.getElementById('description');
    const outputFrame = document.getElementById('outputFrame');
    const embedCodeContainer = document.getElementById('embedCodeContainer');
    const embedCode = document.getElementById('embedCode');
    const downloadMenu = document.getElementById('downloadMenu');
    const downloadHtmlLink = document.getElementById('downloadHtmlLink');
    const downloadCssLink = document.getElementById('downloadCssLink');
    const downloadJsLink = document.getElementById('downloadJsLink');

    // Variables to store the generated content
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

    // Function to handle file downloads
    function download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // Event listener for the "Generate" button
    generateButton.addEventListener('click', () => {
        const description = descriptionInput.value;
        console.log('Description:', description); // Debugging

        // Initially hide buttons and show loading indicator
        embedCodeContainer.style.display = 'none';
        embedButton.style.display = 'none';
        hideEmbedButton.style.display = 'none'; // Initially hide hide button
        downloadButton.style.display = 'none';
        previewButton.style.display = 'none';
        const loadingIndicator = document.getElementById('loadingIndicator');
        loadingIndicator.style.display = 'block';

        // Make a POST request to the server to generate HTML, CSS, and JS
        fetch('https://your-replit-server.replit.app/generate', {
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
                    const data = JSON.parse(text);
                    console.log('Parsed data:', data);
                    if (data && data.complete_html) {
                        generatedHTML = decodeHTMLEntities(data.complete_html);
                        console.log('Decoded HTML Content:', generatedHTML);

                        // Update the iframe with the generated HTML:
                        const iframeDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
                        iframeDocument.open();
                        iframeDocument.write(generatedHTML);
                        iframeDocument.close();

                        // Store separate HTML, CSS, and JS content
                        separateHTML = data.html;
                        generatedCSS = data.css;
                        generatedJS = data.js;

                        // Show the download, embed, and preview buttons
                        downloadButton.style.display = 'inline-block';
                        embedButton.style.display = 'inline-block';
                        previewButton.style.display = 'inline-block';
                    } else {
                        throw new Error('Invalid data received from the API');
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    throw error;
                }
            })
            .catch(error => {
                console.error('Error fetching or displaying code:', error);
                const iframeDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
                iframeDocument.open();
                iframeDocument.write("<p>An error occurred. Please try again.</p>");
                iframeDocument.write("<p>Error: " + error.message + "</p>");
                iframeDocument.close();
            })
            .finally(() => {
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
            });
    });

    // Show download menu on hover and hide on mouse leave
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

    // Event listener for the "Embed" button
    embedButton.addEventListener('click', () => {
        const embedCodeHTML = `<iframe srcdoc="${generatedHTML.replace(/"/g, '&quot;')}" width="100%" height="500" frameborder="0"></iframe>`;
        embedCode.value = embedCodeHTML;
        embedCodeContainer.style.display = 'block';
        embedButton.style.display = 'none';
        hideEmbedButton.style.display = 'inline-block'; // Show hide button
    });

    // Event listener for the "Hide Embed" button
    hideEmbedButton.addEventListener('click', () => {
        embedCodeContainer.style.display = 'none';
        hideEmbedButton.style.display = 'none';
        embedButton.style.display = 'inline-block'; // Show generate button again
    });

    // Event listener for the "Preview" button
    previewButton.addEventListener('click', () => {
        const newTab = window.open();
        newTab.document.open();
        newTab.document.write(generatedHTML);
        newTab.document.close();
    });
});
