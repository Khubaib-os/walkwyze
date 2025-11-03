import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),
    react()],
})




// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react()
//   ],
  
//   build: {
    
//     minify: 'terser',
//     terserOptions: {
//       compress: {
//         drop_console: true,    // Console remove
//         drop_debugger: true    // Debugger remove
//       }
//     },
//     // Sourcemap disable for production
//     sourcemap: false
//   }
// })