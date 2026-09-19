/* The two things that are not decided yet, kept together so that deciding
 * them is one edit rather than a search through the markup.
 *
 * DOWNLOAD_URL is where the .dmg is hosted. Until it is set, both buttons
 * say so rather than pretending to be a working link, because a download
 * button that does nothing is worse than an honest one that waits.
 */

// A file sitting next to this page. Swap it for the GitHub Releases
// URL once the .dmg is hosted there, which is the only change needed.
const DOWNLOAD_URL = "Hark-0.1.0.dmg";
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
