var swiper = new Swiper(".swiper", {
    initialSlide: 3,
    centeredSlides: true,
    loop: true,
    speed: 900,
    grabCursor: true,
    allowTouchMove: true, // Allow swiping
    effect: "coverflow",
    coverflowEffect: {
        rotate: -10,
        stretch: -45,
        depth: 180,
        modifier: 1,
        slideShadows: true,
    },
    mousewheel: {
        thresholdDelta: 50,
        sensitivity: 1,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 1.5, // Adjust for smaller screens
            spaceBetween: 0,
        },
        576: {
            slidesPerView: 1.5, // Adjust for screens >= 576px
            spaceBetween: 0,
        },
        768: {
            slidesPerView: 1.5, // Adjust for screens >= 768px
            spaceBetween: 0,
        },
        1200: {
            slidesPerView: 1.8, // Adjust for screens >= 1200px
            spaceBetween: 0,
        },
    }
});

const slides = document.querySelectorAll(".swiper-slide");

function flipActiveSlide() {
    const activeSlide = document.querySelector(".swiper-slide-active");
    const button = activeSlide.querySelector("button");
    const iframe = activeSlide.querySelector("iframe");

    if (button) {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            activeSlide.classList.add("flipped");
        });
    }

    if (iframe) {
        let isScrolling = false; // Track if the user is scrolling
        let isClick = false; // Track if the user is clicking (not scrolling)
        let mouseMoveThreshold = 5; // Threshold to differentiate between click and scroll
        let startX, startY;

        // Handle mouse events
        iframe.addEventListener("mousedown", (event) => {
            isClick = true; // User is clicking
            startX = event.clientX;
            startY = event.clientY;
        });

        iframe.addEventListener("mousemove", (event) => {
            if (isClick) {
                const deltaX = Math.abs(event.clientX - startX);
                const deltaY = Math.abs(event.clientY - startY);
                if (deltaX > mouseMoveThreshold || deltaY > mouseMoveThreshold) {
                    isScrolling = true; // User is scrolling
                    iframe.style.pointerEvents = "none"; // Disable iframe interactions during scroll
                }
            }
        });

        iframe.addEventListener("mouseup", () => {
            if (isClick && !isScrolling) {
                // If it's a click (not a scroll), play/pause the video
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }
            isClick = false; // Reset click tracking
            isScrolling = false; // Reset scroll tracking
            iframe.style.pointerEvents = "auto"; // Re-enable iframe interactions
        });

        // Handle touch events for mobile devices
        iframe.addEventListener("touchstart", (event) => {
            isClick = true; // User is touching
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        });

        iframe.addEventListener("touchmove", (event) => {
            if (isClick) {
                const deltaX = Math.abs(event.touches[0].clientX - startX);
                const deltaY = Math.abs(event.touches[0].clientY - startY);
                if (deltaX > mouseMoveThreshold || deltaY > mouseMoveThreshold) {
                    isScrolling = true; // User is scrolling
                    iframe.style.pointerEvents = "none"; // Disable iframe interactions during scroll
                }
            }
        });

        iframe.addEventListener("touchend", () => {
            if (isClick && !isScrolling) {
                // If it's a tap (not a scroll), play/pause the video
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }
            isClick = false; // Reset touch tracking
            isScrolling = false; // Reset scroll tracking
            iframe.style.pointerEvents = "auto"; // Re-enable iframe interactions
        });

        // Disable Swiper scroll when hovering over the video
        iframe.addEventListener("mouseenter", () => {
            swiper.mousewheel.disable();
        });

        iframe.addEventListener("mouseleave", () => {
            swiper.mousewheel.enable();
        });
    }
}

slides.forEach((slide) => {
    slide.addEventListener("click", () => {
        if (!slide.classList.contains("swiper-slide-active")) {
            const index = [...slides].indexOf(slide);
            swiper.slideToLoop(index);
        } else if (slide.classList.contains("flipped")) {
            slide.classList.remove("flipped");
        }
    });
});

swiper.on("slideChangeTransitionStart", function () {
    slides.forEach((slide) => {
        slide.classList.remove("flipped");
    });
    flipActiveSlide();
});

flipActiveSlide();
