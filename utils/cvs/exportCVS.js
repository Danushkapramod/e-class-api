import fs from 'fs';
import fastcsv from 'fast-csv';

export async function exportCvs(data,filePath) {
    return new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(filePath);
        fastcsv
            .write(data, { headers: true })
            .pipe(ws)
            .on('finish', resolve)
            .on('error', reject);
        }); 
}

