import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					glow: 'hsl(var(--card-glow))'
				},
				/* Mystical Portal Colors */
				portal: {
					primary: 'hsl(var(--portal-primary))',
					secondary: 'hsl(var(--portal-secondary))',
					accent: 'hsl(var(--portal-accent))',
					emerald: 'hsl(var(--portal-emerald))',
					ring: 'hsl(var(--portal-ring))'
				},
				mystical: {
					text: 'hsl(var(--text-mystical))',
					ethereal: 'hsl(var(--text-ethereal))',
					whisper: 'hsl(var(--text-whisper))'
				},
				choice: {
					hover: 'hsl(var(--choice-hover))',
					active: 'hsl(var(--choice-active))'
				}
			},
			backgroundImage: {
				'cosmic-primary': 'var(--cosmic-primary)',
				'cosmic-portal': 'var(--cosmic-portal)',
				'cosmic-mystical': 'var(--cosmic-mystical)',
				'cosmic-background': 'var(--cosmic-background)'
			},
			boxShadow: {
				'sigil': 'var(--sigil-glow)',
				'rune': 'var(--rune-pulse)',
				'fragment': 'var(--fragment-shine)',
				'portal-glow': '0 0 40px hsl(var(--portal-primary) / 0.3), 0 0 80px hsl(var(--portal-secondary) / 0.2)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				/* Mystical Portal Animations */
				'portal-pulse': {
					'0%, 100%': { 
						transform: 'scale(1)',
						opacity: '0.8'
					},
					'50%': { 
						transform: 'scale(1.05)',
						opacity: '1'
					}
				},
				'sigil-rotate': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'rune-glow': {
					'0%, 100%': { 
						filter: 'drop-shadow(0 0 5px hsl(var(--portal-primary)))',
						transform: 'scale(1)'
					},
					'50%': { 
						filter: 'drop-shadow(0 0 20px hsl(var(--portal-primary)))',
						transform: 'scale(1.1)'
					}
				},
				'fragment-float': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg)',
						opacity: '0.6'
					},
					'50%': { 
						transform: 'translateY(-10px) rotate(180deg)',
						opacity: '1'
					}
				},
				'cosmic-drift': {
					'0%': { transform: 'translate(0px, 0px)' },
					'33%': { transform: 'translate(30px, -30px)' },
					'66%': { transform: 'translate(-20px, 20px)' },
					'100%': { transform: 'translate(0px, 0px)' }
				},
				'shimmer-sweep': {
					'0%': { 
						backgroundPosition: '-200% 0'
					},
					'100%': { 
						backgroundPosition: '200% 0'
					}
				},
				'portal-emerge': {
					'0%': { 
						transform: 'scale(0.8) rotate(-180deg)',
						opacity: '0'
					},
					'100%': { 
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				/* Mystical Animations */
				'portal-pulse': 'portal-pulse 3s ease-in-out infinite',
				'sigil-rotate': 'sigil-rotate 20s linear infinite',
				'rune-glow': 'rune-glow 2s ease-in-out infinite',
				'fragment-float': 'fragment-float 4s ease-in-out infinite',
				'cosmic-drift': 'cosmic-drift 8s ease-in-out infinite',
				'shimmer-sweep': 'shimmer-sweep 2s ease-in-out',
				'portal-emerge': 'portal-emerge 0.6s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
