document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("nav ul li a");
    const content = document.getElementById("content");
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    document.body.appendChild(spinner);

    links.forEach(link => {
        link.addEventListener("click", async event => {
            event.preventDefault();
            const page = link.getAttribute("data-page");

            if (page) {
                try {
                    spinner.style.display = "block";
                    const response = await fetch(page);
                    if (!response.ok) {
                        throw new Error(`Network error: ${response.statusText}`);
                    }
                    const data = await response.text();
                    content.innerHTML = data;
                } catch (error) {
                    content.innerHTML = "<p>Wystąpił błąd przy ładowaniu strony.</p>";
                    console.error("Błąd ładowania strony:", error);
                } finally {
                    spinner.style.display = "none";
                }
            }
        });
    });
});