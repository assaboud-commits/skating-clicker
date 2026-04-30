import React, { useEffect, useMemo, useState } from "react";

const KEY = "blik-skating-clicker-tg-v2";
const LOGO_SRC = "/blik-logo.png";
const BRAND = {
  black: "#000000",
  white: "#FFFFFF",
  green: "#00FF00",
  gray: "#A6A6A6",
};

const I = ({ children, size = 18 }) => (
  <span className="inline-flex items-center justify-center leading-none" style={{ width: size, height: size, fontSize: size * 0.85 }}>
    {children}
  </span>
);

const icons = {
  ice: (p) => <I {...p}>❄️</I>,
  cup: (p) => <I {...p}>🏆</I>,
  zap: (p) => <I {...p}>⚡</I>,
  money: (p) => <I {...p}>₽</I>,
  fans: (p) => <I {...p}>👥</I>,
  star: (p) => <I {...p}>★</I>,
  gym: (p) => <I {...p}>🏋️</I>,
  dress: (p) => <I {...p}>◩</I>,
  music: (p) => <I {...p}>♪</I>,
  medal: (p) => <I {...p}>🥇</I>,
  crown: (p) => <I {...p}>♛</I>,
  reset: (p) => <I {...p}>↺</I>,
  spark: (p) => <I {...p}>✦</I>,
};

const stages = [
  ["Дворовый каток", 0, "Новичок", "Первые круги, падения и упрямство."],
  ["Детская секция", 500, "Первые шаги", "Появились тренер, расписание и настоящая дисциплина."],
  ["Школьная лига", 2000, "Юный спортсмен", "Первые контрольные прокаты и борьба с волнением."],
  ["Городские старты", 7500, "Надежда города", "Первые медали, стабильные элементы и маленькая группа фанатов."],
  ["Областной сезон", 22000, "Крепкий участник", "Программы стали сложнее, ошибки дороже, конкуренция жестче."],
  ["Региональная сборная", 60000, "Сильный фигурист", "Появились сборы, медиа и борьба за место в команде."],
  ["Юниорская арена", 135000, "Претендент", "Каждый старт уже влияет на карьеру и репутацию."],
  ["Национальная арена", 280000, "Топ страны", "Судьи смотрят на детали, фанаты ждут чистых прокатов."],
  ["Международный сезон", 520000, "Звезда", "Гран-при, пресса, перелеты и борьба за пьедестал."],
  ["Главный финал", 850000, "Фаворит", "Один сезон отделяет тебя от статуса легенды."],
  ["Вершина льда", 1300000, "Легенда", "Ты стал легендой, которую помнят."],
].map(([name, min, tone, note]) => ({ name, min, tone, note }));

const upgrades = [
  ["skates", "Профессиональные коньки", icons.ice, "+0.8 мастерства за тренировку", 140, 1.55, 45, { click: 0.8 }],
  ["coach", "Личный тренер", icons.gym, "+0.35 мастерства в секунду", 450, 1.64, 40, { autoSkill: 0.35 }],
  ["choreo", "Хореограф", icons.music, "+1 фанат за тренировку и бонус к оценке", 760, 1.68, 35, { fansClick: 1, score: 1 }],
  ["costume", "Сценический костюм", icons.dress, "+4% к наградам", 1200, 1.7, 30, { reward: 0.04 }],
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
  ["camp", "Международные сборы", icons.crown, "+1.4 мастерства в секунду и +8 энергии", 86000, 1.95, 16, { autoSkill: 1.4, maxEnergy: 8 }],
].map(([id, title, icon, description, base, scale, max, effect]) => ({ id, title, icon, description, base, scale, max, effect }));

