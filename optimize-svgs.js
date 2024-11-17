import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const configName = 'default-two-dec';

// Ensure the output directory exists
try {
	await fs.mkdir(outputDir, { recursive: true });
} catch (err) {
	console.error('Error creating output directory:', err);
	process.exit(1);
}

// Read all SVG files from the input directory
try {
	const files = await fs.readdir(inputDir);

	for (const file of files) {
		if (path.extname(file) === '.svg') {
			const inputFile = path.join(inputDir, file);
			const outputFile = path.join(outputDir, file);

			// Optimize the SVG file using the configuration file
			exec(
				`npx svgo --config=svgo.${configName}.config.js ${inputFile} -o ${outputFile}`,
				(err, stdout, stderr) => {
					if (err) {
						console.error(`Error optimizing ${file}:`, err);
						return;
					}
					console.log(`Optimized ${file}`);
				}
			);
		}
	}
} catch (err) {
	console.error('Error reading input directory:', err);
}
