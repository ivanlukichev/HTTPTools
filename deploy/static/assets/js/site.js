function setText(element, value, emptyFallback = "Result will appear here.") {
  if (!element) {
    return;
  }

  const text = value && String(value).trim() ? String(value) : emptyFallback;
  element.textContent = text;
  element.dataset.empty = String(!value || !String(value).trim());
}

function setStatus(element, text, type = "") {
  if (!element) {
    return;
  }

  element.textContent = text;
  element.className = "status-message";
  if (type) {
    element.classList.add(type);
  }
}

async function copyText(value, trigger, copiedLabel = "Copied", resetDelay = 1200) {
  if (!value) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    if (trigger) {
      const original = trigger.dataset.label || trigger.textContent;
      trigger.dataset.label = original;
      trigger.textContent = copiedLabel;
      window.setTimeout(() => {
        trigger.textContent = original;
      }, resetDelay);
    }
    return true;
  } catch (error) {
    return false;
  }
}

function setFieldHint(element, text, type = "") {
  if (!element) {
    return;
  }

  element.textContent = text;
  element.className = "field-hint";
  if (type) {
    element.classList.add(type);
  }
}

function setInputValidity(input, isInvalid) {
  if (!input) {
    return;
  }
  input.setAttribute("aria-invalid", isInvalid ? "true" : "false");
}

function formatDateOutput(date) {
  return {
    utc: date.toUTCString(),
    local: date.toString(),
    iso: date.toISOString()
  };
}

function parseTimestampInput(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    throw new Error("Enter a Unix timestamp in seconds or milliseconds.");
  }
  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error("Timestamp must contain digits only.");
  }

  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) {
    throw new Error("Timestamp is out of supported range.");
  }

  const milliseconds = trimmed.length > 10 ? numeric : numeric * 1000;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Timestamp could not be converted to a valid date.");
  }

  return {
    date,
    milliseconds,
    seconds: Math.trunc(milliseconds / 1000)
  };
}

function parseDateInput(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    throw new Error("Enter a date and time value first.");
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Date could not be parsed. Use a valid local date and time.");
  }

  return {
    date,
    milliseconds: date.getTime(),
    seconds: Math.trunc(date.getTime() / 1000)
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const CALENDAR_MIN_YEAR = 1900;
const CALENDAR_MAX_YEAR = 2100;

function parseCalendarDateInput(rawValue, label = "Date") {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    throw new Error(`Select ${label.toLowerCase()} first.`);
  }

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`${label} must use a valid calendar date.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < CALENDAR_MIN_YEAR || year > CALENDAR_MAX_YEAR) {
    throw new Error(`Allowed date range is ${CALENDAR_MIN_YEAR}–${CALENDAR_MAX_YEAR}.`);
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(date.getTime())
    || date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    throw new Error(`${label} must be a valid calendar date.`);
  }

  return date;
}

function getTodayCalendarDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function formatCalendarDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatReadableCalendarDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });
}

function formatApproxUnit(value, unit) {
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${rounded} ${unit}`;
}

function getDayOfYear(date) {
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.floor((date.getTime() - startOfYear.getTime()) / DAY_MS) + 1;
}

function getYearLength(year) {
  const start = Date.UTC(year, 0, 1);
  const next = Date.UTC(year + 1, 0, 1);
  return Math.round((next - start) / DAY_MS);
}

function getIsoWeekNumber(date) {
  const target = new Date(date.getTime());
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target.getTime() - yearStart.getTime()) / DAY_MS) + 1) / 7);
}

function getDaysInMonthUtc(year, monthIndex) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function createValidUtcDate(year, monthIndex, day) {
  const clampedDay = Math.min(day, getDaysInMonthUtc(year, monthIndex));
  return new Date(Date.UTC(year, monthIndex, clampedDay));
}

