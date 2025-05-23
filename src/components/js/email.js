// email.js - EmailJS Handler untuk Astro
// Letakkan file ini di: /src/components/js/email.js

// Import EmailJS dinamis
import('https://cdn.emailjs.com/dist/email.min.js').then((emailjs) => {
    // Initialize EmailJS - Ganti dengan Public Key Anda
    emailjs.default.init('4-iOyCns2viav_IW_');

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const status = document.getElementById('status');

    // Pastikan semua element ada
    if (!form || !submitBtn || !status) {
        console.error('Form elements tidak ditemukan');
        return;
    }

    // Function untuk menampilkan status
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        
        // Sembunyikan status setelah 5 detik
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }

    // Function untuk mengatur loading state
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span>Sending...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }
    }

    // Event listener untuk form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Validasi form
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Cek field required
        if (!name || !email || !message) {
            showStatus('Please fill in all required fields (Name, Email, Message).', 'error');
            return;
        }

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }

        setLoading(true);

        // Kirim email menggunakan EmailJS
        // Ganti 'service_ffsqvoa' dan 'template_vms7qa9' dengan ID Anda
        emailjs.default.sendForm('service_ffsqvoa', 'template_vms7qa9', form)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                showStatus('Failed to send message. Please try again later.', 'error');
            })
            .finally(function() {
                setLoading(false);
            });
    });

    // Tambahkan interaktivitas pada input
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    inputs.forEach(input => {
        // Efek focus
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        // Efek blur
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Real-time validation feedback
        input.addEventListener('input', function() {
            if (this.hasAttribute('required') && this.value.trim() === '') {
                this.style.borderColor = '#f56565';
            } else if (this.type === 'email' && this.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                this.style.borderColor = emailRegex.test(this.value) ? '#48bb78' : '#f56565';
            } else if (this.value.trim() !== '') {
                this.style.borderColor = '#48bb78';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });

    console.log('EmailJS handler loaded successfully');

}).catch((error) => {
    console.error('Failed to load EmailJS:', error);
    
    // Tampilkan error message jika EmailJS gagal load
    const status = document.getElementById('status');
    if (status) {
        status.textContent = 'Failed to load email service. Please refresh the page.';
        status.className = 'status error';
        status.style.display = 'block';
    }
});