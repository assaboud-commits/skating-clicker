import React, { useEffect, useMemo, useState } from "react";

const KEY = "blik-skating-clicker-tg-v4";
const BASE_URL = (import.meta && import.meta.env && import.meta.env.BASE_URL) || "/";
const LOGO_SRC = `${BASE_URL}blik-logo.png`;
const TAB_BACKGROUNDS = {
  ice: `${BASE_URL}backgrounds/ice.jpg`,
  tasks: `${BASE_URL}backgrounds/tasks.jpg`,
  events: `${BASE_URL}backgrounds/starts.jpg`,
  shop: `${BASE_URL}backgrounds/upgrades.jpg`,
  more: `${BASE_URL}backgrounds/more.jpg`
};
const BRAND = { black: "#000000", white: "#FFFFFF", green: "#00FF00", gray: "#A6A6A6" };

const I = ({ children, size = 18 }) => (
  <span className="inline-flex items-center justify-center leading-none" style={{ width: size, height: size, fontSize: size * 0.85 }}>{children}</span>
);

const icons = {
  ice: (p) => <I {...p}>❄️</I>, cup: (p) => <I {...p}>🏆</I>, zap: (p) => <I {...p}>⚡</I>, money: (p) => <I {...p}>₽</I>,
  fans: (p) => <I {...p}>👥</I>, star: (p) => <I {...p}>★</I>, gym: (p) => <I {...p}>🏋️</I>, music: (p) => <I {...p}>♪</I>,
  medal: (p) => <I {...p}>🥇</I>, crown: (p) => <I {...p}>♛</I>, reset: (p) => <I {...p}>↺</I>, spark: (p) => <I {...p}>✦</I>
};

const stages = [
  ["Дворовый каток", 0, "Новичок", "Первые круги, падения и упрямство."],
  ["Детская секция", 500, "Первые шаги", "Появились тренер, расписание и настоящая дисциплина."],
  ["Школьная лига", 2000, "Юный спортсмен", "Первые контрольные прокаты и борьба с волнением."],
  ["Городские старты", 7500, "Надежда города", "Первые медали и маленькая группа фанатов."],
  ["Областной сезон", 22000, "Крепкий участник", "Программы стали сложнее, конкуренция жестче."],
  ["Региональная сборная", 60000, "Сильный фигурист", "Появились сборы, медиа и борьба за место в команде."],
  ["Юниорская арена", 135000, "Претендент", "Каждый старт уже влияет на карьеру."],
  ["Национальная арена", 280000, "Топ страны", "Судьи смотрят на детали, фанаты ждут чистых прокатов."],
  ["Международный сезон", 520000, "Звезда", "Гран-при, пресса, перелеты и пьедесталы."],
  ["Главный финал", 850000, "Фаворит", "Один сезон отделяет тебя от статуса легенды."],
  ["Вершина льда", 1300000, "Легенда", "Ты стал легендой, которую помнят."]
].map(([name, min, tone, note]) => ({ name, min, tone, note }));

const upgrades = [
  ["skates", "Профессиональные коньки", icons.ice, "+0.8 мастерства за тренировку", 140, 1.55, 45, { click: 0.8 }],
  ["coach", "Личный тренер", icons.gym, "+0.35 мастерства в секунду", 450, 1.64, 40, { autoSkill: 0.35 }],
  ["choreo", "Хореограф", icons.music, "+1 фанат за тренировку и бонус к оценке", 760, 1.68, 35, { fansClick: 1, score: 1 }],
  ["costumeBase", "Сценический образ", icons.star, "+4% к наградам", 1200, 1.7, 30, { reward: 0.04 }],
  ["media", "Медиа-команда", icons.fans, "+0.45 фаната в секунду", 1800, 1.72, 30, { autoFans: 0.45 }],
  ["mental", "Спортивный психолог", icons.spark, "+8 к максимуму энергии", 2400, 1.74, 25, { maxEnergy: 8 }],
  ["ballet", "Классическая подготовка", icons.music, "+0.7 мастерства за тренировку и бонус к оценке", 3600, 1.76, 26, { click: 0.7, score: 1.2 }],
  ["blades", "Заточка лезвий", icons.ice, "+1.2 мастерства за тренировку", 5200, 1.78, 24, { click: 1.2 }],
  ["recovery", "Восстановление", icons.spark, "+10 к максимуму энергии", 7600, 1.8, 22, { maxEnergy: 10 }],
  ["analyst", "Видеоаналитик", icons.star, "+3 к оценке и +2% к наградам", 11200, 1.82, 22, { score: 3, reward: 0.02 }],
  ["agent", "Спортивный агент", icons.money, "+3% к наградам и +0.2 фаната в секунду", 16800, 1.84, 20, { reward: 0.03, autoFans: 0.2 }],
  ["rink", "Аренда льда", icons.ice, "+0.6 мастерства в секунду", 25000, 1.86, 20, { autoSkill: 0.6 }],
  ["jumps", "Ультра-си база", icons.star, "+3 мастерства за тренировку и большой бонус к оценке", 38000, 1.9, 18, { click: 3, score: 3 }],
  ["tour", "Ледовое шоу", icons.fans, "+1 фанат в секунду и +3% к наградам", 56000, 1.92, 18, { autoFans: 1, reward: 0.03 }],
  ["camp", "Международные сборы", icons.crown, "+1.4 мастерства в секунду и +8 энергии", 86000, 1.95, 16, { autoSkill: 1.4, maxEnergy: 8 }]
].map(([id, title, icon, description, base, scale, max, effect]) => ({ id, title, icon, description, base, scale, max, effect }));

