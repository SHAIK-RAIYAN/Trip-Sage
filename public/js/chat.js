const socket = io("/chat");
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

// Maintain conversation context
const context = [];

// Helper to append message bubbles
function appendMessage(text, fromUser = true) {
  const wrapper = document.createElement("div");
  wrapper.className = fromUser ? "msg-user" : "msg-agent";
  const bubble = document.createElement("div");
  bubble.className = `bubble ${fromUser ? "bubble-user" : "bubble-agent"}`;
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;

  // Display user message
  appendMessage(question, true);
  context.push({ role: "user", content: question });
  chatInput.value = "";

  // Send to server
  socket.emit("userMessage", { question, context });
});

// Listen for agent responses
socket.on("agentMessage", ({ answer }) => {
  appendMessage(answer, false);
  context.push({ role: "assistant", content: answer });
});
