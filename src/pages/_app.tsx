import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppProvider from '../hooks';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>

      <ToastContainer />
    </>
  );
}

export default MyApp