const comps = [
  ["openice", "Открытый лед", 180, 0, 0, 70, 20, 1, 230], ["yard", "Первые показательные", 450, 20, 0, 120, 40, 1, 560],
  ["school", "Школьная лига", 1000, 60, 1, 230, 80, 2, 1250], ["district", "Кубок района", 2200, 150, 3, 420, 150, 3, 2800],
  ["city", "Кубок города", 5200, 400, 8, 900, 330, 6, 6600], ["winter", "Зимнее первенство", 12000, 1200, 18, 1800, 700, 10, 15000],
  ["region", "Региональное первенство", 26000, 3500, 38, 3800, 1500, 16, 33000], ["federation", "Кубок федерации", 55000, 9000, 80, 7600, 3200, 26, 70000],
  ["juniors", "Юниорский финал", 100000, 22000, 150, 13500, 6500, 40, 128000], ["challenge", "Национальный челлендж", 180000, 55000, 280, 23000, 12000, 60, 230000],
  ["nationals", "Чемпионат страны", 300000, 120000, 520, 38000, 21000, 90, 385000], ["cupfinal", "Финал Кубка", 470000, 240000, 850, 62000, 36000, 130, 600000],
  ["grandprix", "Финал Гран-при", 700000, 420000, 1300, 98000, 62000, 190, 900000], ["euro", "Континентальный старт", 950000, 700000, 2000, 145000, 98000, 270, 1220000],
  ["worlds", "Главный мировой старт", 1250000, 1000000, 3000, 240000, 160000, 420, 1600000]
].map(([id, title, req, fansReq, repReq, coins, fans, rep, diff]) => ({ id, title, req, fansReq, repReq, coins, fans, rep, diff }));

const achievements = [
  ["first100", "Первые 100 часов льда", (s) => s.skill >= 100], ["skill1000", "Мастерство 1 000", (s) => s.skill >= 1000],
  ["skill10000", "Мастерство 10 000", (s) => s.skill >= 10000], ["skill100000", "Мастерство 100 000", (s) => s.skill >= 100000],
  ["skill500000", "Мастерство 500 000", (s) => s.skill >= 500000], ["legend", "Дойти до вершины льда", (s) => s.skill >= 1300000],
  ["fans500", "Первые 500 фанатов", (s) => s.fans >= 500], ["fans10000", "10 000 фанатов", (s) => s.fans >= 10000],
  ["fans100000", "100 000 фанатов", (s) => s.fans >= 100000], ["coins1000", "Накопить 1 000 ₽", (s) => s.coins >= 1000],
  ["coins50000", "Накопить 50 000 ₽", (s) => s.coins >= 50000], ["rep50", "Репутация 50+", (s) => s.rep >= 50],
  ["rep250", "Репутация 250+", (s) => s.rep >= 250], ["rep1000", "Репутация 1 000+", (s) => s.rep >= 1000],
  ["start1", "Первый официальный старт", (s) => Object.values(s.done || {}).filter(Boolean).length >= 1],
  ["start5", "Пять стартов в сезоне", (s) => Object.values(s.done || {}).filter(Boolean).length >= 5],
  ["start10", "Десять стартов в карьере", (s) => Object.values(s.done || {}).filter(Boolean).length >= 10],
  ["upgrades5", "Пять улучшений", (s) => Object.values(s.ups || {}).reduce((a, b) => a + b, 0) >= 5],
  ["upgrades25", "Система подготовки", (s) => Object.values(s.ups || {}).reduce((a, b) => a + b, 0) >= 25],
  ["energy180", "Запас выносливости", (s) => derived(s).maxEnergy >= 180]
].map(([id, title, ok]) => ({ id, title, ok }));

const programItems = [
  ["spin", "Комбинированное вращение", 0, 1], ["steps", "Дорожка шагов", 500, 2], ["double", "Двойной прыжок", 2000, 4],
  ["triple", "Тройной прыжок", 12000, 9], ["cascade", "Каскад 3+2", 45000, 18], ["triple3", "Каскад 3+3", 120000, 36],
  ["quad", "Ультра-си элемент", 340000, 80]
].map(([id, title, req, score]) => ({ id, title, req, score }));

const sponsors = [
  ["local", "Локальный спортмагазин", 5000, 10, 4, 0.01], ["rink", "Ледовый дворец", 30000, 80, 18, 0.02],
  ["media", "Медиа-партнер", 150000, 300, 60, 0.03], ["gear", "Бренд экипировки", 450000, 900, 150, 0.04],
  ["fashion", "Премиальный модный дом", 950000, 2500, 420, 0.06]
].map(([id, title, fansReq, repReq, coinsSec, reward]) => ({ id, title, fansReq, repReq, coinsSec, reward }));

const trainingModes = [
  ["jumps", "Прыжки", "Больше мастерства, выше расход энергии", 1.4, 0.65, 1.3, 0],
  ["choreo", "Хореография", "Больше фанатов и немного репутации", 0.75, 2.4, 0.9, 0.03],
  ["stamina", "Выносливость", "Меньше расход энергии, спокойный прогресс", 0.65, 0.8, 0.35, 0],
  ["program", "Прокат программы", "Баланс мастерства, фанатов и оценки", 1, 1.25, 1, 0.01]
].map(([id, title, note, skillMod, fansMod, energyCost, repGain]) => ({ id, title, note, skillMod, fansMod, energyCost, repGain }));

const taskTemplates = [
  ["train", "Провести тренировки", 180, "trains"], ["fans", "Набрать фанатов", 2500, "fans"],
  ["coins", "Заработать бюджет", 6000, "coins"], ["starts", "Выступить на стартах", 2, "starts"],
  ["upgrades", "Купить улучшения", 2, "upgrades"]
].map(([id, title, goal, field]) => ({ id, title, goal, field }));

const tabs = [
  ["ice", "Лед", icons.ice], ["tasks", "Задания", icons.spark], ["events", "Старты", icons.medal], ["shop", "Апгрейды", icons.zap], ["more", "Еще", icons.crown]
].map(([id, label, icon]) => ({ id, label, icon }));