function getCalendarDiffParts(startDate, endDate) {
  let years = endDate.getUTCFullYear() - startDate.getUTCFullYear();
  let months = endDate.getUTCMonth() - startDate.getUTCMonth();
  let days = endDate.getUTCDate() - startDate.getUTCDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = (endDate.getUTCMonth() + 11) % 12;
    const previousMonthYear = previousMonth === 11 ? endDate.getUTCFullYear() - 1 : endDate.getUTCFullYear();
    days += getDaysInMonthUtc(previousMonthYear, previousMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function formatDurationFromMinutes(totalMinutes) {
  const absoluteMinutes = Math.abs(totalMinutes);
  const days = Math.floor(absoluteMinutes / (24 * 60));
  const hours = Math.floor((absoluteMinutes % (24 * 60)) / 60);
  const minutes = absoluteMinutes % 60;
  return { days, hours, minutes, totalMinutes: absoluteMinutes };
}

function parseTimeInput(value) {
  const match = value.trim().match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error("Enter a valid time.");
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new Error("Enter a valid time.");
  }
  return (hours * 60) + minutes;
}

function parseDateTimeLocalInput(value, label = "Date and time") {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`Select ${label.toLowerCase()} first.`);
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${label} must be a valid date and time.`);
  }
  return date;
}

function getSupportedTimezones() {
  const common = [
    "UTC",
    "America/New_York",
    "Europe/London",
    "Europe/Berlin",
    "Asia/Bangkok",
    "Asia/Tokyo",
    "Australia/Sydney"
  ];

  if (typeof Intl.supportedValuesOf === "function") {
    const zones = Intl.supportedValuesOf("timeZone");
    return [...new Set([...common, ...zones])];
  }

  return common;
}

function getTimezoneLabel(timeZone) {
  const friendly = {
    UTC: "UTC",
    "America/New_York": "New York",
    "Europe/London": "London",
    "Europe/Berlin": "Berlin",
    "Asia/Bangkok": "Bangkok",
    "Asia/Tokyo": "Tokyo",
    "Australia/Sydney": "Sydney"
  };
  return friendly[timeZone] ? `${friendly[timeZone]} (${timeZone})` : timeZone.replace(/_/g, " ");
}

function getTimeZoneParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = {};
  formatter.formatToParts(date).forEach((part) => {
    if (part.type !== "literal") {
      parts[part.type] = part.value;
    }
  });
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second)
  };
}

function zonedDateTimeToUtc(dateString, timeString, timeZone) {
  const dateMatch = dateString.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = timeString.trim().match(/^(\d{2}):(\d{2})$/);
  if (!dateMatch || !timeMatch) {
    throw new Error("Select both a valid date and time.");
  }

  const desired = {
    year: Number(dateMatch[1]),
    month: Number(dateMatch[2]),
    day: Number(dateMatch[3]),
    hour: Number(timeMatch[1]),
    minute: Number(timeMatch[2])
  };

  let guess = Date.UTC(desired.year, desired.month - 1, desired.day, desired.hour, desired.minute);

  for (let index = 0; index < 4; index += 1) {
    const actual = getTimeZoneParts(new Date(guess), timeZone);
    const desiredStamp = Date.UTC(desired.year, desired.month - 1, desired.day, desired.hour, desired.minute);
    const actualStamp = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute);
    const diffMinutes = Math.round((desiredStamp - actualStamp) / 60000);
    if (diffMinutes === 0) {
      const confirmed = getTimeZoneParts(new Date(guess), timeZone);
      if (
        confirmed.year === desired.year
        && confirmed.month === desired.month
        && confirmed.day === desired.day
        && confirmed.hour === desired.hour
        && confirmed.minute === desired.minute
      ) {
        return new Date(guess);
      }
      break;
    }
    guess += diffMinutes * 60000;
  }

  throw new Error("Selected local time could not be matched exactly in the source timezone.");
}

function formatTimeZoneOutput(date, timeZone) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short"
  });
  return formatter.format(date);
}

function isWeekendExcluded(date, options) {
  const day = date.getUTCDay();
  return (day === 6 && options.excludeSaturday) || (day === 0 && options.excludeSunday);
}

function parseHolidayLines(rawValue) {
  const lines = rawValue.split(/\r\n|\r|\n/);
  const holidays = new Set();
  const invalid = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    try {
      const date = parseCalendarDateInput(trimmed, "Holiday date");
      holidays.add(formatCalendarDate(date));
    } catch (error) {
      invalid.push({ line: index + 1, value: trimmed });
    }
  });

  return { holidays, invalid };
}

function countBusinessDaysInclusive(startDate, endDate, options, holidays) {
  let businessDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let current = new Date(startDate.getTime());

  while (current.getTime() <= endDate.getTime()) {
    const key = formatCalendarDate(current);
    if (isWeekendExcluded(current, options)) {
      weekendDays += 1;
    } else if (holidays.has(key)) {
      holidayDays += 1;
    } else {
      businessDays += 1;
    }
    current = new Date(current.getTime() + DAY_MS);
  }

  return {
    businessDays,
    weekendDays,
    holidayDays,
    totalCalendarDays: Math.round((endDate.getTime() - startDate.getTime()) / DAY_MS)
  };
}

function addBusinessDays(startDate, businessDaysToAdd, options, holidays) {
  let current = new Date(startDate.getTime());
  let added = 0;
  let skippedWeekendDays = 0;
  let skippedHolidayDays = 0;

  while (added < businessDaysToAdd) {
    current = new Date(current.getTime() + DAY_MS);
    if (current.getUTCFullYear() < CALENDAR_MIN_YEAR || current.getUTCFullYear() > CALENDAR_MAX_YEAR) {
      throw new Error(`Result date must stay within ${CALENDAR_MIN_YEAR}–${CALENDAR_MAX_YEAR}.`);
    }

    const key = formatCalendarDate(current);
    if (isWeekendExcluded(current, options)) {
      skippedWeekendDays += 1;
      continue;
    }
    if (holidays.has(key)) {
      skippedHolidayDays += 1;
      continue;
    }
    added += 1;
  }

  return {
    resultDate: current,
    skippedWeekendDays,
    skippedHolidayDays
  };
}

function encodeBase64Unicode(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64Unicode(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function createUuidList(count) {
  const uuids = [];
  for (let index = 0; index < count; index += 1) {
    uuids.push(crypto.randomUUID());
  }
  return uuids;
}

function getRandomInt(maxExclusive) {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error("Random range must be a positive integer.");
  }

  const maxUint32 = 0x100000000;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const buffer = new Uint32Array(1);

  while (true) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) {
      return buffer[0] % maxExclusive;
    }
  }
}

function pickRandomItems(source, count) {
  const items = [];
  for (let index = 0; index < count; index += 1) {
    items.push(source[getRandomInt(source.length)]);
  }
  return items;
}

const MEMORABLE_WORDS = [
  "apple", "beacon", "breeze", "cabin", "cactus", "cedar", "cloud", "comet", "coral", "copper",
  "dawn", "delta", "ember", "field", "forest", "garden", "glacier", "harbor", "hazel", "island",
  "juniper", "lantern", "meadow", "mango", "maple", "marble", "mist", "morning", "mountain", "ocean",
  "orchard", "pebble", "planet", "prairie", "quiet", "rain", "raven", "river", "saffron", "shadow",
  "silver", "sky", "stone", "summit", "sunny", "thunder", "trail", "valley", "violet", "willow"
];

function getPasswordStrength(length, enabledSets) {
  const variety = enabledSets.length;
  if (length >= 20 && variety >= 4) {
    return "Very strong";
  }
  if (length >= 14 && variety >= 3) {
    return "Strong";
  }
  if (length >= 10 && variety >= 2) {
    return "Medium";
  }
  return "Weak";
}

function initStrengthBadge(badge, label) {
  if (!badge) {
    return;
  }
  badge.textContent = label;
  badge.className = "strength-badge";
  badge.dataset.level = label.toLowerCase().replace(/\s+/g, "-");
}

function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initHomeTimestampWidget() {
  const root = document.querySelector("[data-home-timestamp]");
  if (!root) {
    return;
  }

  const fields = {
    seconds: root.querySelector("#home-current-timestamp-seconds"),
    milliseconds: root.querySelector("#home-current-timestamp-milliseconds"),
    utc: root.querySelector("#home-current-timestamp-utc"),
    local: root.querySelector("#home-current-timestamp-local"),
    iso: root.querySelector("#home-current-timestamp-iso")
  };
  const copyButton = root.querySelector("#home-timestamp-copy");

  const updateWidget = () => {
    const now = Date.now();
    const seconds = Math.trunc(now / 1000);
    const formatted = formatDateOutput(new Date(now));

    if (fields.seconds) {
      fields.seconds.textContent = String(seconds);
    }
    if (fields.milliseconds) {
      fields.milliseconds.textContent = String(now);
    }
    if (fields.utc) {
      fields.utc.textContent = formatted.utc;
    }
    if (fields.local) {
      fields.local.textContent = formatted.local;
    }
    if (fields.iso) {
      fields.iso.textContent = formatted.iso;
    }
  };

  updateWidget();
  window.setInterval(updateWidget, 1000);

  copyButton?.addEventListener("click", async () => {
    const value = fields.seconds?.textContent.trim() || "";
    const copied = await copyText(value, copyButton, "Copied ✓", 2000);
    if (!copied && copyButton) {
      const original = copyButton.dataset.label || copyButton.textContent;
      copyButton.dataset.label = original;
      copyButton.textContent = "Copy failed";
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 2000);
    }
  });
}

function initGlobalCopy() {
  document.querySelectorAll("[data-copy-source]").forEach((button) => {
    button.addEventListener("click", async () => {
      const selector = button.getAttribute("data-copy-source");
      const target = selector ? document.querySelector(selector) : null;
      const value = target ? target.textContent.trim() : "";
      const copied = await copyText(value, button);
      if (!copied) {
        const status = button.closest("[data-status-scope]")?.querySelector(".status-message");
        setStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
      }
    });
  });
}

function initEpochConverter() {
  const root = document.querySelector("[data-epoch-tool]");
  if (!root) {
    return;
  }

  const tabs = root.querySelectorAll("[data-tab]");
  const panels = root.querySelectorAll("[data-panel]");
  const timestampInput = root.querySelector("#epoch-timestamp-input");
  const dateInput = root.querySelector("#epoch-date-input");
  const result = root.querySelector("#epoch-result");
  const status = root.querySelector("#epoch-status");
  const liveFields = {
    seconds: document.querySelector("#current-timestamp-seconds"),
    milliseconds: document.querySelector("#current-timestamp-milliseconds"),
    utc: document.querySelector("#current-timestamp-utc"),
    local: document.querySelector("#current-timestamp-local"),
    iso: document.querySelector("#current-timestamp-iso"),
    hex: document.querySelector("#current-timestamp-hex")
  };

  const updateCurrentTimestamp = () => {
    const now = Date.now();
    const seconds = Math.trunc(now / 1000);
    const date = new Date(now);
    const formatted = formatDateOutput(date);

    if (liveFields.seconds) {
      liveFields.seconds.textContent = String(seconds);
    }
    if (liveFields.milliseconds) {
      liveFields.milliseconds.textContent = String(now);
    }
    if (liveFields.utc) {
      liveFields.utc.textContent = formatted.utc;
    }
    if (liveFields.local) {
      liveFields.local.textContent = formatted.local;
    }
    if (liveFields.iso) {
      liveFields.iso.textContent = formatted.iso;
    }
    if (liveFields.hex) {
      liveFields.hex.textContent = `0x${now.toString(16).toUpperCase()}`;
    }
  };

  updateCurrentTimestamp();
  window.setInterval(updateCurrentTimestamp, 1000);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelId = tab.getAttribute("data-tab");
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.id !== panelId;
      });
      setStatus(status, "Choose a mode and convert locally in your browser.");
    });
  });

  root.querySelector("#epoch-convert-ts")?.addEventListener("click", () => {
    try {
      const parsed = parseTimestampInput(timestampInput.value);
      const formatted = formatDateOutput(parsed.date);
      const output = [
        `Seconds: ${parsed.seconds}`,
        `Milliseconds: ${parsed.milliseconds}`,
        `UTC: ${formatted.utc}`,
        `Local: ${formatted.local}`,
        `ISO 8601: ${formatted.iso}`
      ].join("\n");
      setText(result, output);
      setStatus(status, "Timestamp converted successfully.", "success");
    } catch (error) {
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  });

  root.querySelector("#epoch-convert-date")?.addEventListener("click", () => {
    try {
      const parsed = parseDateInput(dateInput.value);
      const formatted = formatDateOutput(parsed.date);
      const output = [
        `Unix seconds: ${parsed.seconds}`,
        `Unix milliseconds: ${parsed.milliseconds}`,
        `UTC: ${formatted.utc}`,
        `Local: ${formatted.local}`,
        `ISO 8601: ${formatted.iso}`
      ].join("\n");
      setText(result, output);
      setStatus(status, "Date converted successfully.", "success");
    } catch (error) {
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  });

  root.querySelector("#epoch-clear")?.addEventListener("click", () => {
    timestampInput.value = "";
    dateInput.value = "";
    setText(result, "");
    setStatus(status, "Fields cleared.");
  });
}

function initTimestampTool() {
  const root = document.querySelector("[data-timestamp-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#timestamp-input");
  const result = root.querySelector("#timestamp-result");
  const status = root.querySelector("#timestamp-status");

  root.querySelector("#timestamp-convert")?.addEventListener("click", () => {
    try {
      const parsed = parseTimestampInput(input.value);
      const formatted = formatDateOutput(parsed.date);
      const output = [
        `UTC: ${formatted.utc}`,
        `Local: ${formatted.local}`,
        `ISO 8601: ${formatted.iso}`
      ].join("\n");
      setText(result, output);
      setStatus(status, "Timestamp converted successfully.", "success");
    } catch (error) {
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  });

  root.querySelector("#timestamp-clear")?.addEventListener("click", () => {
    input.value = "";
    setText(result, "");
    setStatus(status, "Input cleared.");
  });
}

function initDateCalculatorTool() {
  const root = document.querySelector("[data-date-calculator-tool]");
  if (!root) {
    return;
  }

  const result = root.querySelector("#date-calculator-result");
  const status = root.querySelector("#date-calculator-status");
  const tabs = root.querySelectorAll("[data-date-calculator-mode]");
  const panels = root.querySelectorAll("[data-date-calculator-panel]");
  const startA = root.querySelector("#date-calculator-start-a");
  const endA = root.querySelector("#date-calculator-end-a");
  const targetB = root.querySelector("#date-calculator-target-b");
  const startC = root.querySelector("#date-calculator-start-c");
  const daysC = root.querySelector("#date-calculator-days-c");
  let currentMode = "between";

  const dateInputs = [startA, endA, targetB, startC];

  const resetValidity = () => {
    dateInputs.forEach((input) => setInputValidity(input, false));
    setInputValidity(daysC, false);
  };

  const renderDaysSummary = (prefix, dayCount) => {
    const absoluteDays = Math.abs(dayCount);
    return [
      `${prefix}: ${absoluteDays} day${absoluteDays === 1 ? "" : "s"}`,
      `Weeks: ${formatApproxUnit(absoluteDays / 7, "weeks")}`,
      `Months (approx): ${formatApproxUnit(absoluteDays / 30.44, "months")}`
    ].join("\n");
  };

  const renderCurrentMode = () => {
    resetValidity();

    try {
      if (currentMode === "between") {
        if (!startA.value || !endA.value) {
          setText(result, "");
          setStatus(status, "Choose both dates to see the difference.");
          return;
        }

        const startDate = parseCalendarDateInput(startA.value, "Start date");
        const endDate = parseCalendarDateInput(endA.value, "End date");
        const dayCount = Math.abs(Math.round((endDate.getTime() - startDate.getTime()) / DAY_MS));
        setText(result, renderDaysSummary("Days between dates", dayCount));
        setStatus(status, "Date difference updated.", "success");
        return;
      }

      if (currentMode === "until") {
        if (!targetB.value) {
          setText(result, "");
          setStatus(status, "Choose a target date to see the remaining time.");
          return;
        }

        const targetDate = parseCalendarDateInput(targetB.value, "Target date");
        const today = getTodayCalendarDate();
        const dayCount = Math.round((targetDate.getTime() - today.getTime()) / DAY_MS);
        if (dayCount < 0) {
          const absoluteDays = Math.abs(dayCount);
          setText(result, [
            `Selected date was ${absoluteDays} day${absoluteDays === 1 ? "" : "s"} ago`,
            `Weeks ago: ${formatApproxUnit(absoluteDays / 7, "weeks")}`,
            `Months ago (approx): ${formatApproxUnit(absoluteDays / 30.44, "months")}`
          ].join("\n"));
          setStatus(status, "The selected date is in the past.", "success");
          return;
        }

        setText(result, renderDaysSummary("Days remaining", dayCount));
        setStatus(status, dayCount === 0 ? "The selected date is today." : "Remaining days updated.", "success");
        return;
      }

      if (!startC.value || !daysC.value.trim()) {
        setText(result, "");
        setStatus(status, "Choose a start date and enter a number of days.");
        return;
      }

      const startDate = parseCalendarDateInput(startC.value, "Start date");
      const dayOffset = Number(daysC.value.trim());
      if (!Number.isInteger(dayOffset)) {
        throw new Error("Number of days must be a whole number.");
      }

      const resultDate = new Date(startDate.getTime() + (dayOffset * DAY_MS));
      if (resultDate.getUTCFullYear() < CALENDAR_MIN_YEAR || resultDate.getUTCFullYear() > CALENDAR_MAX_YEAR) {
        throw new Error(`Result date must stay within ${CALENDAR_MIN_YEAR}–${CALENDAR_MAX_YEAR}.`);
      }

      setText(result, [
        `Result date: ${formatCalendarDate(resultDate)}`,
        `Readable date: ${formatReadableCalendarDate(resultDate)}`,
        `Days applied: ${dayOffset}`
      ].join("\n"));
      setStatus(status, "Result date updated.", "success");
    } catch (error) {
      if (currentMode === "between") {
        setInputValidity(startA, Boolean(startA.value));
        setInputValidity(endA, Boolean(endA.value));
      } else if (currentMode === "until") {
        setInputValidity(targetB, Boolean(targetB.value));
      } else {
        setInputValidity(startC, Boolean(startC.value));
        setInputValidity(daysC, Boolean(daysC.value.trim()));
      }
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.getAttribute("data-date-calculator-mode") || "between";
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute("data-date-calculator-panel") !== currentMode;
      });
      renderCurrentMode();
    });
  });

  const bindLiveUpdate = (input) => {
    input?.addEventListener("input", renderCurrentMode);
    input?.addEventListener("change", renderCurrentMode);
  };

  [startA, endA, targetB, startC, daysC].forEach(bindLiveUpdate);

  root.querySelectorAll("[data-date-offset]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!startC.value) {
        startC.value = formatCalendarDate(getTodayCalendarDate());
      }
      if (daysC) {
        daysC.value = button.getAttribute("data-date-offset") || "";
      }
      currentMode = "after";
      tabs.forEach((item) => {
        item.setAttribute("aria-selected", String((item.getAttribute("data-date-calculator-mode") || "between") === "after"));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute("data-date-calculator-panel") !== "after";
      });
      renderCurrentMode();
    });
  });

  root.querySelector("#date-calculator-copy")?.addEventListener("click", async (event) => {
    const value = result.dataset.empty === "true" ? "" : result.textContent.trim();
    const copied = await copyText(value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#date-calculator-clear")?.addEventListener("click", () => {
    [startA, endA, targetB, startC, daysC].forEach((input) => {
      if (input) {
        input.value = "";
      }
    });
    currentMode = "between";
    tabs.forEach((item) => {
      item.setAttribute("aria-selected", String((item.getAttribute("data-date-calculator-mode") || "between") === "between"));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute("data-date-calculator-panel") !== "between";
    });
    resetValidity();
    setText(result, "");
    setStatus(status, "Date inputs cleared.");
  });

  renderCurrentMode();
}

function initBusinessDaysCalculatorTool() {
  const root = document.querySelector("[data-business-days-tool]");
  if (!root) {
    return;
  }

  const result = root.querySelector("#business-days-result");
  const status = root.querySelector("#business-days-status");
  const holidayInput = root.querySelector("#business-days-holidays");
  const holidayHint = root.querySelector("#business-days-holidays-hint");
  const tabs = root.querySelectorAll("[data-business-days-mode]");
  const panels = root.querySelectorAll("[data-business-days-panel]");
  const startA = root.querySelector("#business-days-start-a");
  const endA = root.querySelector("#business-days-end-a");
  const startB = root.querySelector("#business-days-start-b");
  const daysB = root.querySelector("#business-days-days-b");
  const excludeSaturday = root.querySelector("#business-days-exclude-saturday");
  const excludeSunday = root.querySelector("#business-days-exclude-sunday");
  let currentMode = "between";

  const dateInputs = [startA, endA, startB];

  const resetValidity = () => {
    dateInputs.forEach((input) => setInputValidity(input, false));
    setInputValidity(daysB, false);
    setInputValidity(holidayInput, false);
  };

  const updateHolidayHint = () => {
    const { holidays, invalid } = parseHolidayLines(holidayInput.value);
    if (invalid.length) {
      setInputValidity(holidayInput, true);
      setFieldHint(holidayHint, "Invalid holiday date format. Use YYYY-MM-DD.", "error");
      return { holidays, invalid, valid: false };
    }

    setInputValidity(holidayInput, false);
    setFieldHint(
      holidayHint,
      `Holiday format: YYYY-MM-DD, one date per line. Valid holiday dates: ${holidays.size}.`,
      holidays.size ? "success" : ""
    );
    return { holidays, invalid, valid: true };
  };

  const getWeekendOptions = () => ({
    excludeSaturday: Boolean(excludeSaturday?.checked),
    excludeSunday: Boolean(excludeSunday?.checked)
  });

  const renderCurrentMode = () => {
    resetValidity();
    const holidayState = updateHolidayHint();
    if (!holidayState.valid) {
      setText(result, "");
      setStatus(status, "Fix the holiday list format to continue.", "error");
      return;
    }

    try {
      if (currentMode === "between") {
        if (!startA.value || !endA.value) {
          setText(result, "");
          setStatus(status, "Choose both dates to see the business day count.");
          return;
        }

        const startDate = parseCalendarDateInput(startA.value, "Start date");
        const endDate = parseCalendarDateInput(endA.value, "End date");
        if (startDate.getTime() > endDate.getTime()) {
          setInputValidity(startA, true);
          setInputValidity(endA, true);
          throw new Error("Start date must be earlier than or equal to end date.");
        }

        const summary = countBusinessDaysInclusive(startDate, endDate, getWeekendOptions(), holidayState.holidays);
        setText(result, [
          `Business days: ${summary.businessDays}`,
          `Weekend days excluded: ${summary.weekendDays}`,
          `Custom holidays excluded: ${summary.holidayDays}`,
          `Total calendar days: ${summary.totalCalendarDays}`
        ].join("\n"));
        setStatus(status, "Business day count updated.", "success");
        return;
      }

      if (!startB.value || !daysB.value.trim()) {
        setText(result, "");
        setStatus(status, "Choose a start date and enter business days to add.");
        return;
      }

      const startDate = parseCalendarDateInput(startB.value, "Start date");
      const businessDaysToAdd = Number(daysB.value.trim());
      if (!Number.isInteger(businessDaysToAdd) || businessDaysToAdd <= 0) {
        setInputValidity(daysB, Boolean(daysB.value.trim()));
        throw new Error("Number of business days must be greater than 0.");
      }

      const summary = addBusinessDays(startDate, businessDaysToAdd, getWeekendOptions(), holidayState.holidays);
      setText(result, [
        `Result date: ${formatCalendarDate(summary.resultDate)}`,
        `Business days added: ${businessDaysToAdd}`,
        `Skipped weekend days: ${summary.skippedWeekendDays}`,
        `Skipped holidays: ${summary.skippedHolidayDays}`
      ].join("\n"));
      setStatus(status, "Future business date updated.", "success");
    } catch (error) {
      if (currentMode === "between") {
        setInputValidity(startA, Boolean(startA.value));
        setInputValidity(endA, Boolean(endA.value));
      } else {
        setInputValidity(startB, Boolean(startB.value));
        setInputValidity(daysB, Boolean(daysB.value.trim()));
      }
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.getAttribute("data-business-days-mode") || "between";
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute("data-business-days-panel") !== currentMode;
      });
      renderCurrentMode();
    });
  });

  const bindLiveUpdate = (input) => {
    input?.addEventListener("input", renderCurrentMode);
    input?.addEventListener("change", renderCurrentMode);
  };

  [startA, endA, startB, daysB, holidayInput, excludeSaturday, excludeSunday].forEach(bindLiveUpdate);

  root.querySelector("#business-days-copy")?.addEventListener("click", async (event) => {
    const value = result.dataset.empty === "true" ? "" : result.textContent.trim();
    const copied = await copyText(value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#business-days-clear")?.addEventListener("click", () => {
    [startA, endA, startB, daysB, holidayInput].forEach((input) => {
      if (input) {
        input.value = "";
      }
    });
    if (excludeSaturday) {
      excludeSaturday.checked = true;
    }
    if (excludeSunday) {
      excludeSunday.checked = true;
    }
    currentMode = "between";
    tabs.forEach((item) => {
      item.setAttribute("aria-selected", String((item.getAttribute("data-business-days-mode") || "between") === "between"));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute("data-business-days-panel") !== "between";
    });
    resetValidity();
    setText(result, "");
    updateHolidayHint();
    setStatus(status, "Business day inputs cleared.");
  });

  updateHolidayHint();
  renderCurrentMode();
}

function initAgeCalculatorTool() {
  const root = document.querySelector("[data-age-calculator-tool]");
  if (!root) {
    return;
  }

  const birthDateInput = root.querySelector("#age-calculator-birth-date");
  const result = root.querySelector("#age-calculator-result");
  const status = root.querySelector("#age-calculator-status");

  const renderAge = () => {
    setInputValidity(birthDateInput, false);
    try {
      if (!birthDateInput.value) {
        setText(result, "");
        setStatus(status, "Choose a birth date to calculate the age.");
        return;
      }

      const birthDate = parseCalendarDateInput(birthDateInput.value, "Birth date");
      const today = getTodayCalendarDate();
      if (birthDate.getTime() > today.getTime()) {
        setInputValidity(birthDateInput, true);
        throw new Error("Birth date cannot be in the future.");
      }

      const age = getCalendarDiffParts(birthDate, today);
      let nextBirthday = createValidUtcDate(today.getUTCFullYear(), birthDate.getUTCMonth(), birthDate.getUTCDate());
      if (nextBirthday.getTime() < today.getTime()) {
        nextBirthday = createValidUtcDate(today.getUTCFullYear() + 1, birthDate.getUTCMonth(), birthDate.getUTCDate());
      }
      const daysUntilNextBirthday = Math.round((nextBirthday.getTime() - today.getTime()) / DAY_MS);

      setText(result, [
        "Age:",
        `${age.years} years`,
        `${age.months} months`,
        `${age.days} days`,
        "",
        `Next birthday date: ${formatCalendarDate(nextBirthday)}`,
        `Days until next birthday: ${daysUntilNextBirthday}`
      ].join("\n"));
      setStatus(status, "Age updated.", "success");
    } catch (error) {
      if (birthDateInput.value) {
        setInputValidity(birthDateInput, true);
      }
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  };

  birthDateInput?.addEventListener("input", renderAge);
  birthDateInput?.addEventListener("change", renderAge);

  root.querySelector("#age-calculator-copy")?.addEventListener("click", async (event) => {
    const value = result.dataset.empty === "true" ? "" : result.textContent.trim();
    const copied = await copyText(value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#age-calculator-clear")?.addEventListener("click", () => {
    if (birthDateInput) {
      birthDateInput.value = "";
    }
    setInputValidity(birthDateInput, false);
    setText(result, "");
    setStatus(status, "Birth date cleared.");
  });

  renderAge();
}

function initDayOfYearTool() {
  const root = document.querySelector("[data-day-of-year-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#day-of-year-date");
  const result = root.querySelector("#day-of-year-result");
  const status = root.querySelector("#day-of-year-status");

  const renderDayOfYear = () => {
    setInputValidity(input, false);
    try {
      if (!input.value) {
        setText(result, "");
        setStatus(status, "Choose a date to see its position in the year.");
        return;
      }

      const date = parseCalendarDateInput(input.value, "Date");
      const dayOfYear = getDayOfYear(date);
      const yearLength = getYearLength(date.getUTCFullYear());
      const remaining = yearLength - dayOfYear;
      const weekNumber = getIsoWeekNumber(date);

      setText(result, [
        `Day of year: ${dayOfYear}`,
        `Days remaining in year: ${remaining}`,
        `Year length: ${yearLength} days`,
        `Week number: ${weekNumber}`
      ].join("\n"));
      setStatus(status, "Day-of-year details updated.", "success");
    } catch (error) {
      if (input.value) {
        setInputValidity(input, true);
      }
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  };

  if (input && !input.value) {
    input.value = formatCalendarDate(getTodayCalendarDate());
  }

  input?.addEventListener("input", renderDayOfYear);
  input?.addEventListener("change", renderDayOfYear);

  root.querySelector("#day-of-year-copy")?.addEventListener("click", async (event) => {
    const value = result.dataset.empty === "true" ? "" : result.textContent.trim();
    const copied = await copyText(value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#day-of-year-clear")?.addEventListener("click", () => {
    if (input) {
      input.value = formatCalendarDate(getTodayCalendarDate());
    }
    setInputValidity(input, false);
    renderDayOfYear();
  });

  renderDayOfYear();
}

function initTimeDurationCalculatorTool() {
  const root = document.querySelector("[data-time-duration-tool]");
  if (!root) {
    return;
  }

  const result = root.querySelector("#time-duration-result");
  const status = root.querySelector("#time-duration-status");
  const tabs = root.querySelectorAll("[data-time-duration-mode]");
  const panels = root.querySelectorAll("[data-time-duration-panel]");
  const startTime = root.querySelector("#time-duration-start-time");
  const endTime = root.querySelector("#time-duration-end-time");
  const startDateTime = root.querySelector("#time-duration-start-datetime");
  const endDateTime = root.querySelector("#time-duration-end-datetime");
  let currentMode = "time";

  const resetValidity = () => {
    [startTime, endTime, startDateTime, endDateTime].forEach((input) => setInputValidity(input, false));
  };

  const renderDuration = () => {
    resetValidity();
    try {
      if (currentMode === "time") {
        if (!startTime.value || !endTime.value) {
          setText(result, "");
          setStatus(status, "Choose both times to see the duration.");
          return;
        }

        const startMinutes = parseTimeInput(startTime.value);
        const endMinutesRaw = parseTimeInput(endTime.value);
        const endMinutes = endMinutesRaw >= startMinutes ? endMinutesRaw : endMinutesRaw + (24 * 60);
        const duration = formatDurationFromMinutes(endMinutes - startMinutes);
        setText(result, [
          `Duration: ${duration.hours} hours ${duration.minutes} minutes`,
          `Total minutes: ${duration.totalMinutes}`
        ].join("\n"));
        setStatus(status, endMinutesRaw < startMinutes ? "Duration updated. End time was treated as the next day." : "Duration updated.", "success");
        return;
      }

      if (!startDateTime.value || !endDateTime.value) {
        setText(result, "");
        setStatus(status, "Choose both date and time values to see the duration.");
        return;
      }

      const start = parseDateTimeLocalInput(startDateTime.value, "Start date and time");
      const end = parseDateTimeLocalInput(endDateTime.value, "End date and time");
      if (end.getTime() < start.getTime()) {
        setInputValidity(startDateTime, true);
        setInputValidity(endDateTime, true);
        throw new Error("End date and time must be later than or equal to the start date and time.");
      }

      const totalMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
      const duration = formatDurationFromMinutes(totalMinutes);
      setText(result, [
        `Total duration: ${duration.days} days ${duration.hours} hours ${duration.minutes} minutes`,
        `Total hours: ${formatApproxUnit(totalMinutes / 60, "hours")}`,
        `Total minutes: ${duration.totalMinutes}`
      ].join("\n"));
      setStatus(status, "Duration updated.", "success");
    } catch (error) {
      if (currentMode === "time") {
        setInputValidity(startTime, Boolean(startTime.value));
        setInputValidity(endTime, Boolean(endTime.value));
      } else {
        setInputValidity(startDateTime, Boolean(startDateTime.value));
        setInputValidity(endDateTime, Boolean(endDateTime.value));
      }
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.getAttribute("data-time-duration-mode") || "time";
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute("data-time-duration-panel") !== currentMode;
      });
      renderDuration();
    });
  });

  [startTime, endTime, startDateTime, endDateTime].forEach((input) => {
    input?.addEventListener("input", renderDuration);
    input?.addEventListener("change", renderDuration);
  });

  root.querySelector("#time-duration-copy")?.addEventListener("click", async (event) => {
    const value = result.dataset.empty === "true" ? "" : result.textContent.trim();
    const copied = await copyText(value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#time-duration-clear")?.addEventListener("click", () => {
    [startTime, endTime, startDateTime, endDateTime].forEach((input) => {
      if (input) {
        input.value = "";
      }
    });
    currentMode = "time";
    tabs.forEach((item) => item.setAttribute("aria-selected", String((item.getAttribute("data-time-duration-mode") || "time") === "time")));
    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute("data-time-duration-panel") !== "time";
    });
    resetValidity();
    setText(result, "");
    setStatus(status, "Time inputs cleared.");
  });

  renderDuration();
}

function initTimezoneConverterTool() {
  const root = document.querySelector("[data-timezone-converter-tool]");
  if (!root) {
    return;
  }

  const dateInput = root.querySelector("#timezone-converter-date");
  const timeInput = root.querySelector("#timezone-converter-time");
  const fromSelect = root.querySelector("#timezone-converter-from");
  const toSelect = root.querySelector("#timezone-converter-to");
  const result = root.querySelector("#timezone-converter-result");
  const status = root.querySelector("#timezone-converter-status");
  const worldTimesList = document.querySelector("#world-times-list");
  const zones = getSupportedTimezones();
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const worldTimeRows = [
    { label: "Your local time", zone: localZone },
    { label: "UTC time", zone: "UTC" },
    { label: "New York", zone: "America/New_York" },
    { label: "Los Angeles", zone: "America/Los_Angeles" },
    { label: "London", zone: "Europe/London" },
    { label: "Berlin", zone: "Europe/Berlin" },
    { label: "Dubai", zone: "Asia/Dubai" },
    { label: "Bangkok", zone: "Asia/Bangkok" },
    { label: "Tokyo", zone: "Asia/Tokyo" },
    { label: "Sydney", zone: "Australia/Sydney" }
  ].filter((row) => zones.includes(row.zone));

  const populateTimezones = (select) => {
    if (!select) {
      return;
    }
    zones.forEach((zone) => {
      const option = document.createElement("option");
      option.value = zone;
      option.textContent = getTimezoneLabel(zone);
      select.appendChild(option);
    });
  };

  populateTimezones(fromSelect);
  populateTimezones(toSelect);
  if (fromSelect) {
    fromSelect.value = localZone && zones.includes(localZone) ? localZone : "Asia/Bangkok";
  }
  if (toSelect) {
    toSelect.value = "UTC";
  }

  const renderWorldTimes = () => {
    if (!worldTimesList) {
      return;
    }

    const formatterCache = new Map();
    const getFormatter = (zone) => {
      if (!formatterCache.has(zone)) {
        formatterCache.set(zone, new Intl.DateTimeFormat(undefined, {
          timeZone: zone,
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23"
        }));
      }
      return formatterCache.get(zone);
    };

    worldTimesList.textContent = "";
    const now = new Date();

    worldTimeRows.forEach((row) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "world-time-button";
      button.setAttribute("aria-pressed", String(fromSelect?.value === row.zone));

      const city = document.createElement("span");
      city.className = "world-time-button__city";
      city.textContent = row.label;

      const time = document.createElement("span");
      time.className = "world-time-button__time";
      time.textContent = getFormatter(row.zone).format(now);

      button.append(city, time);
      button.addEventListener("click", () => {
        if (fromSelect) {
          fromSelect.value = row.zone;
        }
        renderWorldTimes();
        renderConversion();
      });
      worldTimesList.appendChild(button);
    });
  };

  const renderConversion = () => {
    [dateInput, timeInput, fromSelect, toSelect].forEach((input) => setInputValidity(input, false));
    try {
      if (!dateInput.value || !timeInput.value || !fromSelect.value || !toSelect.value) {
        setText(result, "");
        setStatus(status, "Choose a date, time and both time zones to convert.");
        return;
      }

      const instant = zonedDateTimeToUtc(dateInput.value, timeInput.value, fromSelect.value);
      setText(result, [
        `Converted time: ${formatTimeZoneOutput(instant, toSelect.value)}`,
        `From timezone: ${getTimezoneLabel(fromSelect.value)}`,
        `To timezone: ${getTimezoneLabel(toSelect.value)}`
      ].join("\n"));
      setStatus(status, "Timezone conversion updated.", "success");
    } catch (error) {
      [dateInput, timeInput, fromSelect, toSelect].forEach((input) => setInputValidity(input, true));
      setText(result, "");
      setStatus(status, error.message, "error");
    }
  };

  [dateInput, timeInput, fromSelect, toSelect].forEach((input) => {
    input?.addEventListener("input", () => {
      renderConversion();
      if (input === fromSelect) {
        renderWorldTimes();
      }
    });
    input?.addEventListener("change", () => {
      renderConversion();
      if (input === fromSelect) {
        renderWorldTimes();
      }
    });
  });

  root.querySelector("#timezone-converter-copy")?.addEventListener("click", async (event) => {
    const value = result.dataset.empty === "true" ? "" : result.textContent.trim();
    const copied = await copyText(value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#timezone-converter-clear")?.addEventListener("click", () => {
    if (dateInput) {
      dateInput.value = "";
    }
    if (timeInput) {
      timeInput.value = "";
    }
    if (fromSelect) {
      fromSelect.value = localZone && zones.includes(localZone) ? localZone : "Asia/Bangkok";
    }
    if (toSelect) {
      toSelect.value = "UTC";
    }
    [dateInput, timeInput, fromSelect, toSelect].forEach((input) => setInputValidity(input, false));
    setText(result, "");
    setStatus(status, "Timezone inputs cleared.");
    renderWorldTimes();
  });

  renderWorldTimes();
  renderConversion();
  window.setInterval(renderWorldTimes, 60000);
}

function initBase64Tool() {
  const root = document.querySelector("[data-base64-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#base64-input");
  const output = root.querySelector("#base64-output");
  const status = root.querySelector("#base64-status");

  root.querySelector("#base64-encode")?.addEventListener("click", () => {
    output.value = encodeBase64Unicode(input.value);
    setStatus(status, "Text encoded as Base64.", "success");
  });

  root.querySelector("#base64-decode")?.addEventListener("click", () => {
    try {
      output.value = decodeBase64Unicode(input.value.trim());
      setStatus(status, "Base64 decoded successfully.", "success");
    } catch (error) {
      output.value = "";
      setStatus(status, "Invalid Base64 input. Check the string and try again.", "error");
    }
  });

  root.querySelector("#base64-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget);
    if (!copied) {
      setStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
    }
  });

  root.querySelector("#base64-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    setStatus(status, "Input and output cleared.");
  });
}

function initUrlTool() {
  const root = document.querySelector("[data-url-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#url-input");
  const output = root.querySelector("#url-output");
  const status = root.querySelector("#url-status");

  root.querySelector("#url-encode-btn")?.addEventListener("click", () => {
    output.value = encodeURIComponent(input.value);
    setStatus(status, "String URL-encoded successfully.", "success");
  });

  root.querySelector("#url-decode-btn")?.addEventListener("click", () => {
    try {
      output.value = decodeURIComponent(input.value.trim());
      setStatus(status, "String URL-decoded successfully.", "success");
    } catch (error) {
      output.value = "";
      setStatus(status, "Invalid encoded URL component. Check the input and try again.", "error");
    }
  });

  root.querySelector("#url-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget);
    if (!copied) {
      setStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
    }
  });

  root.querySelector("#url-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    setStatus(status, "Input and output cleared.");
  });
}

function initJsonTool() {
  const root = document.querySelector("[data-json-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#json-input");
  const output = root.querySelector("#json-output");
  const status = root.querySelector("#json-status");

  const parseJson = () => JSON.parse(input.value);

  root.querySelector("#json-format")?.addEventListener("click", () => {
    try {
      output.value = JSON.stringify(parseJson(), null, 2);
      setStatus(status, "Valid JSON formatted successfully.", "success");
    } catch (error) {
      output.value = "";
      setStatus(status, `Invalid JSON: ${error.message}`, "error");
    }
  });

  root.querySelector("#json-minify")?.addEventListener("click", () => {
    try {
      output.value = JSON.stringify(parseJson());
      setStatus(status, "Valid JSON minified successfully.", "success");
    } catch (error) {
      output.value = "";
      setStatus(status, `Invalid JSON: ${error.message}`, "error");
    }
  });

  root.querySelector("#json-validate")?.addEventListener("click", () => {
    try {
      parseJson();
      output.value = "";
      setStatus(status, "JSON is valid.", "success");
    } catch (error) {
      output.value = "";
      setStatus(status, `Invalid JSON: ${error.message}`, "error");
    }
  });

  root.querySelector("#json-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget);
    if (!copied) {
      setStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
    }
  });

  root.querySelector("#json-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    setStatus(status, "Input and output cleared.");
  });
}

function initUuidTool() {
  const root = document.querySelector("[data-uuid-tool]");
  if (!root) {
    return;
  }

  const output = root.querySelector("#uuid-result");
  const countSelect = root.querySelector("#uuid-count");
  const status = root.querySelector("#uuid-status");

  root.querySelector("#uuid-generate")?.addEventListener("click", () => {
    const count = Number(countSelect.value || 1);
    const result = createUuidList(count).join("\n");
    setText(output, result);
    setStatus(status, `${count} UUID v4 ${count === 1 ? "identifier" : "identifiers"} generated.`, "success");
  });

  root.querySelector("#uuid-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.textContent.trim(), event.currentTarget);
    if (!copied) {
      setStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
    }
  });

  root.querySelector("#uuid-clear")?.addEventListener("click", () => {
    setText(output, "");
    setStatus(status, "Generated UUIDs cleared.");
  });
}

function initPasswordTool() {
  const root = document.querySelector("[data-password-tool]");
  if (!root) {
    return;
  }

  const tabs = root.querySelectorAll("[data-password-mode]");
  const panels = root.querySelectorAll("[data-password-panel]");
  const result = root.querySelector("#password-result");
  const status = root.querySelector("#password-status");
  const copyButton = root.querySelector("#password-copy");
  const strengthBadge = root.querySelector("#password-strength");
  const randomLength = root.querySelector("#password-random-length");
  const uppercase = root.querySelector("#password-uppercase");
  const lowercase = root.querySelector("#password-lowercase");
  const numbers = root.querySelector("#password-numbers");
  const symbols = root.querySelector("#password-symbols");
  const excludeSimilar = root.querySelector("#password-exclude-similar");
  const memorableWordCount = root.querySelector("#memorable-word-count");
  const memorableSeparator = root.querySelector("#memorable-separator");
  const memorableAddNumber = root.querySelector("#memorable-add-number");
  const memorableCapitalize = root.querySelector("#memorable-capitalize");
  const pinLength = root.querySelector("#pin-length");

  let currentMode = "random";

  const randomCharacterSets = {
    uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
    lowercase: "abcdefghijkmnopqrstuvwxyz",
    numbers: "23456789",
    symbols: "!@#$%^&*()-_=+[]{}?.,"
  };

  const updateStrength = () => {
    const activeSets = [
      uppercase?.checked ? randomCharacterSets.uppercase : "",
      lowercase?.checked ? randomCharacterSets.lowercase : "",
      numbers?.checked ? randomCharacterSets.numbers : "",
      symbols?.checked ? randomCharacterSets.symbols : ""
    ].filter(Boolean);
    const length = Math.max(4, Math.min(64, Number(randomLength?.value || 16)));
    initStrengthBadge(strengthBadge, getPasswordStrength(length, activeSets));
  };

  const generateRandomPassword = () => {
    const length = Math.max(4, Math.min(64, Number(randomLength?.value || 16)));
    const sets = [
      uppercase?.checked ? randomCharacterSets.uppercase : "",
      lowercase?.checked ? randomCharacterSets.lowercase : "",
      numbers?.checked ? randomCharacterSets.numbers : "",
      symbols?.checked ? randomCharacterSets.symbols : ""
    ].filter(Boolean);

    if (!sets.length) {
      throw new Error("Select at least one character group.");
    }

    let pool = sets.join("");
    if (!excludeSimilar?.checked) {
      pool += "O0Il1";
    }

    const chars = [];
    sets.forEach((set) => {
      chars.push(set[getRandomInt(set.length)]);
    });

    while (chars.length < length) {
      chars.push(pool[getRandomInt(pool.length)]);
    }

    for (let index = chars.length - 1; index > 0; index -= 1) {
      const swapIndex = getRandomInt(index + 1);
      [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
    }

    const value = chars.join("");
    initStrengthBadge(strengthBadge, getPasswordStrength(length, sets));
    return value;
  };

  const generateMemorablePassword = () => {
    const count = Number(memorableWordCount?.value || 3);
    const separator = memorableSeparator?.value ?? "-";
    const words = pickRandomItems(MEMORABLE_WORDS, count).map((word) => (
      memorableCapitalize?.checked ? word.charAt(0).toUpperCase() + word.slice(1) : word
    ));
    let resultValue = words.join(separator);

    if (memorableAddNumber?.checked) {
      resultValue += `${separator}${String(getRandomInt(90) + 10)}`;
    }

    return resultValue;
  };

  const generatePinCode = () => {
    const length = Number(pinLength?.value || 4);
    const digits = [];
    for (let index = 0; index < length; index += 1) {
      digits.push(String(getRandomInt(10)));
    }
    return digits.join("");
  };

  const generateCurrentMode = () => {
    if (currentMode === "memorable") {
      return generateMemorablePassword();
    }
    if (currentMode === "pin") {
      return generatePinCode();
    }
    return generateRandomPassword();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.getAttribute("data-password-mode") || "random";
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.id !== `password-mode-${currentMode}`;
      });
      if (currentMode === "random") {
        updateStrength();
      } else {
        initStrengthBadge(strengthBadge, "Very strong");
      }
      setStatus(status, "Choose your settings and generate locally in your browser.");
    });
  });

  [randomLength, uppercase, lowercase, numbers, symbols].forEach((control) => {
    control?.addEventListener("input", updateStrength);
    control?.addEventListener("change", updateStrength);
  });

  root.querySelector("#password-generate")?.addEventListener("click", () => {
    try {
      const value = generateCurrentMode();
      setText(result, value, "Generated result will appear here.");
      const successText = currentMode === "pin"
        ? "PIN code generated successfully."
        : currentMode === "memorable"
          ? "Memorable password generated successfully."
          : "Random password generated successfully.";
      setStatus(status, successText, "success");
    } catch (error) {
      setText(result, "", "Generated result will appear here.");
      setStatus(status, error.message, "error");
    }
  });

  copyButton?.addEventListener("click", async (event) => {
    if (result.dataset.empty === "true") {
      setStatus(status, "Generate a password, passphrase or PIN first.", "error");
      return;
    }
    const copied = await copyText(result.textContent.trim(), event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
    }
  });

  result?.addEventListener("click", async () => {
    if (result.dataset.empty === "true") {
      return;
    }
    const copied = await copyText(result.textContent.trim(), copyButton, "Copied ✓", 2000);
    if (copied) {
      setStatus(status, "Result copied to your clipboard.", "success");
    } else {
      setStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
    }
  });

  result?.addEventListener("keydown", async (event) => {
    if ((event.key === "Enter" || event.key === " ") && result.dataset.empty !== "true") {
      event.preventDefault();
      const copied = await copyText(result.textContent.trim(), copyButton, "Copied ✓", 2000);
      if (copied) {
        setStatus(status, "Result copied to your clipboard.", "success");
      } else {
        setStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
      }
    }
  });

  root.querySelector("#password-clear")?.addEventListener("click", () => {
    setText(result, "", "Generated result will appear here.");
    setStatus(status, "Result cleared.");
  });

  updateStrength();
}

function htmlToPlainText(input) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "text/html");
  const ignoredTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);
  const doubleBreakTags = new Set([
    "ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DIV", "DL", "FIELDSET", "FIGCAPTION", "FIGURE",
    "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HR", "LI", "MAIN", "NAV",
    "OL", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"
  ]);
  const singleBreakTags = new Set(["BR"]);
  let output = "";

  const appendBreak = (count) => {
    const normalizedCount = count === 1 ? 1 : 2;
    if (!output) {
      return;
    }
    const existingBreaks = output.match(/\n+$/);
    const trailingBreaks = existingBreaks ? existingBreaks[0].length : 0;
    if (trailingBreaks < normalizedCount) {
      output += "\n".repeat(normalizedCount - trailingBreaks);
    }
  };

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      output += node.nodeValue || "";
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const tagName = node.tagName;
    if (ignoredTags.has(tagName)) {
      return;
    }

    if (singleBreakTags.has(tagName)) {
      appendBreak(1);
      return;
    }

    const isBlock = doubleBreakTags.has(tagName);
    if (isBlock && output && !output.endsWith("\n")) {
      appendBreak(1);
    }

    Array.from(node.childNodes).forEach(walk);

    if (isBlock) {
      appendBreak(2);
    }
  };

  Array.from(documentNode.body.childNodes).forEach(walk);

  return output
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function htmlToMarkdown(input) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "text/html");
  const ignoredTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);
  const blockTags = new Set([
    "ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DIV", "DL", "FIELDSET", "FIGCAPTION", "FIGURE",
    "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HR", "LI", "MAIN", "NAV",
    "OL", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"
  ]);

  const escapeMarkdownText = (value) => value
    .replace(/\\/g, "\\\\")
    .replace(/([\\`*_\[\]])/g, "\\$1");

  const normalizeInlineWhitespace = (value) => value.replace(/\s+/g, " ");

  const normalizeInlineMarkdown = (value) => value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  const cleanupMarkdownOutput = (value) => value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const indentBlock = (value, prefix) => value
    .split("\n")
    .map((line) => (line ? `${prefix}${line}` : prefix.trimEnd()))
    .join("\n");

  const serializeChildren = (node, context = {}) => Array.from(node.childNodes)
    .map((child) => serializeNode(child, context))
    .join("");

  const serializeList = (node, depth = 0) => {
    const isOrdered = node.tagName === "OL";
    const items = [];

    Array.from(node.children).forEach((child, index) => {
      if (child.tagName !== "LI") {
        return;
      }

      const nestedLists = [];
      const inlineContent = [];

      Array.from(child.childNodes).forEach((grandChild) => {
        if (
          grandChild.nodeType === Node.ELEMENT_NODE
          && (grandChild.tagName === "UL" || grandChild.tagName === "OL")
        ) {
          nestedLists.push(serializeList(grandChild, depth + 1).trimEnd());
          return;
        }

        inlineContent.push(serializeNode(grandChild, { inline: true, listDepth: depth }));
      });

      const marker = isOrdered ? `${index + 1}. ` : "- ";
      const prefix = `${"  ".repeat(depth)}${marker}`;
      const itemText = normalizeInlineMarkdown(inlineContent.join("").trim());
      let itemOutput = `${prefix}${itemText}`;

      if (nestedLists.length) {
        itemOutput += `\n${nestedLists.join("\n")}`;
      }

      items.push(itemOutput.trimEnd());
    });

    return `${items.join("\n")}\n\n`;
  };

  const serializeNode = (node, context = {}) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = context.preformatted
        ? (node.nodeValue || "")
        : normalizeInlineWhitespace(node.nodeValue || "");
      return escapeMarkdownText(text);
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const tagName = node.tagName;
    if (ignoredTags.has(tagName)) {
      return "";
    }

    if (/^H[1-6]$/.test(tagName)) {
      const level = Number(tagName[1]);
      const text = normalizeInlineMarkdown(serializeChildren(node, { inline: true }));
      return `${"#".repeat(level)} ${text}\n\n`;
    }

    if (tagName === "P") {
      return `${normalizeInlineMarkdown(serializeChildren(node, { inline: true }))}\n\n`;
    }

    if (tagName === "BR") {
      return "\n";
    }

    if (tagName === "HR") {
      return "---\n\n";
    }

    if (tagName === "STRONG" || tagName === "B") {
      return `**${normalizeInlineMarkdown(serializeChildren(node, { inline: true }))}**`;
    }

    if (tagName === "EM" || tagName === "I") {
      return `*${normalizeInlineMarkdown(serializeChildren(node, { inline: true }))}*`;
    }

    if (tagName === "CODE" && node.parentElement?.tagName !== "PRE") {
      const text = (node.textContent || "").replace(/\s+/g, " ").trim().replace(/`/g, "\\`");
      return `\`${text}\``;
    }

    if (tagName === "PRE") {
      const text = (node.textContent || "").replace(/\n+$/g, "");
      return `\`\`\`\n${text}\n\`\`\`\n\n`;
    }

    if (tagName === "A") {
      const href = node.getAttribute("href")?.trim() || "";
      const text = normalizeInlineMarkdown(serializeChildren(node, { inline: true })) || href;
      return href ? `[${text}](${href})` : text;
    }

    if (tagName === "IMG") {
      const src = node.getAttribute("src")?.trim() || "";
      const alt = escapeMarkdownText(node.getAttribute("alt")?.trim() || "");
      return src ? `![${alt}](${src})` : alt;
    }

    if (tagName === "UL" || tagName === "OL") {
      return serializeList(node, context.listDepth || 0);
    }

    if (tagName === "BLOCKQUOTE") {
      const text = cleanupMarkdownOutput(serializeChildren(node));
      return `${indentBlock(text, "> ")}\n\n`;
    }

    if (tagName === "TABLE") {
      const rows = Array.from(node.querySelectorAll("tr"))
        .map((row) => Array.from(row.children)
          .map((cell) => normalizeInlineMarkdown(cell.textContent || ""))
          .filter(Boolean)
          .join(" | "))
        .filter(Boolean);
      return rows.length ? `${rows.join("\n")}\n\n` : "";
    }

    if (blockTags.has(tagName)) {
      const text = serializeChildren(node, { listDepth: context.listDepth || 0 });
      return context.inline ? text : `${text}${text.endsWith("\n\n") ? "" : "\n\n"}`;
    }

    return serializeChildren(node, context);
  };

  return cleanupMarkdownOutput(serializeChildren(documentNode.body));
}

