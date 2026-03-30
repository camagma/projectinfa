const screens = {
  login: document.getElementById("screen-login"),
  dashboard: document.getElementById("screen-dashboard"),
  draw: document.getElementById("screen-draw"),
  editor: document.getElementById("screen-editor"),
  result: document.getElementById("screen-result"),
};

const loginBtn = document.getElementById("login-btn");
const authLogin = document.getElementById("auth-login");
const authPassword = document.getElementById("auth-password");
const authConfirm = document.getElementById("auth-confirm");
const authConfirmWrap = document.getElementById("auth-confirm-wrap");
const authMessage = document.getElementById("auth-message");
const settingsModal = document.getElementById("settings-modal");
const drawer = document.getElementById("app-drawer");
const newProjectBtn = document.getElementById("new-project-btn");
const generateBtn = document.getElementById("generate-btn");
const toConfigureBtn = document.getElementById("to-configure");
const clearDrawBtn = document.getElementById("clear-draw");
const planUpload = document.getElementById("plan-upload");
const roomAreaEl = document.getElementById("room-area");
const saveProjectBtn = document.getElementById("save-project");
const newProjectResultBtn = document.getElementById("new-project");
const shapeGroup = document.getElementById("room-shape");
const shapeRect = document.getElementById("shape-rect");
const shapeSquare = document.getElementById("shape-square");
const rectWidthInput = document.getElementById("rect-width");
const rectHeightInput = document.getElementById("rect-height");
const squareSizeInput = document.getElementById("square-size");

const canvas = document.getElementById("room-canvas");
const ctx = canvas.getContext("2d");
const drawCanvas = document.getElementById("draw-canvas");
const drawCtx = drawCanvas ? drawCanvas.getContext("2d") : null;
const resultCanvas = document.getElementById("result-canvas");
const resultCtx = resultCanvas ? resultCanvas.getContext("2d") : null;

const widthInput = document.getElementById("room-width");
const heightInput = document.getElementById("room-height");
const widthVal = document.getElementById("room-width-val");
const heightVal = document.getElementById("room-height-val");
const furnitureList = document.getElementById("furniture-list");
const itemCount = document.getElementById("item-count");
const budgetInput = document.getElementById("budget-input");
const engineLabel = document.getElementById("engine-label");
const useGnnToggle = document.getElementById("use-gnn");
const furnitureTiles = document.getElementById("furniture-tiles");
const furnitureSearch = document.getElementById("furniture-search");
const selectAllBtn = document.getElementById("select-all");
const selectNoneBtn = document.getElementById("select-none");
const variantRow = document.getElementById("variant-row");
const resultList = document.getElementById("result-list");
const totalCostEl = document.getElementById("total-cost");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const projectList = document.getElementById("project-list");

const PIXELS_PER_M = 100;

const appState = {
  polygon: [],
  polygonClosed: false,
  doors: [],
  windows: [],
  bgImage: null,
  variants: [],
  selectedVariant: 0,
  shapeMode: "custom",
};

const i18n = {
  ua: {
    login_tab: "Вхід",
    register_tab: "Реєстрація",
    login_label: "Логін",
    password_label: "Пароль",
    confirm_label: "Повторіть пароль",
    next_btn: "Далі",
    auth_missing: "Введіть логін і пароль.",
    auth_exists: "Користувач з таким логіном вже існує.",
    auth_short: "Пароль занадто короткий. Рекомендовано: ",
    auth_mismatch: "Паролі не співпадають.",
    auth_success: "Реєстрація успішна.",
    auth_bad: "Невірний логін або пароль.",
    menu_dashboard: "Головна",
    menu_draw: "Малювання",
    menu_configure: "Налаштування",
    menu_result: "Результат",
    menu_support: "Підтримка",
    settings_title: "Налаштування",
    support_title: "Підтримка / Допомога",
    support_phone: "Телефон",
    dashboard_title: "Почнімо новий проєкт",
    dashboard_subtitle: "Створи кімнату, задай стиль і отримай оптимальне планування.",
    create_room_btn: "Створити нову кімнату",
    continue_btn: "Продовжити створення",
    previous_works: "Ваші попередні роботи",
    draw_title: "Малювання кімнати",
    tools_title: "Інструменти",
    tool_wall: "• Стіна",
    tool_door: "• Двері",
    tool_window: "• Вікно",
    shape_title: "Форма кімнати",
    shape_rect: "• Прямокутна",
    shape_square: "• Квадратна",
    shape_custom: "• Своя форма",
    rect_width: "Ширина (м)",
    rect_height: "Висота (м)",
    square_size: "Сторона (м)",
    area_label: "Площа",
    area_unit: "м²",
    upload_plan: "Завантажити план",
    clear_btn: "Очистити",
    draw_hint: "Обери інструмент над полотном. Для стін: кліки по точках, подвійний клік — замкнути.",
    editor_title: "Створення кімнати",
    room_type_title: "Тип кімнати:",
    room_kitchen: "• Кухня",
    room_living: "• Вітальня",
    room_bedroom: "• Спальня",
    room_bathroom: "• Ванна",
    budget_label: "Бюджет",
    width_label: "Ширина (м)",
    height_label: "Висота (м)",
    create_btn: "Створити",
    generating: "Генерація...",
    style_title: "Оберіть стиль:",
    floor_title: "Покриття",
    wall_title: "Шпалери",
    furniture_title: "Меблі",
    search_placeholder: "Пошук меблів...",
    select_all: "Всі",
    select_none: "Очистити",
    items_label: "Предметів",
    source_label: "Джерело",
    editor_hint: "Перетягніть меблі або натисніть «Створити».",
    result_title: "Результат",
    variants_title: "Варіанти",
    list_title: "Список меблів",
    total_cost: "Загальна вартість",
    chat_title: "Чат",
    chat_placeholder: "Напиши запит...",
    send_btn: "Надіслати",
    save_btn: "Зберегти",
    new_room_btn: "Нова кімната",
    no_results: "Нічого не знайдено",
    project: "Проєкт",
    chat_empty: "Введіть повідомлення.",
    chat_plant: "Порада: додайте рослину біля вікна або в куті кімнати.",
    chat_style: "Спробуйте узгодити меблі за кольором і фактурою для цілісності стилю.",
    chat_light: "Додайте торшер або настільну лампу для зонального освітлення.",
    chat_default: "Готово! Можу допомогти з вибором меблів або стилю.",
  },
  en: {
    login_tab: "Login",
    register_tab: "Register",
    login_label: "Login",
    password_label: "Password",
    confirm_label: "Confirm password",
    next_btn: "Next",
    auth_missing: "Please enter login and password.",
    auth_exists: "User already exists.",
    auth_short: "Password is too short. Suggested: ",
    auth_mismatch: "Passwords do not match.",
    auth_success: "Registration successful.",
    auth_bad: "Invalid login or password.",
    menu_dashboard: "Home",
    menu_draw: "Draw",
    menu_configure: "Configure",
    menu_result: "Result",
    menu_support: "Support",
    settings_title: "Settings",
    support_title: "Support / Help",
    support_phone: "Phone",
    dashboard_title: "Start a new project",
    dashboard_subtitle: "Create a room, pick a style, and get an optimal layout.",
    create_room_btn: "Create a new room",
    continue_btn: "Continue",
    previous_works: "Your previous work",
    draw_title: "Draw a room",
    tools_title: "Tools",
    tool_wall: "• Wall",
    tool_door: "• Door",
    tool_window: "• Window",
    shape_title: "Room shape",
    shape_rect: "• Rectangular",
    shape_square: "• Square",
    shape_custom: "• Custom shape",
    rect_width: "Width (m)",
    rect_height: "Height (m)",
    square_size: "Side (m)",
    area_label: "Area",
    area_unit: "m²",
    upload_plan: "Upload plan",
    clear_btn: "Clear",
    draw_hint: "Pick a tool above the canvas. For walls: click points, double-click to close.",
    editor_title: "Room setup",
    room_type_title: "Room type:",
    room_kitchen: "• Kitchen",
    room_living: "• Living room",
    room_bedroom: "• Bedroom",
    room_bathroom: "• Bathroom",
    budget_label: "Budget",
    width_label: "Width (m)",
    height_label: "Height (m)",
    create_btn: "Generate",
    generating: "Generating...",
    style_title: "Choose a style:",
    floor_title: "Flooring",
    wall_title: "Wallpaper",
    furniture_title: "Furniture",
    search_placeholder: "Search furniture...",
    select_all: "All",
    select_none: "Clear",
    items_label: "Items",
    source_label: "Source",
    editor_hint: "Drag furniture or click “Generate”.",
    result_title: "Result",
    variants_title: "Variants",
    list_title: "Furniture list",
    total_cost: "Total cost",
    chat_title: "Chat",
    chat_placeholder: "Type a request...",
    send_btn: "Send",
    save_btn: "Save",
    new_room_btn: "New room",
    no_results: "No results",
    project: "Project",
    chat_empty: "Type a message.",
    chat_plant: "Tip: add a plant near a window or in a corner.",
    chat_style: "Try matching colors and materials for a cohesive style.",
    chat_light: "Add a floor or desk lamp for zoned lighting.",
    chat_default: "Done! I can help you choose furniture or style.",
  },
};