const n = (v, f = 0) => (Number.isFinite(Number(v)) ? Number(v) : f);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v) => (n(v) >= 1000000 ? `${(n(v) / 1000000).toFixed(1)}M` : n(v) >= 1000 ? `${(n(v) / 1000).toFixed(1)}K` : `${Math.floor(n(v))}`);
const cost = (u, lvl) => Math.floor(u.base * Math.pow(u.scale, lvl));
const stageOf = (skill) => stages.reduce((a, s) => (skill >= s.min ? s : a), stages[0]);
const dayStamp = () => new Date().toISOString().slice(0, 10);
const makeTasks = () => Object.fromEntries(taskTemplates.map((t) => [t.id, { progress: 0, done: false, claimed: false }]));

function tg() { if (typeof window === "undefined") return null; return window.Telegram?.WebApp || null; }
function buzz(type = "light") { try { tg()?.HapticFeedback?.impactOccurred?.(type); } catch {} }

function initial() {
  return {
    skill: 0, coins: 60, fans: 0, rep: 0, energy: 100, updated: Date.now(),
    ups: Object.fromEntries(upgrades.map((u) => [u.id, 0])), done: {}, ach: {}, tasks: makeTasks(), taskStamp: dayStamp(),
    program: { spin: true }, sponsors: {}, prestige: 0, trainingMode: "jumps", news: ["БЛИК: новый фигурист вышел на лед. Начинается путь."],
    log: ["Ты впервые вышел на лед. Пока холодно, страшно, но красиво."]
  };
}

function programScore(s) { return programItems.filter((x) => s.program?.[x.id]).reduce((a, x) => a + x.score, 0); }
function sponsorBonus(s) {
  const fanBoost = 1 + Math.min(Math.sqrt(Math.max(0, s.fans)) / 1700, 0.75);
  const repBoost = 1 + Math.min(Math.sqrt(Math.max(0, s.rep)) / 90, 0.55);
  const base = sponsors.filter((x) => s.sponsors?.[x.id]).reduce((a, x) => ({ coinsSec: a.coinsSec + x.coinsSec, reward: a.reward + x.reward }), { coinsSec: 0, reward: 0 });
  return { coinsSec: base.coinsSec * fanBoost * repBoost, reward: base.reward, fanBoost, repBoost };
}

function derived(s) {
  const prestigeBoost = 1 + (s.prestige || 0) * 0.08;
  const sp = sponsorBonus(s);
  const d = { click: 2 * prestigeBoost, autoSkill: 0, fansClick: 1, autoFans: 0, score: programScore(s), reward: sp.reward + Math.min(Math.sqrt(Math.max(0, s.fans)) / 4200, 0.28) + Math.min(Math.sqrt(Math.max(0, s.rep)) / 160, 0.22), maxEnergy: 100, sponsorCoins: sp.coinsSec, fanBoost: sp.fanBoost, repBoost: sp.repBoost };
  upgrades.forEach((u) => {
    const lvl = s.ups?.[u.id] || 0;
    Object.entries(u.effect).forEach(([k, v]) => { d[k] += v * lvl; });
  });
  return { ...d, stage: stageOf(s.skill) };
}

function normalize(raw) {
  const base = initial();
  if (!raw || typeof raw !== "object") return base;
  const ups = Object.fromEntries(upgrades.map((u) => [u.id, clamp(Math.floor(n(raw.ups?.[u.id])), 0, u.max)]));
  const s = {
    ...base,
    skill: Math.max(0, n(raw.skill)), coins: Math.max(0, n(raw.coins, 60)), fans: Math.max(0, n(raw.fans)), rep: Math.max(0, n(raw.rep)),
    energy: Math.max(0, n(raw.energy, 100)), updated: Math.max(0, n(raw.updated, Date.now())), ups,
    done: raw.done && typeof raw.done === "object" && !Array.isArray(raw.done) ? raw.done : {},
    ach: raw.ach && typeof raw.ach === "object" && !Array.isArray(raw.ach) ? raw.ach : {},
    tasks: raw.tasks && typeof raw.tasks === "object" && !Array.isArray(raw.tasks) ? raw.tasks : makeTasks(), taskStamp: raw.taskStamp || dayStamp(),
    program: raw.program && typeof raw.program === "object" && !Array.isArray(raw.program) ? raw.program : { spin: true },
    sponsors: raw.sponsors && typeof raw.sponsors === "object" && !Array.isArray(raw.sponsors) ? raw.sponsors : {},
    trainingMode: trainingModes.some((x) => x.id === raw.trainingMode) ? raw.trainingMode : "jumps",
    prestige: Math.max(0, n(raw.prestige)),
    news: Array.isArray(raw.news) && raw.news.length ? raw.news.slice(0, 8).map(String) : base.news,
    log: Array.isArray(raw.log) && raw.log.length ? raw.log.slice(0, 6).map(String) : base.log
  };
  s.energy = clamp(s.energy, 0, derived(s).maxEnergy);
  return s;
}