function initRemoveHtmlTool() {
  const root = document.querySelector("[data-remove-html-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#remove-html-input");
  const output = root.querySelector("#remove-html-output");
  const status = root.querySelector("#remove-html-status");

  root.querySelector("#remove-html-submit")?.addEventListener("click", () => {
    const value = input.value;
    if (!value.trim()) {
      output.value = "";
      setStatus(status, "Paste HTML or formatted text first.", "error");
      return;
    }

    output.value = htmlToPlainText(value);
    setStatus(status, "HTML tags removed successfully.", "success");
  });

  root.querySelector("#remove-html-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, output.value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#remove-html-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    setStatus(status, "Input and output cleared.");
  });
}

function initHtmlMarkdownTool() {
  const root = document.querySelector("[data-html-markdown-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#html-markdown-input");
  const output = root.querySelector("#html-markdown-output");
  const status = root.querySelector("#html-markdown-status");

  root.querySelector("#html-markdown-submit")?.addEventListener("click", () => {
    const value = input.value;
    if (!value.trim()) {
      output.value = "";
      setStatus(status, "Paste HTML or formatted text first.", "error");
      return;
    }

    output.value = htmlToMarkdown(value);
    setStatus(status, "HTML converted to Markdown successfully.", "success");
  });

  root.querySelector("#html-markdown-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, output.value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#html-markdown-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    setStatus(status, "Input and output cleared.");
  });
}

