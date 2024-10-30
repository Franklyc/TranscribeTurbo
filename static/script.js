// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const html = document.documentElement;

function updateThemeIcons() {
    const isDark = html.classList.contains('dark');
    sunIcon.classList.toggle('hidden', !isDark);
    moonIcon.classList.toggle('hidden', isDark);
}

// Check for saved theme preference or system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}
updateThemeIcons();

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
    updateThemeIcons();
});



// Drag and Drop & File Handling
const dropZone = document.getElementById('dropZone');
const audioFile = document.getElementById('audioFile');
const audioPreview = document.getElementById('audioPreview');
const audioPlayer = document.getElementById('audioPlayer');
const selectedFileName = document.getElementById('selectedFileName');
const fileSize = document.getElementById('fileSize');

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropZone.classList.add('border-blue-600', 'bg-blue-50', 'dark:bg-gray-700');
}

function unhighlight() {
    dropZone.classList.remove('border-blue-600', 'bg-blue-50', 'dark:bg-gray-700');
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
}


function handleFileSelect(file) {
    if (file) {
        selectedFileName.textContent = file.name;
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const sizeText = fileSizeMB > 19.5
            ? `${fileSizeMB}MB (Will be split into chunks for processing)`
            : `${fileSizeMB}MB`;
        fileSize.textContent = `File size: ${sizeText}`;

        const url = URL.createObjectURL(file);
        audioPlayer.src = url;
        audioPreview.classList.remove('hidden');
        audioFile.files = [file]; // Ensure the file input is updated as well
    } else {
        selectedFileName.textContent = 'No file selected';
        fileSize.textContent = '';
        audioPreview.classList.add('hidden');
    }
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

dropZone.addEventListener('drop', handleDrop, false);
audioFile.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));



// Status Updates and Progress
const statusContainer = document.getElementById('statusContainer');
const statusText = document.getElementById('statusText');
const statusDetail = document.getElementById('statusDetail');
const processingProgress = document.getElementById('processingProgress');
const processingProgressBar = document.getElementById('processingProgressBar');
const processingProgressText = document.getElementById('processingProgressText');
const uploadProgress = document.getElementById('uploadProgress');
const uploadProgressBar = document.getElementById('uploadProgressBar');
const uploadProgressText = document.getElementById('uploadProgressText');


function updateStatus(message, detail = '') {
    statusContainer.classList.remove('hidden');
    statusText.textContent = message;
    statusDetail.textContent = detail;
}

function updateProcessingProgress(current, total) {
    processingProgress.classList.remove('hidden');
    const percentage = (current / total * 100).toFixed(0);
    processingProgressBar.style.width = `${percentage}%`;
    processingProgressText.textContent = `Processing chunk ${current} of ${total}`;
}




// Transcription Result and Download/Copy
const resultContainer = document.getElementById('result');
const transcriptionText = document.getElementById('transcriptionText');
const timeline = document.getElementById('timeline');
const downloadButton = document.getElementById('downloadButton');
const copyButton = document.getElementById('copyButton');
const timelineView = document.getElementById('timelineView')


function createTimelineSegment(text, startTime, endTime, startSeconds) {
    const segment = document.createElement('div');
    segment.className = 'timeline-segment p-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
    segment.innerHTML = `
        <span class="text-sm text-gray-500 dark:text-gray-400">${startTime} - ${endTime}</span>
        <p class="text-gray-700 dark:text-gray-300">${text}</p>
    `;

    segment.addEventListener('click', () => {
        if (audioPlayer) {
            audioPlayer.currentTime = startSeconds;
            audioPlayer.play();
        }
    });

    return segment;
}

function showTranscription(text, segments = []) {
    transcriptionText.textContent = text;
    resultContainer.classList.remove('hidden');

    timeline.innerHTML = '';

    if (segments.length > 0) {
        segments.forEach(segment => {
            const timelineSegment = createTimelineSegment(
                segment.text,
                new Date(segment.start * 1000).toISOString().substr(11, 8),
                new Date(segment.end * 1000).toISOString().substr(11, 8),
                segment.start
            );
            timeline.appendChild(timelineSegment);
        });
        timelineView.classList.remove('hidden');
    } else {
        timelineView.classList.add('hidden');
    }

    setTimeout(() => {
        resultContainer.classList.add('show');
    }, 10);

    downloadButton.onclick = function () {
        const blob = new Blob([text], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcription.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    copyButton.onclick = function () {
        navigator.clipboard.writeText(text).then(function () {
            alert('Transcription copied to clipboard!');
        }).catch(function (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please try selecting and copying manually.');
        });
    };
}


// Form Submission and API Call
const uploadForm = document.getElementById('uploadForm');
const languageSelect = document.getElementById('language');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const file = audioFile.files[0];
    const language = languageSelect.value;

    if (!file) {
        alert('Please select an audio file');
        return;
    }


    resultContainer.classList.remove('show');
    resultContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    statusContainer.classList.remove('hidden');
    processingProgress.classList.add('hidden');
    uploadProgress.classList.remove('hidden');


    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    try {
        updateStatus('Uploading audio file...', 'This may take a moment');

        const response = await fetch('/transcribe', {
            method: 'POST',
            body: formData,
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                uploadProgressBar.style.width = percentCompleted + '%';
                uploadProgressText.textContent = percentCompleted + '%';
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'An error occurred during transcription');
        }

        if (data.error) {
            throw new Error(data.error);
        }

        updateStatus('Processing complete', data.status);

        showTranscription(data.text, data.segments || []);


        setTimeout(() => {
            statusContainer.classList.add('hidden');
            uploadProgress.classList.add('hidden');
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        errorMessage.classList.remove('hidden');
        errorText.textContent = error.message;
        statusContainer.classList.add('hidden');
        uploadProgress.classList.add('hidden');
    }
});