let currentLang = localStorage.getItem("lang") || "ua";
let currentTheme = localStorage.getItem("theme") || "dark";

function t(key) {
  return i18n[currentLang]?.[key] || key;
}

function applyLang() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.placeholder = t(key);
    }
  });
  if (generateBtn && !generateBtn.disabled) {
    generateBtn.textContent = t("create_btn");
  }
  drawDrawCanvas();
  renderTiles();
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  applyLang();
}

function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem("theme", theme);
  document.body.dataset.theme = theme;
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

function openSettings() {
  settingsModal?.classList.add("show");
}

function closeSettings() {
  settingsModal?.classList.remove("show");
}

function openDrawer() {
  drawer?.classList.add("show");
}

function closeDrawer() {
  drawer?.classList.remove("show");
}

let authMode = "login";
const MIN_PASSWORD = 6;

function setAuthMessage(text, type = "error") {
  if (!authMessage) return;
  authMessage.textContent = text;
  authMessage.classList.remove("error", "success");
  authMessage.classList.add(type);
}

function clearAuthMessage() {
  if (!authMessage) return;
  authMessage.textContent = "";
  authMessage.classList.remove("error", "success");
}

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.auth === mode);
  });
  if (authConfirmWrap) {
    authConfirmWrap.classList.toggle("show", mode === "register");
  }
  clearAuthMessage();
}

function getUsers() {
  const raw = localStorage.getItem("planning_users");
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users) {
  localStorage.setItem("planning_users", JSON.stringify(users));
}

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

