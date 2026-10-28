document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const formCard = document.getElementById('formCard');
    const welcomeCard = document.getElementById('welcomeCard');
    const resetBtn = document.getElementById('resetBtn');
    const copyBtn = document.getElementById('copyBtn');
    const themeToggle = document.getElementById('themeToggle');
    const successSound = document.getElementById('successSound');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    
    const ageInput = document.getElementById('age');
    const ageError = document.getElementById('ageError');
    const trackInputs = document.querySelectorAll('.track-input');
    const progressBar = document.getElementById('progressBar');
    
    const resId = document.getElementById('resId');
    const resName = document.getElementById('resName');
    const resAge = document.getElementById('resAge');
    const resSpecialization = document.getElementById('resSpecialization');

    // 4. ميزة الحفظ التلقائي عبر LocalStorage (التحقق إذا كان الطالب مسجلاً مسبقاً)
    const savedData = localStorage.getItem('studentRegistration');
    if (savedData) {
        const student = JSON.parse(savedData);
        resId.textContent = student.id;
        resName.textContent = student.name;
        resAge.textContent = student.age + ' سنة';
        resSpecialization.textContent = student.specialization;

        formCard.classList.add('hidden');
        welcomeCard.classList.remove('hidden');
    }

    // تبديل المظهر الليلي
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // شريط التقدم التفاعلي
    function updateProgress() {
        let filledCount = 0;
        trackInputs.forEach(input => {
            if (input.value.trim() !== '') filledCount++;
        });
        progressBar.style.width = (filledCount / trackInputs.length) * 100 + '%';
    }

    trackInputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });

    // دالة تفعيل تأثير الاهتزاز عند الخطأ
    function triggerShake(cardElement) {
        cardElement.classList.add('shake');
        setTimeout(() => {
            cardElement.classList.remove('shake');
        }, 400);
    }

    // إرسال النموذج ومعالجة الشروط
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const age = parseInt(ageInput.value);
        const specialization = document.getElementById('specialization').value;

        // التحقق من شرط العمر (17 سنة فأكثر)
        if (age < 17) {
            ageError.textContent = 'عذراً، يجب ألا يقل عمرك عن 17 سنة لتتمكن من الانضمام.';
            ageInput.style.borderColor = '#ff4757';
            triggerShake(formCard); // اهتزاز البطاقة عند الخطأ
            return;
        } else {
            ageError.textContent = '';
            ageInput.style.borderColor = '';
        }

        if (!name || !age || !specialization) {
            alert('الرجاء تعبئة جميع الحقول المطلوبة!');
            triggerShake(formCard);
            return;
        }

        // 3. شاشة تحميل وهمية (Loading Spinner)
        submitBtn.disabled = true;
        btnText.innerHTML = 'جاري التحقق من البيانات <span class="spinner"></span>';

        setTimeout(() => {
            // توليد رقم تعريفي عشوائي
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const generatedId = `ID-2026-${randomNum}`;

            const studentData = {
                id: generatedId,
                name: name,
                age: age,
                specialization: specialization
            };

            // حفظ البيانات في المتصفح
            localStorage.setItem('studentRegistration', JSON.stringify(studentData));

            // عرض البيانات في صفحة الترحيب
            resId.textContent = generatedId;
            resName.textContent = name;
            resAge.textContent = age + ' سنة';
            resSpecialization.textContent = specialization;

            // تشغيل الصوت
            successSound.play().catch(err => console.log(err));

            // الانتقال لصفحة الترحيب
            formCard.classList.add('hidden');
            welcomeCard.classList.remove('hidden');

            // إرجاع الزر لحالته الطبيعية
            submitBtn.disabled = false;
            btnText.textContent = 'ابدأ الرحلة الآن ✨';

            // 5. تأثير قصاصات الورق الملونة (Confetti Effect)
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });

        }, 1000); // تأخير لمدة ثانية واحدة ليعطي إيحاء المعالجة
    });

    // وظيفة نسخ التفاصيل
    copyBtn.addEventListener('click', () => {
        const textToCopy = `تفاصيل تسجيل الطالب:\nالرقم التعريفي: ${resId.textContent}\nالاسم: ${resName.textContent}\nالعمر: ${resAge.textContent}\nالتخصص: ${resSpecialization.textContent}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.textContent = '✅ تم النسخ بنجاح!';
            setTimeout(() => { copyBtn.textContent = '📋 نسخ تفاصيل التسجيل'; }, 2000);
        });
    });

    // زر مسح التسجيل والعودة (حذف البيانات من التخزين المحلي)
    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('studentRegistration');
        registrationForm.reset();
        progressBar.style.width = '0%';
        ageError.textContent = '';
        welcomeCard.classList.add('hidden');
        formCard.classList.remove('hidden');
    });
});