const comps = [
  ["openice", "Открытый лед", 180, 70, 20, 1, 230],
  ["yard", "Первые показательные", 450, 120, 40, 2, 560],
  ["school", "Школьная лига", 1000, 230, 80, 4, 1250],
  ["district", "Кубок района", 2200, 420, 150, 7, 2800],
  ["city", "Кубок города", 5200, 900, 330, 12, 6600],
  ["winter", "Зимнее первенство", 12000, 1800, 700, 20, 15000],
  ["region", "Региональное первенство", 26000, 3800, 1500, 34, 33000],
  ["federation", "Кубок федерации", 55000, 7600, 3200, 58, 70000],
  ["juniors", "Юниорский финал", 100000, 13500, 6500, 90, 128000],
  ["challenge", "Национальный челлендж", 180000, 23000, 12000, 130, 230000],
  ["nationals", "Чемпионат страны", 300000, 38000, 21000, 190, 385000],
  ["cupfinal", "Финал Кубка", 470000, 62000, 36000, 270, 600000],
  ["grandprix", "Финал Гран-при", 700000, 98000, 62000, 390, 900000],
  ["euro", "Континентальный старт", 950000, 145000, 98000, 560, 1220000],
  ["worlds", "Главный мировой старт", 1250000, 240000, 160000, 820, 1600000],
].map(([id, title, req, coins, fans, rep, diff]) => ({ id, title, req, coins, fans, rep, diff }));

const achievements = [
  ["first100", "Первые 100 часов льда", (s) => s.skill >= 100],
  ["skill1000", "Мастерство 1 000", (s) => s.skill >= 1000],
  ["skill10000", "Мастерство 10 000", (s) => s.skill >= 10000],
  ["skill100000", "Мастерство 100 000", (s) => s.skill >= 100000],
  ["skill500000", "Мастерство 500 000", (s) => s.skill >= 500000],
  ["legend", "Дойти до вершины льда", (s) => s.skill >= 1300000],
  ["fans500", "Первые 500 фанатов", (s) => s.fans >= 500],
  ["fans10000", "10 000 фанатов", (s) => s.fans >= 10000],
  ["fans100000", "100 000 фанатов", (s) => s.fans >= 100000],
  ["coins1000", "Накопить 1 000 ₽", (s) => s.coins >= 1000],
  ["coins50000", "Накопить 50 000 ₽", (s) => s.coins >= 50000],
  ["rep50", "Репутация 50+", (s) => s.rep >= 50],
  ["rep250", "Репутация 250+", (s) => s.rep >= 250],
  ["rep1000", "Репутация 1 000+", (s) => s.rep >= 1000],
  ["start1", "Первый официальный старт", (s) => Object.values(s.done || {}).filter(Boolean).length >= 1],
  ["start5", "Пять стартов в сезоне", (s) => Object.values(s.done || {}).filter(Boolean).length >= 5],
  ["start10", "Десять стартов в карьере", (s) => Object.values(s.done || {}).filter(Boolean).length >= 10],
  ["upgrades5", "Пять улучшений", (s) => Object.values(s.ups || {}).reduce((a, b) => a + b, 0) >= 5],
  ["upgrades25", "Система подготовки", (s) => Object.values(s.ups || {}).reduce((a, b) => a + b, 0) >= 25],
  ["energy180", "Запас выносливости", (s) => derived(s).maxEnergy >= 180],
].map(([id, title, ok]) => ({ id, title, ok }));

const tabs = [
  ["ice", "Лед", icons.ice],
  ["shop", "Апгрейды", icons.zap],
  ["events", "Старты", icons.medal],
  ["career", "Путь", icons.crown],
  ["achievements", "Достижения", icons.spark],
].map(([id, label, icon]) => ({ id, label, icon }));

const n = (v, f = 0) => (Number.isFinite(Number(v)) ? Number(v) : f);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v) => (n(v) >= 1000000 ? `${(n(v) / 1000000).toFixed(1)}M` : n(v) >= 1000 ? `${(n(v) / 1000).toFixed(1)}K` : `${Math.floor(n(v))}`);
const cost = (u, lvl) => Math.floor(u.base * Math.pow(u.scale, lvl));
const stageOf = (skill) => stages.reduce((a, s) => (skill >= s.min ? s : a), stages[0]);

function tg() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp || null;
}

function buzz(type = "light") {
  try {
    tg()?.HapticFeedback?.impactOccurred?.(type);
  } catch {}
}

