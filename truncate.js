// Cross-browser API alias
typeof browser !== 'undefined' ? null : (window.browser = chrome);
const API = browser;

const DEFAULT_LIMIT = 60;
let currentLimit = DEFAULT_LIMIT;
let enabled = true;
let debounceId;

API.storage.sync.get(["messageLimit", "enabled"]).then(cfg => {
  currentLimit = cfg.messageLimit || DEFAULT_LIMIT;
  enabled = cfg.enabled !== false;
  prune();
});

API.runtime.onMessage.addListener(msg => {
  if (msg.type === 'UPDATE_LIMIT') { currentLimit = msg.value; prune(); }
  if (msg.type === 'TOGGLE_ENABLED') { enabled = msg.value; prune(); }
});

const main = document.querySelector('main');
const observer = new MutationObserver(() => {
  clearTimeout(debounceId);
  debounceId = setTimeout(prune, 250);
});
observer.observe(main, { childList: true, subtree: true });

function prune() {
  if (!enabled) return;

  const turns = Array.from(main.querySelectorAll('[data-testid="conversation-turn"]'));
  if (turns.length <= currentLimit) return;

  const excess = turns.length - currentLimit;
  for (let i = 0; i < excess; i++) {
    if (turns[i] && turns[i].isConnected) {
      turns[i].remove();
    }
  }
}