async function hashPassword(password) {
  if (window.crypto && window.crypto.subtle) {
    const data = new TextEncoder().encode(password);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return btoa(password);
}

async function handleAuth() {
  const login = authLogin?.value.trim() || "";
  const password = authPassword?.value || "";
  const confirm = authConfirm?.value || "";
  if (!login || !password) {
    setAuthMessage(t("auth_missing"));
    return;
  }

  const users = getUsers();
  const key = login.toLowerCase();

  if (authMode === "register") {
    if (users[key]) {
      setAuthMessage(t("auth_exists"));
      return;
    }
    if (password.length < MIN_PASSWORD) {
      const suggestion = generatePassword(10);
      if (authPassword) authPassword.value = suggestion;
      if (authConfirm) authConfirm.value = suggestion;
      setAuthMessage(`${t("auth_short")}${suggestion}`);
      return;
    }
    if (password !== confirm) {
      setAuthMessage(t("auth_mismatch"));
      return;
    }
    const hash = await hashPassword(password);
    users[key] = { hash, createdAt: new Date().toISOString() };
    saveUsers(users);
    setAuthMessage(t("auth_success"), "success");
    switchScreen("dashboard");
    return;
  }

  if (!users[key]) {
    setAuthMessage(t("auth_bad"));
    return;
  }
  const hash = await hashPassword(password);
  if (users[key].hash !== hash) {
    setAuthMessage(t("auth_bad"));
    return;
  }
  clearAuthMessage();
  switchScreen("dashboard");
}

const furnitureDB = [
  {
    id: "ikea_klippan",
    name: "KLIPPAN 2-seat sofa",
    brand: "IKEA",
    category: "sofa",
    w: 1.8,
    h: 0.88,
    price_usd: 399,
    size_cm: "180×88",
    image:
      "https://www.ikea.com/jp/en/images/products/klippan-2-seat-sofa-vissle-green__1153145_pe885991_s5.jpg?f=u",
    source_url: "https://www.ikea.com/jp/en/p/klippan-2-seat-sofa-vissle-green-s99304267/",
    rooms: ["living"],
  },
  {
    id: "ikea_lack",
    name: "LACK coffee table",
    brand: "IKEA",
    category: "coffee_table",
    w: 0.9,
    h: 0.55,
    price_usd: 79,
    size_cm: "90×55",
    image:
      "https://www.ikea.com/mx/en/images/products/lack-coffee-table-black-brown__57540_pe163122_s5.jpg?f=s",
    source_url: "https://www.ikea.com/us/en/p/lack-coffee-table-white-80449901/",
    rooms: ["living", "kitchen"],
  },
  {
    id: "ikea_malm",
    name: "MALM bed frame (high)",
    brand: "IKEA",
    category: "bed",
    w: 2.09,
    h: 1.76,
    price_usd: 499,
    size_cm: "209×176",
    image:
      "https://www.ikea.com/om/en/images/products/malm-bed-frame-high-white__0749130_pe745499_s5.jpg?f=s",
    source_url: "https://www.ikea.com/om/en/p/malm-bed-frame-high-white-s09929373/",
    rooms: ["bedroom"],
  },
  {
    id: "ikea_billy",
    name: "BILLY bookcase",
    brand: "IKEA",
    category: "bookcase",
    w: 0.8,
    h: 0.28,
    price_usd: 129,
    size_cm: "80×28",
    image:
      "https://www.ikea.com/jp/en/images/products/billy-bookcase-oak-effect__1097086_pe864714_s5.jpg?f=u",
    source_url: "https://www.ikea.com/jp/en/p/billy-bookcase-oak-effect-60492783/",
    rooms: ["living", "bedroom", "office"],
  },
  {
    id: "jysk_hovslund",
    name: "HOVSLUND coffee table",
    brand: "JYSK",
    category: "coffee_table",
    w: 1.1,
    h: 0.6,
    price_usd: 159,
    size_cm: "110×60",
    image: "https://jysk.ge/upload/products/E2A645F190/62F73352D5D64271A9134C8514C079A8_3690398.jpg",
    source_url:
      "https://jysk.ge/en/product/%E1%83%A7%E1%83%90%E1%83%95%E1%83%98%E1%83%A1%20%E1%83%9B%E1%83%90%E1%83%92%E1%83%98%E1%83%93%E1%83%90%20HOVSLUND%2060x110%20%E1%83%A2%E1%83%9C%E1%83%94%20-%E1%83%AE%E1%83%98%E1%83%A1%20%E1%83%94%E1%83%A4%E1%83%B0%E1%83%94%E1%83%A5%E1%83%A2%E1%83%98%20CBA1760003/",
    rooms: ["living", "kitchen"],
  },
  {
    id: "jysk_abildro",
    name: "ABILDRO bed frame",
    brand: "JYSK",
    category: "bed",
    w: 2.0,
    h: 0.9,
    price_usd: 219,
    size_cm: "200×90",
    image: "https://jysk.ge/upload/products/AA736D00D4/87B119BDCB1F47A2B2965A1410777AF7_3600082.jpg",
    source_url: "https://jysk.ge/en/product/bed-frame-abildro-90x200-black-3600082/",
    rooms: ["bedroom"],
  },
  {
    id: "ikea_poang",
    name: "POÄNG armchair",
    brand: "IKEA",
    category: "armchair",
    w: 0.68,
    h: 0.82,
    price_usd: 135,
    size_cm: "68×82",
    image:
      "https://www.ikea.com/us/en/images/products/poaeng-armchair-birch-veneer-knisa-bright-orange__1382355_pe962262_s5.jpg?f=s",
    source_url:
      "https://www.ikea.com/us/en/p/poaeng-armchair-birch-veneer-knisa-bright-orange-s79575033/",
    rooms: ["living", "bedroom"],
  },
  {
    id: "ikea_micke",
    name: "MICKE desk",
    brand: "IKEA",
    category: "desk",
    w: 1.05,
    h: 0.5,
    price_usd: 129,
    size_cm: "105×50",
    image: "https://www.ikea.com/jp/en/images/products/micke-desk-white__0736018_pe740345_s5.jpg?f=s",
    source_url: "https://www.ikea.com/jp/en/p/micke-desk-white-80354276/",
    rooms: ["office", "bedroom"],
  },
  {
    id: "ikea_linnmon",
    name: "LINNMON / ADILS desk",
    brand: "IKEA",
    category: "desk",
    w: 1.0,
    h: 0.6,
    price_usd: 50,
    size_cm: "100×60",
    image:
      "https://www.ikea.com/us/en/images/products/linnmon-adils-desk-black-brown-white__1327991_pe944603_s5.jpg?f=s",
    source_url: "https://www.ikea.com/us/en/p/linnmon-adils-desk-black-brown-white-s29416367/",
    rooms: ["office", "bedroom"],
  },
  {
    id: "ikea_hemnes_dresser",
    name: "HEMNES 3-drawer dresser",
    brand: "IKEA",
    category: "dresser",
    w: 0.58,
    h: 0.79,
    price_usd: 180,
    size_cm: "58×79",
    image:
      "https://www.ikea.com/us/en/images/products/hemnes-3-drawer-dresser-dark-gray-stained__0895773_pe782416_s5.jpg?f=u",
    source_url:
      "https://www.ikea.com/us/en/p/hemnes-3-drawer-dresser-dark-gray-stained-90483471/",
    rooms: ["bedroom"],
  },
  {
    id: "ikea_kallax",
    name: "KALLAX shelf unit",
    brand: "IKEA",
    category: "bookcase",
    w: 1.47,
    h: 0.39,
    price_usd: 240,
    size_cm: "147×39",
    image:
      "https://www.ikea.com/us/en/images/products/kallax-shelf-unit-with-4-inserts-white__0644583_pe702802_s5.jpg?f=s",
    source_url: "https://www.ikea.com/us/en/p/kallax-shelf-unit-with-4-inserts-white-s39017486/",
    rooms: ["living", "bedroom", "office"],
  },
];

const extraFurniture = [
  { id: "sofa_2", name: "Sofa 2-seat", brand: "Generic", category: "sofa", w: 1.8, h: 0.9, price_usd: 450, size_cm: "180×90", rooms: ["living"] },
  { id: "sofa_3", name: "Sofa 3-seat", brand: "Generic", category: "sofa", w: 2.2, h: 0.95, price_usd: 620, size_cm: "220×95", rooms: ["living"] },
  { id: "sectional_l", name: "Sectional L", brand: "Generic", category: "sofa", w: 2.6, h: 1.9, price_usd: 980, size_cm: "260×190", rooms: ["living"] },
  { id: "armchair", name: "Armchair", brand: "Generic", category: "armchair", w: 0.9, h: 0.85, price_usd: 220, size_cm: "90×85", rooms: ["living"] },
  { id: "coffee_table", name: "Coffee Table", brand: "Generic", category: "coffee_table", w: 1.1, h: 0.6, price_usd: 120, size_cm: "110×60", rooms: ["living"] },
  { id: "tv_stand", name: "TV Stand", brand: "Generic", category: "tv_stand", w: 1.6, h: 0.4, price_usd: 180, size_cm: "160×40", rooms: ["living"] },
  { id: "bookshelf", name: "Bookshelf", brand: "Generic", category: "bookcase", w: 0.9, h: 0.35, price_usd: 160, size_cm: "90×35", rooms: ["living", "office"] },
  { id: "bed_queen", name: "Bed Queen", brand: "Generic", category: "bed", w: 2.0, h: 1.6, price_usd: 520, size_cm: "200×160", rooms: ["bedroom"] },
  { id: "bed_king", name: "Bed King", brand: "Generic", category: "bed", w: 2.1, h: 1.8, price_usd: 680, size_cm: "210×180", rooms: ["bedroom"] },
  { id: "nightstand", name: "Nightstand", brand: "Generic", category: "nightstand", w: 0.45, h: 0.4, price_usd: 60, size_cm: "45×40", rooms: ["bedroom"] },
  { id: "wardrobe", name: "Wardrobe", brand: "Generic", category: "wardrobe", w: 1.6, h: 0.6, price_usd: 430, size_cm: "160×60", rooms: ["bedroom"] },
  { id: "dresser", name: "Dresser", brand: "Generic", category: "dresser", w: 1.2, h: 0.5, price_usd: 210, size_cm: "120×50", rooms: ["bedroom"] },
  { id: "desk", name: "Desk", brand: "Generic", category: "desk", w: 1.4, h: 0.7, price_usd: 180, size_cm: "140×70", rooms: ["office"] },
  { id: "office_chair", name: "Office Chair", brand: "Generic", category: "chair", w: 0.65, h: 0.65, price_usd: 150, size_cm: "65×65", rooms: ["office"] },
  { id: "desk_lamp", name: "Desk Lamp", brand: "Generic", category: "lamp", w: 0.2, h: 0.2, price_usd: 30, size_cm: "20×20", rooms: ["office"] },
  { id: "dining_table_4", name: "Dining Table 4p", brand: "Generic", category: "dining_table", w: 1.4, h: 0.8, price_usd: 240, size_cm: "140×80", rooms: ["kitchen"] },
  { id: "dining_table_6", name: "Dining Table 6p", brand: "Generic", category: "dining_table", w: 1.8, h: 0.9, price_usd: 320, size_cm: "180×90", rooms: ["kitchen"] },
  { id: "dining_chair", name: "Dining Chair", brand: "Generic", category: "chair", w: 0.45, h: 0.5, price_usd: 60, size_cm: "45×50", rooms: ["kitchen"] },
  { id: "kitchen_base", name: "Kitchen Base Cabinet", brand: "Generic", category: "kitchen_cabinet", w: 0.8, h: 0.6, price_usd: 140, size_cm: "80×60", rooms: ["kitchen"] },
  { id: "kitchen_sink", name: "Sink Cabinet", brand: "Generic", category: "kitchen_cabinet", w: 0.8, h: 0.6, price_usd: 160, size_cm: "80×60", rooms: ["kitchen"] },
  { id: "fridge", name: "Refrigerator", brand: "Generic", category: "appliance", w: 0.7, h: 0.7, price_usd: 700, size_cm: "70×70", rooms: ["kitchen"] },
  { id: "stove", name: "Stove", brand: "Generic", category: "appliance", w: 0.6, h: 0.6, price_usd: 450, size_cm: "60×60", rooms: ["kitchen"] },
  { id: "shower", name: "Shower Cabin", brand: "Generic", category: "shower", w: 0.9, h: 0.9, price_usd: 420, size_cm: "90×90", rooms: ["bathroom"] },
  { id: "toilet", name: "Toilet", brand: "Generic", category: "toilet", w: 0.7, h: 0.4, price_usd: 180, size_cm: "70×40", rooms: ["bathroom"] },
  { id: "vanity", name: "Vanity", brand: "Generic", category: "vanity", w: 0.8, h: 0.5, price_usd: 220, size_cm: "80×50", rooms: ["bathroom"] },
  { id: "mirror", name: "Mirror", brand: "Generic", category: "mirror", w: 0.6, h: 0.05, price_usd: 50, size_cm: "60×5", rooms: ["bathroom"] },
  { id: "plant_small", name: "Plant Small", brand: "Generic", category: "plant", w: 0.35, h: 0.35, price_usd: 25, size_cm: "35×35", rooms: ["living", "bedroom"] },
  { id: "plant_big", name: "Plant Big", brand: "Generic", category: "plant", w: 0.6, h: 0.6, price_usd: 60, size_cm: "60×60", rooms: ["living"] },
  { id: "bench", name: "Bench", brand: "Generic", category: "bench", w: 1.2, h: 0.45, price_usd: 110, size_cm: "120×45", rooms: ["hall"] },
  { id: "shoe_rack", name: "Shoe Rack", brand: "Generic", category: "storage", w: 0.8, h: 0.3, price_usd: 70, size_cm: "80×30", rooms: ["hall"] },
  { id: "coat_rack", name: "Coat Rack", brand: "Generic", category: "storage", w: 0.6, h: 0.6, price_usd: 90, size_cm: "60×60", rooms: ["hall"] },
  { id: "side_table", name: "Side Table", brand: "Generic", category: "side_table", w: 0.5, h: 0.5, price_usd: 55, size_cm: "50×50", rooms: ["living", "bedroom"] },
  { id: "media_console", name: "Media Console", brand: "Generic", category: "tv_stand", w: 1.8, h: 0.45, price_usd: 220, size_cm: "180×45", rooms: ["living"] },
  { id: "crib", name: "Crib", brand: "Generic", category: "bed", w: 1.25, h: 0.7, price_usd: 230, size_cm: "125×70", rooms: ["bedroom"] },
  { id: "floor_lamp", name: "Floor Lamp", brand: "Generic", category: "lamp", w: 0.3, h: 0.3, price_usd: 85, size_cm: "30×30", rooms: ["living", "bedroom", "office"] },
  { id: "wall_shelf", name: "Wall Shelf", brand: "Generic", category: "bookcase", w: 0.8, h: 0.25, price_usd: 70, size_cm: "80×25", rooms: ["living", "bedroom"] },
  { id: "bar_stool", name: "Bar Stool", brand: "Generic", category: "chair", w: 0.4, h: 0.4, price_usd: 45, size_cm: "40×40", rooms: ["kitchen"] },
  { id: "kitchen_island", name: "Kitchen Island", brand: "Generic", category: "kitchen_cabinet", w: 1.2, h: 0.8, price_usd: 320, size_cm: "120×80", rooms: ["kitchen"] },
];

extraFurniture.forEach((item) => furnitureDB.push(item));

const furnitureMap = new Map(furnitureDB.map((item) => [item.id, item]));
const selectedSet = new Set();
const imageCache = new Map();
let lastScene = null;
const planIcons = {
  bed: "assets/furniture/bed.svg",
  sofa: "assets/furniture/sofa.svg",
  armchair: "assets/furniture/chair.svg",
  coffee_table: "assets/furniture/table.svg",
  dining_table: "assets/furniture/table.svg",
  chair: "assets/furniture/chair.svg",
  bookcase: "assets/furniture/shelf.svg",
  desk: "assets/furniture/desk.svg",
  dresser: "assets/furniture/dresser.svg",
  wardrobe: "assets/furniture/dresser.svg",
  tv_stand: "assets/furniture/table.svg",
  side_table: "assets/furniture/table.svg",
  kitchen_cabinet: "assets/furniture/dresser.svg",
  appliance: "assets/furniture/dresser.svg",
  shower: "assets/furniture/dresser.svg",
  toilet: "assets/furniture/dresser.svg",
  vanity: "assets/furniture/dresser.svg",
  mirror: "assets/furniture/mirror.svg",
  plant: "assets/furniture/plant.svg",
  lamp: "assets/furniture/lamp.svg",
  bench: "assets/furniture/table.svg",
  storage: "assets/furniture/shelf.svg",
};

const categoryWeights = {
  living: {
    sofa: 4,
    armchair: 2.5,
    tv_stand: 2.5,
    coffee_table: 2,
    plant: 1,
    bookcase: 1.4,
    side_table: 1.2,
    lamp: 1,
  },
  bedroom: {
    bed: 4.5,
    wardrobe: 3,
    chair: 1.2,
    plant: 0.8,
    bookcase: 1.2,
    dresser: 2,
    nightstand: 2,
    mirror: 1.1,
    lamp: 1,
  },
  kitchen: { dining_table: 3, chair: 2, kitchen_cabinet: 4, appliance: 3.5, coffee_table: 1.4 },
  bathroom: { shower: 4, toilet: 3.5, vanity: 3, mirror: 1.5 },
  office: { desk: 4, chair: 3.5, bookcase: 2, lamp: 1 },
  hall: { bench: 2.5, storage: 3, side_table: 1 },
};

function switchScreen(target, push = true) {
  Object.values(screens).forEach((screen) => screen && screen.classList.remove("active"));
  if (screens[target]) {
    screens[target].classList.add("active");
  }
  if (push) {
    history.pushState({ screen: target }, "", `#${target}`);
  }
}

function registerToggleGroup(selector, itemSelector, onChange) {
  document.querySelectorAll(selector).forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest(itemSelector);
      if (!button) return;
      group.querySelectorAll(itemSelector).forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (onChange) {
        onChange();
      }
    });
  });
}