function load() { if (typeof window === "undefined") return initial(); try { const raw = window.localStorage.getItem(KEY); return raw ? normalize(JSON.parse(raw)) : initial(); } catch { return initial(); } }
function save(s) { try { if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }
function addLog(s, items) { const arr = Array.isArray(items) ? items : [items]; return { ...s, log: [...arr.map(String), ...s.log].slice(0, 6) }; }
function addNews(s, item) { return { ...s, news: [String(item), ...(s.news || [])].slice(0, 8) }; }
function freshTasks(s) { return s.taskStamp === dayStamp() ? s : { ...s, tasks: makeTasks(), taskStamp: dayStamp() }; }

function bumpTask(s, field, amount) {
  const next = freshTasks(s);
  const tasks = { ...next.tasks };
  taskTemplates.forEach((t) => {
    if (t.field === field && tasks[t.id] && !tasks[t.id].done) {
      const progress = Math.min(t.goal, (tasks[t.id].progress || 0) + amount);
      tasks[t.id] = { ...tasks[t.id], progress, done: progress >= t.goal };
    }
  });
  return { ...next, tasks };
}

function claimTask(s, task) {
  const item = s.tasks?.[task.id];
  if (!item?.done || item.claimed) return s;
  const reward = 1200 + Math.floor(task.goal * 18);
  return addLog(addNews({ ...s, coins: s.coins + reward, tasks: { ...s.tasks, [task.id]: { ...item, claimed: true } } }, `БЛИК: выполнено задание «${task.title}».`), `Задание выполнено: ${task.title}. +${fmt(reward)} ₽.`);
}

function applyAch(s) {
  const ach = { ...s.ach };
  const got = [];
  achievements.forEach((a) => { if (!ach[a.id] && a.ok(s)) { ach[a.id] = true; got.push(a.title); } });
  if (!got.length) return { s: { ...s, ach }, got };
  return { s: addLog({ ...s, ach, coins: s.coins + got.length * 250 }, `Достижение: ${got[0]}! Бонус: ${got.length * 250} ₽.`), got };
}

function tick(s, now = Date.now()) {
  const x = freshTasks(s);
  const d = derived(x);
  const sec = Math.max(0, (now - n(x.updated, now)) / 1000);
  if (!sec) return { s: { ...x, updated: now }, got: [] };
  return applyAch({ ...x, skill: x.skill + d.autoSkill * sec, fans: x.fans + d.autoFans * sec, coins: x.coins + d.sponsorCoins * sec, energy: clamp(x.energy + 2.6 * sec, 0, d.maxEnergy), updated: now });
}

const TESTS_OK = (() => {
  const s = normalize({ skill: "500", coins: "1000", energy: "9999", ups: { skates: 2, coach: 1 } });
  const a = tick({ ...initial(), updated: 0, ups: { ...initial().ups, coach: 1 } }, 5000).s;
  const b = applyAch({ ...initial(), skill: 100, coins: 60 });
  const paths = typeof BASE_URL === "string" && BASE_URL.length > 0 && LOGO_SRC.includes("blik-logo.png") && TAB_BACKGROUNDS.ice.includes("backgrounds/ice.jpg");
  return paths && s.skill === 500 && s.coins === 1000 && s.energy <= derived(s).maxEnergy && Math.abs(a.skill - 1.75) < 0.001 && b.s.coins === 310 && tabs.length === 5;
})();

function BrandLogo({ className = "" }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <div className={`relative inline-flex items-center gap-1 ${className}`}><span className="text-2xl font-black tracking-tight text-white">БЛИК</span><span className="text-2xl leading-none text-[#00FF00]">✦</span></div>;
  return <img src={LOGO_SRC} alt="БЛИК" onError={() => setBroken(true)} className={`block object-contain ${className}`} />;
}

function Card({ children, className = "" }) { return <section className={`rounded-none border border-[#00FF00]/25 bg-black/80 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] ${className}`}>{children}</section>; }
function Title({ small, title, icon: Icon }) { return <div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#00FF00]">{small}</p><h2 className="text-xl font-black tracking-tight text-white">{title}</h2></div><div className="flex h-10 w-10 items-center justify-center border border-[#00FF00]/40 bg-[#00FF00] text-black"><Icon size={19} /></div></div>; }
function Pill({ icon: Icon, label, value }) { return <div className="border border-white/10 bg-white/[0.04] p-3"><div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#00FF00]"><Icon size={13} /> {label}</div><p className="text-lg font-black leading-none text-white">{value}</p></div>; }
function Bar({ value, max, label }) { const p = clamp((value / (max > 0 ? max : 1)) * 100, 0, 100); return <div><div className="mb-1.5 flex justify-between text-[11px] font-bold text-white/60"><span>{label}</span><span className="text-[#00FF00]">{Math.floor(p)}%</span></div><div className="h-2.5 overflow-hidden bg-white/10"><div className="h-full bg-[#00FF00] transition-all" style={{ width: `${p}%` }} /></div></div>; }

function Nav({ tab, setTab }) {
  return <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#00FF00]/25 bg-black px-2 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2"><div className="grid grid-cols-5 gap-1">{tabs.map((t) => { const Icon = t.icon; const active = tab === t.id; return <button key={t.id} type="button" onClick={() => { buzz(); setTab(t.id); }} className={`flex flex-col items-center justify-center gap-1 border px-1 py-2 text-[9px] font-black uppercase tracking-[0.03em] transition ${active ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/[0.03] text-white/55"}`}><Icon size={17} /><span>{t.label}</span></button>; })}</div></nav>;
}

function TrainingModes({ s, setMode }) {
  return <div className="mb-4 grid grid-cols-2 gap-2">{trainingModes.map((m) => { const active = s.trainingMode === m.id; return <button key={m.id} type="button" onClick={() => setMode(m)} className={`border p-3 text-left transition ${active ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/[0.04] text-white"}`}><p className="text-xs font-black uppercase">{m.title}</p><p className={active ? "mt-1 text-[10px] leading-snug text-black/65" : "mt-1 text-[10px] leading-snug text-white/45"}>{m.note}</p></button>; })}</div>;
}

function Ice({ s, d, next, float, train, setMode }) {
  return <div className="space-y-4"><Card><div className="mb-3"><p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#00FF00]">Текущий этап</p><h1 className="mt-1 text-2xl font-black text-white">{d.stage.name}</h1><p className="mt-1 text-xs leading-relaxed text-white/55">{d.stage.note}</p></div><div className="grid grid-cols-2 gap-2"><Pill icon={icons.star} label="Мастерство" value={fmt(s.skill)} /><Pill icon={icons.money} label="Бюджет" value={`${fmt(s.coins)} ₽`} /><Pill icon={icons.fans} label="Фанаты" value={fmt(s.fans)} /><Pill icon={icons.cup} label="Репутация" value={fmt(s.rep)} /></div></Card><Card><div className="space-y-3"><Bar value={s.energy} max={d.maxEnergy} label={`Энергия: ${Math.floor(s.energy)} / ${d.maxEnergy}`} />{next ? <Bar value={s.skill - d.stage.min} max={next.min - d.stage.min} label={`До «${next.name}»: ${fmt(Math.max(0, next.min - s.skill))}`} /> : <Bar value={100} max={100} label="Карьерная вершина достигнута" />}</div><div className="mt-4"><TrainingModes s={s} setMode={setMode} /></div></Card><div className="relative flex min-h-[300px] items-center justify-center overflow-visible bg-transparent px-2 py-8">{float.map((f) => <div key={f.id} className="pointer-events-none absolute z-20 animate-pulse border border-[#00FF00] bg-[#00FF00] px-4 py-2 text-sm font-black text-black shadow-xl">{f.text}</div>)}<button type="button" onClick={train} className="relative z-10 flex h-56 w-56 flex-col items-center justify-center rounded-full border-2 border-[#00FF00] bg-white text-black shadow-[0_0_70px_rgba(0,255,0,0.28)] active:scale-95"><icons.ice size={45} /><span className="mt-3 text-2xl font-black">Тренировка</span><span className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/60">+{d.click.toFixed(1)} за тап</span></button></div></div>;
}

function Shop({ s, buy }) { return <Card><Title small="Магазин" title="Улучшения" icon={icons.zap} /><div className="space-y-2.5">{upgrades.map((u) => <Upgrade key={u.id} u={u} s={s} buy={buy} />)}</div></Card>; }
function Upgrade({ u, s, buy }) { const Icon = u.icon; const lvl = s.ups[u.id] || 0; const c = cost(u, lvl); const can = s.coins >= c && lvl < u.max; return <article className="border border-white/10 bg-white/[0.035] p-3.5"><div className="flex gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#00FF00]/35 bg-black text-[#00FF00]"><Icon size={20} /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-black text-white">{u.title}</h3><span className="border border-white/10 bg-black px-2 py-1 text-[10px] font-black text-white/60">{lvl}/{u.max}</span></div><p className="mt-1 text-xs text-white/50">{u.description}</p><button type="button" onClick={() => buy(u)} disabled={!can} className={`mt-3 w-full border px-4 py-3 text-xs font-black uppercase tracking-[0.04em] ${can ? "border-[#00FF00] bg-[#00FF00] text-black" : "cursor-not-allowed border-white/10 bg-white/5 text-white/35"}`}>{lvl >= u.max ? "Максимум" : `Купить за ${fmt(c)} ₽`}</button></div></div></article>; }

function Events({ s, compete }) { return <Card><Title small="Соревнования" title="Выход на старт" icon={icons.medal} /><div className="mb-3 border border-[#00FF00]/25 bg-[#00FF00]/10 p-3 text-xs font-bold leading-relaxed text-white/75">Программа проката дает бонус к оценке. Травм и случайных провалов нет.</div><div className="space-y-2.5">{comps.map((c) => <Competition key={c.id} c={c} s={s} compete={compete} />)}</div></Card>; }
function Competition({ c, s, compete }) {
  const can = s.skill >= c.req && s.fans >= c.fansReq && s.rep >= c.repReq && s.energy >= 30;
  return <article className="border border-white/10 bg-white/[0.035] p-3.5"><div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-black text-white">{c.title}</h3><p className="mt-1 text-xs text-white/50">Нужно: {fmt(c.req)} мастерства, {fmt(c.fansReq)} фанатов, {fmt(c.repReq)} репутации и 30 энергии</p></div>{s.done[c.id] ? <span className="border border-[#00FF00]/35 bg-[#00FF00]/10 px-2 py-1 text-[10px] font-black text-[#00FF00]">пройдено</span> : null}</div><div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold text-white/55"><span className="border border-white/10 bg-black px-2 py-1">до {fmt(c.coins)} ₽</span><span className="border border-white/10 bg-black px-2 py-1">до {fmt(c.fans)} фанатов</span><span className="border border-white/10 bg-black px-2 py-1">+{fmt(c.rep)} репутации</span></div><button type="button" onClick={() => compete(c)} disabled={!can} className={`mt-3 w-full border px-4 py-3 text-xs font-black uppercase tracking-[0.04em] ${can ? "border-[#00FF00] bg-[#00FF00] text-black" : "cursor-not-allowed border-white/10 bg-white/5 text-white/35"}`}>{can ? "Откатать программу" : "Пока рано"}</button></article>;
}

function Tasks({ s, claim }) { return <Card><Title small="Каждый день" title="Задания дня" icon={icons.spark} /><div className="space-y-2.5">{taskTemplates.map((t) => { const item = s.tasks?.[t.id] || { progress: 0 }; const p = clamp((item.progress / t.goal) * 100, 0, 100); return <article key={t.id} className="border border-white/10 bg-white/[0.035] p-3"><div className="mb-2 flex items-start justify-between gap-2"><div><p className="text-sm font-black text-white">{t.title}</p><p className="text-xs text-white/45">{fmt(item.progress || 0)} / {fmt(t.goal)}</p></div><button type="button" onClick={() => claim(t)} disabled={!item.done || item.claimed} className={`border px-3 py-2 text-[10px] font-black uppercase ${item.done && !item.claimed ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/5 text-white/35"}`}>{item.claimed ? "Получено" : item.done ? "Забрать" : "В процессе"}</button></div><div className="h-2 bg-white/10"><div className="h-full bg-[#00FF00]" style={{ width: `${p}%` }} /></div></article>; })}</div></Card>; }

function Program({ s, toggle }) { const bonus = programScore(s); return <Card><Title small="Прокат" title="Программа" icon={icons.music} /><div className="mb-3 border border-[#00FF00]/25 bg-[#00FF00]/10 p-3 text-xs font-bold leading-relaxed text-white/75">Собирай программу. Каждый элемент дает бонус к оценке на стартах. Текущий бонус: +{bonus}.</div><div className="space-y-2.5">{programItems.map((x) => { const open = s.skill >= x.req; const active = Boolean(s.program?.[x.id]); return <article key={x.id} className={`border p-3 ${active ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/[0.035] text-white"}`}><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black">{x.title}</p><p className={active ? "text-xs text-black/65" : "text-xs text-white/45"}>Нужно {fmt(x.req)} мастерства · +{x.score} к оценке</p></div><button type="button" onClick={() => toggle(x)} disabled={!open || x.id === "spin"} className={`border px-3 py-2 text-[10px] font-black uppercase ${active ? "border-black bg-black text-[#00FF00]" : open ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/5 text-white/30"}`}>{active ? "В программе" : open ? "Добавить" : "Закрыто"}</button></div></article>; })}</div></Card>; }

function Sponsors({ s, sign }) { return <Card><Title small="Контракты" title="Спонсоры" icon={icons.money} /><div className="space-y-2.5">{sponsors.map((x) => { const ok = s.fans >= x.fansReq && s.rep >= x.repReq; const active = Boolean(s.sponsors?.[x.id]); return <article key={x.id} className={`border p-3 ${active ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/[0.035] text-white"}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black">{x.title}</p><p className={active ? "text-xs text-black/65" : "text-xs text-white/45"}>Нужно {fmt(x.fansReq)} фанатов и {fmt(x.repReq)} репутации · +{x.coinsSec} ₽/сек · +{Math.round(x.reward * 100)}% к наградам</p></div><button type="button" onClick={() => sign(x)} disabled={!ok || active} className={`border px-3 py-2 text-[10px] font-black uppercase ${ok && !active ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/5 text-white/35"}`}>{active ? "Подписан" : ok ? "Подписать" : "Закрыто"}</button></div></article>; })}</div></Card>; }

function Career({ s, d }) {
  return <Card><Title small="Карьера" title="Лестница к вершине" icon={icons.crown} /><div className="space-y-2.5">{stages.map((st, i) => { const active = st.name === d.stage.name; const reached = s.skill >= st.min; return <article key={st.name} className={`border p-3 ${active ? "border-[#00FF00] bg-[#00FF00] text-black" : reached ? "border-white/10 bg-white/10 text-white" : "border-white/10 bg-white/[0.025] text-white/35"}`}><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center border border-current text-xs font-black">{i + 1}</div><div><p className="text-sm font-black">{st.name}</p><p className={active ? "text-xs text-black/65" : "text-xs text-white/50"}>от {fmt(st.min)} мастерства</p></div></div></article>; })}</div>{!TESTS_OK ? <div className="mt-3 border border-red-300/30 bg-red-500/10 p-3 text-xs text-red-100">Проверки логики не пройдены.</div> : null}</Card>;
}

function Achievements({ s }) { const unlocked = achievements.filter((a) => s.ach?.[a.id]).length; return <Card><Title small="Награды" title={`Достижения ${unlocked}/${achievements.length}`} icon={icons.spark} /><div className="space-y-2.5">{achievements.map((a, i) => { const open = Boolean(s.ach?.[a.id]); return <article key={a.id} className={`border p-3 ${open ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/[0.03] text-white/35"}`}><div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center border border-current text-xs font-black">{open ? "✓" : i + 1}</div><div><p className="text-sm font-black">{a.title}</p><p className={open ? "text-xs text-black/65" : "text-xs text-white/40"}>{open ? "Получено" : "Пока закрыто"}</p></div></div></article>; })}</div></Card>; }
function Resources({ s, d }) {
  return <Card><Title small="Экономика" title="Зачем нужны ресурсы" icon={icons.star} /><div className="space-y-2 text-xs leading-relaxed text-white/65"><p><b className="text-[#00FF00]">Репутация</b> нужна для допуска к крупным стартам, спонсоров и престижа. Сейчас: {fmt(s.rep)}.</p><p><b className="text-[#00FF00]">Фанаты</b> открывают старты, усиливают доход спонсоров и повышают награды. Сейчас: {fmt(s.fans)}.</p><p><b className="text-[#00FF00]">Бонус аудитории</b>: ×{d.fanBoost.toFixed(2)} к доходу спонсоров. <b className="text-[#00FF00]">Бонус репутации</b>: ×{d.repBoost.toFixed(2)}.</p></div></Card>;
}

function BlikFeed({ s }) {
  const feed = [...(s.news || []), ...(s.log || [])].slice(0, 10);
  return <Card><Title small="БЛИК" title="Лента" icon={icons.spark} /><div className="space-y-2">{feed.map((x, i) => <div key={`${x}-${i}`} className="border border-white/10 bg-white/[0.035] px-3.5 py-3 text-xs leading-relaxed text-white/65">{x}</div>)}</div></Card>;
}

function More({ s, d, prestige, reset, share }) {
  return <div className="space-y-4"><Resources s={s} d={d} /><Career s={s} d={d} /><Achievements s={s} /><BlikFeed s={s} /><Card><Title small="Финал" title="Престиж" icon={icons.crown} /><p className="mb-3 text-xs leading-relaxed text-white/60">После вершины льда можно начать карьеру заново с бонусом наследия. Нужно: 1.3M мастерства, 1M фанатов и 3K репутации. Сейчас престиж: {s.prestige || 0}.</p><button type="button" onClick={prestige} disabled={s.skill < 1300000 || s.fans < 1000000 || s.rep < 3000} className={`w-full border px-4 py-3 text-xs font-black uppercase ${s.skill >= 1300000 && s.fans >= 1000000 && s.rep >= 3000 ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/5 text-white/35"}`}>Начать новую легенду</button></Card><Card><Title small="Telegram" title="Поделиться результатом" icon={icons.fans} /><p className="mb-3 text-xs leading-relaxed text-white/60">Скопируй или отправь другу текущий результат и предложи обогнать тебя.</p><button type="button" onClick={share} className="w-full border border-[#00FF00] bg-[#00FF00] px-4 py-3 text-xs font-black uppercase text-black">Поделиться</button></Card><Card><Title small="Настройки" title="Опасная зона" icon={icons.reset} /><button type="button" onClick={reset} className="w-full border border-white/20 bg-white/5 px-4 py-3 text-xs font-black uppercase text-white/70">Сбросить прогресс</button></Card></div>;
}

export default function FigureSkatingClicker() {
  const [s, setS] = useState(load);
  const [tab, setTab] = useState("ice");
  const [toast, setToast] = useState(null);
  const [float, setFloat] = useState([]);
  const d = useMemo(() => derived(s), [s]);
  const next = stages.find((x) => x.min > s.skill);
  const finale = s.skill >= stages[stages.length - 1].min;

  useEffect(() => { const app = tg(); try { app?.ready?.(); app?.expand?.(); app?.disableVerticalSwipes?.(); app?.setHeaderColor?.(BRAND.black); app?.setBackgroundColor?.(BRAND.black); } catch {} }, []);
  useEffect(() => save(s), [s]);
  useEffect(() => { const id = window.setInterval(() => { let msg = null; setS((old) => { const r = tick(old); if (r.got.length) msg = `Достижение: ${r.got[0]}`; return r.s; }); if (msg) setToast(msg); }, 1000); return () => window.clearInterval(id); }, []);
  useEffect(() => { if (!toast) return undefined; const id = window.setTimeout(() => setToast(null), 2200); return () => window.clearTimeout(id); }, [toast]);

  function pop(text) { const id = `${Date.now()}-${Math.random()}`; setFloat((a) => [...a, { id, text }]); window.setTimeout(() => setFloat((a) => a.filter((x) => x.id !== id)), 750); }
  function train() { buzz("medium"); let msg = null; setS((old) => { const base = freshTasks(tick(old).s); const dd = derived(base); const mode = trainingModes.find((x) => x.id === base.trainingMode) || trainingModes[0]; const crit = Math.random() < 0.08 + Math.min(base.rep / 5000, 0.08); const mod = base.energy >= 1 ? 1 : 0.25; const gain = dd.click * mode.skillMod * mod * (crit ? 3 : 1); const fanGain = dd.fansClick * mode.fansMod * mod * (crit ? 2 : 1); const repGain = mode.repGain ? mode.repGain * mod : 0; const stageIndex = Math.max(0, stages.findIndex((x) => x.name === dd.stage.name)); const coinGain = Math.max(1, Math.floor((stageIndex + 1) * mod)); let ns = { ...base, skill: base.skill + gain, fans: base.fans + fanGain, rep: base.rep + repGain, coins: base.coins + coinGain, energy: clamp(base.energy - mode.energyCost, 0, dd.maxEnergy), updated: Date.now() }; ns = bumpTask(bumpTask(bumpTask(ns, "trains", 1), "fans", fanGain), "coins", coinGain); pop(crit ? `Идеальный прыжок +${Math.floor(gain)}` : `+${Math.floor(gain)}`); if (crit) ns = addLog(ns, "Чистый выезд после сложного прыжка. Зал ожил."); const r = applyAch(ns); if (r.got.length) msg = `Достижение: ${r.got[0]}`; return r.s; }); if (msg) setToast(msg); }
  function buy(u) { let msg = null; setS((old) => { const base = freshTasks(tick(old).s); const lvl = base.ups[u.id] || 0; const c = cost(u, lvl); if (lvl >= u.max || base.coins < c) { buzz(); return base; } buzz("medium"); const r = applyAch(bumpTask(addLog({ ...base, coins: base.coins - c, ups: { ...base.ups, [u.id]: lvl + 1 }, updated: Date.now() }, `Улучшение куплено: ${u.title}, уровень ${lvl + 1}.`), "upgrades", 1)); if (r.got.length) msg = `Достижение: ${r.got[0]}`; return r.s; }); if (msg) setToast(msg); }
  function compete(c) {
    let msg = null;
    setS((old) => {
      const base = freshTasks(tick(old).s);
      const dd = derived(base);
      if (base.skill < c.req || base.fans < c.fansReq || base.rep < c.repReq || base.energy < 30) { buzz(); return base; }
      buzz("heavy");
      const ratio = (base.skill + base.rep * 40 + dd.score * 120 + Math.random() * c.diff * 0.45) / c.diff;
      const place = ratio >= 1.35 ? "золото" : ratio >= 1.08 ? "серебро" : ratio >= 0.88 ? "бронза" : "4 место";
      const mult = ratio >= 1.35 ? 1.25 : ratio >= 1.08 ? 0.9 : ratio >= 0.88 ? 0.65 : 0.35;
      const firstReward = base.done[c.id] ? 1 : 1.25;
      const firstRep = base.done[c.id] ? 0.12 : 1;
      const m = mult * firstReward * (1 + dd.reward);
      const coins = Math.floor(c.coins * m), fans = Math.floor(c.fans * m), rep = Math.max(base.done[c.id] ? 0 : 1, Math.floor(c.rep * mult * firstRep));
      msg = `${c.title}: ${place}`;
      let ns = { ...base, coins: base.coins + coins, fans: base.fans + fans, rep: base.rep + rep, energy: clamp(base.energy - 30, 0, dd.maxEnergy), done: { ...base.done, [c.id]: true }, updated: Date.now() };
      ns = bumpTask(bumpTask(bumpTask(ns, "starts", 1), "fans", fans), "coins", coins);
      ns = addNews(ns, `БЛИК: старт «${c.title}» завершен. Результат — ${place}.`);
      const r = applyAch(addLog(ns, [`${c.title}: ${place}. +${fmt(coins)} ₽, +${fmt(fans)} фанатов, +${rep} репутации.`, "Прокат завершен. Опыт и сезонный прогресс засчитаны."]));
      if (r.got.length) msg = `Достижение: ${r.got[0]}`;
      return r.s;
    });
    if (msg) setToast(msg);
  }
  function reset() { if (typeof window !== "undefined" && !window.confirm("Сбросить весь прогресс и начать заново?")) return; buzz("heavy"); try { window.localStorage.removeItem(KEY); } catch {} setS(initial()); setTab("ice"); setFloat([]); setToast("Новая карьера началась"); }
  function claim(t) { setS((old) => applyAch(claimTask(freshTasks(old), t)).s); }
  function toggleProgram(x) { setS((old) => { if (old.skill < x.req || x.id === "spin") return old; const active = Boolean(old.program?.[x.id]); return addNews({ ...old, program: { ...old.program, [x.id]: !active } }, active ? `БЛИК: элемент «${x.title}» убран из программы.` : `БЛИК: в программу добавлен элемент «${x.title}».`); }); }
  function signSponsor(x) { setS((old) => { if (old.sponsors?.[x.id] || old.fans < x.fansReq || old.rep < x.repReq) return old; return addLog(addNews({ ...old, sponsors: { ...old.sponsors, [x.id]: true } }, `БЛИК: подписан спонсорский контракт «${x.title}».`), `Новый спонсор: ${x.title}.`); }); }
  function setTrainingMode(mode) { setS((old) => ({ ...old, trainingMode: mode.id })); }
  async function shareResult() {
    const url = "https://assaboud-commits.github.io/skating-clicker/";
    const text = `Я дошел до этапа «${d.stage.name}» в игре «Путь фигуриста» от БЛИК. Мастерство: ${fmt(s.skill)}, фанаты: ${fmt(s.fans)}, репутация: ${fmt(s.rep)}.`;
    try {
      if (navigator.share) await navigator.share({ title: "Путь фигуриста", text, url });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(`${text}
${url}`); setToast("Результат скопирован"); }
      else setToast("Скопируй ссылку на игру из браузера");
    } catch {}
  }
  function doPrestige() { setS((old) => { if (old.skill < 1300000 || old.fans < 1000000 || old.rep < 3000) return old; const next = initial(); return { ...next, prestige: (old.prestige || 0) + 1, news: [`БЛИК: новая легенда начинается с наследием ${(old.prestige || 0) + 1}.`] }; }); setTab("ice"); }

  return <div className="min-h-[100dvh] overflow-hidden bg-black text-white" style={{ "--tg-accent": BRAND.green, paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}><div className="pointer-events-none fixed inset-0 z-0"><div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 blur-md scale-110 transition-all duration-500" style={{ backgroundImage: `url(${TAB_BACKGROUNDS[tab] || TAB_BACKGROUNDS.ice})` }} /><div className="absolute inset-0 bg-contain bg-top bg-no-repeat opacity-55 transition-all duration-500" style={{ backgroundImage: `url(${TAB_BACKGROUNDS[tab] || TAB_BACKGROUNDS.ice})` }} /><div className="absolute inset-0 bg-black/70" /><div className="absolute inset-0 opacity-70"><div className="absolute -left-24 top-[-120px] h-80 w-80 rounded-full bg-[#00FF00]/10 blur-3xl" /><div className="absolute right-[-160px] top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" /><div className="absolute bottom-[-180px] left-1/4 h-96 w-96 rounded-full bg-[#00FF00]/10 blur-3xl" /></div></div><main className="relative z-10 mx-auto max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+104px)]"><header className="mb-3 flex items-center justify-between gap-3 border border-[#00FF00]/25 bg-black px-4 py-3 shadow-2xl"><div><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#00FF00]"><icons.ice size={13} /> Mini App</div><h1 className="text-xl font-black text-white">Путь фигуриста</h1></div><BrandLogo className="h-10 w-auto max-w-[118px]" /></header>{tab === "ice" ? <Ice s={s} d={d} next={next} float={float} train={train} setMode={setTrainingMode} /> : null}{tab === "tasks" ? <Tasks s={s} claim={claim} /> : null}{tab === "events" ? <Events s={s} compete={compete} /> : null}{tab === "shop" ? <><Shop s={s} buy={buy} /><div className="mt-4"><Program s={s} toggle={toggleProgram} /></div><div className="mt-4"><Sponsors s={s} sign={signSponsor} /></div></> : null}{tab === "more" ? <More s={s} d={d} prestige={doPrestige} reset={reset} share={shareResult} /> : null}</main><Nav tab={tab} setTab={setTab} />{toast ? <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+86px)] z-50 mx-auto max-w-sm border border-[#00FF00] bg-[#00FF00] p-4 text-center text-sm font-black text-black shadow-2xl">{toast}</div> : null}{finale ? <div className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+12px)] z-40 mx-auto max-w-sm border border-[#00FF00] bg-white px-4 py-3 text-black shadow-2xl"><div className="flex items-center gap-3"><icons.crown /><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Финал</p><p className="text-sm font-black">Ты стал легендой льда</p></div></div></div> : null}</div>;
}