function initial() {
  return {
    skill: 0,
    coins: 60,
    fans: 0,
    rep: 0,
    energy: 100,
    updated: Date.now(),
    ups: Object.fromEntries(upgrades.map((u) => [u.id, 0])),
    done: {},
    ach: {},
    log: ["Ты впервые вышел на лед. Пока холодно, страшно, но красиво."],
  };
}

function derived(s) {
  const d = { click: 2, autoSkill: 0, fansClick: 1, autoFans: 0, score: 0, reward: 0, maxEnergy: 100 };
  upgrades.forEach((u) => {
    const lvl = s.ups?.[u.id] || 0;
    Object.entries(u.effect).forEach(([k, v]) => {
      d[k] += v * lvl;
    });
  });
  return { ...d, stage: stageOf(s.skill) };
}

function normalize(raw) {
  const base = initial();
  if (!raw || typeof raw !== "object") return base;
  const ups = Object.fromEntries(upgrades.map((u) => [u.id, clamp(Math.floor(n(raw.ups?.[u.id])), 0, u.max)]));
  const s = {
    ...base,
    skill: Math.max(0, n(raw.skill)),
    coins: Math.max(0, n(raw.coins, 60)),
    fans: Math.max(0, n(raw.fans)),
    rep: Math.max(0, n(raw.rep)),
    energy: Math.max(0, n(raw.energy, 100)),
    updated: Math.max(0, n(raw.updated, Date.now())),
    ups,
    done: raw.done && typeof raw.done === "object" && !Array.isArray(raw.done) ? raw.done : {},
    ach: raw.ach && typeof raw.ach === "object" && !Array.isArray(raw.ach) ? raw.ach : {},
    log: Array.isArray(raw.log) && raw.log.length ? raw.log.slice(0, 6).map(String) : base.log,
  };
  s.energy = clamp(s.energy, 0, derived(s).maxEnergy);
  return s;
}

function load() {
  if (typeof window === "undefined") return initial();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : initial();
  } catch {
    return initial();
  }
}

function save(s) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

function addLog(s, items) {
  const arr = Array.isArray(items) ? items : [items];
  return { ...s, log: [...arr.map(String), ...s.log].slice(0, 6) };
}

function applyAch(s) {
  const ach = { ...s.ach };
  const got = [];
  achievements.forEach((a) => {
    if (!ach[a.id] && a.ok(s)) {
      ach[a.id] = true;
      got.push(a.title);
    }
  });
  if (!got.length) return { s: { ...s, ach }, got };
  return { s: addLog({ ...s, ach, coins: s.coins + got.length * 250 }, `Достижение: ${got[0]}! Бонус: ${got.length * 250} ₽.`), got };
}

function tick(s, now = Date.now()) {
  const d = derived(s);
  const sec = Math.max(0, (now - n(s.updated, now)) / 1000);
  if (!sec) return { s: { ...s, updated: now }, got: [] };
  return applyAch({ ...s, skill: s.skill + d.autoSkill * sec, fans: s.fans + d.autoFans * sec, energy: clamp(s.energy + 1.4 * sec, 0, d.maxEnergy), updated: now });
}

const TESTS_OK = (() => {
  const s = normalize({ skill: "500", coins: "1000", energy: "9999", ups: { skates: 2, coach: 1 } });
  const a = tick({ ...initial(), updated: 0, ups: { ...initial().ups, coach: 1 } }, 5000).s;
  const b = applyAch({ ...initial(), skill: 100, coins: 80 });
  return s.skill === 500 && s.coins === 1000 && s.energy <= derived(s).maxEnergy && Math.abs(a.skill - 1.75) < 0.001 && b.s.coins === 310 && tabs.length === 5;
})();

function BrandLogo({ className = "" }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div className={`relative inline-flex items-center gap-1 ${className}`}>
        <span className="text-2xl font-black tracking-tight text-white">БЛИК</span>
        <span className="text-2xl leading-none text-[#00FF00]">✦</span>
      </div>
    );
  }
  return <img src={LOGO_SRC} alt="БЛИК" onError={() => setBroken(true)} className={`block object-contain ${className}`} />;
}

