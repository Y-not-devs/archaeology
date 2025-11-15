// Простая интерактивность для статического сайта

document.addEventListener('DOMContentLoaded', function() {
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками репозиториев и трендовыми карточками
    const cards = document.querySelectorAll('.repo-card, .trending-card, .commit-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Фильтрация по табам
    const filterTabs = document.querySelectorAll('.tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем active со всех табов
            filterTabs.forEach(t => t.classList.remove('active'));
            // Добавляем active на текущий таб
            this.classList.add('active');
            
            // Здесь можно добавить логику фильтрации, когда появится бэкенд
            console.log('Фильтр активирован:', this.textContent);
        });
    });

    // Поиск
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            console.log('Поиск:', query);
            // Здесь будет логика поиска, когда появится бэкенд
        });
    }

    // Кнопка Star
    const starButtons = document.querySelectorAll('.btn-action');
    starButtons.forEach(button => {
        if (button.textContent.includes('Star')) {
            button.addEventListener('click', function() {
                const countElement = this.querySelector('.count');
                if (countElement) {
                    let count = parseInt(countElement.textContent);
                    
                    // Переключаем состояние
                    if (this.classList.contains('starred')) {
                        count--;
                        this.classList.remove('starred');
                        this.style.backgroundColor = 'var(--bg-tertiary)';
                    } else {
                        count++;
                        this.classList.add('starred');
                        this.style.backgroundColor = 'rgba(56, 139, 253, 0.15)';
                        this.style.borderColor = 'var(--link-color)';
                    }
                    
                    countElement.textContent = count;
                }
            });
        }
    });

    // Копирование хеша коммита
    const copyButtons = document.querySelectorAll('.btn-icon');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hashElement = this.previousElementSibling;
            if (hashElement && hashElement.classList.contains('commit-hash')) {
                const hash = hashElement.textContent;
                
                // Копируем в буфер обмена
                navigator.clipboard.writeText(hash).then(() => {
                    // Показываем визуальную обратную связь
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<span style="color: var(--green);">✓</span>';
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 1500);
                }).catch(err => {
                    console.error('Ошибка копирования:', err);
                });
            }
        });
    });

    // Анимация счетчиков на главной странице
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent.replace(/,/g, ''));
        let currentValue = 0;
        const increment = finalValue / 50; // 50 шагов анимации
        const duration = 1500; // 1.5 секунды
        const stepTime = duration / 50;

        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue.toLocaleString();
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(currentValue).toLocaleString();
            }
        }, stepTime);
    });

    // Подсветка текущей страницы в навигации
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.repo-tab');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Раскрытие/скрытие описания коммита (если оно длинное)
    const commitDescriptions = document.querySelectorAll('.commit-description');
    commitDescriptions.forEach(desc => {
        if (desc.scrollHeight > 100) {
            desc.style.maxHeight = '100px';
            desc.style.overflow = 'hidden';
            desc.style.position = 'relative';
            
            const expandButton = document.createElement('button');
            expandButton.textContent = 'Показать больше';
            expandButton.className = 'expand-button';
            expandButton.style.cssText = `
                background: none;
                border: none;
                color: var(--link-color);
                cursor: pointer;
                font-size: 12px;
                margin-top: 8px;
                padding: 0;
            `;
            
            desc.parentElement.appendChild(expandButton);
            
            expandButton.addEventListener('click', function() {
                if (desc.style.maxHeight === '100px') {
                    desc.style.maxHeight = 'none';
                    this.textContent = 'Показать меньше';
                } else {
                    desc.style.maxHeight = '100px';
                    this.textContent = 'Показать больше';
                }
            });
        }
    });

    // Hover эффект для файлов в explorer
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--bg-tertiary)';
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = '';
            }
        });
    });

    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Симуляция загрузки данных для фильтров
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            console.log('Фильтр изменен:', this.value);
            
            // Анимация "загрузки"
            const commitsList = document.querySelector('.commits-list');
            if (commitsList) {
                commitsList.style.opacity = '0.5';
                setTimeout(() => {
                    commitsList.style.opacity = '1';
                }, 300);
            }
        });
    });

    // Добавление tooltip для кнопок
    const buttonsWithTooltip = document.querySelectorAll('[title]');
    buttonsWithTooltip.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.textContent = this.getAttribute('title');
            tooltip.className = 'tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background-color: var(--bg-secondary);
                color: var(--text-primary);
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 1000;
                border: 1px solid var(--border-color);
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            this._tooltip = tooltip;
        });
        
        button.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });

    console.log('ArcheoHub инициализирован');
});

// Функция для форматирования дат (можно использовать позже)
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 30) {
        return date.toLocaleDateString('ru-RU');
    } else if (days > 0) {
        return `${days} ${days === 1 ? 'день' : 'дней'} назад`;
    } else if (hours > 0) {
        return `${hours} ${hours === 1 ? 'час' : 'часов'} назад`;
    } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? 'минуту' : 'минут'} назад`;
    } else {
        return 'только что';
    }
}

// Функция для форматирования чисел
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}