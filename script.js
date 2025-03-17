document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 导航栏滚动效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
        lastScrollTop = scrollTop;
    });

    // 表单提交处理
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // 这里可以添加表单数据发送到服务器的代码
            console.log('Form submitted:', formData);
            
            // 显示成功消息
            alert('Thank you for your message! We will contact you soon.');
            
            // 重置表单
            contactForm.reset();
        });
    }

    // 产品卡片悬停效果
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 创建首页轮播效果
    setupHeroSlider();

    // 设置产品卡片轮播
    setupProductSliders();

    // 处理图片加载错误
    handleImageErrors();
});

// 首页轮播效果
function setupHeroSlider() {
    const heroSlider = document.querySelector('.hero-slider');
    if (!heroSlider) return;

    // 产品文件夹路径
    const productFolders = [
        "Mens-Coat&Jacket",
        "Ladies-Coat",
        "Ladies-Jacket",
        "Mens-Wind-Jacket",
        "Ladies-wind-Coat",
        "straw-hats",
        "Mens-SOCKS",
        "scarves-foulards"
    ];

    // 为每个产品文件夹创建一个幻灯片
    productFolders.forEach((folder, index) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('images/product/${folder}/1.png')`;
        
        // 设置第一张幻灯片为活动状态
        if (index === 0) {
            slide.classList.add('active');
        }
        
        heroSlider.appendChild(slide);
    });

    // 轮播逻辑
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    // 每5秒切换一次幻灯片
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// 设置产品卡片轮播
function setupProductSliders() {
    // 获取所有产品卡片
    const productCards = document.querySelectorAll('.product-card');
    
    // 为每个产品卡片设置轮播
    productCards.forEach(card => {
        const folder = card.getAttribute('data-folder');
        const slider = card.querySelector('.product-card-slider');
        
        // 创建6张幻灯片（假设每个产品最多有6张图片）
        for (let i = 1; i <= 6; i++) {
            const slide = document.createElement('div');
            slide.className = 'product-card-slide';
            
            const img = document.createElement('img');
            img.src = `images/product/${folder}/${i}.png`;
            img.alt = card.querySelector('h3').textContent;
            
            // 设置图片加载错误处理
            img.onerror = function() {
                // 如果图片不存在，则移除该幻灯片
                slide.remove();
                
                // 如果是第一张图片，则使用占位图
                if (i === 1) {
                    const placeholderSlide = document.createElement('div');
                    placeholderSlide.className = 'product-card-slide active';
                    
                    const placeholderImg = document.createElement('img');
                    placeholderImg.src = createPlaceholderImage();
                    placeholderImg.alt = card.querySelector('h3').textContent;
                    
                    // 添加点击事件，跳转到产品展示页面
                    placeholderImg.addEventListener('click', function() {
                        window.location.href = `products.html?category=${encodeURIComponent(folder)}`;
                    });
                    
                    placeholderSlide.appendChild(placeholderImg);
                    slider.appendChild(placeholderSlide);
                }
            };
            
            // 添加点击事件，跳转到产品展示页面
            img.addEventListener('click', function() {
                window.location.href = `products.html?category=${encodeURIComponent(folder)}`;
            });
            
            // 设置第一张幻灯片为活动状态
            if (i === 1) {
                slide.classList.add('active');
            }
            
            slide.appendChild(img);
            slider.appendChild(slide);
        }
        
        // 设置导航按钮
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        
        // 当前幻灯片索引
        let currentIndex = 0;
        
        // 下一张幻灯片
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止触发卡片的点击事件
            e.preventDefault(); // 防止触发链接跳转
            
            const slides = card.querySelectorAll('.product-card-slide');
            if (slides.length <= 1) return;
            
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        });
        
        // 上一张幻灯片
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止触发卡片的点击事件
            e.preventDefault(); // 防止触发链接跳转
            
            const slides = card.querySelectorAll('.product-card-slide');
            if (slides.length <= 1) return;
            
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
        });
    });
}

// 处理图片加载错误
function handleImageErrors() {
    // 创建一个简单的占位图片
    const placeholderUrl = createPlaceholderImage();
    
    // 为所有产品图片添加错误处理
    document.querySelectorAll('.product-card img').forEach(img => {
        img.onerror = function() {
            this.src = placeholderUrl;
        };
    });
}

// 创建占位图片
function createPlaceholderImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // 设置背景色为浅灰色
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 添加文本
    ctx.fillStyle = '#FF8C00';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PIAT GARMENTS', canvas.width / 2, canvas.height / 2);
    
    return canvas.toDataURL();
} 