const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
		},
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};

module.exports = config;
