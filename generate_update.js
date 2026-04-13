const fs = require('fs');
const content = fs.readFileSync('script_text.txt', 'utf-8');

const act1 = content.substring(content.indexOf('Ninio  monje:'), content.indexOf('Segundo  acto:'));
const act2 = content.substring(content.indexOf('Ninio  Leguizamon   :'), content.indexOf('Tercer acto:'));
const act3 = content.substring(content.indexOf('Gabriel  ahora  agrega'), content.indexOf('Acto  4 (De transición):'));
const act4 = content.substring(content.indexOf('Gabriel  se  queda  solo,'), content.indexOf('Acto  5: Ingreso'));
const act5 = content.substring(content.indexOf('La  comparsa   canta  esto'), content.indexOf('Acto  6: El secreto:'));
const act6 = content.substring(content.indexOf('De  la misma  manera   que  ingresó'), content.indexOf('Acto  7 empieza  la banda'));
const act7 = content.substring(content.indexOf('Lista de  temas'), content.indexOf('8avo  acto: Entra'));
const act8 = content.substring(content.indexOf('Mientras  Gugú  Petit Morte'));

const escapeSql = (str) => str.replace(/'/g, "''").trim();

let sql = `-- AGREGADA DE COLUMNA \nALTER TABLE public.scripts ADD COLUMN IF NOT EXISTS content_body TEXT;\n\n`;
sql += `UPDATE public.scripts SET content_body = '${escapeSql(act1)}' WHERE title LIKE 'ACTO 1%';\n`;
sql += `UPDATE public.scripts SET content_body = '${escapeSql(act2)}' WHERE title LIKE 'ACTO 2%';\n`;
sql += `UPDATE public.scripts SET content_body = '${escapeSql(act3)}' WHERE title LIKE 'ACTO 3%';\n`;
sql += `UPDATE public.scripts SET content_body = '${escapeSql(act4)}' WHERE title LIKE 'ACTO 4%';\n`;
sql += `UPDATE public.scripts SET content_body = '${escapeSql(act5)}' WHERE title LIKE 'ACTO 5%';\n`;
sql += `UPDATE public.scripts SET content_body = '${escapeSql(act6)}' WHERE title LIKE 'ACTO 6%';\n`;
sql += `UPDATE public.scripts SET content_body = '${escapeSql(act7)}' WHERE title LIKE 'ACTO 7%';\n`;
sql += `UPDATE public.scripts SET content_body = '${escapeSql(act8)}' WHERE title LIKE 'ACTOS 8%';\n`;

fs.writeFileSync('supabase/scripts_content_update.sql', sql);
console.log('SQL File created successfully at supabase/scripts_content_update.sql');
