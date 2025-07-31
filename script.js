/* ====== Game-like Animated Intro with 3D Object (show once per session) ====== */
window.addEventListener('DOMContentLoaded', () => {
    // Only show intro if not already shown in this session
    // TEMP: Always show intro for testing (remove or revert this for production)
    // if (sessionStorage.getItem('introShown')) {
    //     const intro = document.getElementById('intro-overlay');
    //     if (intro) intro.remove();
    //     return;
    // }
    // sessionStorage.setItem('introShown', '1');
    const intro = document.getElementById('intro-overlay');
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

        // Fade out after 5.5s
        setTimeout(() => {
            intro.classList.add('fade-out');
            setTimeout(() => {
                intro.remove();
            }, 1100);
        }, 5500);
    }
});

// Contact form validation
document.getElementById('contactForm').addEventListener('submit', function(e) {
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
// Add CSS classes for animation (injected for demo, should be in CSS)
const style = document.createElement('style');
style.innerHTML = `
.pre-animate { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(.23,1.02,.32,1); }
.visible-animate { opacity: 1 !important; transform: none !important; }
`;
document.head.appendChild(style);

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
