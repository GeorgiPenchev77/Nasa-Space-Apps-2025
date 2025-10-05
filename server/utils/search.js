import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export default function searchCSV(query, folderPath = '../resources') {
  return new Promise((resolve, reject) => {
    const results = [];
    const normalizedQuery = query.trim().toLowerCase().replace(/[^a-z0-9]/g, ""); // remove punctuation

    fs.readdir(folderPath, (err, files) => {
      if (err) return reject(err);

      const csvFiles = files.filter(file => file.endsWith('.csv'));
      if (csvFiles.length === 0) return resolve(results);

      let filesProcessed = 0;

      csvFiles.forEach(file => {
        const filePath = path.join(folderPath, file);

        fs.createReadStream(filePath)
          .pipe(csv({ separator: "," }))
          .on('data', row => {
            if (!row || Object.keys(row).length === 0) return;

            try {
              const normalizedValues = Object.values(row)
                .filter(v => v !== null && v !== undefined)
                .map(v => v.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "")); // normalize punctuation

              if (normalizedValues.some(val => val.includes(normalizedQuery))) {
                results.push({
                  file,
                  title: row.Title?.trim() || "",
                  link: row.Link?.trim() || "",
                });
              }
            } catch (e) {
              console.warn("Row parse issue:", e.message);
            }
          })
          .on('end', () => {
            filesProcessed++;
            if (filesProcessed === csvFiles.length) {
              // Remove duplicate links
              const unique = results.filter(
                (v, i, a) => a.findIndex(t => t.link === v.link) === i
              );
              resolve(unique);
            }
          });
      });
    });
  });
}
