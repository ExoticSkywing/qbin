class QBinMDEditor extends QBinEditorBase {
    constructor() {
        super();
        this.currentEditor = "md";
        this.contentType = "text/markdown; charset=UTF-8";
        this.saveDebounceTimeout = null;
        this.uploadDebounceTimeout = null;
        this.passwordPanelInitialized = false;
        this.currentTheme = this.getThemePreference();
        this.initialize();
    }

    async initialize() {
        await super.initialize();
        this.initializeQuickShare();
    }

    getThemePreference() {
        const savedTheme = localStorage.getItem('qbin-theme') || 'system';
        if (savedTheme === 'dark') return 'dark';
        if (savedTheme === 'light') return 'light';
        // System preference:
        return window.matchMedia('(prefers-color-scheme: dark)').matches ?
            'dark' : 'light';
    }

    toolbarsConfig(config){
        if(isMobile()){
            config.toolbar = [
                    'switchModel',
                    {
                        insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'inlineCode', 'toc', 'table', 'pdf', 'word', 'file'],
                    },
                    'search',
                ];
            config.toolbarRight = ['mySettings', 'myGuide', 'togglePreview', 'undo', 'redo', ];
            config.sidebar = null;
            config.bubble = false;
        }else {
            config.toolbar = [
                    'switchModel',
                    'bold',
                    'italic',
                    {
                        strikethrough: ['strikethrough', 'underline', 'sub', 'sup'],
                    },
                    'size',
                    '|',
                    'color',
                    'header',
                    '|',
                    'ol',
                    'ul',
                    'checklist',
                    'panel',
                    'justify',
                    'detail',
                    '|',
                    {
                        insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'inlineCode', 'toc', 'table', 'pdf', 'word', 'file'],
                    },
                    'undo',
                    'redo',
                    'export',
                ];
            config.toolbarRight = ['mySettings', 'togglePreview', 'shortcutKey', 'myGuide', 'wordCount'];
            config.bubble = ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color'];
            config.sidebar = null;
        }
        return config
    }

    async initEditor() {
        const locale = (navigator.language || navigator.userLanguage).replace("-", "_");
        const customSettings = Cherry.createMenuHook('设置', {
          icon: {
            type: 'svg',
            content: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><defs><symbol id="lineMdCogLoop0"><path d="M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.6 7.4 16.8 7.61 16.99 7.83C17.46 8.4 17.85 9.05 18.11 9.77C18.2 10.03 18.28 10.31 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12"><animate fill="freeze" attributeName="d" begin="0.45s" dur="0.1s" values="M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.6 7.4 16.8 7.61 16.99 7.83C17.46 8.4 17.85 9.05 18.11 9.77C18.2 10.03 18.28 10.31 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12;M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.38 7.2 19 6.12 19.01 6.14C19.01 6.14 20.57 8.84 20.57 8.84C20.58 8.87 18.35 10.59 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12"/></path></symbol></defs><g fill="none" stroke="currentColor" stroke-width="1.2"><g stroke-linecap="round"><path stroke-dasharray="20" stroke-dashoffset="20" d="M12 9c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.1s" values="20;0"/></path><path stroke-dasharray="48" stroke-dashoffset="48" d="M12 5.5c3.59 0 6.5 2.91 6.5 6.5c0 3.59 -2.91 6.5 -6.5 6.5c-3.59 0 -6.5 -2.91 -6.5 -6.5c0 -3.59 2.91 -6.5 6.5 -6.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.3s" values="48;0"/><set fill="freeze" attributeName="opacity" begin="0.45s" to="0"/></path></g><g opacity="0"><use href="#lineMdCogLoop0"/><use href="#lineMdCogLoop0" transform="rotate(60 12 12)"/><use href="#lineMdCogLoop0" transform="rotate(120 12 12)"/><use href="#lineMdCogLoop0" transform="rotate(180 12 12)"/><use href="#lineMdCogLoop0" transform="rotate(240 12 12)"/><use href="#lineMdCogLoop0" transform="rotate(300 12 12)"/><set fill="freeze" attributeName="opacity" begin="0.45s" to="1"/><animateTransform attributeName="transform" dur="15s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></g></svg>',
            iconStyle: 'width: 18px; height: 18px; vertical-align: middle;',
          },
          onClick: () => {
            this.togglePasswordPanel(true); // 传入 true 表示是点击触发
          }
        });
        const customGuide = Cherry.createMenuHook('帮助文档', {
          icon: {
            type: 'svg',
            content: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="16" stroke-dashoffset="16" d="M9 10c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 0.98 -0.47 1.85 -1.2 2.4c-0.73 0.55 -1.3 0.6 -1.8 1.6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="16;0"/></path><path stroke-dasharray="2" stroke-dashoffset="2" d="M12 17v0.01"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0"/></path></g></svg>',
            iconStyle: 'width: 18px; height: 18px; vertical-align: middle;',
          },
          onClick: () => {
            window.open('/r/mdviwer?file=guide', '_blank', 'noopener,noreferrer');
          }
        });
        const toolbars = {
            showToolbar: true,
            toolbar: [],
            toolbarRight: [],
            bubble: [],
            sidebar: [],
            customMenu: {
                mySettings: customSettings,
                myGuide: customGuide,
            },
            toc: true,
            float: false,
        };

        // TODO 实现sidebar Zen模式
        const basicConfig = {
            id: 'markdown',
            nameSpace: 'qbin',
            externals: {
                echarts: window.echarts,
                katex: window.katex,
                MathJax: window.MathJax,
            },
            engine: {
                global: {
                    flowSessionContext: true,
                },
                syntax: {
                    codeBlock: {
                        theme: 'twilight',
                        lineNumber: true,
                        expandCode: true,
                        changeLang: false,
                        editCode: false,
                        wrap: false,
                    },
                    table: {
                        enableChart: true,
                    },
                    fontEmphasis: {
                        allowWhitespace: false,
                    },
                    strikethrough: {
                        needWhitespace: false,
                    },
                    mathBlock: {
                      engine: 'katex',
                    },
                    inlineMath: {
                      engine: 'katex',
                    },
                },
            },
            multipleFileSelection: {
                video: false,
                audio: false,
                image: false,
                word: false,
                pdf: false,
                file: false,
            },
            toolbars: this.toolbarsConfig(toolbars),
            previewer: {
                dom: false,
                enablePreviewerBubble: false,
                floatWhenClosePreviewer: false,
                lazyLoadImg: {
                    maxNumPerTime: 2,
                    noLoadImgNum: 5,
                    autoLoadImgNum: 5,
                    maxTryTimesPerSrc: 2,
                }
            },
            editor: {
                id: 'qbin-text',
                name: 'qbin-text',
                autoSave2Textarea: false,
                defaultModel: 'edit&preview',
                showFullWidthMark: false,
                showSuggestList: false,
                writingStyle: 'normal',
            },
            themeSettings: {
                mainTheme: this.currentTheme,
                codeBlockTheme: 'default',
            },
            callback: {
                // onPaste: (clipboardData) => console.log(clipboardData),
                afterChange: (text, html) => {
                    this.handleContentChange(text);
                },
            },
            event: {
                changeMainTheme: (theme) => {
                    const userPreference = localStorage.getItem('qbin-theme') || 'system';
                    if (userPreference === 'system') {
                        localStorage.setItem('qbin-theme', 'system');
                    }
                    document.documentElement.classList.remove('light-theme', 'dark-theme');
                    document.documentElement.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
                }
            },
            isPreviewOnly: false,
            autoScrollByHashAfterInit: true,
            locale: locale,
            fileUpload: this.myFileUpload.bind(this),
        };
        const config = Object.assign({}, basicConfig, { value: "" });
        Cherry.usePlugin(CherryCodeBlockMermaidPlugin, {
          mermaid: window.mermaid,
          mermaidAPI: window.mermaid,
          theme: 'default',
          sequence: {
            useMaxWidth: false,
            showSequenceNumbers: true,
            mirrorActors: true,
            messageAlign: 'center'
          },
          flowchart: {
            htmlLabels: true,
            curve: 'linear'
          }
        });
        Cherry.usePlugin(CherryTableEchartsPlugin, {
          mermaid: window.echarts,
        });
        window.cherry = new Cherry(config);
        this.setupEditorChangeListener();
        this.initializePasswordPanel();
        this.setupThemeListener();
        return window.cherry;
    }

    getEditorContent() {
        return window.cherry.getMarkdown();
    }

    setEditorContent(content) {
        window.cherry.setMarkdown(content);
    }

    setupEditorChangeListener() {
        // 监听编辑器内容变化，用于自动保存和上传
        let saveTimeout;

        const contentChangeCallback = () => {
            // 保存到本地缓存
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                this.saveToLocalCache();
            }, 1000);

            // 自动上传
            clearTimeout(this.autoUploadTimer);
            this.autoUploadTimer = setTimeout(() => {
                const content = this.getEditorContent();
                if (content && cyrb53(content) !== this.lastUploadedHash) {
                    this.handleUpload(content, "text/markdown; charset=UTF-8");
                }
            }, 2000);
        };

        let lastChangeTime = 0;
        const throttleTime = 500; // 500ms节流

        document.addEventListener('cherry:change', () => {
            const now = Date.now();
            if (now - lastChangeTime > throttleTime) {
                lastChangeTime = now;
                contentChangeCallback();
            }
        });
    }

    handleContentChange(content) {
        // 本地缓存防抖 (1秒)
        clearTimeout(this.saveDebounceTimeout);
        this.saveDebounceTimeout = setTimeout(() => {
            this.saveToLocalCache();
        }, 1000);

        // 自动上传防抖 (3秒)
        clearTimeout(this.uploadDebounceTimeout);
        this.uploadDebounceTimeout = setTimeout(() => {
            if (content && cyrb53(content) !== this.lastUploadedHash) {
                this.handleUpload(content, "text/markdown; charset=UTF-8");
            }
        }, 3000);
    }

    initializePasswordPanel() {
        if (this.passwordPanelInitialized) return;

        const passwordPanel = document.querySelector('.password-panel');
        if (!passwordPanel) return;

        let isInputActive = false;
        let hoverTimeout = null;
        let hideTimeout = null;

        const adjustPanelPosition = (settingsBtn) => {
            const btnRect = settingsBtn.getBoundingClientRect();
            passwordPanel.style.top = (btnRect.bottom + 10) + 'px';
            const rightOffset = window.innerWidth - btnRect.right;
            passwordPanel.style.right = (rightOffset + btnRect.width/2) + 'px';
        };

        const setupPanelEvents = () => {
            const settingsBtn = document.querySelector('.cherry-toolbar-button.cherry-toolbar-mySettings');
            if (!settingsBtn) return false;

            // 调整面板位置
            const handleResize = () => {
                if (passwordPanel.classList.contains('active')) {
                    adjustPanelPosition(settingsBtn);
                }
            };
            window.addEventListener('resize', handleResize);

            // 设置按钮悬停事件
            settingsBtn.addEventListener('mouseenter', () => {
                if (window.innerWidth <= 768) return; // 移动端不触发悬停
                clearTimeout(hideTimeout);
                adjustPanelPosition(settingsBtn);
                hoverTimeout = setTimeout(() => {
                    passwordPanel.classList.add('active');
                }, 100);
            });

            settingsBtn.addEventListener('mouseleave', () => {
                if (window.innerWidth <= 768) return;
                clearTimeout(hoverTimeout);
                if (!isInputActive && !passwordPanel.matches(':hover')) {
                    hideTimeout = setTimeout(() => {
                        passwordPanel.classList.remove('active');
                    }, 300);
                }
            });

            // 面板悬停事件
            passwordPanel.addEventListener('mouseenter', () => {
                if (window.innerWidth <= 768) return;
                clearTimeout(hideTimeout);
            });

            passwordPanel.addEventListener('mouseleave', () => {
                if (window.innerWidth <= 768) return;
                if (!isInputActive) {
                    hideTimeout = setTimeout(() => {
                        passwordPanel.classList.remove('active');
                    }, 300);
                }
            });

            // 输入框焦点事件
            const inputs = passwordPanel.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    isInputActive = true;
                    clearTimeout(hideTimeout);
                });

                input.addEventListener('blur', () => {
                    isInputActive = false;
                    if (!passwordPanel.matches(':hover')) {
                        hideTimeout = setTimeout(() => {
                            passwordPanel.classList.remove('active');
                        }, 800);
                    }
                });
            });

            // 加密复选框交互
            // this.initializeEncryptCheckbox();

            return true;
        };

        // 确保事件只绑定一次
        if (setupPanelEvents()) {
            this.passwordPanelInitialized = true;
        }
    }

    initializeEncryptCheckbox() {
        const checkbox = document.getElementById('encrypt-checkbox');
        const hiddenCheckbox = document.getElementById('encryptData');
        const optionToggle = document.querySelector('.option-toggle');

        if (optionToggle && checkbox && hiddenCheckbox) {
            optionToggle.addEventListener('click', () => {
                const isChecked = checkbox.classList.contains('checked');
                checkbox.classList.toggle('checked');
                hiddenCheckbox.checked = !isChecked;
            });
        }
    }

    togglePasswordPanel(isClick = false) {
        const passwordPanel = document.querySelector('.password-panel');
        if (!passwordPanel) return;
        if (isClick) {
            passwordPanel.classList.toggle('active');
        }
    }

    applyThemeBasedOnPreference() {
        const userPreference = localStorage.getItem('qbin-theme') || 'system';
        let themeToApply;

        if (userPreference === 'system') {
            // Apply theme based on system preference
            themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            // Apply user's explicit choice
            themeToApply = userPreference;
        }

        if (window.cherry && window.cherry.setTheme) {
            // Store original theme value
            const originalTheme = localStorage.getItem('qbin-theme');

            // Apply the theme
            window.cherry.setTheme(themeToApply);
            window.cherry.setCodeBlockTheme(`one-${themeToApply}`);

            // Restore "system" if that was the original preference
            if (originalTheme === 'system') {
                localStorage.setItem('qbin-theme', 'system');
            }
        }
    }

    setupThemeListener() {
        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            // Only react to system changes if the user preference is 'system'
            if (localStorage.getItem('qbin-theme') === 'system' || !localStorage.getItem('qbin-theme')) {
                this.applyThemeBasedOnPreference();
            }
        });

        // Listen for explicit theme changes from other tabs/windows
        window.addEventListener('storage', (event) => {
            if (event.key === 'qbin-theme') {
                this.applyThemeBasedOnPreference();
            }
        });

        // Setup the global theme toggler
        if (!window.qbinToggleTheme) {
            window.qbinToggleTheme = (theme) => {
                localStorage.setItem('qbin-theme', theme);
                this.applyThemeBasedOnPreference();
            };
        }

        // Apply the initial theme
        this.applyThemeBasedOnPreference();
    }

    async myFileUpload(file, callback) {
        try {
            const mainType = file.type.split('/')[0];
            const mimetype = file.type || 'application/octet-stream';
            
            const keyInput = document.getElementById('key-input');
            const pwd = this.currentPath.key || keyInput?.value?.trim() || API.generateKey(6);
            const key = `file-${mainType}-${Date.now()}`;

            this.updateUploadStatus(`正在上传 ${file.name}...`, 'loading');
            
            const success = await API.uploadContent(file, key, pwd, mimetype, file.name);
            
            if (success) {
                // 构建文件访问 URL
                const baseUrl = window.location.origin;
                const url = `/r/${key}/${pwd}`;
                
                // 成功回调
                this.updateUploadStatus(`${file.name} 上传成功`, 'success');
                
                // 根据文件类型返回不同的配置
                if (mainType === "video") {
                    callback(url, {
                        name: file.name,
                        isShadow: true, // 是否显示阴影，默认false
                        isRadius: true, // 是否显示圆角，默认false
                    });
                } else if (mainType === "image") {
                    callback(url, {
                        name: file.name,
                        isShadow: true, // 是否显示阴影，默认false
                        width: '80%', // 图片的宽度，默认100%，可配置百分比，也可配置像素值
                    });
                } else {
                    // 其他文件类型
                    callback(url, {
                        name: file.name,
                        size: file.size,
                    });
                }
                
                // 清除状态提示
                setTimeout(() => {
                    this.updateUploadStatus('');
                }, 2000);
            } else {
                throw new Error('上传失败');
            }
        } catch (error) {
            console.error('文件上传失败:', error);
            this.updateUploadStatus(`上传失败: ${error.message}`, 'error');
            
            // 清除错误提示
            setTimeout(() => {
                this.updateUploadStatus('');
            }, 5000);
            
            // 通知编辑器上传失败
            callback('', {
                error: true,
                message: error.message
            });
        }
    }

    // 初始化快捷分享功能
    initializeQuickShare() {
        const quickShareBtn = document.getElementById('quick-share-btn');
        const manualShareBtn = document.getElementById('manual-share-btn');
        const shareDropdownMenu = document.getElementById('share-dropdown-menu');
        const shareOptions = document.querySelectorAll('.share-option');

        if (!quickShareBtn || !manualShareBtn || !shareDropdownMenu) {
            return;
        }

        // 一键快捷分享
        quickShareBtn.addEventListener('click', () => {
            const shareLink = this.getQuickShareLink();
            this.copyShareLink(shareLink, quickShareBtn);
        });

        // 手动分享下拉菜单
        manualShareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShowing = shareDropdownMenu.classList.contains('show');
            
            if (!isShowing) {
                // 计算按钮位置
                const rect = manualShareBtn.getBoundingClientRect();
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    // 移动端：居中显示，距离按钮下方
                    shareDropdownMenu.style.top = `${rect.bottom + 4}px`;
                    shareDropdownMenu.style.left = '';
                    shareDropdownMenu.style.right = '';
                } else {
                    // 桌面端：右对齐按钮
                    shareDropdownMenu.style.top = `${rect.bottom + 4}px`;
                    shareDropdownMenu.style.right = `${window.innerWidth - rect.right}px`;
                    shareDropdownMenu.style.left = 'auto';
                }
            }
            
            shareDropdownMenu.classList.toggle('show');
        });

        // 点击分享选项
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const type = option.getAttribute('data-type');
                const shareLink = this.getShareLinkByType(type);
                this.copyShareLink(shareLink, option);
                shareDropdownMenu.classList.remove('show');
            });
        });

        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!manualShareBtn.contains(e.target) && !shareDropdownMenu.contains(e.target)) {
                shareDropdownMenu.classList.remove('show');
            }
        });

        // 窗口大小改变时关闭下拉菜单
        window.addEventListener('resize', () => {
            shareDropdownMenu.classList.remove('show');
        });

        // 滚动时关闭下拉菜单
        window.addEventListener('scroll', () => {
            shareDropdownMenu.classList.remove('show');
        }, true);
    }

    // 获取快捷分享链接（自动判断）
    getQuickShareLink() {
        const passwordInput = document.getElementById('password-input');
        const keyInput = document.getElementById('key-input');
        const hasPassword = passwordInput && passwordInput.value.trim();
        const key = this.currentPath.key || (keyInput && keyInput.value.trim()) || 'untitled';

        const baseUrl = window.location.origin;

        if (hasPassword) {
            // 有密码：使用预览模式（不带密码）
            return `${baseUrl}/p/${key}`;
        } else {
            // 无密码：使用纯净只读模式
            return `${baseUrl}/r/mdviewer?file=${key}`;
        }
    }

    // 根据类型获取分享链接
    getShareLinkByType(type) {
        const keyInput = document.getElementById('key-input');
        const key = this.currentPath.key || (keyInput && keyInput.value.trim()) || 'untitled';
        const baseUrl = window.location.origin;

        switch (type) {
            case 'preview':
                // 预览模式
                return `${baseUrl}/p/${key}`;
            case 'clean':
                // 纯净只读模式
                return `${baseUrl}/r/mdviewer?file=${key}`;
            case 'render':
                // 直接渲染模式
                return `${baseUrl}/r/${key}`;
            default:
                return `${baseUrl}/p/${key}`;
        }
    }

    // 复制分享链接到剪贴板
    async copyShareLink(link, element) {
        try {
            await navigator.clipboard.writeText(link);
            
            // 显示成功反馈
            const originalHTML = element.innerHTML;
            element.classList.add('copied');
            
            if (element.tagName === 'BUTTON') {
                element.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>已复制</span>
                `;
            } else {
                // 对于下拉选项，显示临时提示
                const toast = document.createElement('div');
                toast.className = 'copy-toast';
                toast.textContent = '✓ 链接已复制';
                toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #52c41a;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    font-size: 14px;
                    font-weight: 500;
                    animation: slideInRight 0.3s ease;
                `;
                document.body.appendChild(toast);

                setTimeout(() => {
                    toast.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }, 2000);
            }
            
            // 恢复原始状态
            setTimeout(() => {
                element.classList.remove('copied');
                if (element.tagName === 'BUTTON') {
                    element.innerHTML = originalHTML;
                }
            }, 2000);
            
        } catch (error) {
            console.error('复制失败:', error);
            
            // 降级方案：创建临时输入框
            const tempInput = document.createElement('input');
            tempInput.value = link;
            tempInput.style.position = 'fixed';
            tempInput.style.top = '-1000px';
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            this.showToast('链接已复制（兼容模式）', 'success');
        }
    }

    // 显示提示消息
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.textContent = message;
        const colors = {
            success: '#52c41a',
            error: '#ff4d4f',
            info: '#1890ff'
        };
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

new QBinMDEditor();
