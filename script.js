(() => {
  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const hasGsap = Boolean(window.gsap);
  const hasScrollTrigger = Boolean(window.ScrollTrigger);

  if (hasGsap && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.9 });
  }

  let lenis = null;
  if (window.Lenis && !reducedMotion) {
    lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.1
    });

    if (hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  const scrollToTarget = (target) => {
    if (!(target instanceof HTMLElement)) return;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.15 });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      scrollToTarget(target);
      window.history.pushState(null, "", hash);
    });
  });

  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  function closeMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
    if (hasGsap && !reducedMotion) {
      gsap.to(mobileMenu.querySelectorAll("nav a"), {
        y: 20,
        autoAlpha: 0,
        duration: 0.25,
        stagger: 0.03,
        overwrite: true
      });
    }
  }

  function openMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenu.classList.add("is-open");
    body.classList.add("menu-open");
    if (hasGsap && !reducedMotion) {
      gsap.fromTo(
        mobileMenu.querySelectorAll("nav a"),
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.07,
          overwrite: true
        }
      );
    }
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  function initLoader() {
    const loader = document.querySelector(".loader");
    const count = document.querySelector(".loader__count");
    if (!loader) return;

    if (!hasGsap || reducedMotion) {
      loader.classList.add("is-loaded");
      window.setTimeout(() => loader.remove(), 30);
      return;
    }

    const progress = { value: 0 };
    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        loader.classList.add("is-loaded");
        window.setTimeout(() => loader.remove(), 900);
      }
    });

    timeline
      .to(progress, {
        value: 100,
        duration: 1.15,
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(progress.value)).padStart(2, "0");
        }
      })
      .from(".loader__word > span:first-child", { yPercent: 110, duration: 0.8 }, 0.2)
      .from(".loader__meta", { autoAlpha: 0, duration: 0.4 }, 0.15)
      .to(".loader__word", { yPercent: -15, autoAlpha: 0, duration: 0.45 }, 1.15);

    return timeline;
  }

  function initHero() {
    if (!hasGsap || reducedMotion) return;

    const timeline = gsap.timeline({
      defaults: { duration: 1.15, ease: "power4.out" },
      delay: 0.15
    });

    gsap.set(".hero__title-line", { yPercent: 112 });
    gsap.set(".hero-card", { autoAlpha: 0, scale: 0.82 });
    gsap.set(
      [".hero__intro", ".hero__kicker", ".hero__side-copy", ".hero__description", ".hero__cn-title"],
      { autoAlpha: 0, y: 24 }
    );

    timeline
      .to(".hero__title-line", {
        yPercent: 0,
        stagger: 0.08,
        duration: 1.25,
        ease: "power4.out"
      })
      .to(
        ".hero-card",
        {
          autoAlpha: 1,
          scale: 1,
          stagger: 0.08,
          duration: 1.1,
          ease: "power3.out"
        },
        0.25
      )
      .to(
        [".hero__intro", ".hero__kicker", ".hero__side-copy"],
        { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.7 },
        0.7
      )
      .to(
        [".hero__description", ".hero__cn-title"],
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.7 },
        1
      )
      .from(".hero__baseline", { autoAlpha: 0, duration: 0.6 }, 1.15);
  }

  function initCursor() {
    const cursor = document.querySelector(".cursor");
    if (!cursor || !finePointer || reducedMotion || !hasGsap) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3" });

    window.addEventListener("pointermove", (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
      cursor.classList.add("is-visible");
    });

    document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));

    document
      .querySelectorAll(".project-list__item a, .project-card, .case-video")
      .forEach((item) => {
        item.addEventListener("mouseenter", () => {
          cursor.querySelector("span").textContent =
            item.tagName === "VIDEO" ? "PLAY" : "VIEW";
          gsap.to(cursor, { scale: 1.18, duration: 0.25 });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(cursor, { scale: 1, duration: 0.25 });
        });
      });
  }

  function initProgress() {
    const progress = document.querySelector(".scroll-progress span");
    if (!progress || !hasScrollTrigger) return;

    gsap.to(progress, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2
      }
    });
  }

  function initWorkPreviews() {
    const items = [...document.querySelectorAll(".project-list__item")];
    const previews = [...document.querySelectorAll(".preview-stack__item")];
    if (!items.length || !previews.length) return;

    if (!hasGsap || reducedMotion) return;

    previews.forEach((preview, index) => {
      gsap.set(preview, {
        zIndex: index === 0 ? 3 : 1,
        clipPath:
          index === 0
            ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
      });
    });

    let activeKey = "aigc";

    const setActive = (key) => {
      if (!key || key === activeKey) return;
      activeKey = key;

      items.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.project === key);
      });

      previews.forEach((preview) => {
        const isIncoming = preview.dataset.preview === key;
        const isOutgoing = preview.classList.contains("is-active") && !isIncoming;

        if (isIncoming) {
          gsap.set(preview, {
            zIndex: 4,
            clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
          });
          gsap.to(preview, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.85,
            ease: "power4.inOut",
            overwrite: true,
            onComplete: () => {
              previews.forEach((item) => {
                if (item !== preview) {
                  item.classList.remove("is-active");
                  gsap.set(item, {
                    zIndex: 1,
                    clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
                  });
                }
              });
              preview.classList.add("is-active");
              gsap.set(preview, { zIndex: 3 });
            }
          });
        } else if (isOutgoing) {
          gsap.set(preview, { zIndex: 2 });
        }
      });
    };

    items.forEach((item) => {
      item.addEventListener("pointerenter", () => setActive(item.dataset.project));
      item.addEventListener("focusin", () => setActive(item.dataset.project));
    });
  }

  function initPixelBand() {
    const grid = document.querySelector(".pixel-grid");
    if (!grid || !hasGsap) return;

    const total = 24 * 8;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i += 1) {
      const cell = document.createElement("span");
      cell.className = "pixel";
      cell.style.background = i % 7 === 0 ? "#f1eee3" : i % 3 === 0 ? "#171714" : "#1e46e9";
      fragment.appendChild(cell);
    }
    grid.appendChild(fragment);

    if (reducedMotion) {
      grid.remove();
      return;
    }

    const cells = grid.querySelectorAll(".pixel");
    gsap.fromTo(
      cells,
      { opacity: 1, scale: 1 },
      {
        opacity: 0,
        scale: 0.9,
        ease: "none",
        stagger: { amount: 0.75, from: "random" },
        scrollTrigger: {
          trigger: ".pixel-band",
          start: "top 85%",
          end: "bottom 35%",
          scrub: 1
        }
      }
    );
  }

  function initTextReveals() {
    if (!hasGsap || !hasScrollTrigger || reducedMotion) return;

    const revealGroups = [
      [".profile__statement", ".profile__index"],
      [".work-index__head > p", ".project-list"],
      [".ip-concept__title", ".ip-concept__list"],
      [".culture-hero__copy", ".culture-system__column"],
      [".visual-lab__intro", ".visual-feature__statement", ".visual-lab__footer"],
      [".process__head", ".process-step"],
      [".capability-grid article", ".toolbelt"],
      [".archive-grid article", ".contact__bottom"]
    ];

    revealGroups.forEach(([selector]) => {
      gsap.utils.toArray(selector).forEach((element) => {
        gsap.from(element, {
          y: 50,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        });
      });
    });

    gsap.utils.toArray(".case__title > span").forEach((line) => {
      gsap.from(line, {
        yPercent: 45,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: line.closest(".case__head"),
          start: "top 72%",
          once: true
        }
      });
    });

    gsap.utils.toArray(".display-title").forEach((title) => {
      gsap.from(title, {
        y: 72,
        autoAlpha: 0,
        duration: 1.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: title,
          start: "top 86%",
          once: true
        }
      });
    });

    gsap.utils.toArray(".display-title__fill").forEach((fill) => {
      gsap.fromTo(
        fill,
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: fill.closest(".display-title"),
            start: "top 80%",
            end: "bottom 45%",
            scrub: 1
          }
        }
      );
    });
  }

  function initMediaReveals() {
    if (!hasGsap || !hasScrollTrigger || reducedMotion) return;

    gsap.utils
      .toArray(
        ".case-gallery figure, .ip-gallery figure, .culture-gallery figure, .poster-card, .archive-grid figure"
      )
      .forEach((figure) => {
        gsap.from(figure, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.15,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: figure,
            start: "top 88%",
            once: true
          }
        });

        const image = figure.querySelector("img");
        if (image) {
          gsap.from(image, {
            scale: 1.08,
            duration: 1.45,
            ease: "power3.out",
            scrollTrigger: {
              trigger: figure,
              start: "top 88%",
              once: true
            }
          });
        }
      });

    gsap.matchMedia().add("(min-width: 901px)", () => {
      gsap.utils.toArray(".case-gallery figure:not(.case-gallery__wide) img").forEach(
        (image, index) => {
          gsap.to(image, {
            yPercent: index === 0 ? -4 : 3,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest(".case-gallery"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          });
        }
      );
    });
  }

  function initMarquees() {
    if (!hasGsap || reducedMotion) return;

    const track = document.querySelector(".marquee__track");
    if (track) {
      gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 24,
        ease: "none"
      });
    }

    gsap.to(".contact__ticker span", {
      xPercent: -22,
      repeat: -1,
      yoyo: true,
      duration: 8,
      ease: "sine.inOut"
    });
  }

  function initVideoBehavior() {
    const video = document.querySelector(".case-video");
    if (!video || !hasScrollTrigger) return;

    ScrollTrigger.create({
      trigger: video,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause()
    });
  }

  // Keep the scroll sequence aligned with the visible project directory.
  function reorderPortfolioSequence() {
    const ipCase = document.querySelector("#case-ip");
    const cultureCase = document.querySelector("#case-culture");
    const visualCase = document.querySelector("#visual");
    if (!ipCase || !cultureCase || !visualCase || !ipCase.parentNode) return;

    ipCase.parentNode.insertBefore(cultureCase, ipCase);
    ipCase.parentNode.insertBefore(visualCase, ipCase);
  }

  function initContactCopy() {
    const button = document.querySelector("[data-copy-wechat]");
    if (!button) return;

    const label = button.querySelector(".contact__copy-label");
    const wechat = button.dataset.copyWechat;

    button.addEventListener("click", async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(wechat);
        } else {
          const field = document.createElement("textarea");
          field.value = wechat;
          field.setAttribute("readonly", "");
          field.style.position = "fixed";
          field.style.opacity = "0";
          document.body.appendChild(field);
          field.select();
          document.execCommand("copy");
          field.remove();
        }

        if (label) {
          label.textContent = "COPIED";
          label.classList.add("is-copied");
        }
        window.setTimeout(() => {
          if (label) {
            label.textContent = "COPY";
            label.classList.remove("is-copied");
          }
        }, 1800);
      } catch {
        if (label) label.textContent = wechat;
      }
    });
  }

  function init() {
    reorderPortfolioSequence();
    const loaderTimeline = initLoader();
    const heroDelay = reducedMotion || !hasGsap ? 0 : 1.35;
    window.setTimeout(initHero, heroDelay * 1000);

    initCursor();
    initProgress();
    initWorkPreviews();
    initPixelBand();
    initTextReveals();
    initMediaReveals();
    initMarquees();
    initVideoBehavior();
    initContactCopy();

    if (hasScrollTrigger) {
      window.addEventListener("load", () => ScrollTrigger.refresh());
    }

    if (loaderTimeline) {
      loaderTimeline.eventCallback("onComplete", () => {
        document.querySelector(".loader")?.classList.add("is-loaded");
      });
    }

    window.setTimeout(() => {
      const loader = document.querySelector(".loader");
      loader?.classList.add("is-loaded");
      window.setTimeout(() => loader?.remove(), 900);
      root.classList.add("page-ready");
    }, 2300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
