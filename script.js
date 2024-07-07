// script.js

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const downloadButton = document.getElementById('downloadButton');
    const embedButton = document.getElementById('embedButton');
    const previewButton = document.getElementById('previewButton');
    const descriptionInput = document.getElementById('description');
    const outputFrame = document.getElementById('outputFrame');
    const embedCodeContainer = document.getElementById('embedCodeContainer');
    const embedCode = document.getElementById('embedCode');

    let generatedHTML = '';

    function decodeHTMLEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    function download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    generateButton.addEventListener('click', () => {
        const description = descriptionInput.value;
        console.log('Description:', description); // Debugging

        fetch('https://geminiserver-cloudcorprecord.replit.app/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: description, model: 'gemini-1.5-flash' })
        })
        .then(response => {
            console.log('Response status:', response.status); // Debugging
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // Debugging
            if (data && data.text) {
                generatedHTML = decodeHTMLEntities(data.text);
                console.log('Decoded HTML Content:', generatedHTML); // Debugging
                // Update the iframe with the generated HTML:
                const iframeDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
                iframeDocument.open();
                iframeDocument.write(generatedHTML);
                iframeDocument.close();

                // Show the download, embed, and preview buttons
                if (downloadButton) downloadButton.style.display = 'inline-block';
                if (embedButton) embedButton.style.display = 'inline-block';
                if (previewButton) previewButton.style.display = 'inline-block';
            } else {
                throw new Error('Invalid data received from the API');
            }
        })
        .catch(error => {
            console.error('Error fetching or displaying code:', error);
            const iframeDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write("<p>An error occurred. Please try again.</p>");
            iframeDocument.write("<p>Error: " + error.message + "</p>"); // Display error message
            iframeDocument.close();
        });
    });

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            download('generated.html', generatedHTML);
        });
    }

    if (embedButton) {
        embedButton.addEventListener('click', () => {
            const embedCodeHTML = `<iframe srcdoc="${generatedHTML.replace(/"/g, '&quot;')}" width="100%" height="500" frameborder="0"></iframe>`;
            if (embedCode) embedCode.value = embedCodeHTML;
            if (embedCodeContainer) embedCodeContainer.style.display = 'block';
        });
    }

    if (previewButton) {
        previewButton.addEventListener('click', () => {
            const newTab = window.open();
            newTab.document.open();
            newTab.document.write(generatedHTML);
            newTab.document.close();
        });
    }
});