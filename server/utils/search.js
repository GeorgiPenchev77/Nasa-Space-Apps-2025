import fs from 'fs';
import csv from 'csv-parser';

export default function searchCSV(query, folderPath = '../resources') {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.readdir(folderPath, (err, files) => {
      if (err) return reject(err);

      const csvFiles = files.filter(file => file.endsWith('.csv'));
      let filesProcessed = 0;

      if (csvFiles.length === 0) return resolve(results);

      csvFiles.forEach(file => {
        fs.createReadStream(`${folderPath}/${file}`)
          .pipe(csv())
          .on('data', row => {
            if (Object.values(row).some(val => val.toString().toLowerCase().includes(query.toLowerCase()))) {
              results.push({ file, row });
            }
          })
          .on('end', () => {
            filesProcessed++;
            if (filesProcessed === csvFiles.length) resolve(results);
          });
      });
    });
  });
}
