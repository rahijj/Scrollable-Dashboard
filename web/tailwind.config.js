module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			keyframes: {
				spinner: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},

				disappear: {
					"0%, 50%": { opacity: "1" },

					"100%": {
						opacity: "0",
						display: "none",
					},
				},
			},
			animation: {
				disappear: "disappear 2.3s ease-out",
				spinner: "spinner 1.5s linear infinite",
			},
		},
		screens: {
			"2xl": { max: "1535px" },
			// => @media (max-width: 1535px) { ... }

			xl: { max: "1279px" },
			// => @media (max-width: 1279px) { ... }

			lg: { max: "1023px" },
			// => @media (max-width: 1023px) { ... }

			md: { max: "767px" },
			// => @media (max-width: 767px) { ... }

			sm: { max: "639px" },
			// => @media (max-width: 639px) { ... }
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
	"editor.quickSuggestions": {
		strings: true,
	},
}
