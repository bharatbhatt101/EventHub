// ==========================================
// EVENT DATA
// ==========================================

const events = [
    {
        id: 1,
        title: "Live Music Night",
        category: "Music",
        date: "2026-10-10",
        time: "7:30 PM",
        location: "The Courtyard, Chandigarh",
        price: 499,
        image:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
        desc:
            "An energetic evening of live performances, great food and unforgettable vibes."
    },

    {
        id: 2,
        title: "City Marathon 2026",
        category: "Sports",
        date: "2026-10-18",
        time: "6:00 AM",
        location: "Sukhna Lake, Chandigarh",
        price: 299,
        image:
            "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
        desc:
            "Run, challenge yourself and be part of Chandigarh's biggest community race."
    },

    {
        id: 3,
        title: "Modern Web Workshop",
        category: "Workshop",
        date: "2026-10-22",
        time: "11:00 AM",
        location: "Innovation Hub, Mohali",
        price: 799,
        image:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
        desc:
            "A practical workshop covering modern web design, JavaScript and project building."
    },

    {
        id: 4,
        title: "Autumn Food Festival",
        category: "Festival",
        date: "2026-10-25",
        time: "4:00 PM",
        location: "Sector 17 Plaza, Chandigarh",
        price: 399,
        image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
        desc:
            "Taste local favourites, discover new flavours and enjoy live entertainment."
    },

    {
        id: 5,
        title: "Acoustic Sunset",
        category: "Music",
        date: "2026-11-01",
        time: "5:30 PM",
        location: "Terrace Garden, Chandigarh",
        price: 599,
        image:
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80",
        desc:
            "Relax with intimate acoustic performances as the sun sets."
    },

    {
        id: 6,
        title: "Creative Photography Lab",
        category: "Workshop",
        date: "2026-11-08",
        time: "10:00 AM",
        location: "Art District, Panchkula",
        price: 699,
        image:
            "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=900&q=80",
        desc:
            "Learn practical composition, lighting and storytelling techniques from professionals."
    }
];


// ==========================================
// APPLICATION STATE
// ==========================================

let activeCategory = "All";

let favorites = JSON.parse(
    localStorage.getItem("eventhubFavorites") || "[]"
);

let bookings = JSON.parse(
    localStorage.getItem("eventhubBookings") || "[]"
);


// ==========================================
// DOM ELEMENTS
// ==========================================

const eventGrid = document.getElementById("eventGrid");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    const formattedDate = new Date(date + "T12:00:00");

    return {
        day: formattedDate.getDate(),

        month: formattedDate.toLocaleString(
            "en-US",
            {
                month: "short"
            }
        ),

        full: formattedDate.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
    };
}


// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(price) {

    if (price === 0) {
        return "Free";
    }

    return `₹${price.toLocaleString("en-IN")}`;
}


// ==========================================
// RENDER EVENTS
// ==========================================

function renderEvents() {

    const searchInput =
        document.getElementById("searchInput");

    const sortSelect =
        document.getElementById("sortSelect");

    const searchQuery =
        searchInput.value.toLowerCase().trim();

    const sortOption =
        sortSelect.value;


    // Filter events
    let filteredEvents = events.filter(event => {

        const categoryMatch =
            activeCategory === "All" ||
            event.category === activeCategory;

        const searchMatch =
            (
                event.title +
                " " +
                event.location +
                " " +
                event.category
            )
                .toLowerCase()
                .includes(searchQuery);

        return categoryMatch && searchMatch;
    });


    // Sort events
    if (sortOption === "priceLow") {

        filteredEvents.sort(
            (a, b) => a.price - b.price
        );
    }


    if (sortOption === "priceHigh") {

        filteredEvents.sort(
            (a, b) => b.price - a.price
        );
    }


    if (sortOption === "date") {

        filteredEvents.sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );
    }


    // Generate event cards
    eventGrid.innerHTML = filteredEvents
        .map(event => {

            const date = formatDate(event.date);

            const isFavorite =
                favorites.includes(event.id);


            return `
                <article class="event-card">

                    <div class="event-image">

                        <img
                            src="${event.image}"
                            alt="${event.title}"
                            loading="lazy"
                        >

                        <div class="date-badge">
                            <small>
                                ${date.month.toUpperCase()}
                            </small>

                            ${date.day}
                        </div>

                        <button
                            class="fav ${isFavorite ? "active" : ""}"
                            onclick="toggleFavorite(${event.id})"
                        >
                            ${isFavorite ? "♥" : "♡"}
                        </button>

                    </div>


                    <div class="event-body">

                        <span class="tag">
                            ${event.category}
                        </span>

                        <h3>
                            ${event.title}
                        </h3>

                        <p class="meta">
                            📅 ${date.full} • ${event.time}
                        </p>

                        <p class="meta">
                            📍 ${event.location}
                        </p>


                        <div class="event-bottom">

                            <span class="price">
                                ${formatPrice(event.price)}
                            </span>

                            <button
                                class="view-btn"
                                onclick="openDetails(${event.id})"
                            >
                                View Event
                            </button>

                        </div>

                    </div>

                </article>
            `;
        })
        .join("");


    // Show empty state
    emptyState.hidden =
        filteredEvents.length !== 0;
}


