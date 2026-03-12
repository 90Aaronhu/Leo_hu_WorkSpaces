// 获取DOM元素
const form = document.getElementById('destiny-form');
const inputSection = document.getElementById('input-section');
const loadingSection = document.getElementById('loading-section');
const resultSection = document.getElementById('result-section');
const resetBtn = document.getElementById('reset-btn');

// 结果展示元素
const greetingEl = document.getElementById('result-greeting');
const baziDisplay = document.getElementById('bazi-display');
const descOverall = document.getElementById('desc-overall');
const descLove = document.getElementById('desc-love');
const descWealth = document.getElementById('desc-wealth');

// 命理文庫（可根据哈希值随机抽取）
const fortunes = {
    overall: [
        "今年吉星高照，紫微星入命，虽偶有波折，但贵人暗中相助，遇难成祥。宜守正道，静待花开。",
        "天机星转动，今年是充满变数的一年。不要固执己见，顺应时势，跳出舒适圈方能迎来巨大转机。",
        "流年平稳，五行流转无滞。虽然没有惊天动地的大事，但这正是积蓄力量的好时候。厚积薄发，秋后有成。",
        "贪狼入宫，野心与机遇并存。你将面临许多诱惑与挑战，唯有坚定内心信仰，方能拨云见日，收获辉煌。"
    ],
    love: [
        "红鸾星动，桃花如雨。单身者有望在不经意间邂逅正缘；有伴侣者感情升温，情比金坚，宜多些浪漫。",
        "孤辰寡宿暗布，今年感情运势稍显平淡。不必强求，缘分未到时，不如先好好沉淀自己，提升个人魅力。",
        "天喜星临，情缘虽好但略带考验。你们需要更多的沟通与包容，经历小风浪后，感情反而会更加深厚。",
        "桃花带劫，容易遇到烂桃花或短暂的感情纠葛。擦亮眼睛，保持理性，不要轻易被甜言蜜语蒙蔽双眼。"
    ],
    wealth: [
        "武曲星发力，正财旺盛。只要脚踏实地，努力工作，薪资与存款必将稳步上涨。不宜进行高风险投机。",
        "偏财运极佳的一年！可能会有意想不到的收入来源，例如投资回报、奖金或副业收入。但切记见好就收，切勿贪得无厌。",
        "财帛宫逢空，今年容易有意外的花销，理财需格外谨慎。建议做好储蓄计划，避免情绪化消费，以备不时之需。",
        "破军化禄，打破旧格局才能迎来新财富。适合尝试新的投资方向或开启个人的小副业，胆大心细，必有所获。"
    ]
};

// 初始化年月日下拉框
const yearSelect = document.getElementById('birth-year');
const monthSelect = document.getElementById('birth-month');
const daySelect = document.getElementById('birth-day');

// 生成年份 (1940 到 当前年份)
const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 1940; i--) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i + '年';
    yearSelect.appendChild(option);
}

// 生成月份 (1-12)
for (let i = 1; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i + '月';
    monthSelect.appendChild(option);
}

// 动态生成日期
function updateDays() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    
    // 保留默认选项
    daySelect.innerHTML = '<option value="" disabled selected>日</option>';
    
    if (year && month) {
        // 获取该月的天数
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '日';
            daySelect.appendChild(option);
        }
    }
}

yearSelect.addEventListener('change', updateDays);
monthSelect.addEventListener('change', updateDays);

// 天干地支库
const tiangan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const dizhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 字符串哈希函数，用于生成伪随机
function stringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// 模拟生辰八字排盘（简化版演义算法）
function generateBazi(year, month, day, timeStr) {
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    // 粗略模拟，并非真实命理万年历
    // 天干地支每60年一轮回，这里用简化的取模运算演示排盘感
    const yGanIndex = (year - 4) % 10;
    const yGan = tiangan[yGanIndex >= 0 ? yGanIndex : yGanIndex + 10];
    
    const yZhiIndex = (year - 4) % 12;
    const yZhi = dizhi[yZhiIndex >= 0 ? yZhiIndex : yZhiIndex + 12];
    
    const mGan = tiangan[(month + year) % 10];
    const mZhi = dizhi[(month + 1) % 12];
    
    const dGan = tiangan[(day + month) % 10];
    const dZhi = dizhi[day % 12];

    let tGan = "--", tZhi = "--";
    if(timeStr && timeStr !== "unknown") {
        const hour = parseInt(timeStr);
        // 时辰换算
        const zhiIndex = Math.floor((hour + 1) / 2) % 12;
        tZhi = dizhi[zhiIndex];
        tGan = tiangan[(hour + day) % 10];
    } else {
        tGan = "吉";
        tZhi = "时";
    }

    return `${yGan}${yZhi}年 ${mGan}${mZhi}月 ${dGan}${dZhi}日 ${tGan}${tZhi}`;
}

// 提交表单处理
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const year = yearSelect.value;
    const month = monthSelect.value;
    const day = daySelect.value;
    const birthTime = document.getElementById('birth-time').value;

    if(!name || !year || !month || !day || !birthTime) {
        alert('请完整选择您的生辰信息');
        return;
    }

    const birthDate = `${year}-${month}-${day}`;

    // 切换到加载状态
    inputSection.classList.remove('active-section');
    inputSection.classList.add('hidden-section');
    loadingSection.classList.remove('hidden-section');
    loadingSection.classList.add('show-loading');

    // 模拟占卜计算耗时 (2.5秒)
    setTimeout(() => {
        // 计算玄学哈希值
        const seedStr = `${name}-${gender}-${birthDate}`;
        const hash = stringHash(seedStr);

        // 选择运势结果
        const overallResult = fortunes.overall[hash % fortunes.overall.length];
        const loveResult = fortunes.love[(hash >> 2) % fortunes.love.length];
        const wealthResult = fortunes.wealth[(hash >> 4) % fortunes.wealth.length];

        // 排盘
        const bazi = generateBazi(year, month, day, birthTime);

        // 渲染数据
        greetingEl.textContent = `尊敬的命主：${name}`;
        baziDisplay.textContent = `天元命盘：[ ${bazi} ]`;
        descOverall.textContent = overallResult;
        descLove.textContent = loveResult;
        descWealth.textContent = wealthResult;

        // 切换视图并开启动画
        loadingSection.classList.remove('show-loading');
        loadingSection.classList.add('hidden-section');
        
        resultSection.classList.remove('hidden-section');
        resultSection.style.display = 'block';
        // 强制重绘以触发动画
        void resultSection.offsetWidth;
        resultSection.classList.add('show');

    }, 2500);
});

// 重置测算
resetBtn.addEventListener('click', () => {
    resultSection.classList.remove('show');
    
    setTimeout(() => {
        resultSection.style.display = 'none';
        inputSection.classList.remove('hidden-section');
        inputSection.classList.add('active-section');
        form.reset();
    }, 500); // 等待淡出动画完成
});
