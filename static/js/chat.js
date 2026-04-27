document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("userInput").addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });
});

function sendMessage() {
    const inputEl = document.getElementById("userInput");
    const userText = inputEl.value.trim();
    if (!userText) return;

    appendMessage(userText, "user-message");
    inputEl.value = "";
    inputEl.disabled = true;
    document.getElementById("sendBtn").disabled = true;

    const typingId = showTypingIndicator();

    fetch("/get", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "msg=" + encodeURIComponent(userText),
    })
        .then(function (response) {
            if (!response.ok) throw new Error("Server error: " + response.status);
            return response.text();
        })
        .then(function (botReply) {
            removeTypingIndicator(typingId);
            appendMessage(botReply, "bot-message");
        })
        .catch(function (error) {
            removeTypingIndicator(typingId);
            appendMessage("Sorry, something went wrong. Please try again.", "bot-message");
            console.error("Chat error:", error);
        })
        .finally(function () {
            inputEl.disabled = false;
            document.getElementById("sendBtn").disabled = false;
            inputEl.focus();
        });
}

function appendMessage(text, cssClass) {
    const chatbox = document.getElementById("chatbox");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", cssClass);
    msgDiv.innerText = text;
    chatbox.appendChild(msgDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const chatbox = document.getElementById("chatbox");
    const indicator = document.createElement("div");
    const id = "typing-" + Date.now();
    indicator.id = id;
    indicator.classList.add("message", "bot-message", "typing-indicator");
    indicator.innerText = "Thinking...";
    chatbox.appendChild(indicator);
    scrollToBottom();
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    const chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
}
