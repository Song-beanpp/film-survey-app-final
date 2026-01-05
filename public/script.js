// Survey Navigation and Logic
let currentSection = 1;
const totalSections = 11;
let watchedFilms = [];

// Film data
const films = [
    { id: 'zootopia', english: 'Zootopia', chinese: '疯狂动物城', year: '2016', section: 3 },
    { id: 'frozen2', english: 'Frozen II', chinese: '冰雪奇缘2', year: '2019', section: 4 },
    { id: 'mulan', english: 'Mulan', chinese: '花木兰', year: '2020', section: 5 },
    { id: 'greenbook', english: 'Green Book', chinese: '绿皮书', year: '2019', section: 6 },
    { id: 'kungfupanda3', english: 'Kung Fu Panda 3', chinese: '功夫熊猫3', year: '2016', section: 7 }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateFilmSections();
    updateProgress();

    // Form submission
    document.getElementById('surveyForm').addEventListener('submit', handleSubmit);
});

// Generate film evaluation sections dynamically
function generateFilmSections() {
    const container = document.getElementById('filmSections');

    films.forEach((film, index) => {
        const section = document.createElement('section');
        section.className = 'survey-section';
        section.setAttribute('data-section', film.section);

        section.innerHTML = `
            <div class="section-header">
                <h2>电影${index + 1}: ${film.english}《${film.chinese}》</h2>
                <p>Film ${index + 1} Evaluation</p>
            </div>

            <div class="section-content">
                <div class="question">
                    <label class="required">您是否完整观看过电影 ${film.english}《${film.chinese}》(${film.year})?</label>
                    <p class="question-desc">Have you watched the film ${film.english} (${film.year}) completely?</p>
                    <div class="radio-group">
                        <label><input type="radio" name="${film.id}_watched" value="yes" required> 是,我已完整观看 | Yes, I have watched it completely</label>
                        <label><input type="radio" name="${film.id}_watched" value="no"> 否,我未完整观看 | No, I have not watched it completely</label>
                    </div>
                </div>

                <div class="film-evaluation" id="${film.id}_evaluation" style="display:none;">
                    <div class="film-title-display">
                        <div class="english-title">${film.english}</div>
                        <div class="chinese-title">${film.chinese}</div>
                    </div>

                    <div class="question">
                        <label class="required">请对中文片名"${film.chinese}"进行评价</label>
                        <p class="question-desc">Please evaluate the Chinese title "${film.chinese}"</p>
                        
                        <div class="likert-grid">
                            <table class="likert-table">
                                <thead>
                                    <tr>
                                        <th style="width: 40%;">陈述 | Statement</th>
                                        <th>1<br>非常不同意</th>
                                        <th>2<br>不同意</th>
                                        <th>3<br>中立</th>
                                        <th>4<br>同意</th>
                                        <th>5<br>非常同意</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>中文片名易于理解<br><small>The Chinese title is easy to understand</small></td>
                                        <td><input type="radio" name="${film.id}_easy" value="1" required></td>
                                        <td><input type="radio" name="${film.id}_easy" value="2"></td>
                                        <td><input type="radio" name="${film.id}_easy" value="3"></td>
                                        <td><input type="radio" name="${film.id}_easy" value="4"></td>
                                        <td><input type="radio" name="${film.id}_easy" value="5"></td>
                                    </tr>
                                    <tr>
                                        <td>中文片名对我有吸引力<br><small>The Chinese title is attractive to me</small></td>
                                        <td><input type="radio" name="${film.id}_attractive" value="1" required></td>
                                        <td><input type="radio" name="${film.id}_attractive" value="2"></td>
                                        <td><input type="radio" name="${film.id}_attractive" value="3"></td>
                                        <td><input type="radio" name="${film.id}_attractive" value="4"></td>
                                        <td><input type="radio" name="${film.id}_attractive" value="5"></td>
                                    </tr>
                                    <tr>
                                        <td>中文片名准确反映了英文片名的含义<br><small>The Chinese title accurately reflects the meaning of the English title</small></td>
                                        <td><input type="radio" name="${film.id}_accurate" value="1" required></td>
                                        <td><input type="radio" name="${film.id}_accurate" value="2"></td>
                                        <td><input type="radio" name="${film.id}_accurate" value="3"></td>
                                        <td><input type="radio" name="${film.id}_accurate" value="4"></td>
                                        <td><input type="radio" name="${film.id}_accurate" value="5"></td>
                                    </tr>
                                    <tr>
                                        <td>我喜欢这个中文译名<br><small>I like this Chinese translation</small></td>
                                        <td><input type="radio" name="${film.id}_like" value="1" required></td>
                                        <td><input type="radio" name="${film.id}_like" value="2"></td>
                                        <td><input type="radio" name="${film.id}_like" value="3"></td>
                                        <td><input type="radio" name="${film.id}_like" value="4"></td>
                                        <td><input type="radio" name="${film.id}_like" value="5"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="question">
                        <label>英文片名"${film.english}"对您意味着什么或暗示了什么?</label>
                        <p class="question-desc">What does the English title "${film.english}" mean or suggest to you?</p>
                        <textarea name="${film.id}_english_meaning" rows="4" placeholder="请用中文或英文详细描述您的理解..."></textarea>
                    </div>

                    <div class="question">
                        <label>中文片名"${film.chinese}"对您意味着什么或暗示了什么?</label>
                        <p class="question-desc">What does the Chinese title "${film.chinese}" mean or suggest to you?</p>
                        <textarea name="${film.id}_chinese_meaning" rows="4" placeholder="请用中文或英文详细描述您的理解..."></textarea>
                    </div>

                    <div class="question">
                        <label>请解释您在上述评分中的理由</label>
                        <p class="question-desc">Please explain the reasons for your ratings above.</p>
                        <textarea name="${film.id}_explanation" rows="4" placeholder="例如:为什么您认为中文片名易于/不易于理解?..."></textarea>
                    </div>
                </div>
            </div>

            <div class="button-group">
                <button type="button" class="btn btn-prev" onclick="prevSection()">← 上一步 | Previous</button>
                <button type="button" class="btn btn-next" onclick="nextSection()">下一步 | Next →</button>
            </div>
        `;

        container.appendChild(section);

        // Add event listener for watch status
        const watchedRadios = section.querySelectorAll(`input[name="${film.id}_watched"]`);
        watchedRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const evaluation = document.getElementById(`${film.id}_evaluation`);
                if (radio.value === 'yes') {
                    evaluation.style.display = 'block';
                    // Make evaluation questions required
                    evaluation.querySelectorAll('input[type="radio"]').forEach(input => {
                        input.required = true;
                    });
                } else {
                    evaluation.style.display = 'none';
                    // Remove required from evaluation questions
                    evaluation.querySelectorAll('input[type="radio"]').forEach(input => {
                        input.required = false;
                        input.checked = false;
                    });
                    evaluation.querySelectorAll('textarea').forEach(textarea => {
                        textarea.value = '';
                    });
                }
            });
        });
    });
}

