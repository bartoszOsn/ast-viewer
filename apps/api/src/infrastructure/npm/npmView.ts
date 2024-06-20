import { exec } from 'child_process';

export function npmView(packageName: string): Promise<NpmView> {
	return new Promise((resolve, reject) => {
		exec(`npm view ${packageName} --json`, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			} else {
				resolve(JSON.parse(stdout));
			}
		})
	});
}

export interface NpmView {
	name: string;
	versions: Array<string>;
	version: string;
}