// ==========================================
// TOGGLE FAVORITE
// ==========================================

function toggleFavorite(eventId) {

    if (favorites.includes(eventId)) {

        favorites =
            favorites.filter(
                id => id !== eventId
            );

        showToast("Removed from favourites");

    } else {

        favorites.push(eventId);

        showToast("Added to favourites");
    }


    // Save favorites
    localStorage.setItem(
        "eventhubFavorites",
        JSON.stringify(favorites)
    );


    renderEvents();
}


// ==========================================
// OPEN EVENT DETAILS
// ==========================================

function openDetails(eventId) {

    const event =
        events.find(
            item => item.id === eventId
        );

    const date =
        formatDate(event.date);


    document.getElementById(
        "modalContent"
    ).innerHTML = `

        <span class="tag">
            ${event.category}
        </span>

        <h2>
            ${event.title}
        </h2>

        <img
            class="modal-img"
            src="${event.image}"
            alt="${event.title}"
        >

        <p>
            ${event.desc}
        </p>

        <p class="meta">
            📅 ${date.full} • ${event.time}
        </p>

        <p class="meta">
            📍 ${event.location}
        </p>

        <div class="event-bottom">

            <span class="price">
                ${formatPrice(event.price)}
                / ticket
            </span>

        </div>

        <div class="modal-actions">

            <button
                class="book-now"
                onclick="showBookingForm(${event.id})"
            >
                Book Tickets
            </button>

            <button
                class="secondary"
                onclick="closeModal()"
            >
                Close
            </button>

        </div>
    `;


    document
        .getElementById("modalBackdrop")
        .classList.add("show");
}


// ==========================================
// BOOKING FORM
// ==========================================

function showBookingForm(eventId) {

    const event =
        events.find(
            item => item.id === eventId
        );


    document.getElementById(
        "modalContent"
    ).innerHTML = `

        <span class="tag">
            BOOK YOUR SPOT
        </span>

        <h2>
            ${event.title}
        </h2>


        <form
            id="bookingForm"
            class="form-grid"
        >

            <div class="form-group">

                <label>
                    Full Name
                </label>

                <input
                    type="text"
                    name="name"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    Tickets
                </label>

                <input
                    type="number"
                    name="tickets"
                    min="1"
                    max="10"
                    value="1"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    Phone
                </label>

                <input
                    type="tel"
                    name="phone"
                    pattern="[0-9]{10}"
                    required
                >

            </div>


            <div class="form-group full">

                <button
                    class="book-now"
                    type="submit"
                    style="width:100%"
                >
                    Confirm Booking —
                    ${formatPrice(event.price)}
                </button>

            </div>

        </form>
    `;


    const bookingForm =
        document.getElementById("bookingForm");


    bookingForm.addEventListener(
        "submit",
        function (eventObject) {

            eventObject.preventDefault();


            const formData =
                new FormData(bookingForm);


            const ticketQuantity =
                Number(
                    formData.get("tickets")
                );


            const newBooking = {

                id: Date.now(),

                eventId: event.id,

                title: event.title,

                date: event.date,

                time: event.time,

                location: event.location,

                tickets: ticketQuantity,

                name: formData.get("name")
            };


            bookings.push(newBooking);


            localStorage.setItem(
                "eventhubBookings",
                JSON.stringify(bookings)
            );


            closeModal();

            renderBookings();

            showToast(
                "Booking confirmed successfully!"
            );


            setTimeout(() => {

                document
                    .getElementById("bookings")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }, 400);
        }
    );
}


