/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#ffc727",
				secondary: {
					100: "#E2E2D5",
					200: "#888883",
				},
				dark: "#111111",
			},
			Container: {
				sm: 'flex-row items-start justify-center gap-6',
				lg: 'w-3/4 h-auto',
			},
		},
	},
	plugins: [
		require('tailwindcss-animated')
	],
}

