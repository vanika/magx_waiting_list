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
        alert('Per favore inserisci il tuo indirizzo email');
        return;
    }

    if (!validateEmail(email)) {
        alert('Per favore inserisci un indirizzo email valido');
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
        alert(`Hai raggiunto il massimo di ${MAX_IDS} occhiali. Invia gli occhiali che hai già aggiunto e poi puoi aggiungerne altri.`);
        return;
    }

    if (glassesIds.has(id)) {
        alert('Questo occhiale è già stato aggiunto');
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
        alert('Occhiali inviati con successo!');
        glassesIds.clear();
        idsList.innerHTML = '';
        updateSubmitButton();
    })
    .catch(error => {
        alert('Errore nell\'invio dei codici. Per favore riprova.');
        console.error('Errore:', error);
    });
}

// Function to handle barcode scanner input
function handleBarcodeInput(event) {
    // Only process if we're in the glasses section
    if (glassesSection.style.display === 'none') {
        return;
    }

    // If Enter is pressed, add the current input value
    if (event.key === 'Enter') {
        const id = glassesIdInput.value.trim();
        if (id) {
            addGlassesId();
        }
    }
}

emailButton.addEventListener('click', handleEmailSubmit);
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleEmailSubmit();
    }
});

addButton.addEventListener('click', addGlassesId);
glassesIdInput.addEventListener('keypress', handleBarcodeInput);
submitButton.addEventListener('click', submitIds);

// Remove the old barcode event listener
document.removeEventListener('keydown', handleBarcodeInput); 