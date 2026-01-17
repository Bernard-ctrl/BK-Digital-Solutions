/* ====== Game-like Animated Intro with 3D Object (show once per session) ====== */
window.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-overlay');
    if (!intro) return;

    const INTRO_FLAG = 'bk_intro_shown';
    let shouldSkipIntro = false;
    try {
        shouldSkipIntro = sessionStorage.getItem(INTRO_FLAG) === '1';
    } catch (err) {
        shouldSkipIntro = false;
    }

    if (shouldSkipIntro) {
        intro.remove();
        return;
    }
    try {
        sessionStorage.setItem(INTRO_FLAG, '1');
    } catch (err) {
        // Ignore storage errors; intro will simply replay next session if storage unavailable
    }

    const skipBtn = document.getElementById('skipIntro');
    const progressBar = document.querySelector('.intro-progress__track .progress-bar');
    const progressValue = document.querySelector('.intro-progress .progress-value');
    const progressTarget = Math.floor(78 + Math.random() * 18); // 78% - 96%
    const progressDuration = 3200 + Math.random() * 1800; // 3.2s - 5s
    const progressStart = performance.now();
    if (progressValue) {
        progressValue.textContent = '0%';
    }
    if (progressBar) {
        const animateProgress = now => {
            const elapsed = now - progressStart;
            const progress = Math.min(elapsed / progressDuration, 1);
            const currentPercent = progressTarget * progress;
            progressBar.style.width = `${currentPercent.toFixed(1)}%`;
            if (progressValue) {
                progressValue.textContent = `${Math.round(currentPercent)}%`;
            }
            if (progress < 1 && intro && !intro.classList.contains('fade-out')) {
                requestAnimationFrame(animateProgress);
            }
        };
        requestAnimationFrame(animateProgress);
    }
    const dismissIntro = () => {
        if (!intro || intro.classList.contains('fade-out')) return;
        intro.classList.add('fade-out');
        setTimeout(() => {
            if (intro && intro.parentNode) intro.remove();
        }, 600);
    };
    if (skipBtn && intro) {
        skipBtn.addEventListener('click', dismissIntro);
    }
    if (intro && window.THREE) {
        // Setup Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        camera.position.z = 4.5;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(intro.offsetWidth > 400 ? 220 : 150, intro.offsetWidth > 400 ? 220 : 150);
        document.getElementById('intro-3d').appendChild(renderer.domElement);

        // --- PC Parts Groups ---
        const group = new THREE.Group();

        // Motherboard (base)
        const mbGeometry = new THREE.BoxGeometry(2.2, 1.5, 0.12);
        const mbMaterial = new THREE.MeshStandardMaterial({
            color: 0x222244,
            metalness: 0.6,
            roughness: 0.3,
            emissive: 0x3949ab,
            emissiveIntensity: 0.13
        });
        const motherboard = new THREE.Mesh(mbGeometry, mbMaterial);
        motherboard.position.set(0, 0, 0);
        group.add(motherboard);

        // CPU
        const cpuGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.12);
        const cpuMaterial = new THREE.MeshStandardMaterial({
            color: 0xffb300,
            metalness: 0.8,
            roughness: 0.18,
            emissive: 0xffb300,
            emissiveIntensity: 0.18
        });
        const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
        cpu.position.set(-0.6, 0.3, 0.35);
        group.add(cpu);

        // RAM
        const ramGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.32);
        const ramMaterial = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            metalness: 0.7,
            roughness: 0.18,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.18
        });
        const ram = new THREE.Mesh(ramGeometry, ramMaterial);
        ram.position.set(-1.0, -0.3, 0.7);
        group.add(ram);

        // SSD
        const ssdGeometry = new THREE.BoxGeometry(0.7, 0.25, 0.13);
        const ssdMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.6,
            roughness: 0.2,
            emissive: 0x3949ab,
            emissiveIntensity: 0.09
        });
        const ssd = new THREE.Mesh(ssdGeometry, ssdMaterial);
        ssd.position.set(0.8, -0.5, 0.7);
        group.add(ssd);

        // GPU
        const gpuGeometry = new THREE.BoxGeometry(1.1, 0.28, 0.22);
        const gpuMaterial = new THREE.MeshStandardMaterial({
            color: 0x3949ab,
            metalness: 0.7,
            roughness: 0.18,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.13
        });
        const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
        gpu.position.set(0, 0.7, 1.2);
        group.add(gpu);

        // Add all to scene, but start with parts "exploded" away
        scene.add(group);

        // Lighting
        const light1 = new THREE.PointLight(0xffffff, 1, 100);
        light1.position.set(5, 5, 5);
        scene.add(light1);
        const light2 = new THREE.PointLight(0x3949ab, 0.7, 100);
        light2.position.set(-5, -5, 5);
        scene.add(light2);

        // Animation timeline
        let t = 0;
        let phase = 0;
        function animate() {
            t += 0.009; // slower time increment
            group.rotation.x = Math.sin(t * 0.7) * 0.13 + 0.25;
            group.rotation.y += 0.006; // slower rotation

            // Animate parts assembling in sequence
            // 0-1s: RAM moves in
            if (phase === 0 && ram.position.z > 0.18) {
                ram.position.z -= 0.018; // slower movement
            } else if (phase === 0) {
                ram.position.z = 0.18;
                phase = 1;
            }
            // 1-2s: SSD moves in
            if (phase === 1 && ssd.position.z > 0.18) {
                ssd.position.z -= 0.018; // slower movement
            } else if (phase === 1) {
                ssd.position.z = 0.18;
                phase = 2;
            }
            // 2-3s: GPU moves in
            if (phase === 2 && gpu.position.z > 0.18) {
                gpu.position.z -= 0.022; // slower movement
            } else if (phase === 2) {
                gpu.position.z = 0.18;
                phase = 3;
            }
            // 3-4s: CPU moves in
            if (phase === 3 && cpu.position.z > 0.18) {
                cpu.position.z -= 0.018; // slower movement
            } else if (phase === 3) {
                cpu.position.z = 0.18;
                phase = 4;
            }
            // After all assembled, pulse the CPU
            if (phase >= 4) {
                cpu.scale.setScalar(1 + Math.sin(t * 2) * 0.07);
            }

            renderer.render(scene, camera);
            if (intro && !intro.classList.contains('fade-out')) {
                requestAnimationFrame(animate);
            }
        }
        animate();

        // Fade out after animation completes
        setTimeout(dismissIntro, progressDuration + 400);
    } else if (intro) {
        setTimeout(dismissIntro, progressDuration);
    }
});

