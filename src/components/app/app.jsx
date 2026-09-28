import { useState, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { useApi } from '@hooks/useApi.js';
import BurgerApi from '@utils/api.js';

import { BurgerContext } from '../../context';
import { Modal } from '../modal/modal.jsx';

import styles from './app.module.css';

export const App = () => {
  const initOpen = { isopen: false, data: {}, title: null };
  const [ingredients, setIngredients] = useState([]);
  const [sharedCounter, setSharedCounter] = useState(0);
  const [openModal, setOpenModal] = useState(initOpen);

  const [ieFetch] = useApi(async () => {
    const response = await BurgerApi.getIngredients('/ingredients');
    setIngredients(response.data);
  });

  useEffect(() => {
    void ieFetch();
  }, []);

  return (
    <BurgerContext.Provider
      value={{
        sharedCounter,
        setSharedCounter,
        openModal,
        setOpenModal,
      }}
    >
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor ingredients={ingredients} />
        </main>
        {openModal.isopen && (
          <Modal close={() => setOpenModal(initOpen)} title={openModal.title}>
            {openModal.data}
          </Modal>
        )}
      </div>
    </BurgerContext.Provider>
  );
};