const MORSE_CODE_ENTRIES = [
  ["A", ".-"], ["B", "-..."], ["C", "-.-."], ["D", "-.."], ["E", "."], ["F", "..-."],
  ["G", "--."], ["H", "...."], ["I", ".."], ["J", ".---"], ["K", "-.-"], ["L", ".-.."],
  ["M", "--"], ["N", "-."], ["O", "---"], ["P", ".--."], ["Q", "--.-"], ["R", ".-."],
  ["S", "..."], ["T", "-"], ["U", "..-"], ["V", "...-"], ["W", ".--"], ["X", "-..-"],
  ["Y", "-.--"], ["Z", "--.."],
  ["0", "-----"], ["1", ".----"], ["2", "..---"], ["3", "...--"], ["4", "....-"], ["5", "....."],
  ["6", "-...."], ["7", "--..."], ["8", "---.."], ["9", "----."],
  [".", ".-.-.-"], [",", "--..--"], ["?", "..--.."]
];

const MORSE_TEXT_MAP = new Map(MORSE_CODE_ENTRIES);
const MORSE_CODE_MAP = new Map(MORSE_CODE_ENTRIES.map(([character, code]) => [code, character]));

function initMorseTool() {
  const root = document.querySelector("[data-morse-tool]");
  const tableBody = document.querySelector("[data-morse-table]");
  if (!root && !tableBody) {
    return;
  }

  if (tableBody) {
    MORSE_CODE_ENTRIES.forEach(([character, code]) => {
      const row = document.createElement("tr");
      const charCell = document.createElement("th");
      charCell.scope = "row";
      charCell.textContent = character;
      const codeCell = document.createElement("td");
      codeCell.textContent = code;
      row.append(charCell, codeCell);
      tableBody.appendChild(row);
    });
  }

  if (!root) {
    return;
  }

  const input = root.querySelector("#morse-input");
  const output = root.querySelector("#morse-output");
  const status = root.querySelector("#morse-status");
  const playButton = root.querySelector("#morse-play");
  const stopButton = root.querySelector("#morse-stop");
  const audioState = {
    context: null,
    oscillator: null,
    stopTimer: null,
    playing: false
  };

  const canPlayMorse = (value) => {
    const trimmed = value.trim();
    return Boolean(trimmed) && /^[.\-/\s]+$/.test(trimmed) && /[.-]/.test(trimmed);
  };

  const updateAudioButtons = () => {
    const playable = canPlayMorse(output.value);
    if (playButton) {
      playButton.disabled = audioState.playing || !playable;
      playButton.textContent = audioState.playing ? "Playing..." : "Play Morse Sound";
    }
    if (stopButton) {
      stopButton.disabled = !audioState.playing;
    }
  };

  const stopPlayback = async (message = "") => {
    if (audioState.stopTimer) {
      window.clearTimeout(audioState.stopTimer);
      audioState.stopTimer = null;
    }

    if (audioState.oscillator) {
      try {
        audioState.oscillator.stop();
      } catch (error) {
      }
    }

    if (audioState.context) {
      try {
        await audioState.context.close();
      } catch (error) {
      }
    }

    audioState.context = null;
    audioState.oscillator = null;
    audioState.playing = false;
    updateAudioButtons();

    if (message) {
      setStatus(status, message, "success");
    }
  };

  const buildPlaybackTimeline = (value, unit = 0.1) => {
    const words = value.trim().split(/\s*\/\s*/).filter(Boolean);
    const timeline = [];
    let cursor = 0;

    words.forEach((word, wordIndex) => {
      const letters = word.trim().split(/\s+/).filter(Boolean);
      letters.forEach((letter, letterIndex) => {
        Array.from(letter).forEach((symbol, symbolIndex) => {
          const duration = symbol === "." ? unit : unit * 3;
          timeline.push([cursor, duration]);
          cursor += duration;
          if (symbolIndex < letter.length - 1) {
            cursor += unit;
          }
        });

        if (letterIndex < letters.length - 1) {
          cursor += unit * 3;
        }
      });

      if (wordIndex < words.length - 1) {
        cursor += unit * 7;
      }
    });

    return {
      timeline,
      totalDuration: cursor
    };
  };

  const encodeTextToMorse = (value) => {
    const words = value.toUpperCase().trim().split(/\s+/).filter(Boolean);
    let skipped = 0;

    const encodedWords = words.map((word) => {
      const letters = [];
      Array.from(word).forEach((character) => {
        const code = MORSE_TEXT_MAP.get(character);
        if (code) {
          letters.push(code);
        } else {
          skipped += 1;
        }
      });
      return letters.join(" ");
    }).filter(Boolean);

    return {
      value: encodedWords.join(" / "),
      skipped
    };
  };

  const decodeMorseToText = (value) => {
    const words = value.trim().split(/\s*\/\s*/).filter(Boolean);
    let unknown = 0;

    const decodedWords = words.map((word) => word
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => {
        const character = MORSE_CODE_MAP.get(token);
        if (character) {
          return character;
        }
        unknown += 1;
        return "?";
      })
      .join(""))
      .filter(Boolean);

    return {
      value: decodedWords.join(" "),
      unknown
    };
  };

  const setOutputValue = (value) => {
    output.value = value;
    updateAudioButtons();
  };

  root.querySelector("#morse-encode")?.addEventListener("click", () => {
    stopPlayback();
    const value = input.value;
    if (!value.trim()) {
      setOutputValue("");
      setStatus(status, "Type text first.", "error");
      return;
    }

    const result = encodeTextToMorse(value);
    setOutputValue(result.value);
    if (result.skipped > 0) {
      setStatus(status, "Text converted to Morse code. Unsupported characters were skipped.", "success");
    } else {
      setStatus(status, "Text converted to Morse code successfully.", "success");
    }
  });

  root.querySelector("#morse-decode")?.addEventListener("click", () => {
    stopPlayback();
    const value = input.value;
    if (!value.trim()) {
      setOutputValue("");
      setStatus(status, "Paste Morse code first.", "error");
      return;
    }

    const result = decodeMorseToText(value);
    setOutputValue(result.value);
    if (result.unknown > 0) {
      setStatus(status, "Morse code translated. Unknown patterns were replaced with ?.", "success");
    } else {
      setStatus(status, "Morse code translated successfully.", "success");
    }
  });

  root.querySelector("#morse-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, output.value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  playButton?.addEventListener("click", async () => {
    if (!canPlayMorse(output.value)) {
      setStatus(status, "Convert text to Morse code first.", "error");
      updateAudioButtons();
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setStatus(status, "Web Audio API is not supported in this browser.", "error");
      return;
    }

    await stopPlayback();

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const { timeline, totalDuration } = buildPlaybackTimeline(output.value);
    const startAt = context.currentTime + 0.02;
    const volume = 0.08;

    oscillator.type = "sine";
    oscillator.frequency.value = 650;
    gainNode.gain.setValueAtTime(0, startAt);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    await context.resume();
    oscillator.start(startAt);

    timeline.forEach(([offset, duration]) => {
      const toneStart = startAt + offset;
      const toneEnd = toneStart + duration;
      const holdUntil = toneStart + Math.max(duration * 0.65, duration - 0.015);
      gainNode.gain.setValueAtTime(0, toneStart);
      gainNode.gain.linearRampToValueAtTime(volume, toneStart + 0.005);
      gainNode.gain.setValueAtTime(volume, holdUntil);
      gainNode.gain.linearRampToValueAtTime(0, toneEnd);
    });

    oscillator.stop(startAt + totalDuration + 0.05);

    audioState.context = context;
    audioState.oscillator = oscillator;
    audioState.playing = true;
    updateAudioButtons();
    setStatus(status, "Playing Morse audio.", "success");

    audioState.stopTimer = window.setTimeout(() => {
      stopPlayback("Morse audio playback finished.");
    }, (totalDuration + 0.2) * 1000);
  });

  stopButton?.addEventListener("click", () => {
    stopPlayback("Playback stopped.");
  });

  root.querySelector("#morse-clear")?.addEventListener("click", () => {
    stopPlayback();
    input.value = "";
    setOutputValue("");
    setStatus(status, "Input and output cleared.");
  });

  updateAudioButtons();
}