// Contact form validation (guard for pages without the form)
(function(){
    const contactForm = document.getElementById('contactForm');
    if(!contactForm) return; // Avoid breaking other pages
    contactForm.addEventListener('submit', function(e) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const formMessage = document.getElementById('formMessage');
        if (!name || !email || !message) {
            e.preventDefault();
            formMessage.textContent = 'Please fill in all fields.';
            formMessage.style.color = '#ffb300';
            return;
        }
        formMessage.textContent = 'Sending your message...';
        formMessage.style.color = '#3949ab';
    });
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Reveal animation for feature cards on scroll
function animateOnScroll(selector) {
    const elements = document.querySelectorAll(selector);
    const observer = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-animate');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    elements.forEach(el => {
        el.classList.add('pre-animate');
        observer.observe(el);
    });
}
window.addEventListener('DOMContentLoaded', () => {
    animateOnScroll('.feature-card');
    animateOnScroll('.about-section');
    animateOnScroll('.contact-section');
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg-animated');
    if (heroBg) {
        const scrolled = window.scrollY;
        heroBg.style.transform = `translateY(${scrolled * 0.18}px) scale(1.01)`;
    }
});

// ====== Custom Quote Builder Logic ======
function initQuoteBuilder(){
    const form = document.getElementById('customQuoteForm');
    if(!form) return;
    const totalEl = document.getElementById('quoteTotal');
    const breakdownEl = document.getElementById('quoteBreakdown');
    const hiddenTotal = document.getElementById('calculated_total');
    const hiddenBreakdown = document.getElementById('quote_breakdown');
    const docPhasesInput = document.getElementById('docPhases');
    const nameInput = document.getElementById('quoteName');
    const emailInput = document.getElementById('quoteEmail');
    const resetBtn = document.getElementById('resetQuoteForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    const STORAGE_KEY = 'bk_quote_builder_v1';

    function saveState(){
        const data = {
            tier: form.querySelector('input[name="website_tier"]:checked')?.value || '',
            phases: docPhasesInput.value,
            options: Array.from(form.querySelectorAll('input[type="checkbox"][data-price]:checked')).map(cb=>cb.name),
            name: nameInput?.value || '',
            email: emailInput?.value || ''
        };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) { /* ignore quota */ }
    }

    function loadState(){
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if(!raw) return;
            const data = JSON.parse(raw);
            if(data.tier){
                const tierEl = form.querySelector(`input[name="website_tier"][value="${data.tier}"]`);
                if(tierEl) tierEl.checked = true;
            }
            if(typeof data.phases !== 'undefined') docPhasesInput.value = data.phases;
            if(Array.isArray(data.options)){
                data.options.forEach(name=>{
                    const cb = form.querySelector(`input[type="checkbox"][name="${name}"]`);
                    if(cb) cb.checked = true;
                });
            }
            if(nameInput && data.name) nameInput.value = data.name;
            if(emailInput && data.email) emailInput.value = data.email;
        } catch(e){ /* ignore parse errors */ }
    }

    function clearState(){
        try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    }

    function calculate(){
        let total = 0;
        let breakdown = [];
        // Website tier
        const tier = form.querySelector('input[name="website_tier"]:checked');
        if(tier){
            const price = parseFloat(tier.dataset.price||'0');
            total += price;
            if(tier.value === 'none') {
                breakdown.push('No Website Development Selected (RM0)');
            } else {
                const labelMap = { basic: 'Basic', standard: 'Standard', premium: 'Premium/Custom' };
                breakdown.push(`Website Tier (${labelMap[tier.value]||tier.value}) : RM${price}`);
            }
        }
        // Documentation phases
        let phases = parseInt(docPhasesInput.value,10);
        if(isNaN(phases) || phases < 0) phases = 0;
        if(phases > 5) phases = 5;
        docPhasesInput.value = phases;
        if(phases>0){
            const docCost = phases * 100;
            total += docCost;
            breakdown.push(`Documentation Phases (${phases} x RM100) : RM${docCost}`);
        }
        // Optional services
        const optionChecks = form.querySelectorAll('input[type="checkbox"][data-price]');
        optionChecks.forEach(cb=>{
            if(cb.checked){
                const p = parseFloat(cb.dataset.price||'0');
                total += p;
                breakdown.push(`${cb.value} : RM${p}`);
            }
        });
        totalEl.textContent = `RM${total}`;
        breakdownEl.textContent = breakdown.join('\n');
        hiddenTotal.value = total;
        hiddenBreakdown.value = breakdown.join('\n');
        saveState();
        // Disable submit if total is 0 (no payable selections)
        if(submitBtn){
            const disable = total === 0;
            submitBtn.disabled = disable;
            submitBtn.style.opacity = disable ? '0.55' : '1';
            submitBtn.style.cursor = disable ? 'not-allowed' : 'pointer';
            submitBtn.setAttribute('aria-disabled', disable ? 'true' : 'false');
            if(disable){
                submitBtn.title = 'Select at least one paid item to proceed';
            } else {
                submitBtn.removeAttribute('title');
            }
        }
    }
    // Use multiple event types to catch all interactions (especially on iOS)
    form.addEventListener('change', calculate);
    form.addEventListener('input', (e)=>{
        if(e.target && (e.target.matches('input[type="number"]') || e.target.matches('input[type="text"]') || e.target.matches('input[type="email"]'))) {
            calculate();
        }
    });
    form.addEventListener('click', (e)=>{
        if(e.target && (e.target.matches('input[type="radio"]') || e.target.matches('input[type="checkbox"]'))){
            calculate();
        }
    });
    docPhasesInput.addEventListener('input', calculate);
    if(nameInput) nameInput.addEventListener('input', saveState);
    if(emailInput) emailInput.addEventListener('input', saveState);
    if(resetBtn){
        resetBtn.addEventListener('click', () => {
            form.reset();
            docPhasesInput.value = 0;
            calculate();
            clearState();
            const msg = document.getElementById('quoteFormMessage');
            if(msg){ msg.textContent = 'Form reset.'; msg.style.color = '#ffe082'; }
        });
    }
    loadState();
    calculate();

    // Ensure hidden fields up to date on submit
    form.addEventListener('submit', function(e){
        calculate();
        const totalNow = parseFloat(hiddenTotal.value || '0');
        const msg = document.getElementById('quoteFormMessage');
        if(totalNow === 0){
            e.preventDefault();
            if(msg){
                msg.textContent = 'Please select at least one payable service (website tier, documentation phase, or optional service).';
                msg.style.color = '#ff6f00';
            }
            if(submitBtn){
                submitBtn.classList.remove('btn-shake');
                // Force reflow to restart animation
                void submitBtn.offsetWidth;
                submitBtn.classList.add('btn-shake');
            }
            return;
        }
        if(msg){
            msg.style.color = '#ffe082';
            msg.textContent = 'Submitting...';
            setTimeout(()=>{ msg.textContent = 'If not redirected, please check your connection.'; msg.style.color = '#ffb300';}, 4000);
        }
    });
}

window.addEventListener('DOMContentLoaded', initQuoteBuilder);
