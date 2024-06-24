import { exec } from 'child_process';

export function npmInstall(cwd: string, packageName: string, packageVersion: string, packageAlias: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const installArg = `${packageAlias}@npm:${packageName}@${packageVersion}`;
		const command = `npm install ${installArg} --prefix ${cwd}`;
		exec(command, {cwd}, (error: any) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}