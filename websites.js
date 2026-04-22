// 常用网站维护脚本 - 带缓存功能和密码验证
document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'website_auth_status';
    const AUTH_EXPIRE_MS = 24 * 60 * 60 * 1000; // 24小时过期
    const ICON_CACHE_KEY = 'website_icons_cache';
    const CACHE_EXPIRE_DAYS = 1; // 图标缓存1天
    
    // 检查是否已认证
    function checkAuth() {
        try {
            const authData = localStorage.getItem(STORAGE_KEY);
            if (!authData) return false;
            
            const { timestamp, authenticated } = JSON.parse(authData);
            // 检查是否过期
            if (Date.now() - timestamp > AUTH_EXPIRE_MS) {
                localStorage.removeItem(STORAGE_KEY);
                return false;
            }
            return authenticated === true;
        } catch (e) {
            return false;
        }
    }
    
    // 设置认证状态
    function setAuthStatus(authenticated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            timestamp: Date.now(),
            authenticated: authenticated
        }));
    }
    
    // 创建密码验证界面
    function createPasswordPrompt() {
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'none';
        }

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        
        const promptBox = document.createElement('div');
        promptBox.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
        `;
        
        const title = document.createElement('h2');
        title.textContent = '请输入访问密码';
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #2c3e50;
            font-size: 24px;
            font-weight: 600;
        `;
        
        const form = document.createElement('form');
        form.autocomplete = 'off';
        form.style.cssText = 'width: 100%;';
        form.addEventListener('submit', function(event) {
            event.preventDefault();
        });

        const hiddenUsername = document.createElement('input');
        hiddenUsername.type = 'text';
        hiddenUsername.name = 'username';
        hiddenUsername.autocomplete = 'username';
        hiddenUsername.style.display = 'none';

        const hiddenPassword = document.createElement('input');
        hiddenPassword.type = 'password';
        hiddenPassword.name = 'password';
        hiddenPassword.autocomplete = 'new-password';
        hiddenPassword.style.display = 'none';
        
        const input = document.createElement('input');
        input.type = 'password';
        input.placeholder = '请输入密码';
        input.autocomplete = 'new-password';
        input.name = 'site-password-' + Date.now();
        input.readOnly = true;
        input.spellcheck = false;
        input.autocorrect = 'off';
        input.autocapitalize = 'off';
        input.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 20px;
            box-sizing: border-box;
            outline: none;
            transition: border-color 0.3s;
        `;
        input.addEventListener('focus', function() {
            this.readOnly = false;
            if (this.value) {
                this.value = '';
            }
        });
        
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '验证';
        button.style.cssText = `
            background: #4a90e2;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
            width: 100%;
        `;
        
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            color: #e74c3c;
            margin-top: 10px;
            min-height: 20px;
            font-size: 14px;
        `;
        
        button.onmouseover = () => button.style.background = '#357ae8';
        button.onmouseout = () => button.style.background = '#4a90e2';
        
        input.onfocus = () => input.style.borderColor = '#4a90e2';
        input.onblur = () => input.style.borderColor = '#e9ecef';
        
        button.onclick = function() {
            if (input.value === 'la775210') {
                setAuthStatus(true);
                overlay.remove();
                if (header) {
                    header.style.display = 'flex';
                }
                loadWebsitesData(); // 认证成功后加载数据
            } else {
                errorMsg.textContent = '密码错误，请重试';
                input.value = '';
                input.focus();
            }
        };
        
        input.onkeypress = function(e) {
            if (e.key === 'Enter') {
                button.click();
            }
        };
        
        promptBox.appendChild(title);
        form.appendChild(hiddenUsername);
        form.appendChild(hiddenPassword);
        form.appendChild(input);
        form.appendChild(button);
        form.appendChild(errorMsg);
        promptBox.appendChild(form);
        overlay.appendChild(promptBox);
        document.body.appendChild(overlay);
        
        input.focus();
    }
    
    // 从JSON文件加载数据
    function loadWebsitesData() {
        fetch('websites-data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应错误');
                }
                return response.json();
            })
            .then(data => {
                displayWebsites(data.categories);
            })
            .catch(error => {
                console.error('加载数据失败:', error);
                alert('无法加载网站数据，请检查网络连接或数据文件');
            });
    }
    
    // 图标缓存管理
    function getIconCache() {
        try {
            const cache = localStorage.getItem(ICON_CACHE_KEY);
            return cache ? JSON.parse(cache) : {};
        } catch (e) {
            return {};
        }
    }
    
    function setIconCache(cache) {
        try {
            localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            console.warn('无法保存图标缓存:', e);
        }
    }
    
    function isCacheValid(timestamp) {
        return Date.now() - timestamp < CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000;
    }
    
    function getCacheKey(url) {
        return new URL(url).hostname;
    }
    
    function parseSiteEntry(siteEntry) {
        if (typeof siteEntry === 'string') {
            const [namePart, ...rest] = siteEntry.split(',');
            return {
                name: (namePart || '').trim(),
                url: (rest.join(',') || '').trim()
            };
        }
        return siteEntry;
    }

    // 显示网站列表
    function displayWebsites(categories) {
        const grid = document.getElementById('websites-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        categories.forEach((category, index) => {
            if (index > 0) {
                const separator = document.createElement('div');
                separator.className = 'separator-thin';
                grid.appendChild(separator);
            }

            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category.name;
            categoryTitle.style.cssText = `
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin: 20px 0 15px 0;
                grid-column: 1 / -1;
            `;
            grid.appendChild(categoryTitle);

            category.sites.forEach(siteEntry => {
                const site = parseSiteEntry(siteEntry);
                if (!site || !site.url) return;

                const item = document.createElement('a');
                item.className = 'website-item';
                item.href = site.url;
                item.target = '_blank';
                item.rel = 'noopener noreferrer';
                item.title = site.name;
                
                const domain = new URL(site.url).hostname;
                const cacheKey = getCacheKey(site.url);
                const iconCache = getIconCache();
                
                // 默认图标
                const defaultIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiM0YTkwZTIiIGZpbGwtb3BhY2l0eT0iMC4xIi8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgdGV4dC1hbmNob3I9Im1iZGRsZSIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iIzRhOTBlMiI+8J+OqzwvdGV4dD4KPC9zdmc+';

                const img = document.createElement('img');
                img.className = 'site-icon';
                img.alt = site.name;
                
                if (iconCache[cacheKey] && isCacheValid(iconCache[cacheKey].timestamp)) {
                    // 使用缓存的图标
                    img.src = iconCache[cacheKey].iconUrl;
                    img.onerror = () => { img.src = defaultIcon; };
                } else {
                    // 重新获取图标
                    const faviconUrls = [
                        `https://${domain}/favicon.ico`,
                        `https://api.byi.pw/favicon/?url=${encodeURIComponent(site.url)}`,
                        `https://favicon.cccyun.cc/${encodeURIComponent(domain)}`,
                        `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`
                    ];

                    let currentIndex = 0;
                    const tryLoadFavicon = () => {
                        if (currentIndex < faviconUrls.length) {
                            img.src = faviconUrls[currentIndex];
                            currentIndex++;
                        } else {
                            img.src = defaultIcon;
                        }
                    };

                    img.onerror = tryLoadFavicon;
                    img.onload = function() {
                        if (this.naturalWidth > 16 && this.naturalHeight > 16) {
                            const cache = getIconCache();
                            cache[cacheKey] = {
                                iconUrl: this.src,
                                timestamp: Date.now()
                            };
                            setIconCache(cache);
                        } else {
                            this.onerror();
                        }
                    };

                    tryLoadFavicon();
                }

                const nameSpan = document.createElement('span');
                nameSpan.className = 'site-name';
                nameSpan.textContent = site.name;

                item.appendChild(img);
                item.appendChild(nameSpan);
                grid.appendChild(item);
            });
        });
    }
    
    // 直接显示密码验证界面
    createPasswordPrompt();
    
    // 退出登录功能
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem(STORAGE_KEY);
            location.reload(); // 刷新页面重新显示登录界面
        });
    }
});