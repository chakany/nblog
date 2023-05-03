const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
		},
		extend: {
			colors: {
				accent: "var(--accent-color)",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};

module.exports = config;
