import { PackageContext } from '../domain/PackageContext';

export const parsers: Array<PackageContext> = [
	{ name: '@typescript-eslint/parser', language: 'typescript' },
	{ name: '@angular-eslint/template-parser', language: 'html' }
];