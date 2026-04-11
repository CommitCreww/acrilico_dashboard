/**@type {import('tailwindcss').Config} */
export default {
    content: [
        "/index.html",
        ".src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],

    theme: {
  extend: {
    animation: {
      float: "float 12s ease-in-out infinite",
      "float-slow": "float 18s ease-in-out infinite",
      "float-slower": "float 25s ease-in-out infinite",
    },
    keyframes: {
      float: {
        "0%, 100%": {
          transform: "translateY(0px) translateX(0px)",
        },
        "50%": {
          transform: "translateY(-40px) translateX(30px)",
        },
      },
    },
  },
},
}

