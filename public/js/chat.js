const socket = io("/chat", { transports: ["websocket"] });
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatButton = chatForm.querySelector("button");

// Maintain conversation context
const context = [];

// Inject trip context from session
const tripData = window.__tripData__;
const itinerarySummary = window.__itineraryMarkdown__;

if (tripData && itinerarySummary) {
  context.push({
    role: "user",
    content: `I'm planning a trip from ${tripData.source} to ${
      tripData.destination
    } from ${tripData.startDate} to ${tripData.endDate} for ${
      tripData.travelers
    } traveler(s), with a budget of ₹${
      tripData.budget
    }. I'm interested in ${tripData.interests.join(
      ", "
    )}. Can you suggest a good plan?`,
  });

  context.push({
    role: "assistant",
    content: `Sure! Here's the travel plan I generated for the user:\n\n${itinerarySummary}`,
  });
}

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

let isWaitingForResponse = false;

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (isWaitingForResponse) return;
  const question = chatInput.value.trim();
  if (!question) return;

  // Display user message
  appendMessage(question, true);
  context.push({ role: "user", content: question });
  chatInput.value = "";
  chatInput.disabled = true;
  chatButton.disabled = true;
  isWaitingForResponse = true;

  // Send to server
  socket.emit("userMessage", { question, context });
});

// Listen for agent responses
socket.on("agentMessage", ({ answer }) => {
  appendMessage(answer, false);
  context.push({ role: "assistant", content: answer });
  chatInput.disabled = false;
  chatButton.disabled = false;
  chatInput.focus();
  isWaitingForResponse = false;
});
