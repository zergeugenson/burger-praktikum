# Стартер на JavaScript для проекта Stellar Burger

Учебный проект для "Курс по React" Yandex-practicum

## Стек

- React 19, Javascript, Vite
- UI-kit [`@krgaa/react-developer-burger-ui-components`](https://react-burger-ui-components.education-services.ru/)
- Norma API: `https://new-stellarburgers.education-services.ru/api`

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`. Превью продакшен-сборки: `npm run preview` (открыть путь `/react-burger-ts/`).

## GitHub

https://github.com/zergeugenson/burger-praktikum

## Деплой

Сайт на GitHub Pages: https://zergeugenson.github.io/burger-praktikum
Сайт на Web: https://stellarburger.hromov.com/


```bash
npm run deploy
```

Публикует сборку на GH в ветку `gh-pages`, откуда она деплоится. 


## Тесты

```bash
npm run test
```

Запускает тесты бизнес-логики приложения

```bash
npm run test:pr
```

Запускает "npx playwright test e2e/tests/constructor.spec.ts" для тестов функциональности страницы «Конструктор» с Playwright
