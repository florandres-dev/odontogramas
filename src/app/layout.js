import localFont from 'next/font/local';
import Navbar from './components/Navbar';
import './globals.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { AuthProvider } from './context/AuthContext';

export const metadata = {
	title: 'Odontograma | Florencia Andres',
	description: 'Hecho por Florencia Andres',
};

export default function RootLayout({ children }) {
	return (
		<html lang='es'>
			<body className='min-h-screen bg-slate-100'>
				<PrimeReactProvider>
					<AuthProvider>
						<Navbar />
						<div className='sm:pt-14 pt-8 sm:h-screen w-screen'>{children}</div>
					</AuthProvider>
				</PrimeReactProvider>
			</body>
		</html>
	);
}
