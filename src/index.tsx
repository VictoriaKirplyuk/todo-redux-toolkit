import ReactDOM from 'react-dom/client';
import './index.css';
import {store} from './app/store';
import {Provider} from "react-redux";
import App from "./app/App";
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);