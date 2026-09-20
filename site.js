/* The two things that are not decided yet, kept together so that deciding
 * them is one edit rather than a search through the markup.
 *
 * DOWNLOAD_URL is where the .dmg is hosted. Until it is set, both buttons
 * say so rather than pretending to be a working link, because a download
 * button that does nothing is worse than an honest one that waits.
 */

// The release asset. It is not kept in the repository: GitHub Pages
// caps a repo at 1GB and three versions of a 371MB image would pass
// that, while release downloads are not metered at all.
const DOWNLOAD_URL =
  "https://github.com/satya-lakshya/hark/releases/download/v0.1.0/Hark-0.1.0.dmg";
const CONTACT_EMAIL = "hello@example.com";

for (const link of document.querySelectorAll(".download")) {
  if (DOWNLOAD_URL) {
    link.href = DOWNLOAD_URL;
    link.setAttribute("download", "");
  } else {
    link.href = "#get";
    link.dataset.pending = "true";
  }
}

const contact = document.getElementById("contactLink");
if (contact) {
  contact.href = `mailto:${CONTACT_EMAIL}`;
  contact.textContent = "Contact";
}

/* The wave plays itself once, so someone who never moves the pointer over
 * the mark still sees what it does. Only where there is a pointer to
 * hover with: on a phone the mark is a still logo, as intended. */
const mark = document.querySelector(".mark");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const stillness = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (mark && canHover && !stillness) {
  window.addEventListener("load", () => {
    requestAnimationFrame(() => mark.classList.add("is-awake"));
  });
  // Taken off again once it has played, or the class would fight the
  // hover rule and the mark would sit frozen mid-crest.
  mark.addEventListener("animationend", () => mark.classList.remove("is-awake"));
}

/* The payoff reveal, for browsers without scroll timelines.
 *
 * animation-timeline: view() is Chrome 115+ and Safari 26+. Firefox does
 * not ship it, nor does any Safari before 26, and those visitors would
 * otherwise find the download already sitting there with nothing having
 * happened. An observer fires once when it comes into view, which every
 * browser in use can do, and costs nothing while it waits.
 */
const hasScrollTimeline =
  window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()");
const stillWanted = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!hasScrollTimeline && !stillWanted && "IntersectionObserver" in window) {
  const payoff = document.querySelector(".grab .wrap");
  if (payoff) {
    payoff.classList.add("will-arrive");
    new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("has-arrived");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.25 }).observe(payoff);
  }
}