function initNumberTool() {
  const root = document.querySelector("[data-number-tool]");
  if (!root) {
    return;
  }

  const MAX_GENERATED_NUMBERS = 100000;
  const tabs = root.querySelectorAll("[data-number-mode]");
  const panels = root.querySelectorAll("[data-number-panel]");
  const output = root.querySelector("#number-output");
  const status = root.querySelector("#number-status");
  const generateButton = root.querySelector("#number-generate");
  const separatorSelect = root.querySelector("#number-separator");
  const customSeparatorWrap = root.querySelector("#number-custom-separator-wrap");
  const customSeparatorInput = root.querySelector("#number-custom-separator");
  const sequenceStart = root.querySelector("#number-sequence-start");
  const sequenceEnd = root.querySelector("#number-sequence-end");
  const sequenceStep = root.querySelector("#number-sequence-step");
  const sequenceEstimate = root.querySelector("#number-sequence-estimate");
  const randomCount = root.querySelector("#number-random-count");
  const randomMin = root.querySelector("#number-random-min");
  const randomMax = root.querySelector("#number-random-max");
  const randomUnique = root.querySelector("#number-random-unique");
  const randomEstimate = root.querySelector("#number-random-estimate");
  let currentMode = "sequence";

  const parseInteger = (input, label) => {
    const value = Number(input.value);
    if (!Number.isInteger(value)) {
      throw new Error(`${label} must be an integer.`);
    }
    return value;
  };

  const resolveSeparator = () => {
    const value = separatorSelect?.value || "newline";
    if (value === "comma") {
      return ",";
    }
    if (value === "space") {
      return " ";
    }
    if (value === "custom") {
      return customSeparatorInput?.value ?? "";
    }
    return "\n";
  };

  const updateSeparatorInput = () => {
    if (customSeparatorWrap) {
      customSeparatorWrap.hidden = separatorSelect?.value !== "custom";
    }
  };

  const resetValidationState = () => {
    [sequenceStart, sequenceEnd, sequenceStep, randomCount, randomMin, randomMax].forEach((input) => {
      setInputValidity(input, false);
    });
  };

  const validateSequenceState = () => {
    [sequenceStart, sequenceEnd, sequenceStep].forEach((input) => setInputValidity(input, false));

    let start;
    let end;
    let step;
    try {
      start = parseInteger(sequenceStart, "Start");
      end = parseInteger(sequenceEnd, "End");
      step = parseInteger(sequenceStep, "Step");
    } catch (error) {
      if (!Number.isInteger(Number(sequenceStart.value))) {
        setInputValidity(sequenceStart, true);
      }
      if (!Number.isInteger(Number(sequenceEnd.value))) {
        setInputValidity(sequenceEnd, true);
      }
      if (!Number.isInteger(Number(sequenceStep.value))) {
        setInputValidity(sequenceStep, true);
      }
      setFieldHint(sequenceEstimate, error.message, "error");
      return false;
    }

    if (step === 0) {
      setInputValidity(sequenceStep, true);
      setFieldHint(sequenceEstimate, "Step must not be 0.", "error");
      return false;
    }
    if (start < end && step < 0) {
      setInputValidity(sequenceStep, true);
      setFieldHint(sequenceEstimate, "Step must be positive when End is greater than Start.", "error");
      return false;
    }
    if (start > end && step > 0) {
      setInputValidity(sequenceStep, true);
      setFieldHint(sequenceEstimate, "Step must be negative when Start is greater than End.", "error");
      return false;
    }

    const expected = Math.floor((end - start) / step) + 1;
    if (!Number.isFinite(expected) || expected <= 0) {
      setInputValidity(sequenceStart, true);
      setInputValidity(sequenceEnd, true);
      setInputValidity(sequenceStep, true);
      setFieldHint(sequenceEstimate, "Expected output size must be greater than 0.", "error");
      return false;
    }
    if (expected > MAX_GENERATED_NUMBERS) {
      setInputValidity(sequenceStart, true);
      setInputValidity(sequenceEnd, true);
      setInputValidity(sequenceStep, true);
      setFieldHint(sequenceEstimate, "Too many numbers. Maximum allowed is 100000.", "error");
      return false;
    }

    setFieldHint(sequenceEstimate, `Expected output size: ${expected} items`, "success");
    return true;
  };

  const validateRandomState = () => {
    [randomCount, randomMin, randomMax].forEach((input) => setInputValidity(input, false));

    let count;
    let min;
    let max;
    try {
      count = parseInteger(randomCount, "Count");
      min = parseInteger(randomMin, "Min");
      max = parseInteger(randomMax, "Max");
    } catch (error) {
      if (!Number.isInteger(Number(randomCount.value))) {
        setInputValidity(randomCount, true);
      }
      if (!Number.isInteger(Number(randomMin.value))) {
        setInputValidity(randomMin, true);
      }
      if (!Number.isInteger(Number(randomMax.value))) {
        setInputValidity(randomMax, true);
      }
      setFieldHint(randomEstimate, error.message, "error");
      return false;
    }

    if (count < 1) {
      setInputValidity(randomCount, true);
      setFieldHint(randomEstimate, "Count must be at least 1.", "error");
      return false;
    }
    if (count > MAX_GENERATED_NUMBERS) {
      setInputValidity(randomCount, true);
      setFieldHint(randomEstimate, "Too many numbers. Maximum allowed is 100000.", "error");
      return false;
    }
    if (min > max) {
      setInputValidity(randomMin, true);
      setInputValidity(randomMax, true);
      setFieldHint(randomEstimate, "Min must be less than or equal to Max.", "error");
      return false;
    }

    const rangeSize = max - min + 1;
    if (!Number.isSafeInteger(rangeSize) || rangeSize <= 0) {
      setInputValidity(randomMin, true);
      setInputValidity(randomMax, true);
      setFieldHint(randomEstimate, "The selected range is too large.", "error");
      return false;
    }
    if (randomUnique?.checked && count > rangeSize) {
      setInputValidity(randomCount, true);
      setInputValidity(randomMin, true);
      setInputValidity(randomMax, true);
      setFieldHint(randomEstimate, "Not enough unique numbers in the selected range.", "error");
      return false;
    }

    setFieldHint(randomEstimate, `Expected output size: ${count} items`, "success");
    return true;
  };

  const updateValidation = () => {
    resetValidationState();
    const valid = currentMode === "random" ? validateRandomState() : validateSequenceState();
    if (generateButton) {
      generateButton.disabled = !valid;
    }
  };

  const generateSequence = () => {
    const start = parseInteger(sequenceStart, "Start");
    const end = parseInteger(sequenceEnd, "End");
    const step = parseInteger(sequenceStep, "Step");

    if (step === 0) {
      throw new Error("Step must not be 0.");
    }
    if (start < end && step < 0) {
      throw new Error("Step must be positive when End is greater than Start.");
    }
    if (start > end && step > 0) {
      throw new Error("Step must be negative when Start is greater than End.");
    }

    const numbers = [];
    if (step > 0) {
      for (let value = start; value <= end; value += step) {
        numbers.push(String(value));
        if (numbers.length > MAX_GENERATED_NUMBERS) {
          throw new Error("Too many numbers. Maximum allowed is 100000.");
        }
      }
    } else {
      for (let value = start; value >= end; value += step) {
        numbers.push(String(value));
        if (numbers.length > MAX_GENERATED_NUMBERS) {
          throw new Error("Too many numbers. Maximum allowed is 100000.");
        }
      }
    }

    return numbers;
  };

  const getRandomIntInclusive = (min, max) => {
    const range = max - min + 1;
    return min + getRandomInt(range);
  };

  const generateRandomNumbers = () => {
    const count = parseInteger(randomCount, "Count");
    const min = parseInteger(randomMin, "Min");
    const max = parseInteger(randomMax, "Max");
    const unique = Boolean(randomUnique?.checked);

    if (count < 1) {
      throw new Error("Count must be at least 1.");
    }
    if (count > MAX_GENERATED_NUMBERS) {
      throw new Error("Too many numbers. Maximum allowed is 100000.");
    }
    if (min > max) {
      throw new Error("Min must be less than or equal to Max.");
    }

    const rangeSize = max - min + 1;
    if (!Number.isSafeInteger(rangeSize) || rangeSize <= 0) {
      throw new Error("The selected range is too large.");
    }
    if (unique && count > rangeSize) {
      throw new Error("Not enough unique numbers in the selected range.");
    }

    const numbers = [];
    if (unique) {
      const used = new Set();
      while (numbers.length < count) {
        const value = getRandomIntInclusive(min, max);
        if (used.has(value)) {
          continue;
        }
        used.add(value);
        numbers.push(String(value));
      }
    } else {
      for (let index = 0; index < count; index += 1) {
        numbers.push(String(getRandomIntInclusive(min, max)));
      }
    }

    return numbers;
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.getAttribute("data-number-mode") || "sequence";
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.id !== `number-mode-${currentMode}`;
      });
      setStatus(status, "Choose a mode, set your values and generate locally in your browser.");
      updateValidation();
    });
  });

  separatorSelect?.addEventListener("change", updateSeparatorInput);
  [sequenceStart, sequenceEnd, sequenceStep, randomCount, randomMin, randomMax].forEach((input) => {
    input?.addEventListener("input", updateValidation);
  });
  randomUnique?.addEventListener("change", updateValidation);

  root.querySelector("#number-generate")?.addEventListener("click", () => {
    try {
      const values = currentMode === "random" ? generateRandomNumbers() : generateSequence();
      output.value = values.join(resolveSeparator());
      setStatus(
        status,
        currentMode === "random"
          ? "Random numbers generated successfully."
          : "Number sequence generated successfully.",
        "success"
      );
    } catch (error) {
      output.value = "";
      setStatus(status, error.message, "error");
    }
  });

  root.querySelector("#number-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, output.value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#number-clear")?.addEventListener("click", () => {
    sequenceStart.value = "1";
    sequenceEnd.value = "10";
    sequenceStep.value = "1";
    randomCount.value = "5";
    randomMin.value = "1";
    randomMax.value = "100";
    if (randomUnique) {
      randomUnique.checked = false;
    }
    if (separatorSelect) {
      separatorSelect.value = "newline";
    }
    if (customSeparatorInput) {
      customSeparatorInput.value = " | ";
    }
    updateSeparatorInput();
    output.value = "";
    setStatus(status, "Inputs and output cleared.");
    updateValidation();
  });

  updateSeparatorInput();
  updateValidation();
}

