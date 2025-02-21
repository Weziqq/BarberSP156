document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    const content = document.getElementById("content");
    const cache = {};

    // Utworzenie spinnera do wskazywania ładowania
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    document.body.appendChild(spinner);

    const showSpinner = () => spinner.style.display = "block";
    const hideSpinner = () => spinner.style.display = "none";

    // Utworzenie elementu do komunikatów o błędach
    const errorContainer = document.createElement("div");
    errorContainer.id = "error-message";
    errorContainer.setAttribute("role", "alert");
    errorContainer.setAttribute("aria-live", "assertive");
    errorContainer.style.display = "none";
    errorContainer.style.margin = "20px 0";
    content.parentNode.insertBefore(errorContainer, content);

    const displayError = message => {
        errorContainer.textContent = message;
        errorContainer.style.display = "block";
    };

    const clearError = () => {
        errorContainer.textContent = "";
        errorContainer.style.display = "none";
    };

    // Funkcja wyświetlająca powiadomienie (toast)
    const showToast = message => {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("hide");
            toast.addEventListener("transitionend", () => toast.remove());
        }, 3000);
    };

    // Obsługa przełączania trybu ciemnego
    const darkToggle = document.getElementById("dark-mode-toggle");
    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const mode = document.body.classList.contains("dark-mode") ? "Ciemny" : "Jasny";
            showToast(`Tryb ${mode} został aktywowany`);
        });
    }

    // Delegacja zdarzeń w nawigacji
    nav.addEventListener("click", async event => {
        const link = event.target.closest("a[data-page]");
        if (!link) return;
        event.preventDefault();

        const page = link.getAttribute("data-page");
        if (page) {
            try {
                showSpinner();
                clearError();
                // Dodanie klasy animacji wyjścia dla płynnego przejścia
                content.classList.add("fade-out");
                await new Promise(resolve => setTimeout(resolve, 300));

                let pageContent;
                // Sprawdzenie cache
                if (cache[page]) {
                    pageContent = cache[page];
                } else {
                    const response = await fetch(page);
                    if (!response.ok) {
                        throw new Error(`Network error: ${response.statusText}`);
                    }
                    pageContent = await response.text();
                    cache[page] = pageContent;
                }

                content.innerHTML = pageContent;
                // Usunięcie klasy fade-out i dodanie fade-in
                content.classList.remove("fade-out");
                content.classList.add("fade-in");
                setTimeout(() => content.classList.remove("fade-in"), 300);
            } catch (error) {
                content.innerHTML = "<p>Wystąpił błąd przy ładowaniu strony.</p>";
                displayError("Nie udało się załadować treści. Sprawdź połączenie internetowe.");
                console.error("Błąd ładowania strony:", error);
            } finally {
                hideSpinner();
            }
        }
    });
});