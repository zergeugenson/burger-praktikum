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

```bash
npm run deploy
```

Скрипт собирает `dist` с `base: '/react-burger-ts/'`, копирует `index.html` в `404.html` для SPA-переходов и публикует ветку `gh-pages`.


## Процедура создания коммита с проверками

При создании коммита автоматически запускаются проверка линтерами `stylelint`, `eslint` и форматирование `prettier`.

Если линтер обнаружит ошибки:

- Коммит создан не будет
- Необходимо исправить все выявленные проблемы
- Добавить исправленные файлы в индекс: `git add .`
- Повторить коммит

**Рекомендация:**  
Для предотвращения ошибок на этапе коммита предварительно выполните:  
`npm run lint`. Это позволит выявить и исправить проблемы до создания коммита.

Есть также команды для запуска проверок по отдельности:

- `npm run eslint` - запускает проверку линтера и исправляет проблемы, которые можно исправить автоматически,
- `npm run stylelint` - запускает проверку литера для файлов стилей и исправляет проблемы, которые можно исправить автоматически,
- `npm run prettier` - исправляет ошибки форматирования кода.

Можно добавить автозапуск этих команд при сохранении файла в вашей IDE.

Для создания коммита рекомендуется запускать команду `npm run commit`. Она позволяет обеспечить соответствие описаний коммитов [общепринятым соглашениям](https://www.conventionalcommits.org/en/v1.0.0/).

В проекте настроены алиасы, которые можно использовать при импорте модулей:

```
	alias: {
		'@': path.resolve(__dirname, './src'),
		'@components': path.resolve(__dirname, './src/components'),
		'@services': path.resolve(__dirname, './src/utils'),
		'@pages': path.resolve(__dirname, './src/pages'),
		'@utils': path.resolve(__dirname, './src/utils'),
	},
```