registerToggleGroup(".pill-group", ".pill", () => renderTiles());
registerToggleGroup(".style-list", ".style-card");
registerToggleGroup(".material-row", ".material-swatch");
registerToggleGroup("#draw-tool", ".pill");

loginBtn?.addEventListener("click", () => {
  handleAuth();
});
newProjectBtn?.addEventListener("click", () => switchScreen("draw"));

widthInput?.addEventListener("input", () => (widthVal.textContent = widthInput.value));
heightInput?.addEventListener("input", () => (heightVal.textContent = heightInput.value));

function getActiveValue(groupId) {
  const group = document.getElementById(groupId);
  const active = group ? group.querySelector(".active") : null;
  return active ? active.dataset.value : "";
}

function getBudgetValue() {
  if (!budgetInput) return 0;
  const value = parseFloat(budgetInput.value);
  return Number.isFinite(value) ? value : 0;
}

function formatPrice(item) {
  if (!item.price_usd || item.price_usd <= 0) {
    return "";
  }
  return `$${item.price_usd}`;
}

function recommendFurniture(roomType, limit = 8) {
  const weights = categoryWeights[roomType] || {};
  const ranked = furnitureDB
    .map((item) => ({
      ...item,
      score: (weights[item.category] || 0.5) + Math.random() * 0.2,
    }))
    .sort((a, b) => b.score - a.score);
  const budget = getBudgetValue();
  if (!budget || budget <= 0) {
    return ranked.slice(0, limit);
  }
  const picked = [];
  let total = 0;
  ranked.forEach((item) => {
    const price = item.price_usd || 0;
    if (picked.length >= limit) return;
    if (total + price <= budget || price === 0) {
      picked.push(item);
      total += price;
    }
  });
  return picked.length ? picked : ranked.slice(0, limit);
}

