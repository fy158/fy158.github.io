

// hl.js
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载动画
    document.body.classList.add('fade-in');

// 轮播图功能

// 内容管理器功能
function showTab(tabId) {
    // 隐藏所有标签内容
    document.querySelectorAll('.media-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // 显示选中的标签内容
    document.getElementById(tabId).classList.add('active');
    
    // 更新按钮状态
    document.querySelectorAll('.tab-buttons button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
}

// 图片上传预览
function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('imagePreview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

    // 初始化内容管理器
    const fileInput = document.getElementById('mediaUpload');
    if (fileInput) {
        fileInput.addEventListener('change', previewImage);
    }
    
    // 默认显示第一个标签
    showTab('travel');

    // 初始化轮播图
    let currentSlide = 0;
    const slides = document.querySelectorAll('#banner img');
    const indicators = document.querySelectorAll('.slide-indicator');
    const preview = document.getElementById('imagePreview');
    const slideCount = slides.length;

    function showSlide(index) {
        // 更新图片显示
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // 更新指示器状态
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        // 更新预览图
        if (slides[index]) {
            preview.src = slides[index].src;
        }
    }

    // 自动轮播
    function startAutoPlay() {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slideCount;
            showSlide(currentSlide);
        }, 5000);
    }

    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // 初始化
    if (slideCount > 0) {
        showSlide(0);
        startAutoPlay();
    }

    // 内容管理功能
    const contentManager = document.createElement('div');
    contentManager.id = 'contentManager';
    contentManager.innerHTML = `
        <div class="tab-buttons">
            <button class="active" data-type="image">添加图片</button>
            <button data-type="music">添加音乐</button>
            <button data-type="video">添加视频</button>
        </div>
        <form id="mediaForm">
            <div class="media-form active" data-type="image">
                <div class="preview-container">
                    <img id="imagePreview" src="#" alt="图片预览" style="display:none;">
                </div>
                <input type="file" accept="image/*" id="imageUpload" onchange="previewImage(event)">
                <input type="text" id="imageUrl" placeholder="或输入图片URL" oninput="validateImageUrl(this)">
                <input type="text" id="imageTitle" placeholder="图片标题" required>
                <div class="error-message" id="imageError"></div>
                <button type="button" onclick="addMedia('image')" class="submit-btn">
                    <span class="btn-text">添加</span>
                    <span class="loading-spinner" style="display:none;"></span>
                </button>
            </div>
            <div class="media-form" data-type="music">
                <input type="file" accept="audio/*" id="musicUpload">
                <input type="text" id="musicUrl" placeholder="或输入音乐URL" required>
                <input type="text" id="musicTitle" placeholder="音乐标题" required>
                <div class="error-message" id="musicError"></div>
                <button type="button" onclick="addMedia('music')" class="submit-btn">
                    <span class="btn-text">添加</span>
                    <span class="loading-spinner" style="display:none;"></span>
                </button>
            </div>
            <div class="media-form" data-type="video">
                <input type="text" id="videoUrl" placeholder="输入视频URL" required pattern="https?://.+">
                <input type="text" id="videoTitle" placeholder="视频标题" required>
                <div class="error-message" id="videoError"></div>
                <button type="button" onclick="addMedia('video')" class="submit-btn">
                    <span class="btn-text">添加</span>
                    <span class="loading-spinner" style="display:none;"></span>
                </button>
            </div>
        </form>
    `;
    document.body.appendChild(contentManager);

    // 选项卡切换
    document.querySelectorAll('.tab-buttons button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-buttons button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.media-form').forEach(form => {
                form.style.display = form.dataset.type === this.dataset.type ? 'block' : 'none';
            });
        });
    });
});

// 媒体添加功能
function addMedia(type) {
    let mediaUrl, title;
    
    switch(type) {
        case 'image':
            mediaUrl = document.getElementById('imageUrl').value || 
                      URL.createObjectURL(document.getElementById('imageUpload').files[0]);
            title = document.getElementById('imageTitle').value;
            break;
        case 'music':
            mediaUrl = document.getElementById('musicUrl').value || 
                      URL.createObjectURL(document.getElementById('musicUpload').files[0]);
            title = document.getElementById('musicTitle').value;
            break;
        case 'video':
            mediaUrl = document.getElementById('videoUrl').value;
            title = document.getElementById('videoTitle').value;
            break;
    }

    if(!mediaUrl || !title) return;

    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    
    if(type === 'image') {
        mediaItem.innerHTML = `
            <img src="${mediaUrl}" alt="${title}">
            <div class="media-content">
                <p>${title}</p>
            </div>
        `;
        document.querySelector('#luxing .grid-container').appendChild(mediaItem);
    } 
    else {
        mediaItem.style.aspectRatio = '16/9';
        mediaItem.innerHTML = `
            <div class="media-content">
                <h3>${title}</h3>
                ${type === 'music' ? 
                    `<audio controls src="${mediaUrl}"></audio>` : 
                    `<iframe width="100%" height="100%" src="${mediaUrl}" frameborder="0" allowfullscreen></iframe>`}
            </div>
        `;
        document.querySelector(`#${type}s`).appendChild(mediaItem);
    }

    // 清空表单
    document.querySelectorAll('input').forEach(input => input.value = '');
}

// 图片预览功能
function previewImage(event) {
    const preview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

// 图片URL验证
function validateImageUrl(input) {
    const errorDiv = document.getElementById('imageError');
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    if (input.value && !urlPattern.test(input.value)) {
        errorDiv.textContent = '请输入有效的图片URL';
        return false;
    } else {
        errorDiv.textContent = '';
        return true;
    }
}

// 显示加载状态
function setLoadingState(button, isLoading) {
    const spinner = button.querySelector('.loading-spinner');
    const text = button.querySelector('.btn-text');
    
    if (isLoading) {
        spinner.style.display = 'inline-block';
        text.style.display = 'none';
        button.disabled = true;
    } else {
        spinner.style.display = 'none';
        text.style.display = 'inline-block';
        button.disabled = false;
    }
}