function parseSpintaxTemplate(input) {
  let index = 0;

  const parseSequence = (stopChars = new Set()) => {
    const nodes = [];
    let text = "";

    while (index < input.length) {
      const character = input[index];
      if (stopChars.has(character)) {
        break;
      }

      if (character === "{" || character === "[") {
        if (text) {
          nodes.push({ type: "text", value: text });
          text = "";
        }
        index += 1;
        nodes.push({
          type: "choice",
          options: parseOptions(character === "{" ? "}" : "]")
        });
        continue;
      }

      if (character === "}" || character === "]") {
        throw new Error("Invalid spintax pattern. Please check brackets and separators.");
      }

      text += character;
      index += 1;
    }

    if (text) {
      nodes.push({ type: "text", value: text });
    }

    return nodes;
  };

  const optionHasContent = (nodes) => nodes.some((node) => {
    if (node.type === "text") {
      return node.value.length > 0;
    }
    return true;
  });

  const parseOptions = (closingChar) => {
    const options = [];

    while (true) {
      const nodes = parseSequence(new Set(["|", closingChar]));
      if (!optionHasContent(nodes)) {
        throw new Error("Invalid spintax pattern. Please check brackets and separators.");
      }

      options.push(nodes);

      if (index >= input.length) {
        throw new Error("Invalid spintax pattern. Please check brackets and separators.");
      }

      const separator = input[index];
      if (separator === "|") {
        index += 1;
        continue;
      }

      if (separator === closingChar) {
        index += 1;
        break;
      }

      throw new Error("Invalid spintax pattern. Please check brackets and separators.");
    }

    return options;
  };

  const ast = parseSequence();
  if (index !== input.length) {
    throw new Error("Invalid spintax pattern. Please check brackets and separators.");
  }
  return ast;
}

function initSpintaxTool() {
  const root = document.querySelector("[data-spintax-tool]");
  if (!root) {
    return;
  }

  const MAX_ALL_VARIATIONS = 5000;
  const tabs = root.querySelectorAll("[data-spintax-mode]");
  const panels = root.querySelectorAll("[data-spintax-panel]");
  const input = root.querySelector("#spintax-input");
  const output = root.querySelector("#spintax-output");
  const status = root.querySelector("#spintax-status");
  const generateButton = root.querySelector("#spintax-generate");
  const countInput = root.querySelector("#spintax-count");
  const estimate = root.querySelector("#spintax-estimate");
  const removeDuplicates = root.querySelector("#spintax-remove-duplicates");
  const trimSpaces = root.querySelector("#spintax-trim-spaces");
  let currentMode = "multiple";

  const normalizeText = (value) => {
    if (!trimSpaces?.checked) {
      return value;
    }

    return value
      .replace(/\s+/g, " ")
      .trim();
  };

  const renderNodesRandom = (nodes) => nodes.map((node) => {
    if (node.type === "text") {
      return node.value;
    }

    const selected = node.options[getRandomInt(node.options.length)];
    return renderNodesRandom(selected);
  }).join("");

  const countNodeVariations = (node) => {
    if (node.type === "text") {
      return 1;
    }

    return node.options.reduce((sum, option) => sum + countSequenceVariations(option), 0);
  };

  const countSequenceVariations = (nodes) => nodes.reduce((product, node) => {
    const count = countNodeVariations(node);
    const next = product * count;
    if (next > MAX_ALL_VARIATIONS) {
      return MAX_ALL_VARIATIONS + 1;
    }
    return next;
  }, 1);

  const expandNodesAll = (nodes) => {
    let results = [""];

    nodes.forEach((node) => {
      const nodeVariants = node.type === "text"
        ? [node.value]
        : node.options.flatMap((option) => expandNodesAll(option));

      const nextResults = [];
      results.forEach((prefix) => {
        nodeVariants.forEach((variant) => {
          if (nextResults.length >= MAX_ALL_VARIATIONS + 1) {
            return;
          }
          nextResults.push(prefix + variant);
        });
      });
      results = nextResults;
    });

    return results;
  };

  const updateValidation = () => {
    setInputValidity(input, false);
    setInputValidity(countInput, false);

    if (!input.value.trim()) {
      setFieldHint(
        estimate,
        currentMode === "all"
          ? "Estimated total combinations: 0"
          : currentMode === "multiple"
            ? "Enter a spintax template to generate variations."
            : "Generate one variation from the current template."
      );
      if (generateButton) {
        generateButton.disabled = true;
      }
      return;
    }

    let ast;
    try {
      ast = parseSpintaxTemplate(input.value);
    } catch (error) {
      setInputValidity(input, true);
      setFieldHint(estimate, error.message, "error");
      if (generateButton) {
        generateButton.disabled = true;
      }
      return;
    }

    if (currentMode === "multiple") {
      const count = Number(countInput?.value || "");
      if (!Number.isInteger(count) || count < 1) {
        setInputValidity(countInput, true);
        setFieldHint(estimate, "Number of variations must be a positive integer.", "error");
        if (generateButton) {
          generateButton.disabled = true;
        }
        return;
      }
      if (count > MAX_ALL_VARIATIONS) {
        setInputValidity(countInput, true);
        setFieldHint(estimate, "Too many variations requested. Maximum allowed is 5000.", "error");
        if (generateButton) {
          generateButton.disabled = true;
        }
        return;
      }

      setFieldHint(estimate, `Requested variations: ${count}`, "success");
      if (generateButton) {
        generateButton.disabled = false;
      }
      return;
    }

    if (currentMode === "all") {
      const totalVariations = countSequenceVariations(ast);
      if (totalVariations > MAX_ALL_VARIATIONS) {
        setInputValidity(input, true);
        setFieldHint(estimate, "Too many possible variations. Please simplify the template or generate a smaller sample.", "error");
        if (generateButton) {
          generateButton.disabled = true;
        }
        return;
      }

      setFieldHint(estimate, `Estimated total combinations: ${totalVariations}`, "success");
      if (generateButton) {
        generateButton.disabled = false;
      }
      return;
    }

    setFieldHint(estimate, "Generate one variation from the current template.", "success");
    if (generateButton) {
      generateButton.disabled = false;
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.getAttribute("data-spintax-mode") || "multiple";
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panels.forEach((panel) => {
        panel.hidden = panel.id !== `spintax-mode-${currentMode}`;
      });
      setStatus(status, "Choose a mode and expand your template locally in your browser.");
      updateValidation();
    });
  });

  input?.addEventListener("input", updateValidation);
  countInput?.addEventListener("input", updateValidation);

  root.querySelector("#spintax-generate")?.addEventListener("click", () => {
    const template = input.value;
    if (!template.trim()) {
      output.value = "";
      setStatus(status, "Enter a spintax template first.", "error");
      return;
    }

    try {
      const ast = parseSpintaxTemplate(template);
      let values = [];

      if (currentMode === "one") {
        values = [normalizeText(renderNodesRandom(ast))];
      } else if (currentMode === "all") {
        const totalVariations = countSequenceVariations(ast);
        if (totalVariations > MAX_ALL_VARIATIONS) {
          throw new Error("Too many possible variations. Please simplify the template or generate a smaller sample.");
        }
        values = expandNodesAll(ast).map(normalizeText);
      } else {
        const count = Number(countInput?.value || 10);
        if (!Number.isInteger(count) || count < 1) {
          throw new Error("Number of variations must be a positive integer.");
        }
        if (count > MAX_ALL_VARIATIONS) {
          throw new Error("Too many variations requested. Maximum allowed is 5000.");
        }

        for (let index = 0; index < count; index += 1) {
          values.push(normalizeText(renderNodesRandom(ast)));
        }
      }

      if (removeDuplicates?.checked) {
        values = [...new Set(values)];
      }

      output.value = values.join("\n");
      setStatus(
        status,
        currentMode === "all"
          ? "All variations generated successfully."
          : currentMode === "one"
            ? "One variation generated successfully."
            : "Text variations generated successfully.",
        "success"
      );
    } catch (error) {
      output.value = "";
      setStatus(status, error.message, "error");
    }
  });

  root.querySelector("#spintax-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, output.value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#spintax-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    if (countInput) {
      countInput.value = "10";
    }
    if (removeDuplicates) {
      removeDuplicates.checked = true;
    }
    if (trimSpaces) {
      trimSpaces.checked = true;
    }
    setStatus(status, "Input and output cleared.");
    updateValidation();
  });

  updateValidation();
}

function initWordCounterTool() {
  const root = document.querySelector("[data-word-counter-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#word-counter-input");
  const words = root.querySelector("#word-counter-words");
  const characters = root.querySelector("#word-counter-characters");
  const charactersNoSpaces = root.querySelector("#word-counter-characters-no-spaces");
  const lines = root.querySelector("#word-counter-lines");
  const paragraphs = root.querySelector("#word-counter-paragraphs");

  const updateStats = () => {
    const value = input.value;
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    const lineCount = value ? value.split(/\r\n|\r|\n/).length : 0;
    const paragraphCount = value.trim() ? value.trim().split(/\n\s*\n/).filter(Boolean).length : 0;

    if (words) {
      words.textContent = String(wordCount);
    }
    if (characters) {
      characters.textContent = String(value.length);
    }
    if (charactersNoSpaces) {
      charactersNoSpaces.textContent = String(value.replace(/\s/g, "").length);
    }
    if (lines) {
      lines.textContent = String(lineCount);
    }
    if (paragraphs) {
      paragraphs.textContent = String(paragraphCount);
    }
  };

  input?.addEventListener("input", updateStats);

  root.querySelector("#word-counter-clear")?.addEventListener("click", () => {
    input.value = "";
    updateStats();
  });

  updateStats();
}

function initCaseConverterTool() {
  const root = document.querySelector("[data-case-converter-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#case-converter-input");
  const output = root.querySelector("#case-converter-output");
  const status = root.querySelector("#case-converter-status");

  const tokenizeWords = (value) => {
    const normalized = value
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .match(/[\p{L}\p{N}]+/gu);
    return normalized || [];
  };

  const capitalize = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";

  const sentenceCase = (value) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return "";
    }
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const converters = {
    upper: (value) => value.toUpperCase(),
    lower: (value) => value.toLowerCase(),
    title: (value) => tokenizeWords(value).map(capitalize).join(" "),
    sentence: (value) => sentenceCase(value),
    camel: (value) => {
      const words = tokenizeWords(value).map((word) => word.toLowerCase());
      return words.map((word, index) => (index === 0 ? word : capitalize(word))).join("");
    },
    snake: (value) => tokenizeWords(value).map((word) => word.toLowerCase()).join("_"),
    kebab: (value) => tokenizeWords(value).map((word) => word.toLowerCase()).join("-")
  };

  const labels = {
    upper: "UPPERCASE",
    lower: "lowercase",
    title: "Title Case",
    sentence: "Sentence case",
    camel: "camelCase",
    snake: "snake_case",
    kebab: "kebab-case"
  };

  root.querySelectorAll("[data-case-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = input.value;
      if (!value.trim()) {
        output.value = "";
        setStatus(status, "Enter text first.", "error");
        return;
      }

      const action = button.getAttribute("data-case-action");
      output.value = converters[action] ? converters[action](value) : value;
      setStatus(status, `Converted to ${labels[action] || "the selected case"} successfully.`, "success");
    });
  });

  root.querySelector("#case-converter-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, output.value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#case-converter-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    setStatus(status, "Input and output cleared.");
  });
}

function initLineSorterTool() {
  const root = document.querySelector("[data-line-sorter-tool]");
  if (!root) {
    return;
  }

  const input = root.querySelector("#line-sorter-input");
  const output = root.querySelector("#line-sorter-output");
  const status = root.querySelector("#line-sorter-status");
  const tabs = root.querySelectorAll("[data-line-sort-mode]");
  const deduplicate = root.querySelector("#line-sorter-deduplicate");
  const trim = root.querySelector("#line-sorter-trim");
  const removeEmpty = root.querySelector("#line-sorter-remove-empty");
  let currentMode = "az";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.getAttribute("data-line-sort-mode") || "az";
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      setStatus(status, "Choose your sort order and process the lines locally in your browser.");
    });
  });

  root.querySelector("#line-sorter-process")?.addEventListener("click", () => {
    if (!input.value.trim()) {
      output.value = "";
      setStatus(status, "Enter line-based text first.", "error");
      return;
    }

    let linesList = input.value.split(/\r\n|\r|\n/);

    if (trim?.checked) {
      linesList = linesList.map((line) => line.trim());
    }
    if (removeEmpty?.checked) {
      linesList = linesList.filter((line) => line.length > 0);
    }
    if (deduplicate?.checked) {
      linesList = [...new Set(linesList)];
    }

    linesList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
    if (currentMode === "za") {
      linesList.reverse();
    }

    output.value = linesList.join("\n");
    setStatus(status, "Lines processed successfully.", "success");
  });

  root.querySelector("#line-sorter-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, output.value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#line-sorter-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    currentMode = "az";
    tabs.forEach((tab) => {
      tab.setAttribute("aria-selected", String((tab.getAttribute("data-line-sort-mode") || "az") === "az"));
    });
    if (deduplicate) {
      deduplicate.checked = false;
    }
    if (trim) {
      trim.checked = false;
    }
    if (removeEmpty) {
      removeEmpty.checked = false;
    }
    setStatus(status, "Input and output cleared.");
  });
}

function normalizeCompareString(value, options = {}) {
  let normalized = String(value);
  if (options.ignoreWhitespace) {
    normalized = normalized.replace(/\s+/g, " ").trim();
  }
  if (options.ignoreCase) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

function diffSequence(sourceA, sourceB) {
  const lengthA = sourceA.length;
  const lengthB = sourceB.length;
  const maxDepth = lengthA + lengthB;
  let frontier = new Map([[1, 0]]);
  const trace = [];

  for (let depth = 0; depth <= maxDepth; depth += 1) {
    const nextFrontier = new Map();

    for (let diagonal = -depth; diagonal <= depth; diagonal += 2) {
      let x;
      if (
        diagonal === -depth
        || (
          diagonal !== depth
          && (frontier.get(diagonal - 1) ?? -Infinity) < (frontier.get(diagonal + 1) ?? -Infinity)
        )
      ) {
        x = frontier.get(diagonal + 1) ?? 0;
      } else {
        x = (frontier.get(diagonal - 1) ?? 0) + 1;
      }

      let y = x - diagonal;
      while (x < lengthA && y < lengthB && sourceA[x] === sourceB[y]) {
        x += 1;
        y += 1;
      }

      nextFrontier.set(diagonal, x);
      if (x >= lengthA && y >= lengthB) {
        trace.push(nextFrontier);
        return backtrackDiff(trace, sourceA, sourceB);
      }
    }

    trace.push(nextFrontier);
    frontier = nextFrontier;
  }

  return [];
}

function backtrackDiff(trace, sourceA, sourceB) {
  let x = sourceA.length;
  let y = sourceB.length;
  const operations = [];

  for (let depth = trace.length - 1; depth > 0; depth -= 1) {
    const previousFrontier = trace[depth - 1];
    const diagonal = x - y;
    let previousDiagonal;

    if (
      diagonal === -depth
      || (
        diagonal !== depth
        && (previousFrontier.get(diagonal - 1) ?? -Infinity) < (previousFrontier.get(diagonal + 1) ?? -Infinity)
      )
    ) {
      previousDiagonal = diagonal + 1;
    } else {
      previousDiagonal = diagonal - 1;
    }

    const previousX = previousFrontier.get(previousDiagonal) ?? 0;
    const previousY = previousX - previousDiagonal;

    while (x > previousX && y > previousY) {
      operations.push({ type: "equal", ai: x - 1, bi: y - 1 });
      x -= 1;
      y -= 1;
    }

    if (x === previousX) {
      operations.push({ type: "add", bi: y - 1 });
      y -= 1;
    } else {
      operations.push({ type: "remove", ai: x - 1 });
      x -= 1;
    }
  }

  while (x > 0 && y > 0) {
    operations.push({ type: "equal", ai: x - 1, bi: y - 1 });
    x -= 1;
    y -= 1;
  }

  while (x > 0) {
    operations.push({ type: "remove", ai: x - 1 });
    x -= 1;
  }

  while (y > 0) {
    operations.push({ type: "add", bi: y - 1 });
    y -= 1;
  }

  return operations.reverse();
}

function buildDiffRows(linesA, linesB, options) {
  const normalizedA = linesA.map((line) => normalizeCompareString(line, options));
  const normalizedB = linesB.map((line) => normalizeCompareString(line, options));
  const operations = diffSequence(normalizedA, normalizedB);
  const rows = [];

  for (let index = 0; index < operations.length; index += 1) {
    const operation = operations[index];
    if (operation.type === "equal") {
      rows.push({
        type: "unchanged",
        aText: linesA[operation.ai],
        bText: linesB[operation.bi]
      });
      continue;
    }

    const removed = [];
    const added = [];
    while (index < operations.length && operations[index].type !== "equal") {
      if (operations[index].type === "remove") {
        removed.push(operations[index]);
      } else if (operations[index].type === "add") {
        added.push(operations[index]);
      }
      index += 1;
    }
    index -= 1;

    const pairCount = Math.min(removed.length, added.length);
    for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
      rows.push({
        type: "modified",
        aText: linesA[removed[pairIndex].ai],
        bText: linesB[added[pairIndex].bi]
      });
    }

    for (let removeIndex = pairCount; removeIndex < removed.length; removeIndex += 1) {
      rows.push({
        type: "removed",
        aText: linesA[removed[removeIndex].ai],
        bText: ""
      });
    }

    for (let addIndex = pairCount; addIndex < added.length; addIndex += 1) {
      rows.push({
        type: "added",
        aText: "",
        bText: linesB[added[addIndex].bi]
      });
    }
  }

  return rows;
}

