import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const outputDir = path.join(__dirname, 'output');
const assetsDir = path.join(__dirname, 'browser-test', 'src', 'assets');
const jsonFilePath = path.join(assetsDir, 'files.json');

// Ensure the assets directory exists
fs.mkdirSync(assetsDir, { recursive: true });

// Function to copy files and generate JSON
const copyFilesAndGenerateJSON = () => {
	const files = fs.readdirSync(outputDir).filter((file) => file.endsWith('.svg'));

	// Copy files to the assets directory
	files.forEach((file) => {
		const src = path.join(outputDir, file);
		const dest = path.join(assetsDir, file);
		fs.copyFileSync(src, dest);
	});

	// Generate JSON with file names
	const jsonContent = JSON.stringify(files, null, 2);
	fs.writeFileSync(jsonFilePath, jsonContent);

	console.log('Files copied and JSON generated:', files);
};

// Watch for changes in the output directory
fs.watch(outputDir, { recursive: true }, (eventType, filename) => {
	if (filename && filename.endsWith('.svg')) {
		console.log(`Change detected: ${filename}`);
		copyFilesAndGenerateJSON();
	}
});

// Initial run
copyFilesAndGenerateJSON();