function placeItems(room, items, seed = 0) {
  const placements = [];
  const step = 0.25;
  const rng = mulberry32(seed + 1);

  function intersects(a, b) {
    return !(
      a.x + a.w <= b.x ||
      b.x + b.w <= a.x ||
      a.y + a.h <= b.y ||
      b.y + b.h <= a.y
    );
  }

  items
    .slice()
    .sort((a, b) => (b.w * b.h - a.w * a.h) + (rng() - 0.5) * 0.05)
    .forEach((item) => {
      let best = null;
      for (let x = 0; x <= room.w - item.w; x += step) {
        for (let y = 0; y <= room.h - item.h; y += step) {
          const rect = { x, y, w: item.w, h: item.h };
          if (placements.some((p) => intersects(rect, p))) continue;
          const wallDist = Math.min(x, y, room.w - (x + item.w), room.h - (y + item.h));
          const score =
            (categoryWeights[room.type]?.[item.category] || 1) +
            (item.category === "sofa" || item.category === "bed" ? 2 - wallDist : 1);
          if (!best || score > best.score) {
            best = { ...rect, score, id: item.id };
          }
        }
      }
      if (best) placements.push(best);
    });
  return placements;
}

function drawLayout(targetCanvas, targetCtx, room, items, placements) {
  targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  const padding = 30;
  const scale = Math.min(
    (targetCanvas.width - padding * 2) / room.w,
    (targetCanvas.height - padding * 2) / room.h
  );

  const origin = { x: padding, y: padding };
  targetCtx.strokeStyle = "#3b3b46";
  targetCtx.lineWidth = 2;
  targetCtx.strokeRect(origin.x, origin.y, room.w * scale, room.h * scale);

  placements.forEach((p, idx) => {
    const item = items.find((it) => it.id === p.id);
    const x = origin.x + p.x * scale;
    const y = origin.y + p.y * scale;
    const w = p.w * scale;
    const h = p.h * scale;
    const baseAlpha = 0.12 + idx * 0.03;
    targetCtx.fillStyle = `rgba(34, 197, 94, ${baseAlpha})`;
    targetCtx.strokeStyle = "rgba(34, 197, 94, 0.7)";
    targetCtx.lineWidth = 1.5;
    targetCtx.fillRect(x, y, w, h);
    targetCtx.strokeRect(x, y, w, h);

    const imageUrl = item?.plan_image || (item?.category ? planIcons[item.category] : null) || item?.image;
    if (imageUrl) {
      const cached = imageCache.get(imageUrl);
      if (cached?.loaded) {
        targetCtx.save();
        targetCtx.beginPath();
        targetCtx.rect(x + 2, y + 2, w - 4, h - 4);
        targetCtx.clip();
        targetCtx.drawImage(cached.img, x + 2, y + 2, w - 4, h - 4);
        targetCtx.restore();
      } else if (!cached) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        imageCache.set(imageUrl, { img, loaded: false });
        img.onload = () => {
          const entry = imageCache.get(imageUrl);
          if (entry) {
            entry.loaded = true;
          }
          if (lastScene) {
            drawLayout(lastScene.canvas, lastScene.ctx, lastScene.room, lastScene.items, lastScene.placements);
          }
          if (appState.variants.length) {
            renderVariants(appState.variants, appState.variantItems, appState.variantRoom);
          }
        };
        img.src = imageUrl;
      }
    }

    targetCtx.fillStyle = "#cddcda";
    targetCtx.font = "11px JetBrains Mono";
    targetCtx.fillText(item?.name || p.id, x + 6, y + 14);
  });
}

function draw(room, items, placements) {
  if (!canvas) return;
  lastScene = { canvas, ctx, room, items, placements };
  drawLayout(canvas, ctx, room, items, placements);
}

