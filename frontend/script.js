const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadForm = document.getElementById('uploadForm');
    const usernameInput = document.getElementById('username');
    const submitBtn = document.getElementById('submitBtn');
    const messageBox = document.getElementById('messageBox');

    let selectedFiles = [];

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }, false);

    // Clicking anywhere in the dropzone triggers file selection
    // (except the remove button, handled separately)
    dropZone.addEventListener('click', (e) => {
        if(e.target.tagName !== 'LABEL' && e.target.tagName !== 'INPUT') {
            fileInput.click();
        }
    });

    // File input change event
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;
        
        // Add new files to our array
        for (let i = 0; i < files.length; i++) {
            selectedFiles.push(files[i]);
        }
        
        // Reset file input so same file can be selected again
        fileInput.value = '';
        
        updateFileUI();
        validateForm();
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateFileUI();
        validateForm();
    }

    function updateFileUI() {
        fileList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'file-name';
            nameSpan.textContent = file.name;
            nameSpan.title = file.name; // Tooltip for long names
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'file-remove';
            removeBtn.innerHTML = '&times;';
            removeBtn.type = 'button';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                removeFile(index);
            };
            
            item.appendChild(nameSpan);
            item.appendChild(removeBtn);
            
            fileList.appendChild(item);
        });
    }

    function validateForm() {
        if (usernameInput.value.trim() !== '' && selectedFiles.length > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // Input event for username to validate form
    usernameInput.addEventListener('input', validateForm);

    function showMessage(msg, isError = false) {
        messageBox.textContent = msg;
        messageBox.className = 'message-box ' + (isError ? 'error' : 'success');
        messageBox.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    }

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        
        if (!username || selectedFiles.length === 0) {
            showMessage('Please provide a username and select files.', true);
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading...';

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(`Success! Uploaded ${selectedFiles.length} files.`);
                // Reset form
                selectedFiles = [];
                updateFileUI();
                usernameInput.value = '';
                validateForm();
            } else {
                showMessage(data.detail || 'Upload failed', true);
                validateForm(); // Re-enable button
            }
        } catch (error) {
            console.error('Upload Error:', error);
            showMessage('Network error or server is down. Make sure the backend is running.', true);
            validateForm(); // Re-enable button
        } finally {
            submitBtn.textContent = 'Upload Files';
        }
    });
});
