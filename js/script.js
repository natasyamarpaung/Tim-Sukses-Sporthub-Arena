/* ========================================
   script.js - SportHub Arena
   ======================================== */
   /*TAMBAHAN SOUND EFFECT*/

const clickSound = new Audio("sound/click.wav");
const successSound = new Audio("sound/success.wav");
const errorSound = new Audio("sound/error.wav");
const deleteSound = new Audio("sound/delete.wav");

clickSound.volume = 0.5;
successSound.volume = 0.6;
errorSound.volume = 0.6;
deleteSound.volume = 0.6;

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}

function playSuccessSound() {
    successSound.currentTime = 0;
    successSound.play().catch(() => {});
}

function playErrorSound() {
    errorSound.currentTime = 0;
    errorSound.play().catch(() => {});
}

function playDeleteSound() {
    deleteSound.currentTime = 0;
    deleteSound.play().catch(() => {});
}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("button, .btn, a").forEach(el => {

        el.addEventListener("click", () => {
            playClickSound();
        });

    });

});

//Dark Mode
function toggleDark() {
    document.body.classList.toggle('dark');

    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('sporthub_dark', isDark ? '1' : '0');

    // Ganti ikon bulan/matahari
    const icon = document.getElementById('dark-icon');
    if (icon) {
        if (isDark) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }
}

//mobile menu
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');

    if (menu) {
        menu.classList.toggle('open');
    }
}

// tutup mobile menu saat berada diluar
document.addEventListener('click', function(e) {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');

    if (menu && hamburger) {
        if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
            menu.classList.remove('open');
        }
    }
});

// dark mode localstorage
document.addEventListener('DOMContentLoaded', function() {
    const isDark = localStorage.getItem('sporthub_dark') === '1';

    if (isDark) {
        document.body.classList.add('dark');
        const icon = document.getElementById('dark-icon');
        if (icon) {
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    // Cek apakah user sudah login
    // Halaman yang butuh login
    const protectedPages = ['home.html', 'fields.html', 'reservasi.html', 'riwayat.html'];
    const currentPage = window.location.pathname.split('/').pop();

    const user = JSON.parse(localStorage.getItem('sporthub_login') || 'null');

    if (protectedPages.includes(currentPage) && !user) {
        // Redirect ke login kalau belum login
        window.location.href = 'login.html';
    }
});

//scroll efek
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 20) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
        }
    }
});

//Reservasi
function formatReservationDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getReservations() {
    return JSON.parse(localStorage.getItem('sporthub_reservations') || '[]');
}

function saveReservations(reservations) {
    localStorage.setItem('sporthub_reservations', JSON.stringify(reservations));
}