function appendDiffText(target, operations, characters, side) {
  let buffer = "";
  let mode = "text";

  const flush = () => {
    if (!buffer) {
      return;
    }
    const node = document.createElement("span");
    node.textContent = buffer;
    if (mode === "remove") {
      node.className = "diff-inline--remove";
    } else if (mode === "add") {
      node.className = "diff-inline--add";
    }
    target.appendChild(node);
    buffer = "";
  };

  operations.forEach((operation) => {
    if (side === "left" && operation.type === "add") {
      return;
    }
    if (side === "right" && operation.type === "remove") {
      return;
    }

    const nextMode = operation.type === "equal"
      ? "text"
      : side === "left"
        ? "remove"
        : "add";
    const charIndex = side === "left" ? operation.ai : operation.bi;
    const nextChar = characters[charIndex] ?? "";

    if (nextMode !== mode) {
      flush();
      mode = nextMode;
    }
    buffer += nextChar;
  });

  flush();
}

function renderDiffCell(text, type, operations, side) {
  const cell = document.createElement("div");
  cell.className = "diff-cell";
  if (!text) {
    cell.classList.add("diff-cell--empty");
  }
  if (type !== "unchanged") {
    cell.dataset.type = type;
  }

  if (!text) {
    cell.textContent = " ";
    return cell;
  }

  if (type === "modified" && operations) {
    appendDiffText(cell, operations, Array.from(text), side);
    return cell;
  }

  cell.textContent = text;
  return cell;
}

function renderDiffViewer(container, rows, options) {
  if (!container) {
    return "";
  }

  container.textContent = "";
  container.dataset.empty = String(rows.length === 0);
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "diff-viewer__empty";
    empty.textContent = "No differences to show.";
    container.appendChild(empty);
    return "";
  }

  const header = document.createElement("div");
  header.className = "diff-viewer__header";
  const leftHeading = document.createElement("span");
  leftHeading.textContent = "Text A";
  const rightHeading = document.createElement("span");
  rightHeading.textContent = "Text B";
  header.append(leftHeading, rightHeading);
  container.appendChild(header);

  const unifiedLines = [];
  rows.forEach((row) => {
    const rowNode = document.createElement("div");
    rowNode.className = "diff-row";
    let characterDiff = null;

    if (row.type === "modified") {
      const charsA = Array.from(row.aText);
      const charsB = Array.from(row.bText);
      const compareA = charsA.map((char) => normalizeCompareString(char, options));
      const compareB = charsB.map((char) => normalizeCompareString(char, options));
      characterDiff = diffSequence(compareA, compareB);
    }

    const leftType = row.type === "added" ? "unchanged" : row.type;
    const rightType = row.type === "removed" ? "unchanged" : row.type;
    rowNode.append(
      renderDiffCell(row.aText, leftType, characterDiff, "left"),
      renderDiffCell(row.bText, rightType, characterDiff, "right")
    );
    container.appendChild(rowNode);

    if (row.type === "unchanged") {
      unifiedLines.push(`  ${row.aText}`);
    } else if (row.type === "removed") {
      unifiedLines.push(`- ${row.aText}`);
    } else if (row.type === "added") {
      unifiedLines.push(`+ ${row.bText}`);
    } else {
      unifiedLines.push(`- ${row.aText}`);
      unifiedLines.push(`+ ${row.bText}`);
    }
  });

  return unifiedLines.join("\n");
}

function renderResultList(container, items, emptyText) {
  if (!container) {
    return;
  }

  container.textContent = "";
  container.dataset.empty = String(items.length === 0);

  if (!items.length) {
    container.textContent = emptyText;
    return;
  }

  const list = document.createElement("ol");
  list.className = "result-list";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });
  container.appendChild(list);
}

function initTextDiffTool() {
  const root = document.querySelector("[data-text-diff-tool]");
  if (!root) {
    return;
  }

  const MAX_LINES = 100000;
  const MAX_CHARACTERS = 200000;
  const inputA = root.querySelector("#text-diff-input-a");
  const inputB = root.querySelector("#text-diff-input-b");
  const hintA = root.querySelector("#text-diff-input-a-hint");
  const hintB = root.querySelector("#text-diff-input-b-hint");
  const ignoreWhitespace = root.querySelector("#text-diff-ignore-whitespace");
  const ignoreCase = root.querySelector("#text-diff-ignore-case");
  const output = root.querySelector("#text-diff-output");
  const status = root.querySelector("#text-diff-status");
  const compareButton = root.querySelector("#text-diff-compare");
  let copyPayload = "";

  const updateInputHint = (input, hint) => {
    const text = input.value;
    const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;
    const characterCount = text.length;
    if (characterCount > MAX_CHARACTERS || lineCount > MAX_LINES) {
      setInputValidity(input, true);
      setFieldHint(
        hint,
        characterCount > MAX_CHARACTERS
          ? "Input is too large to process efficiently."
          : "Too many lines. Maximum allowed is 100000 per text.",
        "error"
      );
      return false;
    }

    setInputValidity(input, false);
    setFieldHint(hint, `Current size: ${characterCount} characters, ${lineCount} lines. Maximum input size: 200000 characters and 100000 lines.`, characterCount || lineCount ? "success" : "");
    return true;
  };

  const updateValidation = () => {
    const validA = updateInputHint(inputA, hintA);
    const validB = updateInputHint(inputB, hintB);
    if (compareButton) {
      compareButton.disabled = !validA || !validB || (!inputA.value.trim() && !inputB.value.trim());
    }
  };

  root.querySelector("#text-diff-compare")?.addEventListener("click", () => {
    const textA = inputA.value;
    const textB = inputB.value;

    if (!textA.trim() && !textB.trim()) {
      output.textContent = "";
      output.dataset.empty = "true";
      const empty = document.createElement("p");
      empty.className = "diff-viewer__empty";
      empty.textContent = "Compare two texts to see the line-by-line diff here.";
      output.appendChild(empty);
      copyPayload = "";
      setStatus(status, "Enter text in one or both fields first.", "error");
      return;
    }

    if (textA.length > MAX_CHARACTERS || textB.length > MAX_CHARACTERS) {
      setStatus(status, "Text is too large to compare efficiently.", "error");
      return;
    }

    const linesA = textA ? textA.split(/\r\n|\r|\n/) : [];
    const linesB = textB ? textB.split(/\r\n|\r|\n/) : [];

    if (linesA.length > MAX_LINES || linesB.length > MAX_LINES) {
      setStatus(status, "Too many lines. Maximum allowed is 100000 per text.", "error");
      return;
    }

    const rows = buildDiffRows(linesA, linesB, {
      ignoreWhitespace: Boolean(ignoreWhitespace?.checked),
      ignoreCase: Boolean(ignoreCase?.checked)
    });

    copyPayload = renderDiffViewer(output, rows, {
      ignoreWhitespace: Boolean(ignoreWhitespace?.checked),
      ignoreCase: Boolean(ignoreCase?.checked)
    });
    setStatus(status, rows.some((row) => row.type !== "unchanged") ? "Differences highlighted successfully." : "The texts match with the selected options.", "success");
  });

  root.querySelector("#text-diff-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(copyPayload, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, copyPayload ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#text-diff-clear")?.addEventListener("click", () => {
    inputA.value = "";
    inputB.value = "";
    if (ignoreWhitespace) {
      ignoreWhitespace.checked = false;
    }
    if (ignoreCase) {
      ignoreCase.checked = false;
    }
    output.textContent = "";
    output.dataset.empty = "true";
    const empty = document.createElement("p");
    empty.className = "diff-viewer__empty";
    empty.textContent = "Compare two texts to see the line-by-line diff here.";
    output.appendChild(empty);
    copyPayload = "";
    setStatus(status, "Input and output cleared.");
    updateValidation();
  });

  inputA?.addEventListener("input", updateValidation);
  inputB?.addEventListener("input", updateValidation);
  updateValidation();
}

function initListCompareTool() {
  const root = document.querySelector("[data-list-compare-tool]");
  if (!root) {
    return;
  }

  const MAX_LINES = 100000;
  const inputA = root.querySelector("#list-compare-input-a");
  const inputB = root.querySelector("#list-compare-input-b");
  const hintA = root.querySelector("#list-compare-input-a-hint");
  const hintB = root.querySelector("#list-compare-input-b-hint");
  const ignoreCase = root.querySelector("#list-compare-ignore-case");
  const trim = root.querySelector("#list-compare-trim");
  const deduplicate = root.querySelector("#list-compare-deduplicate");
  const ignoreEmpty = root.querySelector("#list-compare-ignore-empty");
  const commonOutput = root.querySelector("#list-compare-common");
  const onlyAOutput = root.querySelector("#list-compare-only-a");
  const onlyBOutput = root.querySelector("#list-compare-only-b");
  const commonCount = root.querySelector("#list-compare-common-count");
  const onlyACount = root.querySelector("#list-compare-only-a-count");
  const onlyBCount = root.querySelector("#list-compare-only-b-count");
  const status = root.querySelector("#list-compare-status");
  const compareButton = root.querySelector("#list-compare-run");
  let copyPayload = "";

  const resetResults = () => {
    renderResultList(commonOutput, [], "Compare two lists to see shared items here.");
    renderResultList(onlyAOutput, [], "Unique items from List A will appear here.");
    renderResultList(onlyBOutput, [], "Unique items from List B will appear here.");
    if (commonCount) {
      commonCount.textContent = "0";
    }
    if (onlyACount) {
      onlyACount.textContent = "0";
    }
    if (onlyBCount) {
      onlyBCount.textContent = "0";
    }
    copyPayload = "";
  };

  const parseList = (value) => {
    const lines = value.split(/\r\n|\r|\n/);
    if (lines.length > MAX_LINES) {
      throw new Error("Too many lines. Maximum allowed is 100000 per text.");
    }

    let items = lines.map((line) => (trim?.checked ? line.trim() : line));
    if (ignoreEmpty?.checked) {
      items = items.filter((line) => line.length > 0);
    }

    const entries = items.map((item) => ({
      key: ignoreCase?.checked ? item.toLowerCase() : item,
      value: item
    }));

    if (!deduplicate?.checked) {
      return entries;
    }

    const seen = new Set();
    return entries.filter((entry) => {
      if (seen.has(entry.key)) {
        return false;
      }
      seen.add(entry.key);
      return true;
    });
  };

  const updateInputHint = (input, hint) => {
    const lineCount = input.value ? input.value.split(/\r\n|\r|\n/).length : 0;
    if (lineCount > MAX_LINES) {
      setInputValidity(input, true);
      setFieldHint(hint, "Too many lines. Maximum allowed is 100000 per text.", "error");
      return false;
    }

    setInputValidity(input, false);
    setFieldHint(hint, `Current line count: ${lineCount} / 100000`, lineCount ? "success" : "");
    return true;
  };

  const updateValidation = () => {
    const validA = updateInputHint(inputA, hintA);
    const validB = updateInputHint(inputB, hintB);
    if (compareButton) {
      compareButton.disabled = !validA || !validB || (!inputA.value.trim() && !inputB.value.trim());
    }
  };

  root.querySelector("#list-compare-run")?.addEventListener("click", () => {
    if (!inputA.value.trim() && !inputB.value.trim()) {
      resetResults();
      setStatus(status, "Enter list data in one or both fields first.", "error");
      return;
    }

    try {
      const listA = parseList(inputA.value);
      const listB = parseList(inputB.value);
      const common = [];
      const onlyA = [];
      const onlyB = [];

      const countsB = new Map();
      listB.forEach((entry) => {
        countsB.set(entry.key, (countsB.get(entry.key) || 0) + 1);
      });

      listA.forEach((entry) => {
        const remaining = countsB.get(entry.key) || 0;
        if (remaining > 0) {
          common.push(entry.value);
          countsB.set(entry.key, remaining - 1);
        } else {
          onlyA.push(entry.value);
        }
      });

      const matchedA = new Map();
      listA.forEach((entry) => {
        matchedA.set(entry.key, (matchedA.get(entry.key) || 0) + 1);
      });

      listB.forEach((entry) => {
        const available = matchedA.get(entry.key) || 0;
        if (available > 0) {
          matchedA.set(entry.key, available - 1);
        } else {
          onlyB.push(entry.value);
        }
      });

      renderResultList(commonOutput, common, "No shared items found.");
      renderResultList(onlyAOutput, onlyA, "No unique items in List A.");
      renderResultList(onlyBOutput, onlyB, "No unique items in List B.");
      if (commonCount) {
        commonCount.textContent = String(common.length);
      }
      if (onlyACount) {
        onlyACount.textContent = String(onlyA.length);
      }
      if (onlyBCount) {
        onlyBCount.textContent = String(onlyB.length);
      }

      copyPayload = [
        "Common items:",
        ...common,
        "",
        "Only in List A:",
        ...onlyA,
        "",
        "Only in List B:",
        ...onlyB
      ].join("\n");
      setStatus(status, "List comparison completed successfully.", "success");
    } catch (error) {
      resetResults();
      setStatus(status, error.message, "error");
    }
  });

  root.querySelector("#list-compare-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(copyPayload, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, copyPayload ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#list-compare-clear")?.addEventListener("click", () => {
    inputA.value = "";
    inputB.value = "";
    if (ignoreCase) {
      ignoreCase.checked = false;
    }
    if (trim) {
      trim.checked = true;
    }
    if (deduplicate) {
      deduplicate.checked = true;
    }
    if (ignoreEmpty) {
      ignoreEmpty.checked = true;
    }
    resetResults();
    setStatus(status, "Input and output cleared.");
    updateValidation();
  });

  resetResults();
  inputA?.addEventListener("input", updateValidation);
  inputB?.addEventListener("input", updateValidation);
  updateValidation();
}

