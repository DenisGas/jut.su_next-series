/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable require-yield */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const csvParser = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const { pipeline } = require('stream/promises');

const LOCALES = ['EN', 'UK', 'RU'];
const INPUT_CSV = './localization.csv';
const OUTPUT_PATH = './src/_locales';
const KEYS_FILE = './src/scripts/modules/common/localizationKeys.js';

// Функція для умовного логування
const conditionalLog = (shouldLog, ...args) => {
  if (shouldLog) console.log(...args);
};
const conditionalWarn = (shouldLog, ...args) => {
  if (shouldLog) console.warn(...args);
};

// Конвертація CSV у JSON
async function csvToJson(shouldLog = false) {
  try {
    const csvPath = path.resolve(INPUT_CSV);
    conditionalLog(shouldLog, `Trying to read CSV from: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    const stats = await fsPromises.stat(csvPath);
    conditionalLog(shouldLog, `CSV file size: ${stats.size} bytes`);
    if (stats.size === 0) {
      throw new Error('CSV file is empty');
    }

    const localeData = Object.fromEntries(LOCALES.map((lang) => [lang, {}]));
    const localizationKeys = {};
    let rowCount = 0;

    const fileContent = await fsPromises.readFile(csvPath, 'utf8');
    conditionalLog(shouldLog, 'CSV file content:', fileContent);

    await pipeline(
      fs.createReadStream(csvPath),
      csvParser(),
      async function* (source) {
        conditionalLog(shouldLog, 'Starting pipeline processing...');
        for await (const row of source) {
          rowCount++;
          conditionalLog(shouldLog, `Processing row ${rowCount}:`, row);
          const key = row.Key?.trim();
          if (!key) {
            conditionalWarn(
              shouldLog,
              `Skipping row ${rowCount}: No 'Key' found`
            );
            continue;
          }

          localizationKeys[key] = key;

          for (const lang of LOCALES) {
            if (row[lang]) {
              localeData[lang][key] = { message: row[lang] };
            } else {
              conditionalWarn(
                shouldLog,
                `No value for ${lang} in row ${rowCount}, key: ${key}`
              );
            }
          }
        }
        if (rowCount === 0) {
          conditionalWarn(shouldLog, 'No rows were processed from CSV');
        }
      }
    );

    conditionalLog(shouldLog, `Processed ${rowCount} rows`);
    conditionalLog(shouldLog, 'localeData after processing:', localeData);

    if (rowCount === 0) {
      throw new Error('No valid rows processed from CSV. Check file format.');
    }

    await Promise.all(
      LOCALES.map(async (lang) => {
        const dir = path.join(OUTPUT_PATH, lang.toLowerCase());
        await fsPromises.mkdir(dir, { recursive: true });
        const content = JSON.stringify(localeData[lang], null, 2);
        conditionalLog(
          shouldLog,
          `Writing to ${lang.toLowerCase()}/messages.json:`,
          content
        );
        await fsPromises.writeFile(
          path.join(dir, 'messages.json'),
          content,
          'utf8'
        );
      })
    );

    const keysContent = `const localizationKeys = ${JSON.stringify(localizationKeys, null, 2)};\nexport default localizationKeys;`;
    await fsPromises.writeFile(KEYS_FILE, keysContent, 'utf8');

    console.log(
      'CSV successfully converted to JSON files and localizationKeys.js'
    );
  } catch (error) {
    console.error('Error in csvToJson:', error);
    throw error;
  }
}

// Конвертація JSON у CSV
async function jsonToCsv(shouldLog = false) {
  try {
    const data = {};

    for (const lang of LOCALES) {
      const filePath = path.join(
        OUTPUT_PATH,
        lang.toLowerCase(),
        'messages.json'
      );
      try {
        const jsonData = JSON.parse(
          await fsPromises.readFile(filePath, 'utf8')
        );
        for (const [key, value] of Object.entries(jsonData)) {
          if (!data[key]) data[key] = { key };
          data[key][lang] = value.message;
        }
      } catch (error) {
        conditionalWarn(
          shouldLog,
          `No messages.json found for ${lang}, skipping...`
        );
      }
    }

    const csvWriter = createObjectCsvWriter({
      path: INPUT_CSV,
      header: [
        { id: 'key', title: 'Key' },
        ...LOCALES.map((lang) => ({ id: lang, title: lang.toUpperCase() })),
      ],
    });

    await csvWriter.writeRecords(Object.values(data));
    console.log(`JSON successfully converted to ${INPUT_CSV}`);
  } catch (error) {
    console.error('Error in jsonToCsv:', error);
    throw error;
  }
}

// Виконання команд через аргументи командного рядка
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const shouldLog = args.includes('--log');

  try {
    if (command === 'csv2json') {
      await csvToJson(shouldLog);
    } else if (command === 'json2csv') {
      await jsonToCsv(shouldLog);
    } else {
      console.log('Usage: node script.js [csv2json|json2csv] [--log]');
    }
  } catch (error) {
    process.exit(1);
  }
}

main();
