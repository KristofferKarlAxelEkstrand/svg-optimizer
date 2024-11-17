import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preset = process.env.PRESET || 'default';
const presetPath = path.join(__dirname, 'presets', `${preset}.js`);

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

// Recursively find all SVG files in a directory
async function findSvgFiles(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	let files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files = files.concat(await findSvgFiles(fullPath));
		} else if (entry.isFile() && path.extname(entry.name) === '.svg') {
			files.push(fullPath);
		}
	}
	return files;
}

// Ensure the output directory exists
try {
	await fs.mkdir(outputDir, { recursive: true });
} catch (err) {
	console.error('Error creating output directory:', err);
	process.exit(1);
}

try {
	const svgFiles = await findSvgFiles(inputDir);

	for (const inputFile of svgFiles) {
		// Get the relative path from inputDir to the file
		const relativePath = path.relative(inputDir, inputFile);
		const outputFile = path.join(outputDir, relativePath);
		const outputFileDir = path.dirname(outputFile);

		// Ensure the output subdirectory exists
		await fs.mkdir(outputFileDir, { recursive: true });

		// Optimize the SVG file using the configuration file
		exec(
			`npx svgo --config=${presetPath} "${inputFile}" -o "${outputFile}"`,
			(err, stdout, stderr) => {
				if (err) {
					console.error(`Error optimizing ${relativePath}:`, err);
					return;
				}
				console.log(`Optimized ${relativePath}`);
			}
		);
	}
} catch (err) {
	console.error('Error processing SVG files:', err);
}
