# Smart Effect — сайт для GitHub Pages

Только файлы сайта (без внутренних инструкций и скриптов генерации).

**Домен:** smart-effect.ru

## Как превратить в репозиторий

1. В этой папке выполнить: `git init`, затем `git add .`, `git commit -m "Initial commit"`, `git branch -M main`.
2. Создать репозиторий на GitHub, подключить: `git remote add origin https://github.com/<username>/<repo>.git`, `git push -u origin main`.
3. В репозитории: **Settings → Pages** → Deploy from branch **main**, folder **/ (root)**.
4. При необходимости указать Custom domain: smart-effect.ru.

## Домен smart-effect.ru — настройка DNS

В панели управления доменом (где купили smart-effect.ru) добавьте записи:

**Чтобы работал основной адрес smart-effect.ru (без www):**

| Тип  | Имя (хост) | Значение        |
|------|-------------|------------------|
| A    | @           | 185.199.108.153  |
| A    | @           | 185.199.109.153  |
| A    | @           | 185.199.110.153  |
| A    | @           | 185.199.111.153  |

**Чтобы работал www.smart-effect.ru (по желанию):**

| Тип   | Имя (хост) | Значение                 |
|-------|------------|---------------------------|
| CNAME | www        | nletra1983.github.io      |

После сохранения DNS подождите 5–60 минут. В GitHub: **Settings → Pages** включите **Enforce HTTPS**.

## Обновление сайта

Правки в этой папке → `git add .` → `git commit -m "..."` → `git push`.
