import { ViteReactSSG } from "vite-react-ssg/single-page"
import "./index.css"
import App from "./App.tsx"

export const createRoot = ViteReactSSG(<App />)