// ==========================================
// RENDER BOOKINGS
// ==========================================

function renderBookings() {

    const bookingList =
        document.getElementById("bookingList");

    const bookingEmpty =
        document.getElementById("bookingEmpty");

    const bookingCount =
        document.getElementById("bookingCount");


    // Update booking count
    bookingCount.textContent =
        `${bookings.length} booking${
            bookings.length === 1
                ? ""
                : "s"
        }`;


    // Show/hide empty message
    bookingEmpty.hidden =
        bookings.length > 0;


    // Generate bookings
    bookingList.innerHTML =
        bookings
            .map(booking => {

                const date =
                    formatDate(booking.date);


                return `
                    <div class="booking">

                        <div>

                            <h3>
                                ${booking.title}
                            </h3>

                            <p>
                                📅 ${date.full}
                                • ${booking.time}
                                • 📍 ${booking.location}
                            </p>

                            <p>
                                Tickets:
                                ${booking.tickets}

                                • Booked by
                                ${booking.name}
                            </p>

                        </div>


                        <span class="status">
                            CONFIRMED
                        </span>

                    </div>
                `;
            })
            .join("");
}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    document
        .getElementById("modalBackdrop")
        .classList.remove("show");
}


// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(showToast.timer);


    showToast.timer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);
}


// ==========================================
// SEARCH
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        renderEvents
    );


// ==========================================
// SORT
// ==========================================

document
    .getElementById("sortSelect")
    .addEventListener(
        "change",
        renderEvents
    );


// ==========================================
// CATEGORY FILTERS
// ==========================================

document
    .querySelectorAll(".chip")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                // Remove active class
                document
                    .querySelectorAll(".chip")
                    .forEach(item =>
                        item.classList.remove("active")
                    );


                // Activate selected button
                button.classList.add("active");


                // Update category
                activeCategory =
                    button.dataset.category;


                // Refresh events
                renderEvents();
            }
        );
    });


// ==========================================
// CATEGORY CARDS
// ==========================================

document
    .querySelectorAll(
        "[data-category-jump]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                activeCategory =
                    button.dataset.categoryJump;


                document
                    .querySelectorAll(".chip")
                    .forEach(chip => {

                        chip.classList.toggle(
                            "active",
                            chip.dataset.category ===
                            activeCategory
                        );
                    });


                renderEvents();


                document
                    .getElementById("events")
                    .scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );
    });


// ==========================================
// MODAL CLOSE BUTTON
// ==========================================

document
    .getElementById("modalClose")
    .addEventListener(
        "click",
        closeModal
    );


// Close modal when clicking outside
document
    .getElementById("modalBackdrop")
    .addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "modalBackdrop"
            ) {
                closeModal();
            }
        }
    );


// ==========================================
// MOBILE MENU
// ==========================================

document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("nav")
                .classList.toggle("open");
        }
    );


// Close mobile menu after navigation
document
    .querySelectorAll(".nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                document
                    .getElementById("nav")
                    .classList.remove("open");
            }
        );
    });


// ==========================================
// DARK / LIGHT MODE
// ==========================================

document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            document.body
                .classList
                .toggle("dark");


            const theme =
                document.body.classList.contains("dark")
                    ? "dark"
                    : "light";


            localStorage.setItem(
                "eventhubTheme",
                theme
            );
        }
    );


// ==========================================
// LOAD SAVED THEME
// ==========================================

if (
    localStorage.getItem("eventhubTheme") ===
    "dark"
) {

    document.body.classList.add("dark");
}


// ==========================================
// INITIALIZE WEBSITE
// ==========================================

renderEvents();

renderBookings();