function initListConverterTool() {
  const root = document.querySelector("[data-list-converter-tool]");
  if (!root) {
    return;
  }

  const MAX_CHARACTERS = 200000;
  const MAX_LINES = 100000;
  const input = root.querySelector("#list-converter-input");
  const output = root.querySelector("#list-converter-output");
  const outputLabel = root.querySelector("#list-converter-output-label");
  const inputHint = root.querySelector("#list-converter-input-hint");
  const modeHint = root.querySelector("#list-converter-mode-hint");
  const shuffleHint = root.querySelector("#list-converter-shuffle-hint");
  const status = root.querySelector("#list-converter-status");
  const convertButton = root.querySelector("#list-converter-convert");
  const shuffleAgainButton = root.querySelector("#list-converter-shuffle-again");
  const tabs = root.querySelectorAll("[data-list-converter-mode]");
  const splitPanel = root.querySelector("#list-converter-split-options");
  const joinPanel = root.querySelector("#list-converter-join-options");
  const shufflePanel = root.querySelector("#list-converter-shuffle-options");
  const splitSelect = root.querySelector("#list-converter-split-delimiter");
  const splitCustomWrap = root.querySelector("#list-converter-split-custom-wrap");
  const splitCustom = root.querySelector("#list-converter-split-custom");
  const joinSelect = root.querySelector("#list-converter-join-delimiter");
  const joinCustomWrap = root.querySelector("#list-converter-join-custom-wrap");
  const joinCustom = root.querySelector("#list-converter-join-custom");
  const shuffleSample = root.querySelector("#list-converter-shuffle-sample");
  const trim = root.querySelector("#list-converter-trim");
  const removeEmpty = root.querySelector("#list-converter-remove-empty");
  const deduplicate = root.querySelector("#list-converter-deduplicate");
  let currentMode = "split";

  const delimiterLabels = {
    comma: "Comma (,)",
    semicolon: "Semicolon (;)",
    pipe: "Pipe (|)",
    space: "Space",
    custom: "Custom delimiter"
  };

  const parseLineItems = (value) => value.split(/\r\n|\r|\n/);

  const normalizeItems = (items) => {
    let nextItems = [...items];
    if (trim?.checked) {
      nextItems = nextItems.map((item) => item.trim());
    }
    if (removeEmpty?.checked) {
      nextItems = nextItems.filter((item) => item.length > 0);
    }
    if (deduplicate?.checked) {
      nextItems = [...new Set(nextItems)];
    }
    return nextItems;
  };

  const getShuffleEligibleItems = () => normalizeItems(parseLineItems(input.value));

  const shuffleItems = (items) => {
    const nextItems = [...items];
    for (let index = nextItems.length - 1; index > 0; index -= 1) {
      const swapIndex = getRandomInt(index + 1);
      [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
    }
    return nextItems;
  };

  const updateInputHint = () => {
    const characterCount = input.value.length;
    const lineCount = input.value ? parseLineItems(input.value).length : 0;
    if (characterCount > MAX_CHARACTERS) {
      setInputValidity(input, true);
      setFieldHint(inputHint, "Input is too large to process efficiently.", "error");
      return false;
    }

    if (lineCount > MAX_LINES) {
      setInputValidity(input, true);
      setFieldHint(inputHint, "Too many lines. Maximum allowed is 100000.", "error");
      return false;
    }

    setInputValidity(input, false);
    setFieldHint(
      inputHint,
      `Current input size: ${characterCount} characters, ${lineCount} lines. Maximum input size: 200000 characters and 100000 lines.`,
      characterCount || lineCount ? "success" : ""
    );
    return true;
  };

  const updateCustomVisibility = () => {
    const splitUsesCustom = splitSelect?.value === "custom";
    const joinUsesCustom = joinSelect?.value === "custom";

    if (splitCustomWrap) {
      splitCustomWrap.hidden = !splitUsesCustom;
    }
    if (joinCustomWrap) {
      joinCustomWrap.hidden = !joinUsesCustom;
    }
  };

  const updateModeUi = () => {
    tabs.forEach((tab) => {
      const mode = tab.getAttribute("data-list-converter-mode") || "split";
      tab.setAttribute("aria-selected", String(mode === currentMode));
    });

    if (splitPanel) {
      splitPanel.hidden = currentMode !== "split";
    }
    if (joinPanel) {
      joinPanel.hidden = currentMode !== "join";
    }
    if (shufflePanel) {
      shufflePanel.hidden = currentMode !== "shuffle";
    }
    if (outputLabel) {
      outputLabel.textContent = currentMode === "shuffle" ? "Shuffled list" : "Converted list";
    }
    if (convertButton) {
      convertButton.textContent = currentMode === "shuffle" ? "Shuffle" : "Convert";
    }
    if (shuffleAgainButton) {
      shuffleAgainButton.hidden = currentMode !== "shuffle";
    }
    if (input) {
      input.placeholder = currentMode === "split"
        ? "apple, banana, cherry, mango"
        : "apple\nbanana\ncherry\nmango";
    }

    updateCustomVisibility();
  };

  const getDelimiterConfig = () => {
    if (currentMode === "split") {
      const value = splitSelect?.value || "comma";
      if (value === "custom") {
        return { key: value, raw: splitCustom?.value || "" };
      }
      return { key: value, raw: value };
    }

    if (currentMode === "shuffle") {
      return { key: "newline", raw: "\n" };
    }

    const value = joinSelect?.value || "comma";
    if (value === "custom") {
      return { key: value, raw: joinCustom?.value || "" };
    }
    return { key: value, raw: value };
  };

  const getJoinDelimiter = (config) => {
    if (config.key === "comma") {
      return ", ";
    }
    if (config.key === "semicolon") {
      return "; ";
    }
    if (config.key === "pipe") {
      return " | ";
    }
    return config.raw;
  };

  const updateModeHint = () => {
    const config = getDelimiterConfig();
    const activeCustomInput = currentMode === "split" ? splitCustom : joinCustom;

    if (activeCustomInput) {
      setInputValidity(activeCustomInput, false);
    }

    if (currentMode === "shuffle") {
      setFieldHint(modeHint, "Shuffle mode randomizes line-based items and can return a random sample.", input.value.trim() ? "success" : "");
      return true;
    }

    if (config.key === "custom" && !config.raw) {
      if (activeCustomInput) {
        setInputValidity(activeCustomInput, true);
      }
      setFieldHint(modeHint, "Enter a custom delimiter first.", "error");
      return false;
    }

    const label = config.key === "custom" ? "custom delimiter" : delimiterLabels[config.key] || "selected delimiter";
    const text = currentMode === "split"
      ? `Split mode using ${label}.`
      : `Join mode using ${label}.`;
    setFieldHint(modeHint, text, input.value.trim() ? "success" : "");
    return true;
  };

  const updateShuffleHint = () => {
    if (!shuffleHint || !shuffleSample) {
      return true;
    }

    const items = getShuffleEligibleItems();
    const rawValue = shuffleSample.value.trim();

    if (!rawValue) {
      setInputValidity(shuffleSample, false);
      setFieldHint(shuffleHint, `Eligible items after cleanup: ${items.length}`, items.length ? "success" : "");
      return true;
    }

    const numeric = Number(rawValue);
    if (!Number.isInteger(numeric) || numeric <= 0) {
      setInputValidity(shuffleSample, true);
      setFieldHint(shuffleHint, "Enter a whole number greater than 0 for the sample size.", "error");
      return false;
    }

    if (numeric > items.length) {
      setInputValidity(shuffleSample, true);
      setFieldHint(shuffleHint, "Sample size cannot be larger than the number of eligible items.", "error");
      return false;
    }

    setInputValidity(shuffleSample, false);
    setFieldHint(shuffleHint, `Eligible items after cleanup: ${items.length}. Random sample size: ${numeric}.`, "success");
    return true;
  };

  const updateValidation = () => {
    const validInput = updateInputHint();
    const validMode = updateModeHint();
    const validShuffle = updateShuffleHint();
    if (convertButton) {
      convertButton.disabled = !validInput || !validMode || !validShuffle || !input.value.trim();
    }
    if (shuffleAgainButton) {
      shuffleAgainButton.disabled = currentMode !== "shuffle" || !validInput || !validShuffle || !input.value.trim();
    }
  };

  const splitInput = (value, config) => {
    if (config.key === "space") {
      return value.split(/\s+/);
    }
    return value.split(config.raw);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentMode = tab.getAttribute("data-list-converter-mode") || "split";
      updateModeUi();
      updateValidation();
      setStatus(status, "Choose how you want to split or join the list locally in your browser.");
    });
  });

  splitSelect?.addEventListener("change", () => {
    updateCustomVisibility();
    updateValidation();
  });
  joinSelect?.addEventListener("change", () => {
    updateCustomVisibility();
    updateValidation();
  });
  splitCustom?.addEventListener("input", updateValidation);
  joinCustom?.addEventListener("input", updateValidation);
  input?.addEventListener("input", updateValidation);
  shuffleSample?.addEventListener("input", updateValidation);
  trim?.addEventListener("change", updateValidation);
  removeEmpty?.addEventListener("change", updateValidation);
  deduplicate?.addEventListener("change", updateValidation);

  const runShuffle = () => {
    const items = getShuffleEligibleItems();
    const shuffled = shuffleItems(items);
    const sampleSize = shuffleSample?.value.trim() ? Number(shuffleSample.value.trim()) : null;
    const finalItems = sampleSize ? shuffled.slice(0, sampleSize) : shuffled;
    output.value = finalItems.join("\n");
    if (sampleSize) {
      setStatus(status, `Selected ${finalItems.length} random item${finalItems.length === 1 ? "" : "s"} from ${items.length}.`, "success");
      return;
    }
    setStatus(status, `Shuffled ${finalItems.length} item${finalItems.length === 1 ? "" : "s"} successfully.`, "success");
  };

  root.querySelector("#list-converter-convert")?.addEventListener("click", () => {
    if (!input.value.trim()) {
      output.value = "";
      setStatus(status, "Enter a list first.", "error");
      updateValidation();
      return;
    }

    if (input.value.length > MAX_CHARACTERS) {
      setStatus(status, "Input is too large to process efficiently.", "error");
      updateValidation();
      return;
    }

    const config = getDelimiterConfig();
    if (config.key === "custom" && !config.raw) {
      setStatus(status, "Enter a custom delimiter first.", "error");
      updateValidation();
      return;
    }

    if (currentMode === "shuffle") {
      runShuffle();
      return;
    }

    if (currentMode === "split") {
      const items = normalizeItems(splitInput(input.value, config));
      output.value = items.join("\n");
      setStatus(status, `List split into ${items.length} item${items.length === 1 ? "" : "s"}.`, "success");
      return;
    }

    const items = normalizeItems(input.value.split(/\r\n|\r|\n/));
    output.value = items.join(getJoinDelimiter(config));
    setStatus(status, `List joined into ${items.length} item${items.length === 1 ? "" : "s"}.`, "success");
  });

  shuffleAgainButton?.addEventListener("click", () => {
    if (currentMode !== "shuffle" || convertButton?.disabled) {
      return;
    }
    runShuffle();
  });

  root.querySelector("#list-converter-copy")?.addEventListener("click", async (event) => {
    const copied = await copyText(output.value, event.currentTarget, "Copied ✓", 2000);
    if (!copied) {
      setStatus(status, output.value ? "Copy failed. Your browser may block clipboard access." : "Nothing to copy yet.", "error");
    }
  });

  root.querySelector("#list-converter-clear")?.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    currentMode = "split";
    if (splitSelect) {
      splitSelect.value = "comma";
    }
    if (joinSelect) {
      joinSelect.value = "comma";
    }
    if (splitCustom) {
      splitCustom.value = "";
    }
    if (joinCustom) {
      joinCustom.value = "";
    }
    if (shuffleSample) {
      shuffleSample.value = "";
    }
    if (trim) {
      trim.checked = true;
    }
    if (removeEmpty) {
      removeEmpty.checked = true;
    }
    if (deduplicate) {
      deduplicate.checked = false;
    }
    updateModeUi();
    updateValidation();
    setStatus(status, "Input and output cleared.");
  });

  updateModeUi();
  updateValidation();
}

const HTTP_STATUS_CODES = [
  ["1xx Informational", [
    [100, "Continue", "The server received the initial request headers and expects the client to continue."],
    [101, "Switching Protocols", "The server agrees to switch protocols as requested by the client."]
  ]],
  ["2xx Success", [
    [200, "OK", "The request succeeded and the response includes the requested representation."],
    [201, "Created", "The request succeeded and created a new resource."],
    [204, "No Content", "The request succeeded and there is no response body to return."]
  ]],
  ["3xx Redirection", [
    [301, "Moved Permanently", "The resource has a permanent new URL and clients should update links."],
    [302, "Found", "The resource is temporarily available at a different URL."],
    [304, "Not Modified", "The cached version can be reused because the resource has not changed."]
  ]],
  ["4xx Client Errors", [
    [400, "Bad Request", "The server could not understand the request because it is malformed."],
    [401, "Unauthorized", "Authentication is required before the request can proceed."],
    [403, "Forbidden", "The server understood the request but refuses to authorize it."],
    [404, "Not Found", "The requested resource could not be found on the server."],
    [405, "Method Not Allowed", "The HTTP method is known but not supported for this resource."],
    [429, "Too Many Requests", "The client sent too many requests in a given amount of time."]
  ]],
  ["5xx Server Errors", [
    [500, "Internal Server Error", "The server encountered an unexpected condition and could not complete the request."],
    [501, "Not Implemented", "The server does not support the required functionality to fulfill the request."],
    [502, "Bad Gateway", "The server received an invalid response from an upstream server."],
    [503, "Service Unavailable", "The server is temporarily unable to handle the request."],
    [504, "Gateway Timeout", "The server did not receive a timely response from an upstream server."]
  ]]
];

function initStatusCodeTable() {
  const body = document.querySelector("[data-status-table]");
  if (!body) {
    return;
  }

  HTTP_STATUS_CODES.forEach(([group, rows]) => {
    const groupRow = document.createElement("tr");
    const groupCell = document.createElement("th");
    groupCell.colSpan = 3;
    groupCell.scope = "colgroup";
    groupCell.textContent = group;
    groupRow.appendChild(groupCell);
    body.appendChild(groupRow);

    rows.forEach(([code, name, meaning]) => {
      const row = document.createElement("tr");
      [String(code), name, meaning].forEach((value, index) => {
        const cell = document.createElement(index === 0 ? "th" : "td");
        if (index === 0) {
          cell.scope = "row";
        }
        cell.textContent = value;
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
  });
}

function initAsciiTable() {
  const body = document.querySelector("[data-ascii-table]");
  if (!body) {
    return;
  }

  const controlDescriptions = [
    "Null", "Start of Heading", "Start of Text", "End of Text", "End of Transmission", "Enquiry",
    "Acknowledge", "Bell", "Backspace", "Horizontal Tab", "Line Feed", "Vertical Tab",
    "Form Feed", "Carriage Return", "Shift Out", "Shift In", "Data Link Escape",
    "Device Control 1", "Device Control 2", "Device Control 3", "Device Control 4",
    "Negative Acknowledge", "Synchronous Idle", "End of Transmission Block", "Cancel",
    "End of Medium", "Substitute", "Escape", "File Separator", "Group Separator",
    "Record Separator", "Unit Separator"
  ];

  for (let value = 0; value <= 127; value += 1) {
    const row = document.createElement("tr");
    const decCell = document.createElement("th");
    decCell.scope = "row";
    decCell.textContent = String(value);

    const hexCell = document.createElement("td");
    hexCell.textContent = `0x${value.toString(16).toUpperCase().padStart(2, "0")}`;

    const charCell = document.createElement("td");
    const descCell = document.createElement("td");

    if (value < 32) {
      charCell.textContent = "CTRL";
      descCell.textContent = controlDescriptions[value];
    } else if (value === 32) {
      charCell.textContent = "Space";
      descCell.textContent = "Printable space character";
    } else if (value === 127) {
      charCell.textContent = "DEL";
      descCell.textContent = "Delete";
    } else {
      charCell.textContent = String.fromCharCode(value);
      descCell.textContent = `Printable character ${String.fromCharCode(value)}`;
    }

    row.append(decCell, hexCell, charCell, descCell);
    body.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHomeTimestampWidget();
  initGlobalCopy();
  initEpochConverter();
  initTimestampTool();
  initDateCalculatorTool();
  initBusinessDaysCalculatorTool();
  initAgeCalculatorTool();
  initDayOfYearTool();
  initTimeDurationCalculatorTool();
  initTimezoneConverterTool();
  initBase64Tool();
  initUrlTool();
  initJsonTool();
  initPasswordTool();
  initNumberTool();
  initRemoveHtmlTool();
  initHtmlMarkdownTool();
  initMorseTool();
  initSpintaxTool();
  initWordCounterTool();
  initCaseConverterTool();
  initLineSorterTool();
  initListConverterTool();
  initTextDiffTool();
  initListCompareTool();
  initUuidTool();
  initStatusCodeTable();
  initAsciiTable();
});
