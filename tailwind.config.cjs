const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
		},
		fontFamily: {
			display: ["Source\\ Sans\\ Pro", "system-ui", "sans-serif"],
			body: ["Noto\\ Serif\\ Lao", "system-ui"],
			mono: ["Roboto\\ Mono", "monospace"]
		},
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};

module.exports = config;