function drawResult(room, items, placements) {
  if (!resultCanvas) return;
  lastScene = { canvas: resultCanvas, ctx: resultCtx, room, items, placements };
  drawLayout(resultCanvas, resultCtx, room, items, placements);
}

function renderFurniture(items) {
  if (furnitureList) {
    furnitureList.innerHTML = "";
  }
  items.forEach((item) => {
    if (furnitureList) {
      const row = document.createElement("div");
      row.className = "f-item";
      const sizeLabel = item.size_cm
        ? `${item.size_cm} см`
        : `${item.w.toFixed(2)} м × ${item.h.toFixed(2)} м`;
      row.innerHTML = `<div><strong>${item.name}</strong><br/>${item.brand || ""} · ${sizeLabel}</div><span>${formatPrice(item)}</span>`;
      furnitureList.appendChild(row);
    }
  });
  itemCount.textContent = selectedSet.size.toString();
}

function renderResult(items) {
  if (!resultList) return;
  resultList.innerHTML = "";
  let total = 0;
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "result-item";
    row.innerHTML = `<strong>${item.name}</strong><span>${formatPrice(item)}</span>`;
    resultList.appendChild(row);
    total += item.price_usd || 0;
  });
  if (totalCostEl) {
    totalCostEl.textContent = `$${total}`;
  }
}

