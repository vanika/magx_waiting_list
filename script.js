const MAX_IDS = 20;
const glassesIds = new Set();
const idsList = document.getElementById('idsList');
const glassesIdInput = document.getElementById('glassesId');
const addButton = document.getElementById('addButton');
const submitButton = document.getElementById('submitButton');
const emailInput = document.getElementById('emailInput');
const nameInput = document.getElementById('nameInput');
const pivaInput = document.getElementById('pivaInput');
const phoneInput = document.getElementById('phoneInput');
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
    const name = nameInput.value.trim();
    const piva = pivaInput.value.trim();
    const phone = phoneInput.value.trim();
    
    if (!email || !name || !piva || !phone) {
        alert('Per favore compila tutti i campi');
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
    
    const result = document.getElementById('result');
    result.style.display = 'block';
    result.innerHTML = "Please wait...";
    result.classList.remove("text-green-500", "text-red-500");
    result.classList.add("text-gray-500");

    const formData = {
        access_key: "1324ef6d-2a8b-4173-b9d2-5e7544d86d58",
        email: userEmail,
        name: nameInput.value.trim(),
        piva: pivaInput.value.trim(),
        phone: phoneInput.value.trim(),
        glasses_ids: idsArray
    };

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            result.innerHTML = json.message;
            result.classList.remove("text-gray-500");
            result.classList.add("text-green-500");
            glassesIds.clear();
            idsList.innerHTML = '';
            updateSubmitButton();
        } else {
            console.log(response);
            result.innerHTML = json.message;
            result.classList.remove("text-gray-500");
            result.classList.add("text-red-500");
        }
    })
    .catch((error) => {
        console.log(error);
        result.innerHTML = "Errore nell\'invio dei codici. Per favore riprova.";
        result.classList.remove("text-gray-500");
        result.classList.add("text-red-500");
    })
    .then(function () {
        setTimeout(() => {
            result.style.display = "none";
        }, 5000);
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