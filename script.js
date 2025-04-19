const MAX_IDS = 20;
const glassesIds = new Set();
const idsList = document.getElementById('idsList');
const glassesIdInput = document.getElementById('glassesId');
const addButton = document.getElementById('addButton');
const submitButton = document.getElementById('submitButton');
const emailInput = document.getElementById('emailInput');
const emailButton = document.getElementById('emailButton');
const emailSection = document.querySelector('.email-section');
const glassesSection = document.querySelector('.glasses-section');

let userEmail = '';

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function handleEmailSubmit() {
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    userEmail = email;
    emailSection.style.display = 'none';
    glassesSection.style.display = 'block';
}

function createIdItem(id) {
    const div = document.createElement('div');
    div.className = 'id-item';
    div.innerHTML = `
        <span>${id}</span>
        <span class="checkmark">✓</span>
        <button class="delete-btn" data-id="${id}">×</button>
    `;
    
    // Add delete functionality
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        glassesIds.delete(id);
        div.remove();
        updateSubmitButton();
    });
    
    return div;
}

function updateSubmitButton() {
    submitButton.disabled = glassesIds.size === 0;
}

function addGlassesId() {
    const id = glassesIdInput.value.trim();
    
    if (!id) {
        return;
    }

    if (glassesIds.size >= MAX_IDS) {
        alert(`Maximum of ${MAX_IDS} IDs reached`);
        return;
    }

    if (glassesIds.has(id)) {
        alert('This ID has already been added');
        return;
    }

    glassesIds.add(id);
    idsList.appendChild(createIdItem(id));
    glassesIdInput.value = '';
    updateSubmitButton();
}

function submitIds() {
    const idsArray = Array.from(glassesIds);
    console.log('Submitting IDs:', idsArray, 'for email:', userEmail);
    
    // Simulate API call
    fetch('/api/upload-ids', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            email: userEmail,
            ids: idsArray 
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('IDs submitted successfully!');
        glassesIds.clear();
        idsList.innerHTML = '';
        updateSubmitButton();
    })
    .catch(error => {
        alert('Error submitting IDs. Please try again.');
        console.error('Error:', error);
    });
}

emailButton.addEventListener('click', handleEmailSubmit);
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleEmailSubmit();
    }
});

addButton.addEventListener('click', addGlassesId);
glassesIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addGlassesId();
    }
});
submitButton.addEventListener('click', submitIds); 