function getVisibleFurniture() {
  const query = furnitureSearch ? furnitureSearch.value.trim().toLowerCase() : "";
  const roomType = getActiveValue("room-type");
  return furnitureDB
    .filter((item) => {
      const haystack = `${item.name} ${item.brand || ""} ${item.category}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesQuery;
    })
    .sort((a, b) => {
      const aScore = roomType && a.rooms && a.rooms.includes(roomType) ? 1 : 0;
      const bScore = roomType && b.rooms && b.rooms.includes(roomType) ? 1 : 0;
      return bScore - aScore;
    });
}

function renderTiles() {
  furnitureTiles.innerHTML = "";
  const visible = getVisibleFurniture();
  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "tile-empty";
    empty.textContent = t("no_results");
    furnitureTiles.appendChild(empty);
    itemCount.textContent = selectedSet.size.toString();
    return;
  }
  visible.forEach((item) => {
    const tile = document.createElement("div");
    tile.className = "furniture-tile";
    if (selectedSet.has(item.id)) {
      tile.classList.add("selected");
    }
    tile.dataset.id = item.id;

    const icon = document.createElement("div");
    icon.className = "tile-icon";
    if (item.image) {
      icon.style.backgroundImage = `url("${item.image}")`;
      icon.style.backgroundSize = "cover";
      icon.style.backgroundRepeat = "no-repeat";
      icon.style.backgroundPosition = "center";
    } else if (planIcons[item.category]) {
      icon.style.backgroundImage = `url("${planIcons[item.category]}")`;
      icon.style.backgroundSize = "contain";
      icon.style.backgroundRepeat = "no-repeat";
      icon.style.backgroundPosition = "center";
      icon.style.backgroundColor = "#16161d";
    }

    const name = document.createElement("div");
    name.className = "tile-name";
    name.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "tile-meta";
    const sizeLabel = item.size_cm ? `${item.size_cm} см` : `${item.w}×${item.h} м`;
    meta.textContent = `${item.brand || ""}${item.brand ? " · " : ""}${sizeLabel}`;

    const price = document.createElement("div");
    price.className = "tile-price";
    price.textContent = formatPrice(item);

    const count = document.createElement("div");
    count.className = "tile-count";
    count.textContent = "x1";

    tile.appendChild(icon);
    tile.appendChild(name);
    tile.appendChild(meta);
    if (price.textContent) {
      tile.appendChild(price);
    }
    tile.appendChild(count);

    tile.addEventListener("click", () => {
      if (selectedSet.has(item.id)) {
        selectedSet.delete(item.id);
      } else {
        selectedSet.add(item.id);
      }
      renderTiles();
    });
    furnitureTiles.appendChild(tile);
  });
  itemCount.textContent = selectedSet.size.toString();
}

selectAllBtn?.addEventListener("click", () => {
  getVisibleFurniture().forEach((item) => selectedSet.add(item.id));
  renderTiles();
});

selectNoneBtn?.addEventListener("click", () => {
  getVisibleFurniture().forEach((item) => selectedSet.delete(item.id));
  renderTiles();
});

furnitureSearch?.addEventListener("input", () => renderTiles());
budgetInput?.addEventListener("input", () => renderTiles());

function getRoomFromState() {
  const room = {
    w: parseFloat(widthInput.value),
    h: parseFloat(heightInput.value),
    type: getActiveValue("room-type"),
    style: getActiveValue("room-style"),
  };
  if (appState.polygonClosed && appState.polygon.length >= 3) {
    const bbox = getBoundingBox(appState.polygon);
    room.w = Math.max(1, bbox.w / PIXELS_PER_M);
    room.h = Math.max(1, bbox.h / PIXELS_PER_M);
    room.polygon = appState.polygon.map((pt) => [
      (pt.x - bbox.x) / PIXELS_PER_M,
      (pt.y - bbox.y) / PIXELS_PER_M,
    ]);
    room.doors = appState.doors.map((pt) => [
      (pt.x - bbox.x) / PIXELS_PER_M,
      (pt.y - bbox.y) / PIXELS_PER_M,
    ]);
    room.windows = appState.windows.map((pt) => [
      (pt.x - bbox.x) / PIXELS_PER_M,
      (pt.y - bbox.y) / PIXELS_PER_M,
    ]);
  }
  return room;
}

async function requestLayoutFromServer(room, selectedIds, useGnn) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  const response = await fetch("http://localhost:8000/api/layout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      width: room.w,
      height: room.h,
      room_type: room.type,
      style: room.style,
      selected_ids: selectedIds,
      use_gnn: useGnn,
      doors: room.doors || [],
      polygon: room.polygon || null,
      windows: room.windows || [],
    }),
    signal: controller.signal,
  });
  clearTimeout(timeout);
  if (!response.ok) {
    throw new Error("Server error");
  }
  return response.json();
}

function buildVariants(room, items, basePlacements) {
  const variants = [basePlacements];
  for (let i = 1; i < 4; i += 1) {
    variants.push(placeItems(room, items, i));
  }
  return variants;
}

function renderVariants(variants, items, room) {
  if (!variantRow) return;
  variantRow.innerHTML = "";
  variants.forEach((variant, idx) => {
    const thumb = document.createElement("div");
    thumb.className = "variant-thumb";
    if (idx === appState.selectedVariant) {
      thumb.classList.add("active");
    }
    const c = document.createElement("canvas");
    c.width = 220;
    c.height = 160;
    const cctx = c.getContext("2d");
    drawLayout(c, cctx, room, items, variant);
    thumb.appendChild(c);
    thumb.addEventListener("click", () => {
      appState.selectedVariant = idx;
      drawResult(room, items, variants[idx]);
      renderVariants(variants, items, room);
    });
    variantRow.appendChild(thumb);
  });
}

if (generateBtn) {
  generateBtn.addEventListener("click", () => {
    if (!widthInput || !heightInput) {
      return;
    }
    const originalLabel = generateBtn.textContent;
    generateBtn.textContent = t("generating");
    generateBtn.disabled = true;

    const room = getRoomFromState();
    const manualSelected = Array.from(selectedSet)
      .map((id) => furnitureMap.get(id))
      .filter(Boolean);
    const selected = manualSelected.length ? manualSelected : recommendFurniture(room.type);
    const selectedIds = selected.map((item) => item.id);

    requestLayoutFromServer(room, selectedIds, useGnnToggle.checked)
      .then((data) => {
        const placements = data.placements.map((p) => ({
          id: p.id,
          x: p.x,
          y: p.y,
          w: p.w,
          h: p.h,
        }));
        renderFurniture(selected);
        draw(room, selected, placements);
        engineLabel.textContent = "GNN API";
        appState.variants = buildVariants(room, selected, placements);
        appState.variantItems = selected;
        appState.variantRoom = room;
        appState.selectedVariant = 0;
        renderResult(selected);
        renderVariants(appState.variants, selected, room);
        drawResult(room, selected, appState.variants[0]);
        switchScreen("result");
      })
      .catch(() => {
        const placements = placeItems(room, selected);
        renderFurniture(selected);
        draw(room, selected, placements);
        engineLabel.textContent = "Local";
        appState.variants = buildVariants(room, selected, placements);
        appState.variantItems = selected;
        appState.variantRoom = room;
        appState.selectedVariant = 0;
        renderResult(selected);
        renderVariants(appState.variants, selected, room);
        drawResult(room, selected, appState.variants[0]);
        switchScreen("result");
      })
      .finally(() => {
        generateBtn.disabled = false;
        generateBtn.textContent = originalLabel;
      });
  });
}

function mulberry32(seed) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function polygonArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 0.000001) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function getBoundingBox(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function clampDimension(value, fallback) {
  const num = Number.parseFloat(value);
  if (Number.isFinite(num)) {
    return Math.max(2, Math.min(12, num));
  }
  return fallback;
}

function makeRectPolygon(widthM, heightM) {
  if (!drawCanvas) return [];
  const w = widthM * PIXELS_PER_M;
  const h = heightM * PIXELS_PER_M;
  const x0 = (drawCanvas.width - w) / 2;
  const y0 = (drawCanvas.height - h) / 2;
  return [
    { x: x0, y: y0 },
    { x: x0 + w, y: y0 },
    { x: x0 + w, y: y0 + h },
    { x: x0, y: y0 + h },
  ];
}

function applyShapePolygon(polygon) {
  appState.polygon = polygon;
  appState.polygonClosed = polygon.length >= 3;
  if (appState.polygonClosed) {
    appState.doors = appState.doors.filter((pt) => pointInPolygon(pt, polygon));
    appState.windows = appState.windows.filter((pt) => pointInPolygon(pt, polygon));
  }
  drawDrawCanvas();
}

function setShapeMode(mode) {
  appState.shapeMode = mode;
  shapeGroup?.querySelectorAll(".pill").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === mode);
  });
  shapeRect?.classList.toggle("show", mode === "rect");
  shapeSquare?.classList.toggle("show", mode === "square");

  if (mode === "rect") {
    const w = clampDimension(rectWidthInput?.value, 4.5);
    const h = clampDimension(rectHeightInput?.value, 3.6);
    if (rectWidthInput) rectWidthInput.value = w;
    if (rectHeightInput) rectHeightInput.value = h;
    applyShapePolygon(makeRectPolygon(w, h));
    return;
  }

  if (mode === "square") {
    const s = clampDimension(squareSizeInput?.value, 4.0);
    if (squareSizeInput) squareSizeInput.value = s;
    applyShapePolygon(makeRectPolygon(s, s));
    return;
  }

  appState.polygon = [];
  appState.polygonClosed = false;
  drawDrawCanvas();
}

function drawDrawCanvas() {
  if (!drawCanvas || !drawCtx) return;
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  drawCtx.fillStyle = "#0f0f14";
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

  if (appState.bgImage) {
    const img = appState.bgImage;
    const scale = Math.min(drawCanvas.width / img.width, drawCanvas.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    drawCtx.drawImage(img, (drawCanvas.width - w) / 2, (drawCanvas.height - h) / 2, w, h);
  }

  if (appState.polygon.length) {
    drawCtx.beginPath();
    drawCtx.moveTo(appState.polygon[0].x, appState.polygon[0].y);
    for (let i = 1; i < appState.polygon.length; i += 1) {
      drawCtx.lineTo(appState.polygon[i].x, appState.polygon[i].y);
    }
    if (appState.polygonClosed) {
      drawCtx.closePath();
      drawCtx.fillStyle = "rgba(34, 197, 94, 0.12)";
      drawCtx.fill();
    }
    drawCtx.strokeStyle = "rgba(34, 197, 94, 0.8)";
    drawCtx.lineWidth = 2;
    drawCtx.stroke();

    appState.polygon.forEach((pt) => {
      drawCtx.fillStyle = "#b2f5d2";
      drawCtx.beginPath();
      drawCtx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      drawCtx.fill();
    });
  }

  appState.doors.forEach((pt) => {
    drawCtx.strokeStyle = "#7dd3fc";
    drawCtx.lineWidth = 2;
    drawCtx.beginPath();
    drawCtx.rect(pt.x - 12, pt.y - 6, 24, 12);
    drawCtx.stroke();
    drawCtx.beginPath();
    drawCtx.arc(pt.x - 12, pt.y + 6, 14, 1.5 * Math.PI, 2 * Math.PI);
    drawCtx.stroke();
  });

  appState.windows.forEach((pt) => {
    drawCtx.strokeStyle = "#93c5fd";
    drawCtx.lineWidth = 2;
    drawCtx.beginPath();
    drawCtx.rect(pt.x - 10, pt.y - 8, 20, 16);
    drawCtx.stroke();
    drawCtx.beginPath();
    drawCtx.moveTo(pt.x - 10, pt.y);
    drawCtx.lineTo(pt.x + 10, pt.y);
    drawCtx.moveTo(pt.x, pt.y - 8);
    drawCtx.lineTo(pt.x, pt.y + 8);
    drawCtx.stroke();
  });

  if (roomAreaEl) {
    if (appState.polygonClosed) {
      const areaPx = polygonArea(appState.polygon);
      const areaM = areaPx / (PIXELS_PER_M * PIXELS_PER_M);
      roomAreaEl.textContent = `${areaM.toFixed(1)} ${t("area_unit")}`;
    } else {
      roomAreaEl.textContent = `0 ${t("area_unit")}`;
    }
  }
}

function getDrawTool() {
  const group = document.getElementById("draw-tool");
  const active = group ? group.querySelector(".active") : null;
  return active ? active.dataset.value : "wall";
}

function handleDrawClick(event) {
  if (!drawCanvas) return;
  if (appState.shapeMode !== "custom" && getDrawTool() === "wall") {
    return;
  }
  const rect = drawCanvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (drawCanvas.width / rect.width);
  const y = (event.clientY - rect.top) * (drawCanvas.height / rect.height);
  const tool = getDrawTool();
  const insidePolygon = appState.polygonClosed
    ? pointInPolygon({ x, y }, appState.polygon)
    : true;

  if (tool === "wall") {
    if (appState.polygonClosed) return;
    if (appState.polygon.length >= 3) {
      const first = appState.polygon[0];
      const dist = Math.hypot(first.x - x, first.y - y);
      if (dist < 12) {
        appState.polygonClosed = true;
        drawDrawCanvas();
        return;
      }
    }
    appState.polygon.push({ x, y });
  } else if (tool === "door") {
    if (!insidePolygon) return;
    appState.doors.push({ x, y });
  } else if (tool === "window") {
    if (!insidePolygon) return;
    appState.windows.push({ x, y });
  }
  drawDrawCanvas();
}

function handleDrawDoubleClick() {
  if (appState.shapeMode !== "custom") {
    return;
  }
  if (appState.polygon.length >= 3) {
    appState.polygonClosed = true;
    drawDrawCanvas();
  }
}

drawCanvas?.addEventListener("click", handleDrawClick);
drawCanvas?.addEventListener("dblclick", handleDrawDoubleClick);

clearDrawBtn?.addEventListener("click", () => {
  appState.polygon = [];
  appState.polygonClosed = false;
  appState.doors = [];
  appState.windows = [];
  if (appState.shapeMode === "custom") {
    drawDrawCanvas();
  } else {
    setShapeMode(appState.shapeMode);
  }
});

toConfigureBtn?.addEventListener("click", () => {
  if (appState.polygonClosed && appState.polygon.length >= 3) {
    const bbox = getBoundingBox(appState.polygon);
    if (widthInput && heightInput) {
      widthInput.value = Math.max(2.5, (bbox.w / PIXELS_PER_M).toFixed(1));
      heightInput.value = Math.max(2.5, (bbox.h / PIXELS_PER_M).toFixed(1));
      widthVal.textContent = widthInput.value;
      heightVal.textContent = heightInput.value;
    }
  }
  switchScreen("editor");
});

planUpload?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      appState.bgImage = img;
      drawDrawCanvas();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function addChatMessage(text, type = "bot") {
  if (!chatBox) return;
  const msg = document.createElement("div");
  msg.className = `chat-msg ${type}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function respondToChat(text) {
  const lower = text.toLowerCase();
  if (!text.trim()) {
    return t("chat_empty");
  }
  if (lower.includes("рослин") || lower.includes("plant")) {
    return t("chat_plant");
  }
  if (lower.includes("стиль")) {
    return t("chat_style");
  }
  if (lower.includes("світл") || lower.includes("освіт")) {
    return t("chat_light");
  }
  return t("chat_default");
}

chatSend?.addEventListener("click", () => {
  const text = chatInput?.value || "";
  if (!text.trim()) {
    return;
  }
  addChatMessage(text, "user");
  chatInput.value = "";
  setTimeout(() => {
    addChatMessage(respondToChat(text), "bot");
  }, 200);
});

chatInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    chatSend.click();
  }
});

