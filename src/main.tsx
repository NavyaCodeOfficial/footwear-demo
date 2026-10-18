import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './app/routes';
import './styles/global.css';

export const createRoot = ViteReactSSG({ routes });
