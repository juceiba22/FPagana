const fs = require('fs');

const content = fs.readFileSync('C:/Users/NINIO/.gemini/antigravity/brain/9245af45-6c4d-4ceb-acf2-f6f4284ee186/.system_generated/steps/126/content.md', 'utf-8');

const extractAct = (startString, endString) => {
  let startIndex = content.indexOf(startString);
  if (startIndex === -1) return '';
  let endIndex = endString ? content.indexOf(endString, startIndex) : content.length;
  if(endIndex === -1) endIndex = content.length;
  return content.substring(startIndex, endIndex).trim();
}

const actsData = [
  {
    id: 1, title: 'ACTO 1: La verdad y la libertad', url: '/scripts/acto-1',
    body: extractAct('Primer Acto: La verdad y la libertad', 'Segundo acto:  El demonio en el mundo criollo')
  },
  {
    id: 2, title: 'ACTO 2: El demonio en el mundo criollo', url: '/scripts/acto-2',
    body: extractAct('Segundo acto:  El demonio en el mundo criollo', 'Tercer acto: La libertad')
  },
  {
    id: 3, title: 'ACTO 3: La libertad y José Mercado', url: '/scripts/acto-3',
    body: extractAct('Tercer acto: La libertad', 'Acto 4 (De transición):')
  },
  {
    id: 4, title: 'ACTO 4: ¿De qué nos quieren hacer olvidar?', url: '/scripts/acto-4',
    body: extractAct('Acto 4 (De transición):', 'Acto 5: Ingreso de los incas')
  },
  {
    id: 5, title: 'ACTO 5: La comparsa de los incas', url: '/scripts/acto-5',
    body: extractAct('Acto 5: Ingreso de los incas', 'Acto 6: El secreto:')
  },
  {
    id: 6, title: 'ACTO 6: El Secreto de la civilización', url: '/scripts/acto-6',
    body: extractAct('Acto 6: El secreto:', 'Acto 7 empieza la banda del Ninio')
  },
  {
    id: 7, title: 'ACTO 7: Ninio Ancestral', url: '/scripts/acto-7',
    body: extractAct('Acto 7 empieza la banda del Ninio', 'acto 8: Entra Gugú')
  },
  {
    id: 8, title: 'ACTO 8: Entra Gugú Petit Morte y Materio primo', url: '/scripts/acto-8',
    body: extractAct('acto 8: Entra Gugú Petit Morte y Materio primo', 'Acto 9: Primer parte del show')
  },
  {
    id: 9, title: 'ACTO 9: Primer parte del show de Materia Primo', url: '/scripts/acto-9',
    body: extractAct('Acto 9: Primer parte del show', 'Acto 10: Que són los pueblos paganos')
  },
  {
    id: 10, title: 'ACTO 10: Que son los pueblos paganos', url: '/scripts/acto-10',
    body: extractAct('Acto 10: Que són los pueblos paganos', 'Acto 11: Momento Folklore furioso')
  },
  {
    id: 11, title: 'ACTO 11: Momento Folklore furioso de Materio Primo', url: '/scripts/acto-11',
    body: extractAct('Acto 11: Momento Folklore furioso', 'Acto: 12 : FIESTA PAGANA.')
  },
  {
    id: 12, title: 'ACTO 12: FIESTA PAGANA', url: '/scripts/acto-12',
    body: extractAct('Acto: 12 : FIESTA PAGANA.', null)
  }
];

const escapeSql = (str) => str.replace(/'/g, "''").trim();

let sql = `TRUNCATE TABLE public.scripts;\n\n`;
sql += `ALTER TABLE public.scripts ADD COLUMN IF NOT EXISTS content_body TEXT;\n\n`;
sql += `ALTER SEQUENCE scripts_id_seq RESTART WITH 1;\n\n`;

actsData.forEach((act, index) => {
  const isPublic = act.id === 1;
  const access_level = isPublic ? 'public' : 'protected';
  let duration = 'A determinar';
  const match = act.body.match(/\((\d+)\s*minutos?\)/i) || act.body.match(/:?\s*(\d+)\s*minutos?/i);
  if(match) duration = match[1] + ' min';

  sql += `INSERT INTO public.scripts (title, content_url, access_level, duration_text, content_body, created_at) VALUES ('${escapeSql(act.title)}', '${act.url}', '${access_level}', '${escapeSql(duration)}', '${escapeSql(act.body)}', now() + interval '${index} minute');\n`;
});

fs.writeFileSync('d:/Paganismo/insert_all_acts.sql', sql);
console.log('Done crafting insert_all_acts.sql');