function renderReservationTable() {
    const tbody = document.getElementById('reservation-table-body');
    const empty = document.getElementById('reservation-empty');
    if (!tbody) return;

    const searchInput = document.getElementById('reservation-search');
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const reservations = getReservations();
    const filtered = reservations.filter(function (item) {
        const combined = [item.id, item.user, item.sport, item.fieldName, item.date, item.timeSlot, item.paymentMethod].join(' ').toLowerCase();
        return combined.includes(keyword);
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');

    filtered.forEach(function (item) {
        const tr = document.createElement('tr');
        const sport = item.sport ? item.sport.charAt(0).toUpperCase() + item.sport.slice(1) : '-';
        const total = Number(item.totalPrice || 0).toLocaleString('id-ID');
        tr.innerHTML = `
            <td><strong>${item.id || '-'}</strong></td>
            <td>${item.user || 'Guest'}</td>
            <td>${sport}</td>
            <td>${item.fieldName || '-'}</td>
            <td>${formatReservationDate(item.date)}</td>
            <td>${item.timeSlot || '-'}</td>
            <td>Rp ${total}</td>
            <td><button class="btn-danger-small" onclick="deleteReservation('${item.id}')"><i class="fas fa-trash"></i> Hapus</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteReservation(id) {
    if (!confirm('Hapus data reservasi ini?')) return;
    const reservations = getReservations().filter(function (item) { return item.id !== id; });
    saveReservations(reservations);
    playDeleteSound();
    renderReservationTable();
}

function clearAllReservations() {
    if (!confirm('Hapus semua data reservasi?')) return;
    saveReservations([]);
    playDeleteSound();
    renderReservationTable();
}
//helpers untuk login
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

function logout() {
    localStorage.removeItem('sporthub_login');
    window.location.href = 'index.html';
}

function loadNavUserName() {
    const user = JSON.parse(localStorage.getItem('sporthub_login') || 'null');
    if (user) {
        const el = document.getElementById('nav-username');
        if (el) el.textContent = user.name;
    }
}

// Background Slideshow
(function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (page !== 'index.html' && page !== 'welcome.html') return;

    let currentSlide = 0;
    const slides = document.querySelectorAll('.bg-slide');
    if (!slides.length) return;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, 5000);
})();

//homepage
(function () {
    if ((window.location.pathname.split('/').pop() || 'index.html') !== 'home.html') return;

//data lapanan
        const popularFields = [
            {
                id: 1,
                name: "Glow Arena Medan",
                sport: "Futsal",
                location: "Kec. Medan Baru, Medan",
                price: "120.000",
                rating: 4.9,
                status: "available",
                badge: "Popular",
                img: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80"
            },
            {
                id: 2,
                name: "Hoops Central Pro",
                sport: "Basket",
                location: "Kec. Medan Kota, Medan",
                price: "85.000",
                rating: 4.8,
                status: "available",
                badge: "Best Choice",
                img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80"
            },
            {
                id: 3,
                name: "Smash Arena Elite",
                sport: "Badminton",
                location: "Kec. Medan Selayang, Medan",
                price: "50.000",
                rating: 5.0,
                status: "booked",
                badge: "Popular",
                img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80"
            }
        ];

        function renderPopularFields() {
            const container = document.getElementById('popular-fields');
            container.innerHTML = '';

            popularFields.forEach(function (field) {
                const statusClass = field.status === 'available' ? 'status-available' :
                    field.status === 'booked' ? 'status-booked' : 'status-maintenance';
                const statusText = field.status === 'available' ? 'Tersedia' :
                    field.status === 'booked' ? 'Dipesan' : 'Maintenance';

                const card = document.createElement('div');
                card.className = 'field-card';
                card.innerHTML = `
                    <div class="field-card-img">
                        <img src="${field.img}" alt="${field.name}">
                        <span class="field-badge">${field.badge}</span>
                        <span class="field-rating"><i class="fas fa-star"></i> ${field.rating}</span>
                        <span class="field-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="field-card-body">
                        <h4>${field.name}</h4>
                        <p class="field-sport"><i class="fas fa-running"></i> ${field.sport}</p>
                        <p class="field-location"><i class="fas fa-map-marker-alt"></i> ${field.location}</p>
                        <div class="field-card-footer">
                            <div class="field-price">
                                <strong>Rp ${field.price}</strong>
                                <span>/jam</span>
                            </div>
                            ${field.status === 'available'
                        ? `<a href="reservasi.html?field=${field.id}" class="btn-book">Book</a>`
                        : `<button class="btn-book btn-book-disabled" disabled>Tidak Tersedia</button>`
                    }
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        //MENGKOPI KODE PROMO
        function copyCode(code) {
            navigator.clipboard.writeText(code).then(function () {
                alert('Kode "' + code + '" berhasil disalin!');
            });
        }

        //pencarian lapangan
        function searchField(query) {
            if (query.length > 0) {
                window.location.href = 'fields.html?search=' + encodeURIComponent(query);
            }
        }

        // user menu
        function toggleUserMenu() {
            const dropdown = document.getElementById('userDropdown');
            dropdown.classList.toggle('show');
        }

        // Tutup dropdown kalau klik di luar
        document.addEventListener('click', function (e) {
            const userMenu = document.querySelector('.user-menu');
            if (userMenu && !userMenu.contains(e.target)) {
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) dropdown.classList.remove('show');
            }
        });

        // logout
        function logout() {
            localStorage.removeItem('sporthub_login');
            window.location.href = 'index.html';
        }

        //tampilkan user di navbar
        function loadUserInfo() {
            const user = JSON.parse(localStorage.getItem('sporthub_login') || 'null');
            if (user) {
                const el = document.getElementById('nav-username');
                if (el) el.textContent = user.name;
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            renderPopularFields();
            loadUserInfo();
        });

window.copyCode = copyCode;
window.searchField = searchField;
window.toggleUserMenu = toggleUserMenu;
window.logout = logout;
})();

//field page
(function () {
    if ((window.location.pathname.split('/').pop() || 'index.html') !== 'fields.html') return;

//Data lapangan
        const allFields = [
            // FUTSAL
            { id:1, name:"Glow Arena Medan - A", sport:"futsal", location:"Kec. Medan Baru", price:"120.000", rating:4.9, status:"available", badge:"Popular", img:"https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80" },
            { id:2, name:"Glow Arena Medan - B", sport:"futsal", location:"Kec. Medan Baru", price:"120.000", rating:4.7, status:"booked", badge:"", img:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80" },
            { id:3, name:"Futsal Pro Center - A", sport:"futsal", location:"Kec. Medan Timur", price:"100.000", rating:4.5, status:"available", badge:"Best Choice", img:"https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80" },
            { id:4, name:"Futsal Pro Center - B", sport:"futsal", location:"Kec. Medan Timur", price:"100.000", rating:4.6, status:"available", badge:"", img:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80" },
            { id:5, name:"Futsal Pro Center - C", sport:"futsal", location:"Kec. Medan Timur", price:"100.000", rating:4.4, status:"maintenance", badge:"", img:"https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80" },
            { id:6, name:"Arena Futsal Setiabudi", sport:"futsal", location:"Jl. Setiabudi, Medan", price:"90.000", rating:4.3, status:"available", badge:"", img:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80" },
            { id:7, name:"Kinetic Futsal Arena", sport:"futsal", location:"Kec. Medan Petisah", price:"110.000", rating:4.8, status:"booked", badge:"Popular", img:"https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80" },
            // BASKET
            { id:8, name:"Hoops Central Pro - A", sport:"basket", location:"Kec. Medan Kota", price:"85.000", rating:4.8, status:"available", badge:"Best Choice", img:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80" },
            { id:9, name:"Hoops Central Pro - B", sport:"basket", location:"Kec. Medan Kota", price:"85.000", rating:4.6, status:"available", badge:"", img:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80" },
            { id:10, name:"Slam Dunk Arena", sport:"basket", location:"Kec. Medan Baru", price:"75.000", rating:4.5, status:"booked", badge:"", img:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80" },
            { id:11, name:"ProBasket Medan", sport:"basket", location:"Kec. Medan Polonia", price:"90.000", rating:4.7, status:"available", badge:"Popular", img:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80" },
            // BADMINTON
            { id:12, name:"Smash Arena Elite - 1", sport:"badminton", location:"Kec. Medan Selayang", price:"50.000", rating:5.0, status:"available", badge:"Popular", img:"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80" },
            { id:13, name:"Smash Arena Elite - 2", sport:"badminton", location:"Kec. Medan Selayang", price:"50.000", rating:4.9, status:"booked", badge:"", img:"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80" },
            { id:14, name:"Bulu Tangkis Pusat Medan", sport:"badminton", location:"Kec. Medan Sunggal", price:"45.000", rating:4.6, status:"available", badge:"Best Choice", img:"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80" },
            { id:15, name:"Shuttle Court Pro", sport:"badminton", location:"Kec. Medan Johor", price:"40.000", rating:4.4, status:"available", badge:"", img:"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80" },
            // VOLI
            { id:16, name:"Spike Arena Medan - A", sport:"voli", location:"Kec. Medan Helvetia", price:"60.000", rating:4.7, status:"available", badge:"Popular", img:"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80" },
            { id:17, name:"Spike Arena Medan - B", sport:"voli", location:"Kec. Medan Helvetia", price:"60.000", rating:4.5, status:"maintenance", badge:"", img:"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80" },
        ];

        let currentFilter = 'semua';

        //filter kategori
        function setFilter(filter, btn) {
            currentFilter = filter;

            // Update tombol aktif
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            filterFields();
        }

        //Filter lapangan
        function filterFields() {
            const searchQuery = document.getElementById('search-field').value.toLowerCase();
            const statusFilter = document.getElementById('status-filter').value;

            let filtered = allFields.filter(function(field) {
                const matchSport = currentFilter === 'semua' || field.sport === currentFilter;
                const matchSearch = field.name.toLowerCase().includes(searchQuery) ||
                                    field.location.toLowerCase().includes(searchQuery);
                const matchStatus = statusFilter === 'semua' || field.status === statusFilter;

                return matchSport && matchSearch && matchStatus;
            });

            renderFields(filtered);

            // Update jumlah hasil
            const countEl = document.getElementById('result-count');
            countEl.textContent = 'Menampilkan ' + filtered.length + ' lapangan';
        }

        //render lapangan ke DOm
        function renderFields(fields) {
            const container = document.getElementById('fields-container');
            const emptyState = document.getElementById('empty-state');

            container.innerHTML = '';

            if (fields.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');

            fields.forEach(function(field) {
                const statusClass = field.status === 'available' ? 'status-available' :
                                    field.status === 'booked' ? 'status-booked' : 'status-maintenance';
                const statusText = field.status === 'available' ? 'Tersedia' :
                                   field.status === 'booked' ? 'Dipesan' : 'Maintenance';

                const card = document.createElement('div');
                card.className = 'field-card';
                if (field.status === 'booked') card.classList.add('field-card-booked');

                card.innerHTML = `
                    <div class="field-card-img">
                        <img src="${field.img}" alt="${field.name}">
                        ${field.badge ? `<span class="field-badge">${field.badge}</span>` : ''}
                        <span class="field-rating"><i class="fas fa-star"></i> ${field.rating}</span>
                        <span class="field-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="field-card-body">
                        <h4>${field.name}</h4>
                        <p class="field-sport"><i class="fas fa-running"></i> ${field.sport.charAt(0).toUpperCase() + field.sport.slice(1)}</p>
                        <p class="field-location"><i class="fas fa-map-marker-alt"></i> ${field.location}</p>
                        <div class="field-card-footer">
                            <div class="field-price">
                                <strong>Rp ${field.price}</strong>
                                <span>/jam</span>
                            </div>
                            ${field.status === 'available' 
                                ? `<a href="reservasi.html?field=${field.id}" class="btn-book">Book</a>`
                                : `<button class="btn-book btn-book-disabled" disabled>Tidak Tersedia</button>`
                            }
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        //reset filter
        function resetFilter() {
            document.getElementById('search-field').value = '';
            document.getElementById('status-filter').value = 'semua';
            currentFilter = 'semua';

            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            document.querySelector('[data-filter="semua"]').classList.add('active');

            filterFields();
        }

        function toggleUserMenu() {
            document.getElementById('userDropdown').classList.toggle('show');
        }

        function logout() {
            localStorage.removeItem('sporthub_login');
            window.location.href = 'index.html';
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Cek URL parameter
            const params = new URLSearchParams(window.location.search);
            const sport = params.get('sport');
            const search = params.get('search');

            if (sport) {
                const btn = document.querySelector('[data-filter="' + sport + '"]');
                if (btn) setFilter(sport, btn);
            }

            if (search) {
                document.getElementById('search-field').value = search;
            }

            // Load user
            const user = JSON.parse(localStorage.getItem('sporthub_login') || 'null');
            if (user) {
                const el = document.getElementById('nav-username');
                if (el) el.textContent = user.name;
            }

            filterFields();
        });

window.setFilter = setFilter;
window.filterFields = filterFields;
window.resetFilter = resetFilter;
window.toggleUserMenu = toggleUserMenu;
window.logout = logout;
})();

//reservasi page
(function () {
    if ((window.location.pathname.split('/').pop() || 'index.html') !== 'reservasi.html') return;

//promo reservasi
        let promoCode = '';
        let discountRate = 0;

        const promoList = {
            STUDENT30: 0.30,
            HEMAT10: 0.10,
            ARENA50: 0.50
        };

        function getPromoLabel(rate) {
            return Math.round(rate * 100) + '%';
        }

        function setPromoMessage(message, type = '') {
            const info = document.getElementById('promo-info');
            if (!info) return;
            info.textContent = message;
            info.className = type ? 'promo-info ' + type : 'promo-info';
        }

        function updateBookingTotal() {
            const subtotal = Number(booking.fieldPrice || 0) + Number(booking.nightSurcharge || 0);
            const discountAmount = Math.round(subtotal * discountRate);

            booking.originalPrice = subtotal;
            booking.discountRate = discountRate;
            booking.discountAmount = discountAmount;
            booking.promoCode = promoCode;
            booking.totalPrice = Math.max(subtotal - discountAmount, 0);

            const totalEl = document.getElementById('total-price');
            if (totalEl) totalEl.textContent = 'Rp ' + booking.totalPrice.toLocaleString('id-ID');

            const paymentTotal = document.getElementById('payment-total');
            if (paymentTotal) paymentTotal.textContent = 'Rp ' + booking.totalPrice.toLocaleString('id-ID');

            const hiddenBase = document.getElementById('harga-dasar');
            if (hiddenBase) hiddenBase.textContent = 'Rp ' + Number(booking.fieldPrice || 0).toLocaleString('id-ID');

            const hiddenNight = document.getElementById('tarif-malam');
            if (hiddenNight) hiddenNight.textContent = 'Rp ' + Number(booking.nightSurcharge || 0).toLocaleString('id-ID');
        }

        function setHarga(harga, malam = 0) {
            booking.fieldPrice = Number(harga) || 0;
            booking.nightSurcharge = Number(malam) || 0;
            updateBookingTotal();
        }

        function hitungTotal() {
            updateBookingTotal();
            return booking.totalPrice;
        }

        function applyPromo() {
            const input = document.getElementById('kodePromo');
            const code = input ? input.value.trim().toUpperCase() : '';

            if (!booking.fieldPrice || !booking.timeSlot) {
                playErrorSound();
                promoCode = '';
                discountRate = 0;
                updateBookingTotal();
                setPromoMessage('Pilih lapangan dan slot waktu terlebih dahulu.', 'error');
                return;
            }

            if (!code) {
                playErrorSound();
                promoCode = '';
                discountRate = 0;
                updateBookingTotal();
                setPromoMessage('Kode promo dikosongkan. Diskon dihapus.', 'muted');
                return;
            }

            if (!promoList[code]) {
                playErrorSound();
                promoCode = '';
                discountRate = 0;
                updateBookingTotal();
                setPromoMessage('Kode promo tidak valid.', 'error');
                return;
            }

            playSuccessSound();
            promoCode = code;
            discountRate = promoList[code];
            updateBookingTotal();
            setPromoMessage('Promo berhasil digunakan. Diskon ' + getPromoLabel(discountRate) + '.', 'success');
        }
//data lapangan
        const fieldsData = {
            futsal: [
                { id: 1, name: "Glow Arena Medan - A", price: 120000 },
                { id: 2, name: "Glow Arena Medan - B", price: 120000 },
                { id: 3, name: "Futsal Pro Center - A", price: 100000 },
                { id: 4, name: "Futsal Pro Center - B", price: 100000 },
                { id: 6, name: "Arena Futsal Setiabudi", price: 90000 },
            ],
            basket: [
                { id: 8, name: "Hoops Central Pro - A", price: 85000 },
                { id: 9, name: "Hoops Central Pro - B", price: 85000 },
                { id: 11, name: "ProBasket Medan", price: 90000 },
            ],
            badminton: [
                { id: 12, name: "Smash Arena Elite - 1", price: 50000 },
                { id: 14, name: "Bulu Tangkis Pusat Medan", price: 45000 },
                { id: 15, name: "Shuttle Court Pro", price: 40000 },
            ],
            voli: [
                { id: 16, name: "Spike Arena Medan - A", price: 60000 },
            ],
        };

        const timeSlotList = [
            "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00",
            "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
            "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
            "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00",
            "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00"
        ];

        //booking
        let booking = {
            sport: '',
            fieldId: null,
            fieldName: '',
            fieldPrice: 0,
            date: '',
            timeSlot: '',
            description: '',
            paymentMethod: '',
            originalPrice: 0,
            nightSurcharge: 0,
            promoCode: '',
            discountRate: 0,
            discountAmount: 0,
            totalPrice: 0
        };

        let currentStep = 1;

        //navigasi
        function markStepDone(step) {
            const indicator = document.getElementById('step-indicator-' + step);
            indicator.classList.add('done');
            const circle = indicator.querySelector('.step-circle');
            if (circle) circle.innerHTML = '';
        }

        function goToStep(step) {
            // Validasi sebelum lanjut
            if (step > currentStep) {
                if (currentStep === 1 && !booking.sport) { alert('Pilih olahraga terlebih dahulu!'); return; }
                if (currentStep === 2 && !booking.fieldId) { alert('Pilih lapangan terlebih dahulu!'); return; }
                if (currentStep === 3) {
                    if (!booking.date) { alert('Pilih tanggal terlebih dahulu!'); return; }
                    if (!booking.timeSlot) { alert('Pilih slot waktu terlebih dahulu!'); return; }
                }
            }

            // Sembunyikan step aktif
            document.getElementById('booking-step-' + currentStep).classList.remove('active');
            document.getElementById('step-indicator-' + currentStep).classList.remove('active');

            // Tandai step selesai
            if (step > currentStep) {
                markStepDone(currentStep);
            }

            currentStep = step;

            // Tampilkan step baru
            document.getElementById('booking-step-' + currentStep).classList.add('active');
            document.getElementById('step-indicator-' + currentStep).classList.add('active');

            // Render konten step khusus
            if (step === 2) renderFieldOptions();
            if (step === 4) renderReview();
            if (step === 5) renderPaymentTotal();

            // Scroll ke atas
            window.scrollTo({ top: 200, behavior: 'smooth' });
        }

        // ======== Step 1: Pilih Olahraga ========
        function selectSport(sport, el) {
            booking.sport = sport;
            booking.fieldId = null;
            booking.fieldName = '';
            booking.fieldPrice = 0;

            document.querySelectorAll('.sport-select-card').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');

            document.getElementById('btn-next-1').removeAttribute('disabled');
        }

        // ======== Step 2: Pilih Lapangan ========
        function renderFieldOptions() {
            const list = document.getElementById('field-select-list');
            const sportLabel = document.getElementById('selected-sport-label');

            list.innerHTML = '';
            sportLabel.textContent = booking.sport.charAt(0).toUpperCase() + booking.sport.slice(1);

            const fields = fieldsData[booking.sport] || [];

            fields.forEach(function (field) {
                const div = document.createElement('div');
                div.className = 'field-select-item';
                div.innerHTML = `
                    <div class="field-select-info">
                        <strong>${field.name}</strong>
                        <span>Rp ${field.price.toLocaleString('id-ID')}/jam</span>
                    </div>
                    <button class="btn-select-field" onclick="selectField(${field.id}, '${field.name}', ${field.price}, this)">
                        Pilih
                    </button>
                `;
                list.appendChild(div);
            });
        }

        function selectField(id, name, price, btn) {
            booking.fieldId = id;
            booking.fieldName = name;
            booking.fieldPrice = price;

            document.querySelectorAll('.btn-select-field').forEach(b => {
                b.textContent = 'Pilih';
                b.classList.remove('selected');
                b.closest('.field-select-item').classList.remove('selected');
            });

            btn.textContent = 'Dipilih';
            btn.classList.add('selected');
            btn.closest('.field-select-item').classList.add('selected');

            document.getElementById('btn-next-2').removeAttribute('disabled');
        }

        // ======== Step 3: Tanggal & Waktu ========
        function updateTimeSlots() {
            const dateInput = document.getElementById('booking-date');
            booking.date = dateInput.value;
            booking.timeSlot = '';

            document.getElementById('btn-next-3').setAttribute('disabled', 'true');

            const container = document.getElementById('time-slots');
            container.innerHTML = '';

            if (!booking.date) return;

            // Simulasi yang sudah dipesan (random)
            const bookedSlots = ["10:00 - 11:00", "15:00 - 16:00", "20:00 - 21:00"];

            timeSlotList.forEach(function (slot) {
                const isBooked = bookedSlots.includes(slot);
                const isNight = parseInt(slot.split(':')[0]) >= 20;

                const btn = document.createElement('button');
                btn.className = 'time-slot' + (isBooked ? ' slot-booked' : '') + (isNight ? ' slot-night' : '');
                btn.disabled = isBooked;
                btn.innerHTML = slot + (isNight ? ' (Malam)' : '') + (isBooked ? '<br><small>Penuh</small>' : '');

                if (!isBooked) {
                    btn.onclick = function () {
                        document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('slot-selected'));
                        this.classList.add('slot-selected');
                        booking.timeSlot = slot;
                        calculatePrice(slot, isNight);
                        document.getElementById('btn-next-3').removeAttribute('disabled');
                    };
                }

                container.appendChild(btn);
            });
        }

        function calculatePrice(slot, isNight) {
            const hourStart = parseInt(slot.split(':')[0]);
            const isNightTime = hourStart >= 20;

            const base = Number(booking.fieldPrice || 0);
            const nightSurcharge = isNightTime ? Math.round(base * 0.25) : 0;

            booking.nightSurcharge = nightSurcharge;
            updateBookingTotal();

            document.getElementById('base-price').textContent = 'Rp ' + base.toLocaleString('id-ID');
            document.getElementById('night-surcharge').textContent = '+Rp ' + nightSurcharge.toLocaleString('id-ID');
            document.getElementById('dynamic-pricing-row').style.display = isNightTime ? 'flex' : 'none';
        }
        // ======== Step 4: Review ========
        function renderReview() {
            booking.description = document.getElementById('booking-desc').value;

            const container = document.getElementById('review-summary');
            container.innerHTML = `
                <div class="review-item">
                    <span><i class="fas fa-running"></i> Olahraga</span>
                    <strong>${booking.sport.charAt(0).toUpperCase() + booking.sport.slice(1)}</strong>
                </div>
                <div class="review-item">
                    <span><i class="fas fa-map-marker-alt"></i> Lapangan</span>
                    <strong>${booking.fieldName}</strong>
                </div>
                <div class="review-item">
                    <span><i class="fas fa-calendar"></i> Tanggal</span>
                    <strong>${formatDate(booking.date)}</strong>
                </div>
                <div class="review-item">
                    <span><i class="fas fa-clock"></i> Waktu</span>
                    <strong>${booking.timeSlot}</strong>
                </div>
                ${booking.description ? `
                <div class="review-item">
                    <span><i class="fas fa-pencil-alt"></i> Deskripsi</span>
                    <strong>${booking.description}</strong>
                </div>` : ''}
                ${booking.discountAmount ? `
                <div class="review-item">
                    <span><i class="fas fa-tags"></i> Promo</span>
                    <strong>${booking.promoCode} (-Rp ${booking.discountAmount.toLocaleString('id-ID')})</strong>
                </div>` : ''}
                <div class="review-item total">
                    <span><i class="fas fa-money-bill"></i> Total Harga</span>
                    <strong class="text-green">Rp ${booking.totalPrice.toLocaleString('id-ID')}</strong>
                </div>
            `;
        }

        // ======== Step 5: Pembayaran ========
        function renderPaymentTotal() {
            document.getElementById('payment-total').textContent = 'Rp ' + booking.totalPrice.toLocaleString('id-ID');
        }

        function selectPayment(method, el) {
            booking.paymentMethod = method;

            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            el.classList.add('selected');

            document.getElementById('btn-confirm').removeAttribute('disabled');
        }

        //konfrim booking
        function confirmBooking() {
            // Jika metode pembayaran QRIS, tampilkan QR code dulu untuk dipindai user
            if (booking.paymentMethod === 'qris') {
                showQrisModal();
                return;
            }

            processBooking();
        }

        // ======== QRIS: Tampilkan QR Code untuk pembayaran ========
        function showQrisModal() {
            const amount = booking.totalPrice || 0;
            const qrisId = 'SH' + Date.now();
            booking._qrisPendingId = qrisId;

            // Data yang di-encode ke dalam QR (simulasi payload QRIS)
            const qrData = `SPORTHUB-QRIS|ID:${qrisId}|AMOUNT:${amount}|SPORT:${booking.sport || '-'}|FIELD:${booking.fieldName || '-'}`;

            // Generate gambar QR via API publik (tanpa perlu library tambahan)
            const qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(qrData);

            document.getElementById('qrisImage').src = qrImageUrl;
            document.getElementById('qrisAmount').textContent = 'Rp ' + amount.toLocaleString('id-ID');
            document.getElementById('qrisBookingId').textContent = 'Ref: ' + qrisId;

            const overlay = document.getElementById('qrisModalOverlay');
            overlay.style.display = 'flex';
        }

        function closeQrisModal() {
            document.getElementById('qrisModalOverlay').style.display = 'none';
        }

        function confirmQrisPayment() {
            closeQrisModal();
            processBooking();
        }

        // Proses booking asli (dipisah agar bisa dipanggil setelah scan QRIS ataupun metode lain)
        function processBooking() {
            // Simpan ke localStorage
            const reservations = JSON.parse(localStorage.getItem('sporthub_reservations') || '[]');
            const user = JSON.parse(localStorage.getItem('sporthub_login') || '{}');

            const newBooking = {
                id: 'SH' + Date.now(),
                user: user.name || 'Guest',
                ...booking,
                createdAt: new Date().toISOString()
            };

            reservations.push(newBooking);
            localStorage.setItem('sporthub_reservations', JSON.stringify(reservations));
            playSuccessSound();

            // Tampilkan success
            document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
            document.getElementById('booking-success').classList.add('active');

            // Update progress semua step done
            for (let i = 1; i <= 5; i++) {
                document.getElementById('step-indicator-' + i).classList.remove('active');
                markStepDone(i);
            }

            // Render detail sukses
            const detail = document.getElementById('success-detail');
            detail.innerHTML = `
                <div class="review-item"><span>ID Booking</span><strong>${newBooking.id}</strong></div>
                <div class="review-item"><span>Lapangan</span><strong>${booking.fieldName}</strong></div>
                <div class="review-item"><span>Tanggal</span><strong>${formatDate(booking.date)}</strong></div>
                <div class="review-item"><span>Waktu</span><strong>${booking.timeSlot}</strong></div>
                <div class="review-item"><span>Pembayaran</span><strong>${getPaymentLabel(booking.paymentMethod)}</strong></div>
                <div class="review-item"><span>Total</span><strong class="text-green">Rp ${booking.totalPrice.toLocaleString('id-ID')}</strong></div>
            `;

            renderReservationTable();
            window.scrollTo({ top: 200, behavior: 'smooth' });
        }

        //helpers
        function formatDate(dateStr) {
            if (!dateStr) return '-';
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }

        function getPaymentLabel(method) {
            const labels = { transfer: 'Transfer Bank', ewallet: 'E-Wallet', cash: 'Bayar di Tempat', qris: 'QRIS' };
            return labels[method] || method;
        }

        function toggleUserMenu() {
            document.getElementById('userDropdown').classList.toggle('show');
        }

        function logout() {
            localStorage.removeItem('sporthub_login');
            window.location.href = 'index.html';
        }

        document.addEventListener('DOMContentLoaded', function () {
            // Set minimum date = hari ini
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('booking-date').min = today;

            // Cek URL param field
            const params = new URLSearchParams(window.location.search);
            const fieldId = parseInt(params.get('field'));
            if (fieldId) {
                // Cari lapangan
                for (const sport in fieldsData) {
                    const f = fieldsData[sport].find(x => x.id === fieldId);
                    if (f) {
                        booking.sport = sport;
                        // Auto ke step 2
                        break;
                    }
                }
            }

            const user = JSON.parse(localStorage.getItem('sporthub_login') || 'null');
            if (user) {
                const el = document.getElementById('nav-username');
                if (el) el.textContent = user.name;
            }

            renderReservationTable();
        });

window.setHarga = setHarga;
window.applyPromo = applyPromo;
window.applypromo = applyPromo;
window.hitungTotal = hitungTotal;
window.goToStep = goToStep;
window.markStepDone = markStepDone;
window.selectSport = selectSport;
window.selectField = selectField;
window.updateTimeSlots = updateTimeSlots;
window.selectPayment = selectPayment;
window.confirmBooking = confirmBooking;
window.showQrisModal = showQrisModal;
window.closeQrisModal = closeQrisModal;
window.confirmQrisPayment = confirmQrisPayment;
window.processBooking = processBooking;
window.toggleUserMenu = toggleUserMenu;
window.logout = logout;
})();

//loginpage
(function () {
    if ((window.location.pathname.split('/').pop() || 'index.html') !== 'login.html') return;

//data user
        let users = [
            { name: "Admin", email: "admin@sporthub.com", phone: "08123456789", password: "admin123" }
        ];

        let generatedOTP = "";
        let forgotEmail = "";

        //memindahkan login ke regist
        function switchTab(tab) {
            if (tab === 'login') {
                showView('view-login');
            } else {
                showView('view-register');
            }
        }

        //tampilan tertentu
        function showView(viewId) {
            document.querySelectorAll('.auth-view').forEach(v => v.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');

            // Reset semua notif
            document.querySelectorAll('.notif').forEach(n => n.classList.add('hidden'));
        }

        //toggle password
        function togglePassword(inputId, btn) {
            const input = document.getElementById(inputId);
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }

        //notifikasi ditampilkan
        function showNotif(id, show = true) {
            const el = document.getElementById(id);
            if (show) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }

        //login
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            showNotif('login-error', false);
            showNotif('login-success', false);

            // Cek dari localStorage juga
            const storedUsers = JSON.parse(localStorage.getItem('sporthub_users') || '[]');
            const allUsers = [...users, ...storedUsers];

            const user = allUsers.find(u => u.email === email && u.password === password);

            if (user) {
                // Simpan session
                playSuccessSound();
                localStorage.setItem('sporthub_login', JSON.stringify({ name: user.name, email: user.email }));
                showNotif('login-success');

                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                document.getElementById('login-error-msg').textContent = 'Email atau password salah. Coba lagi.';
                playErrorSound();
                showNotif('login-error');
            }
        }

        //Register
        function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const phone = document.getElementById('reg-phone').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;

            showNotif('register-error', false);
            showNotif('register-success', false);

            // Validasi password match
            if (password !== confirm) {
                document.getElementById('register-error-msg').textContent = 'Password dan konfirmasi tidak cocok!';
                showNotif('register-error');
                return;
            }

            // Validasi panjang password
            if (password.length < 8) {
                document.getElementById('register-error-msg').textContent = 'Password minimal 8 karakter!';
                showNotif('register-error');
                return;
            }

            // Simpan user ke localStorage
            const storedUsers = JSON.parse(localStorage.getItem('sporthub_users') || '[]');
            
            // Cek email duplikat
            if (storedUsers.find(u => u.email === email) || users.find(u => u.email === email)) {
                document.getElementById('register-error-msg').textContent = 'Email sudah terdaftar!';
                showNotif('register-error');
                return;
            }

            storedUsers.push({ name, phone, email, password });
            localStorage.setItem('sporthub_users', JSON.stringify(storedUsers));
            playSuccessSound();
            showNotif('register-success');

            setTimeout(() => {
                showView('view-login');
                document.getElementById('login-email').value = email;
            }, 2000);
        }

        //lupa password - kirim email
        function handleForgotEmail(e) {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;

            showNotif('forgot-error', false);

            // Cek apakah email terdaftar
            const storedUsers = JSON.parse(localStorage.getItem('sporthub_users') || '[]');
            const allUsers = [...users, ...storedUsers];
            const user = allUsers.find(u => u.email === email);

            if (!user) {
                document.getElementById('forgot-error-msg').textContent = 'Email tidak ditemukan dalam sistem!';
                showNotif('forgot-error');
                return;
            }

            // Generate OTP 6 digit
            forgotEmail = email;
            generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

            // Tampilkan OTP (simulasi frontend)
            document.getElementById('otp-code-show').textContent = generatedOTP;

            showView('view-otp');
        }

        //verifikasi otp
        function handleOTP(e) {
            e.preventDefault();
            showNotif('otp-error', false);

            const boxes = document.querySelectorAll('.otp-box');
            let inputOTP = '';
            boxes.forEach(box => inputOTP += box.value);

            if (inputOTP.length < 6) {
                showNotif('otp-error');
                return;
            }

            if (inputOTP === generatedOTP) {
                showView('view-reset-password');
            } else {
                showNotif('otp-error');
                // Kosongkan kotak OTP
                boxes.forEach(box => box.value = '');
                boxes[0].focus();
            }
        }

        // kirim ulang Otp
        function resendOTP() {
            generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
            document.getElementById('otp-code-show').textContent = generatedOTP;
            alert('Kode OTP baru telah dikirim! (Simulasi: ' + generatedOTP + ')');
        }

        // Reset password
        function handleResetPassword(e) {
            e.preventDefault();
            const newPw = document.getElementById('new-password').value;
            const confirmPw = document.getElementById('confirm-new-password').value;

            showNotif('reset-error', false);

            if (newPw !== confirmPw) {
                document.getElementById('reset-error-msg').textContent = 'Password tidak cocok!';
                showNotif('reset-error');
                return;
            }

            if (newPw.length < 8) {
                document.getElementById('reset-error-msg').textContent = 'Password minimal 8 karakter!';
                showNotif('reset-error');
                return;
            }

            // Update password di localStorage
            const storedUsers = JSON.parse(localStorage.getItem('sporthub_users') || '[]');
            const idx = storedUsers.findIndex(u => u.email === forgotEmail);
            if (idx !== -1) {
                storedUsers[idx].password = newPw;
                localStorage.setItem('sporthub_users', JSON.stringify(storedUsers));
            }
            playSuccessSound();
            alert('Password berhasil diperbarui! Silakan login dengan password baru.');
            showView('view-login');
        }

        // Otp box
        document.addEventListener('DOMContentLoaded', function() {
            const otpBoxes = document.querySelectorAll('.otp-box');
            otpBoxes.forEach(function(box, index) {
                box.addEventListener('input', function() {
                    // Hanya izinkan angka
                    this.value = this.value.replace(/[^0-9]/g, '');
                    if (this.value && index < otpBoxes.length - 1) {
                        otpBoxes[index + 1].focus();
                    }
                });

                box.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && !this.value && index > 0) {
                        otpBoxes[index - 1].focus();
                    }
                });
            });
        });

window.switchTab = switchTab;
window.showView = showView;
window.togglePassword = togglePassword;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleForgotEmail = handleForgotEmail;
window.handleOTP = handleOTP;
window.resendOTP = resendOTP;
window.handleResetPassword = handleResetPassword;
})();

//history page
(function () {
    if ((window.location.pathname.split('/').pop() || 'index.html') !== 'riwayat.html') return;

function toggleUserMenu() {
            document.getElementById('userDropdown').classList.toggle('show');
        }

        function logout() {
            localStorage.removeItem('sporthub_login');
            window.location.href = 'index.html';
        }

        document.addEventListener('DOMContentLoaded', function () {
            const user = JSON.parse(localStorage.getItem('sporthub_login') || 'null');
            if (user) {
                const el = document.getElementById('nav-username');
                if (el) el.textContent = user.name;
            }
            renderReservationTable();
        });

window.toggleUserMenu = toggleUserMenu;
window.logout = logout;
})();