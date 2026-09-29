import './index.css';
import { StrictMode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { App } from '@components/app/app';
import { Provider } from 'react-redux';
import { store } from '@services/store';


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </Provider>
  </StrictMode>
);
