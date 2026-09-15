const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
});

const statusText = document.querySelector('#open-status');
const statusDot = document.querySelector('.status-dot');

function skopjeTimeParts() {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Skopje',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map(({ type, value }) => [type, value]));
  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  return { dayIndex, minute: Number(parts.hour) * 60 + Number(parts.minute) };
}

function isOpenNow() {
  const schedule = [
    [14 * 60, 22 * 60],
    [14 * 60, 25 * 60],
    [12 * 60, 25 * 60],
    [12 * 60, 25 * 60],
    [12 * 60, 25 * 60],
    [13 * 60, 25 * 60],
    [13 * 60, 25 * 60]
  ];
  const { dayIndex, minute } = skopjeTimeParts();
  const today = schedule[dayIndex];
  if (minute >= today[0] && minute < today[1]) return true;
  if (minute < 60) {
    const previous = schedule[(dayIndex + 6) % 7];
    return minute + 1440 < previous[1];
  }
  return false;
}

if (statusText && statusDot) {
  const open = isOpenNow();
  const english = document.documentElement.lang === 'en';
  statusText.textContent = open
    ? (english ? 'Open now' : 'Отворено сега')
    : (english ? 'Currently closed' : 'Моментално затворено');
  statusDot.classList.toggle('closed', !open);
}

document.querySelector('#year').textContent = new Date().getFullYear();