function Card({ children, className = "" }) {
  return <section className={`rounded-none border border-[#00FF00]/25 bg-black/80 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] ${className}`}>{children}</section>;
}

function Title({ small, title, icon: Icon }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#00FF00]">{small}</p>
        <h2 className="text-xl font-black tracking-tight text-white">{title}</h2>
      </div>
      <div className="flex h-10 w-10 items-center justify-center border border-[#00FF00]/40 bg-[#00FF00] text-black"><Icon size={19} /></div>
    </div>
  );
}

function Pill({ icon: Icon, label, value }) {
  return (
    <div className="border border-white/10 bg-white/[0.04] p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#00FF00]"><Icon size={13} /> {label}</div>
      <p className="text-lg font-black leading-none text-white">{value}</p>
    </div>
  );
}

function Bar({ value, max, label }) {
  const p = clamp((value / (max > 0 ? max : 1)) * 100, 0, 100);
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[11px] font-bold text-white/60"><span>{label}</span><span className="text-[#00FF00]">{Math.floor(p)}%</span></div>
      <div className="h-2.5 overflow-hidden bg-white/10"><div className="h-full bg-[#00FF00] transition-all" style={{ width: `${p}%` }} /></div>
    </div>
  );
}

function Nav({ tab, setTab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#00FF00]/25 bg-black px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} type="button" onClick={() => { buzz(); setTab(t.id); }} className={`flex flex-col items-center justify-center gap-1 border px-1.5 py-2 text-[10px] font-black uppercase tracking-[0.04em] transition ${active ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/[0.03] text-white/55"}`}>
              <Icon size={18} /><span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Ice({ s, d, next, float, train, reset }) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div><p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#00FF00]">Текущий этап</p><h1 className="mt-1 text-2xl font-black text-white">{d.stage.name}</h1><p className="mt-1 text-xs leading-relaxed text-white/55">{d.stage.note}</p></div>
          <button type="button" onClick={reset} className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#00FF00]/35 bg-white/[0.03] text-[#00FF00]"><icons.reset size={17} /></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Pill icon={icons.star} label="Мастерство" value={fmt(s.skill)} />
          <Pill icon={icons.money} label="Бюджет" value={`${fmt(s.coins)} ₽`} />
          <Pill icon={icons.fans} label="Фанаты" value={fmt(s.fans)} />
          <Pill icon={icons.cup} label="Репутация" value={fmt(s.rep)} />
        </div>
      </Card>

      <Card>
        <div className="mb-4 space-y-3">
          <Bar value={s.energy} max={d.maxEnergy} label={`Энергия: ${Math.floor(s.energy)} / ${d.maxEnergy}`} />
          {next ? <Bar value={s.skill - d.stage.min} max={next.min - d.stage.min} label={`До «${next.name}»: ${fmt(Math.max(0, next.min - s.skill))}`} /> : <Bar value={100} max={100} label="Карьерная вершина достигнута" />}
        </div>
        <div className="relative flex min-h-[330px] items-center justify-center overflow-hidden border border-white/10 bg-black p-5">
          <div className="absolute inset-0 opacity-25"><div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00FF00]/40" /><div className="absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" /><div className="absolute left-0 top-1/2 h-px w-full bg-[#00FF00]/40" /><div className="absolute left-1/2 top-0 h-full w-px bg-[#00FF00]/30" /></div>
          {float.map((f) => <div key={f.id} className="pointer-events-none absolute z-20 animate-pulse border border-[#00FF00] bg-[#00FF00] px-4 py-2 text-sm font-black text-black shadow-xl">{f.text}</div>)}
          <button type="button" onClick={train} className="relative z-10 flex h-56 w-56 flex-col items-center justify-center rounded-full border-2 border-[#00FF00] bg-white text-black shadow-[0_0_70px_rgba(0,255,0,0.28)] active:scale-95">
            <icons.ice size={45} /><span className="mt-3 text-2xl font-black">Тренировка</span><span className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/60">+{d.click.toFixed(1)} за тап</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

function Shop({ s, buy }) {
  return <Card><Title small="Магазин" title="Улучшения" icon={icons.zap} /><div className="space-y-2.5">{upgrades.map((u) => <Upgrade key={u.id} u={u} s={s} buy={buy} />)}</div></Card>;
}

function Upgrade({ u, s, buy }) {
  const Icon = u.icon;
  const lvl = s.ups[u.id] || 0;
  const c = cost(u, lvl);
  const can = s.coins >= c && lvl < u.max;
  return (
    <article className="border border-white/10 bg-white/[0.035] p-3.5">
      <div className="flex gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#00FF00]/35 bg-black text-[#00FF00]"><Icon size={20} /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-black text-white">{u.title}</h3><span className="border border-white/10 bg-black px-2 py-1 text-[10px] font-black text-white/60">{lvl}/{u.max}</span></div><p className="mt-1 text-xs text-white/50">{u.description}</p><button type="button" onClick={() => buy(u)} disabled={!can} className={`mt-3 w-full border px-4 py-3 text-xs font-black uppercase tracking-[0.04em] ${can ? "border-[#00FF00] bg-[#00FF00] text-black" : "cursor-not-allowed border-white/10 bg-white/5 text-white/35"}`}>{lvl >= u.max ? "Максимум" : `Купить за ${fmt(c)} ₽`}</button></div></div>
    </article>
  );
}

function Events({ s, compete }) {
  return <Card><Title small="Соревнования" title="Выход на старт" icon={icons.medal} /><div className="space-y-2.5">{comps.map((c) => <Competition key={c.id} c={c} s={s} compete={compete} />)}</div></Card>;
}

function Competition({ c, s, compete }) {
  const can = s.skill >= c.req && s.energy >= 30;
  return (
    <article className="border border-white/10 bg-white/[0.035] p-3.5">
      <div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-black text-white">{c.title}</h3><p className="mt-1 text-xs text-white/50">Нужно: {fmt(c.req)} мастерства и 30 энергии</p></div>{s.done[c.id] ? <span className="border border-[#00FF00]/35 bg-[#00FF00]/10 px-2 py-1 text-[10px] font-black text-[#00FF00]">пройдено</span> : null}</div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold text-white/55"><span className="border border-white/10 bg-black px-2 py-1">до {fmt(c.coins)} ₽</span><span className="border border-white/10 bg-black px-2 py-1">до {fmt(c.fans)} фанатов</span></div>
      <button type="button" onClick={() => compete(c)} disabled={!can} className={`mt-3 w-full border px-4 py-3 text-xs font-black uppercase tracking-[0.04em] ${can ? "border-[#00FF00] bg-[#00FF00] text-black" : "cursor-not-allowed border-white/10 bg-white/5 text-white/35"}`}>{can ? "Откатать программу" : "Пока рано"}</button>
    </article>
  );
}

function Career({ s, d }) {
  return (
    <div className="space-y-4">
      <Card><Title small="Карьера" title="Лестница к вершине" icon={icons.crown} /><div className="space-y-2.5">{stages.map((st, i) => {
        const active = st.name === d.stage.name;
        const reached = s.skill >= st.min;
        return <article key={st.name} className={`border p-3 ${active ? "border-[#00FF00] bg-[#00FF00] text-black" : reached ? "border-white/10 bg-white/10 text-white" : "border-white/10 bg-white/[0.025] text-white/35"}`}><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center border border-current text-xs font-black">{i + 1}</div><div><p className="text-sm font-black">{st.name}</p><p className={active ? "text-xs text-black/65" : "text-xs text-white/50"}>от {fmt(st.min)} мастерства</p></div></div></article>;
      })}</div></Card>
      <Card><Title small="Лента" title="История сезона" icon={icons.spark} /><div className="space-y-2">{s.log.map((x, i) => <div key={`${x}-${i}`} className="border border-white/10 bg-white/[0.035] px-3.5 py-3 text-xs leading-relaxed text-white/65">{x}</div>)}</div></Card>
      {!TESTS_OK ? <Card className="border-red-300/30 bg-red-500/10 text-xs text-red-100">Проверки логики не пройдены.</Card> : null}
    </div>
  );
}

function Achievements({ s }) {
  const unlocked = achievements.filter((a) => s.ach?.[a.id]).length;
  return (
    <Card>
      <Title small="Награды" title={`Достижения ${unlocked}/${achievements.length}`} icon={icons.spark} />
      <div className="mb-3 border border-[#00FF00]/25 bg-[#00FF00]/10 p-3 text-xs font-bold leading-relaxed text-white/75">
        Достижения открываются постепенно: за мастерство, фанатов, репутацию, старты, улучшения и выносливость.
      </div>
      <div className="space-y-2.5">
        {achievements.map((a, i) => {
          const open = Boolean(s.ach?.[a.id]);
          return (
            <article key={a.id} className={`border p-3 ${open ? "border-[#00FF00] bg-[#00FF00] text-black" : "border-white/10 bg-white/[0.03] text-white/35"}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-current text-xs font-black">{open ? "✓" : i + 1}</div>
                <div>
                  <p className="text-sm font-black">{a.title}</p>
                  <p className={open ? "text-xs text-black/65" : "text-xs text-white/40"}>{open ? "Получено" : "Пока закрыто"}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}

export default function FigureSkatingClicker() {
  const [s, setS] = useState(load);
  const [tab, setTab] = useState("ice");
  const [toast, setToast] = useState(null);
  const [float, setFloat] = useState([]);
  const d = useMemo(() => derived(s), [s]);
  const next = stages.find((x) => x.min > s.skill);
  const finale = s.skill >= stages[stages.length - 1].min;

  useEffect(() => {
    const app = tg();
    try {
      app?.ready?.();
      app?.expand?.();
      app?.disableVerticalSwipes?.();
      app?.setHeaderColor?.(BRAND.black);
      app?.setBackgroundColor?.(BRAND.black);
    } catch {}
  }, []);

  useEffect(() => save(s), [s]);

  useEffect(() => {
    const id = window.setInterval(() => {
      let msg = null;
      setS((old) => {
        const r = tick(old);
        if (r.got.length) msg = `Достижение: ${r.got[0]}`;
        return r.s;
      });
      if (msg) setToast(msg);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  function pop(text) {
    const id = `${Date.now()}-${Math.random()}`;
    setFloat((a) => [...a, { id, text }]);
    window.setTimeout(() => setFloat((a) => a.filter((x) => x.id !== id)), 750);
  }

  function train() {
    buzz("medium");
    let msg = null;
    setS((old) => {
      const base = tick(old).s;
      const dd = derived(base);
      const crit = Math.random() < 0.08 + Math.min(base.rep / 5000, 0.08);
      const mod = base.energy >= 1 ? 1 : 0.25;
      const gain = dd.click * mod * (crit ? 3 : 1);
      const fanGain = dd.fansClick * mod * (crit ? 2 : 1);
      const stageIndex = Math.max(0, stages.findIndex((x) => x.name === dd.stage.name));
      let ns = { ...base, skill: base.skill + gain, fans: base.fans + fanGain, coins: base.coins + Math.max(1, Math.floor((stageIndex + 1) * mod)), energy: clamp(base.energy - 1, 0, dd.maxEnergy), updated: Date.now() };
      pop(crit ? `Идеальный прыжок +${Math.floor(gain)}` : `+${Math.floor(gain)}`);
      if (crit) ns = addLog(ns, "Чистый выезд после сложного прыжка. Зал ожил.");
      const r = applyAch(ns);
      if (r.got.length) msg = `Достижение: ${r.got[0]}`;
      return r.s;
    });
    if (msg) setToast(msg);
  }

  function buy(u) {
    let msg = null;
    setS((old) => {
      const base = tick(old).s;
      const lvl = base.ups[u.id] || 0;
      const c = cost(u, lvl);
      if (lvl >= u.max || base.coins < c) { buzz(); return base; }
      buzz("medium");
      const r = applyAch(addLog({ ...base, coins: base.coins - c, ups: { ...base.ups, [u.id]: lvl + 1 }, updated: Date.now() }, `Улучшение куплено: ${u.title}, уровень ${lvl + 1}.`));
      if (r.got.length) msg = `Достижение: ${r.got[0]}`;
      return r.s;
    });
    if (msg) setToast(msg);
  }

  function compete(c) {
    let msg = null;
    setS((old) => {
      const base = tick(old).s;
      const dd = derived(base);
      if (base.skill < c.req || base.energy < 30) { buzz(); return base; }
      buzz("heavy");
      const ratio = (base.skill + base.rep * 80 + dd.score * 120 + Math.random() * c.diff * 0.45) / c.diff;
      const place = ratio >= 1.35 ? "золото" : ratio >= 1.08 ? "серебро" : ratio >= 0.88 ? "бронза" : "4 место";
      const mult = ratio >= 1.35 ? 1.25 : ratio >= 1.08 ? 0.9 : ratio >= 0.88 ? 0.65 : 0.35;
      const first = base.done[c.id] ? 1 : 1.4;
      const m = mult * first * (1 + dd.reward);
      const coins = Math.floor(c.coins * m), fans = Math.floor(c.fans * m), rep = Math.floor(c.rep * mult * first);
      msg = `${c.title}: ${place}`;
      const r = applyAch(addLog({ ...base, coins: base.coins + coins, fans: base.fans + fans, rep: base.rep + rep, energy: clamp(base.energy - 30, 0, dd.maxEnergy), done: { ...base.done, [c.id]: true }, updated: Date.now() }, [`${c.title}: ${place}. +${fmt(coins)} ₽, +${fmt(fans)} фанатов, +${rep} репутации.`, place === "4 место" ? "Прокат был нервным, но это опыт." : "Сильный прокат и важный шаг вперед."]));
      if (r.got.length) msg = `Достижение: ${r.got[0]}`;
      return r.s;
    });
    if (msg) setToast(msg);
  }

  function reset() {
    buzz("heavy");
    try { window.localStorage.removeItem(KEY); } catch {}
    setS(initial());
    setTab("ice");
    setFloat([]);
    setToast("Новая карьера началась");
  }

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-black text-white" style={{ "--tg-accent": BRAND.green, paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}>
      <div className="pointer-events-none fixed inset-0 opacity-70"><div className="absolute -left-24 top-[-120px] h-80 w-80 rounded-full bg-[#00FF00]/10 blur-3xl" /><div className="absolute right-[-160px] top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" /><div className="absolute bottom-[-180px] left-1/4 h-96 w-96 rounded-full bg-[#00FF00]/10 blur-3xl" /></div>
      <aside className="pointer-events-none fixed right-2 top-1/2 z-30 hidden -translate-y-1/2 md:block"><div className="-rotate-90 opacity-90"><BrandLogo className="h-10 w-auto" /></div></aside>
      <main className="relative mx-auto max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+104px)]">
        <header className="mb-3 flex items-center justify-between gap-3 border border-[#00FF00]/25 bg-black px-4 py-3 shadow-2xl"><div><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#00FF00]"><icons.ice size={13} /> Mini App</div><h1 className="text-xl font-black text-white">Путь фигуриста</h1></div><BrandLogo className="h-10 w-auto max-w-[118px]" /></header>
        {tab === "ice" ? <Ice s={s} d={d} next={next} float={float} train={train} reset={reset} /> : null}
        {tab === "shop" ? <Shop s={s} buy={buy} /> : null}
        {tab === "events" ? <Events s={s} compete={compete} /> : null}
        {tab === "career" ? <Career s={s} d={d} /> : null}
        {tab === "achievements" ? <Achievements s={s} /> : null}
      </main>
      <Nav tab={tab} setTab={setTab} />
      {toast ? <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+86px)] z-50 mx-auto max-w-sm border border-[#00FF00] bg-[#00FF00] p-4 text-center text-sm font-black text-black shadow-2xl">{toast}</div> : null}
      {finale ? <div className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+12px)] z-40 mx-auto max-w-sm border border-[#00FF00] bg-white px-4 py-3 text-black shadow-2xl"><div className="flex items-center gap-3"><icons.crown /><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Финал</p><p className="text-sm font-black">Ты стал легендой льда</p></div></div></div> : null}
    </div>
  );
}
