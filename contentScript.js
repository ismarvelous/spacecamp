const textPattern = "{labels} | {title} | Opmerkingen:";
const timeRegistrationUrl = "https://app.timeon.nl/#/";

let hostName = "";
let basecampClipboardText = "";

window.addEventListener('load', () => {
    initializeSpaceCamp();

    const manifest = chrome.runtime.getManifest();
    console.info(`Initialized ${manifest.name} - Manifest Version: ${manifest.version}`);
});

document.addEventListener('turbo:load', () => {
    initializeSpaceCamp();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "navigationItemClicked") {
        handleNavigationItemClicked(request.value);
    }
});

function initializeSpaceCamp() {
    hostName = window.location.hostname.toLowerCase();
    if (hostName === "3.basecamp.com") {
        calculateListProgress();
        renderBasecampLabels();
    }
}

function handleNavigationItemClicked(clickedItem) {
    if (clickedItem === "register-time") {
        if (hostName === "3.basecamp.com") {
            copyToClipboardAndRedirect(basecampClipboardText);
        }
        else {
            copyToClipboardAndRedirect(createClipboardText([], document.title));
        }
    }
}

// ----- Basecamp specific -----

function renderBasecampLabels() {
    const labels = [];

    document.querySelectorAll("div.thread-entry__content").forEach((content) => {
        appendLabel(content.innerHTML, labels);
    });

    const render = () => {
        let clipboardText = createClipboardText(labels, document.title);
        let jLabels = labels.join(", ");

        const html = `
            <div id="spcamp-labels" class="todos-form__field">
                <div class="todos-form__field-label">
                    <strong>Labels</strong>
                </div>
                <div class="todos-form__field-content">
                    <div>${jLabels}</div>
                </div>
            </div>
        `;

        basecampClipboardText = clipboardText;

        const spacecampLabels = document.getElementById("spcamp-labels");
        const todoPermaDetails = document.querySelector("section.todo-perma__details");

        if (spacecampLabels) {
            spacecampLabels.outerHTML = html;
        } else if (todoPermaDetails) {
            todoPermaDetails.insertAdjacentHTML('beforeend', html);
        }
    }

    const listUrl = document.querySelector("a[href*='todolists']");

    if (listUrl) {
        fetch(listUrl.href)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                doc.querySelectorAll("div.thread-entry__content").forEach((content) => {
                    appendLabel(content.innerHTML, labels);
                });
                render();
            });
    } else {
        render();
    }
}

function calculateListProgress() {
    document.querySelectorAll("article.todolist").forEach((todoList) => {

        // for todo list detail page
        const overviewListTitle = todoList.querySelector("h3 a.todolist__permalink");
        updateTotalCount(overviewListTitle, todoList, /\(([^)]+)\)/);

        // for todo list detail page
        const detailListTitle = todoList.querySelector("h3.todolist__title span a");
        updateTotalCount(detailListTitle, todoList, /\(([^)]+)\)/);
    });
}

function updateTotalCount(titleElement, todoList, regExp) {
    if (titleElement && !titleElement.textContent.endsWith(")")) {
        const todo = calculateTotal("ul.todos a", todoList, regExp);
        const done = calculateTotal("ul.completed a", todoList, regExp);
        titleElement.append(` (${todo}/${done})`);
    }
}

function calculateTotal(selector, todolist, regExp) {
    let total = 0;
    todolist.querySelectorAll(selector).forEach((link) => {
        if (isVisible(link)) {
            const matches = regExp.exec(link.textContent);
            if (matches) {
                matches.forEach((entry) => {
                    const num = parseInt(entry);
                    if (num) {
                        total += num;
                    }
                });
            }
        }
    });
    return total;
}

// ----- Utils -----

function isVisible(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

function copyToClipboardAndRedirect(text) {
    const focusListener = () => {
        navigator.clipboard.writeText(text).then(() => {
            chrome.runtime.sendMessage({ action: "openTimeRegistrationUrl", url: timeRegistrationUrl });
        }).catch(err => {
            console.error('Failed to copy after focus: ', err);
        });

        window.removeEventListener('focus', focusListener);
    };

    window.addEventListener('focus', focusListener);
}

function appendLabel(html, labels) {
    const re = /(#(\w+)([-](\w+))*)/g;
    let match = null;
    const text = html.replace(/<[^>]*>?/gm, '');
    while ((match = re.exec(text))) {
        if (!match[1].startsWith("#updateLinkRel")) {
            labels.push(match[1]);
        }
    }
}

function createClipboardText(labels, title) {
    return textPattern
        .replace("{labels}", labels.join(", "))
        .replace("{title}", title.replace("&", "and").replace("'", ""));
}