function loadProjects() {
  const raw = localStorage.getItem("planning_projects");
  if (!raw || !projectList) return;
  const items = JSON.parse(raw);
  projectList.innerHTML = "";
  items.slice(-5).reverse().forEach((proj) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `<span>${proj.name}</span><span>${proj.date}</span>`;
    card.addEventListener("click", () => {
      selectedSet.clear();
      proj.selectedIds.forEach((id) => selectedSet.add(id));
      appState.polygon = proj.polygon || [];
      appState.polygonClosed = proj.polygonClosed || false;
      appState.doors = proj.doors || [];
      appState.windows = proj.windows || [];
      drawDrawCanvas();
      switchScreen("editor");
    });
    projectList.appendChild(card);
  });
}

saveProjectBtn?.addEventListener("click", () => {
  const raw = localStorage.getItem("planning_projects");
  const items = raw ? JSON.parse(raw) : [];
  const selectedIds = Array.from(selectedSet);
  const project = {
    name: `${t("project")} ${items.length + 1}`,
    date: new Date().toLocaleDateString(),
    selectedIds,
    polygon: appState.polygon,
    polygonClosed: appState.polygonClosed,
    doors: appState.doors,
    windows: appState.windows,
  };
  items.push(project);
  localStorage.setItem("planning_projects", JSON.stringify(items));
  loadProjects();
});

newProjectResultBtn?.addEventListener("click", () => {
  switchScreen("draw");
});

function init() {
  shapeGroup?.querySelectorAll(".pill").forEach((btn) => {
    btn.addEventListener("click", () => setShapeMode(btn.dataset.value || "custom"));
  });
  rectWidthInput?.addEventListener("input", () => {
    if (appState.shapeMode === "rect") {
      setShapeMode("rect");
    }
  });
  rectHeightInput?.addEventListener("input", () => {
    if (appState.shapeMode === "rect") {
      setShapeMode("rect");
    }
  });
  squareSizeInput?.addEventListener("input", () => {
    if (appState.shapeMode === "square") {
      setShapeMode("square");
    }
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => setTheme(btn.dataset.theme));
  });
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", openDrawer);
  });
  drawer?.addEventListener("click", (event) => {
    if (event.target === drawer) {
      closeDrawer();
    }
  });
  document.querySelectorAll(".drawer-close").forEach((btn) => {
    btn.addEventListener("click", closeDrawer);
  });
  document.querySelectorAll(".drawer-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      closeDrawer();
      if (target === "settings") {
        openSettings();
      } else if (screens[target]) {
        switchScreen(target);
      }
    });
  });
  document.querySelectorAll(".settings-btn").forEach((btn) => {
    btn.addEventListener("click", openSettings);
  });
  settingsModal?.addEventListener("click", (event) => {
    if (event.target === settingsModal || event.target.closest(".modal-close")) {
      closeSettings();
    }
  });
  document.querySelectorAll(".auth-tab").forEach((btn) => {
    btn.addEventListener("click", () => setAuthMode(btn.dataset.auth));
  });
  [authLogin, authPassword, authConfirm].forEach((input) => {
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleAuth();
      }
    });
  });
  setTheme(currentTheme);
  setLang(currentLang);
  setAuthMode("login");
  setShapeMode("custom");
  draw({ w: 4.5, h: 3.6 }, [], []);
  renderTiles();
  drawDrawCanvas();
  loadProjects();

  const initial = location.hash?.replace("#", "") || "login";
  const safeInitial = screens[initial] ? initial : "login";
  history.replaceState({ screen: safeInitial }, "", `#${safeInitial}`);
  switchScreen(safeInitial, false);

  window.addEventListener("popstate", (event) => {
    const target = event.state?.screen || "login";
    switchScreen(target, false);
  });
}

init();
