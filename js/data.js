export const animals = [
  { id: 'whitetail-deer', name: 'Whitetail Deer', icon: '🦌' },
  { id: 'elk', name: 'Elk', icon: '🫎' },
  { id: 'wild-turkey', name: 'Wild Turkey', icon: '🦃' },
  { id: 'duck', name: 'Duck', icon: '🦆' },
  { id: 'black-bear', name: 'Black Bear', icon: '🐻' },
  { id: 'pronghorn', name: 'Pronghorn', icon: '🐐' },
  { id: 'moose', name: 'Moose', icon: '🫎' },
  { id: 'bighorn-sheep', name: 'Bighorn Sheep', icon: '🐏' },
  { id: 'pheasant', name: 'Pheasant', icon: '🪶' },
  { id: 'rabbit', name: 'Rabbit', icon: '🐇' },
];

export const states = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['FL', 'Florida'], ['GA', 'Georgia'],
  ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'],
  ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'],
  ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
].map(([code, name]) => ({ code, name }));

export const featuredStates = ['TX', 'CO', 'WY'];

// Demo dataset: one primary season window per animal/state pair.
// You can edit these dates later in one place.
const defaultWindows = {
  'whitetail-deer': { start: '10-01', end: '01-15' },
  elk: { start: '09-10', end: '11-30' },
  'wild-turkey': { start: '04-01', end: '05-31' },
  duck: { start: '11-01', end: '01-31' },
  'black-bear': { start: '09-01', end: '10-31' },
  pronghorn: { start: '08-15', end: '10-15' },
  moose: { start: '09-05', end: '10-20' },
  'bighorn-sheep': { start: '09-01', end: '12-01' },
  pheasant: { start: '11-10', end: '01-31' },
  rabbit: { start: '10-15', end: '02-28' },
};

export function getSeasonWindow(animalId, stateCode) {
  const base = defaultWindows[animalId];
  if (!base) return null;

  // Tiny variation by state to make demo data feel less identical.
  const shift = stateCode.charCodeAt(0) % 7;
  const shiftedStart = shiftDate(base.start, shift);
  const shiftedEnd = shiftDate(base.end, shift);
  return { start: shiftedStart, end: shiftedEnd };
}

function shiftDate(mmdd, shiftDays) {
  const [m, d] = mmdd.split('-').map(Number);
  const date = new Date(2025, m - 1, d + shiftDays);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}
