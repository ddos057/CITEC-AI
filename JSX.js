const input = document.getElementById('searchInput');
const responseContainer = document.getElementById('responseContainer');
const archiveBtn = document.getElementById('archiveBtn');
const profileBtn = document.getElementById('profileBtn');
const settingsBtn = document.getElementById('settingsBtn');
const guideBtn = document.getElementById('guideBtn');
const sidebar = document.getElementById('sidebar');
const archiveList = document.getElementById('archiveList');
const profileModal = document.getElementById('profileModal');
const settingsModal = document.getElementById('settingsModal');
const guideModal = document.getElementById('guideModal');

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });
});

// Sidebar & modal buttons
archiveBtn.onclick = () => {
    sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
};
profileBtn.onclick = () => profileModal.style.display = 'flex';
settingsBtn.onclick = () => settingsModal.style.display = 'flex';
guideBtn.onclick = () => guideModal.style.display = 'flex';

// Theme toggle
document.getElementById('toggleThemeBtn').onclick = () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
};

let archive = [];

function appendArchiveItem(query) {
    const li = document.createElement('li');
    li.textContent = query;
    archiveList.appendChild(li);
}

// ✅ Fixed AI send function
async function sendToAI(userQuery) {
    try {
        const response = await fetch("https://randeestroyer.app.n8n.cloud/webhook/be0fc336-8b1a-4f14-8062-09b1ebfd6407", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: userQuery })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log("AI response:", data);

        // ✅ Ensure it reads from the correct n8n key
        if (data.aiAnswer) return data.aiAnswer;
        if (data.reply) return data.reply;
        if (data.data) return data.data; // fallback if webhook returns "data"
        return "⚠️ No response received from AI.";

    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "⚠️ Error: Unable to connect to AI service.";
    }
}

// ✅ Handle Enter key to send query
input.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        const userQuery = input.value.trim();
        if (!userQuery) return;

        responseContainer.style.display = 'block';
        input.value = '';

        // Save to archive
        archive.push(userQuery);
        archiveList.innerHTML = '';
        archive.forEach(q => appendArchiveItem(q));

        // Display user message + thinking message
        responseContainer.innerHTML = `
            <div class="message user"><span class="text">${userQuery}</span></div>
            <div class="message ai"><span class="text">Thinking...</span></div>
        `;

        // Get AI reply
        const aiAnswer = await sendToAI(userQuery);
        console.log("Chat will display:", aiAnswer);

        // ✅ Replace only the AI message, not the user message
        responseContainer.innerHTML = `
            <div class="message user"><span class="text">${userQuery}</span></div>
            <div class="message ai"><span class="text">${aiAnswer}</span></div>
        `;

        responseContainer.scrollTop = responseContainer.scrollHeight;
    }
});

// ✅ Profile save handler
document.getElementById('profileForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('profileUsername').value;
    const email = document.getElementById('profileEmail').value;
    alert(`Profile saved!\nUsername: ${username}\nEmail: ${email}`);
    profileModal.style.display = 'none';
};
