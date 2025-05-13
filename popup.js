const API_POP = typeof browser !== 'undefined' ? browser : chrome;

const limitInput = document.getElementById('limit');
const saveBtn    = document.getElementById('save');
const savedLbl   = document.getElementById('saved');
const toggleChk  = document.getElementById('toggle');
const donateBtn  = document.getElementById('donate');

API_POP.storage.sync.get(["messageLimit", "enabled"]).then(cfg => {
  limitInput.value = cfg.messageLimit || 60;
  toggleChk.checked = cfg.enabled !== false;
});

saveBtn.onclick = () => {
  const val = Math.max(1, Math.min(1000, parseInt(limitInput.value, 10) || 60));
  API_POP.storage.sync.set({ messageLimit: val }).then(() => {
    savedLbl.textContent = 'Saved ✔';
    setTimeout(() => savedLbl.textContent = '', 1500);
    notifyTabs({ type: 'UPDATE_LIMIT', value: val });
  });
};

toggleChk.onchange = () => {
  const flag = toggleChk.checked;
  API_POP.storage.sync.set({ enabled: flag }).then(() => {
    notifyTabs({ type: 'TOGGLE_ENABLED', value: flag });
  });
};

donateBtn.onclick = () => {
  API_POP.tabs.create({ url: 'https://www.buymeacoffee.com/KyleQ1' });
};

function notifyTabs(msg) {
  API_POP.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    if (tabs[0]) API_POP.tabs.sendMessage(tabs[0].id, msg);
  });
}
