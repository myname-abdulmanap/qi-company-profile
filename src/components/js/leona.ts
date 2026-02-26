/**
 * leona.ts
 * Script untuk Leona AI chatbot widget.
 * Menggunakan pola yang sama dengan header.ts agar tetap jalan saat View Transitions.
 */

// ---- Session & History Persistence ----
const STORAGE_SESSION_KEY = "leona_session_id";
const STORAGE_HISTORY_KEY = "leona_chat_history";
const MAX_HISTORY = 50;

interface ChatMessage {
  text: string;
  isUser: boolean;
}

function getSessionId(): number {
  const stored = sessionStorage.getItem(STORAGE_SESSION_KEY);
  if (stored) return parseInt(stored, 10);
  const newId = Math.floor(Math.random() * 1_000_000);
  sessionStorage.setItem(STORAGE_SESSION_KEY, String(newId));
  return newId;
}

function loadHistory(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: ChatMessage[]) {
  const trimmed = history.slice(-MAX_HISTORY);
  sessionStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(trimmed));
}

// ---- Leona Chat Functions (module-level for removeEventListener) ----

let _togglePopup: (() => void) | null = null;
let _handleSubmit: ((e: Event) => void) | null = null;

const setupLeona = () => {
  const toggleBtn = document.getElementById("leona-toggle-btn");
  const closeBtn = document.getElementById("leona-close-btn");
  const popup = document.getElementById("leona-popup");
  const form = document.getElementById("leona-form");
  const input = document.getElementById("leona-input") as HTMLInputElement | null;
  const messagesContainer = document.getElementById("leona-messages");
  const quickBtns = document.querySelectorAll(".leona-quick-btn");

  if (!toggleBtn || !popup) return;

  const chatIcon = toggleBtn.querySelector(".chat-icon");
  const closeIcon = toggleBtn.querySelector(".close-icon");
  const helpBubble = document.querySelector(".leona-help-bubble") as HTMLElement | null;

  const sessionId = getSessionId();

  // Reset chat to welcome state
  function resetChatToWelcome() {
    const allMessages = messagesContainer?.querySelectorAll(".leona-message");
    const quickActions = messagesContainer?.querySelector(".leona-quick-actions");

    allMessages?.forEach((msg, index) => {
      if (index === 0) {
        (msg as HTMLElement).style.display = "";
      } else {
        msg.remove();
      }
    });

    if (quickActions) (quickActions as HTMLElement).style.display = "";
    document.getElementById("leona-typing")?.remove();
    sessionStorage.removeItem(STORAGE_HISTORY_KEY);
  }

  // Toggle popup
  function togglePopup() {
    const isHidden = popup?.classList.contains("hidden");

    if (isHidden) {
      resetChatToWelcome();
      popup?.classList.remove("hidden");
      chatIcon?.classList.add("hidden");
      closeIcon?.classList.remove("hidden");
      if (helpBubble) helpBubble.style.display = "none";
      input?.focus();
    } else {
      popup?.classList.add("hidden");
      chatIcon?.classList.remove("hidden");
      closeIcon?.classList.add("hidden");
      if (helpBubble) helpBubble.style.display = "block";
    }
  }

  function addMessage(text: string, isUser: boolean = false, persist: boolean = true) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `leona-message ${isUser ? "leona-user" : "leona-bot"}`;

    let avatarHtml: string;
    if (isUser) {
      avatarHtml = `<div class="leona-message-avatar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`;
    } else {
      avatarHtml = `<div class="leona-message-avatar"><img src="/assets/img/leona.png" alt="Leona" /></div>`;
    }

    messageDiv.innerHTML = `
      ${avatarHtml}
      <div class="leona-message-content"><p>${text}</p></div>
    `;

    messagesContainer?.appendChild(messageDiv);
    messagesContainer?.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });

    if (persist) {
      const history = loadHistory();
      history.push({ text, isUser });
      saveHistory(history);
    }
  }

  function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "leona-message leona-bot";
    typingDiv.id = "leona-typing";
    typingDiv.innerHTML = `
      <div class="leona-message-content">
        <div class="leona-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messagesContainer?.appendChild(typingDiv);
    messagesContainer?.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });
  }

  function removeTyping() {
    document.getElementById("leona-typing")?.remove();
  }

  async function sendToLeona(userMessage: string): Promise<string> {
    const LEONA_URL = "https://n8n.thinkshub.cloud/webhook/leona";
    const LEONA_KEY = "Yx14Dfqit7GuYxi7";

    try {
      const res = await fetch(LEONA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": LEONA_KEY,
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage.trim(),
        }),
      });

      if (!res.ok) {
        console.error(`[Leona] HTTP ${res.status}`);
        return "Chatbot sedang tidak tersedia. Silakan coba lagi nanti.";
      }

      const data = await res.json();
      return (
        data.output ||
        data.response ||
        data.message ||
        data.text ||
        "Maaf, saya tidak bisa memproses permintaan Anda saat ini."
      );
    } catch (err) {
      console.error("[Leona] Request failed:", err);
      return "Chatbot sedang tidak tersedia. Silakan coba lagi nanti.";
    }
  }

  async function handleSend(message: string) {
    if (!message.trim()) return;

    const welcomeMsg = messagesContainer?.querySelector(".leona-message.leona-bot");
    const quickActions = messagesContainer?.querySelector(".leona-quick-actions");
    if (welcomeMsg) (welcomeMsg as HTMLElement).style.display = "none";
    if (quickActions) (quickActions as HTMLElement).style.display = "none";

    addMessage(message, true);
    if (input) input.value = "";
    showTyping();

    const response = await sendToLeona(message);

    removeTyping();
    addMessage(response, false);
  }

  // --- Remove old listeners to prevent duplicates (like header.ts pattern) ---
  if (_togglePopup) {
    toggleBtn.removeEventListener("click", _togglePopup);
    closeBtn?.removeEventListener("click", _togglePopup);
  }
  if (_handleSubmit) {
    form?.removeEventListener("submit", _handleSubmit);
  }

  // --- Create new listeners ---
  _togglePopup = togglePopup;
  _handleSubmit = (e: Event) => {
    e.preventDefault();
    const message = input?.value.trim();
    if (!message) return;
    handleSend(message);
  };

  // --- Attach listeners ---
  toggleBtn.addEventListener("click", _togglePopup);
  closeBtn?.addEventListener("click", _togglePopup);
  form?.addEventListener("submit", _handleSubmit);

  quickBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const message = btn.getAttribute("data-message");
      if (message) handleSend(message);
    });
  });
};

// Run on initial page load
document.addEventListener("DOMContentLoaded", setupLeona);

// Re-run after Astro View Transitions (same pattern as header.ts)
document.addEventListener("astro:after-swap", setupLeona);
