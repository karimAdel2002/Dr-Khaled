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
            slidesPerView: 1.2, // Adjust for smaller screens
            spaceBetween: 5,
        },
        576: {
            slidesPerView: 1.5, // Adjust for screens >= 576px
            spaceBetween: 10,
        },
        768: {
            slidesPerView: 1.5, // Adjust for screens >= 768px
            spaceBetween: 15,
        },
        1200: {
            slidesPerView: 1.8, // Adjust for screens >= 1200px
            spaceBetween: 20,
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
        iframe.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent event bubbling to the slide
        });

        iframe.addEventListener("mouseenter", () => {
            swiper.mousewheel.disable(); // Disable swiper scroll when hovering over the video
        });

        iframe.addEventListener("mouseleave", () => {
            swiper.mousewheel.enable(); // Re-enable swiper scroll when leaving the video
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