// Navigation functions
function nextSection() {
    const current = document.querySelector(`[data-section="${currentSection}"]`);

    // Validate current section
    if (!validateSection(current)) {
        return;
    }

    // Check for disqualification logic
    if (currentSection === 1) {
        const consent = document.querySelector('input[name="consent"]:checked');
        if (consent && consent.value === 'no') {
            showToast('感谢您的关注。Thank you for your interest.', 'error');
            setTimeout(() => window.location.reload(), 2000);
            return;
        }
    }

    if (currentSection === 2) {
        const nativeLanguage = document.querySelector('input[name="nativeLanguage"]:checked');
        const education = document.querySelector('input[name="education"]:checked');

        if (nativeLanguage && (nativeLanguage.value === 'english' || nativeLanguage.value === 'other')) {
            showSection(11); // Disqualification
            return;
        }

        if (education && education.value === 'non-chinese') {
            showSection(11); // Disqualification
            return;
        }

        // Check minimum films watched (new Q7)
        const filmsWatchedCount = document.querySelector('input[name="filmsWatchedCount"]:checked');
        if (filmsWatchedCount) {
            const count = parseInt(filmsWatchedCount.value);
            if (count < 3) {
                showSection(11); // Disqualification
                return;
            }
        }
    }

    // For film sections, check if watched
    if (currentSection >= 3 && currentSection <= 7) {
        const filmIndex = currentSection - 3;
        const film = films[filmIndex];
        const watched = document.querySelector(`input[name="${film.id}_watched"]:checked`);

        if (watched && watched.value === 'no') {
            // Skip to next film or section 8
            currentSection = currentSection === 7 ? 8 : currentSection + 1;
            showSection(currentSection);
            return;
        }
    }

    // Move to next section
    if (currentSection < totalSections) {
        currentSection++;
        showSection(currentSection);
    }
}

function prevSection() {
    if (currentSection > 1) {
        currentSection--;
        showSection(currentSection);
    }
}

function showSection(sectionNum) {
    document.querySelectorAll('.survey-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.querySelector(`[data-section="${sectionNum}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionNum;
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateProgress() {
    const progress = ((currentSection - 1) / (totalSections - 2)) * 100; // Exclude disqualification section
    document.getElementById('progressBar').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('progressText').textContent = `${Math.round(Math.min(progress, 100))}%`;
}

function validateSection(section) {
    const requiredInputs = section.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            const name = input.name;
            const checked = section.querySelector(`input[name="${name}"]:checked`);
            if (!checked) {
                isValid = false;
                const questionDiv = input.closest('.question');
                if (questionDiv) {
                    questionDiv.style.border = '2px solid #a94442';
                    setTimeout(() => {
                        questionDiv.style.border = '1px solid rgba(107, 91, 58, 0.2)';
                    }, 2000);
                }
            }
        } else if (input.value.trim() === '') {
            isValid = false;
            input.style.border = '2px solid #a94442';
            setTimeout(() => {
                input.style.border = '2px solid rgba(107, 91, 58, 0.3)';
            }, 2000);
        }
    });

    if (!isValid) {
        showToast('请完成所有必填项 | Please complete all required fields', 'error');
    }

    return isValid;
}

// Form submission
async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    // Show loading
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中... | Submitting...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showToast(result.message, 'success');
            showSection(10); // Thank you page
        } else {
            throw new Error(result.error || '提交失败 | Submission failed');
        }
    } catch (error) {
        showToast('提交失败,请重试 | Submission failed, please try again', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Track start time for completion time calculation
const startTime = new Date();
