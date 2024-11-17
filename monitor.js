import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const assetsDir = path.join(__dirname, 'server-preview', 'src', 'assets');
const jsonFilePath = path.join(assetsDir, 'files.json');

fs.mkdirSync(assetsDir, { recursive: true });

function getAllSvgFiles(dir, fileList = [], relativeDir = '') {
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		const fullPath = path.join(dir, file);
		const relPath = path.join(relativeDir, file);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			getAllSvgFiles(fullPath, fileList, relPath);
		} else if (file.endsWith('.svg')) {
			fileList.push(relPath);
		}
	});
	console.log(fileList);
	return fileList;
}

// Function to copy files and generate JSON
const copyFilesAndGenerateJSON = () => {
	const svgFiles = getAllSvgFiles(inputDir);

	// Copy files to the output directory, preserving subfolder structure
	svgFiles.forEach((relPath) => {
		const src = path.join(inputDir, relPath);
		const dest = path.join(outputDir, relPath);
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.copyFileSync(src, dest);
	});

	// Copy files to the assets directory, preserving subfolder structure
	svgFiles.forEach((relPath) => {
		const src = path.join(outputDir, relPath);
		const dest = path.join(assetsDir, relPath);
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.copyFileSync(src, dest);
	});

	// Generate JSON with file names (relative paths)
	const jsonContent = JSON.stringify(svgFiles, null, 2);
	fs.writeFileSync(jsonFilePath, jsonContent);

	console.log('Files copied and JSON generated:', svgFiles);
};

// Wat
fs.watch(inputDir, { recursive: true }, (eventType, filename) => {
	if (filename && filename.endsWith('.svg')) {
		console.log(`Change detected: ${filename}`);
		copyFilesAndGenerateJSON();
	}
});

// Initial run
copyFilesAndGenerateJSON();
