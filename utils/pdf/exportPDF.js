import puppeteer from "puppeteer";
import { generateHTML } from "./genarateHTML.js";

export async function exportPdf(data,fileName,category) {
    try {

      const browser = await puppeteer.launch({
        headless: true,
        timeout: 60000, // Increase timeout to 60 seconds
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these arguments for environments that require them
        // executablePath: '/path/to/your/chrome' // Uncomment this line and set the path if needed
      });
      
      const page = await browser.newPage();
      const htmlContent =  generateHTML(data,category);
  
      await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 }); // Increase timeout here as well
      await page.pdf({ path: fileName, printBackground: true, format: 'A4' });
  
      await browser.close();
      console.log('PDF created successfully');
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
};