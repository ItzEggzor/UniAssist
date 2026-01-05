/* =========================
   GLOBAL STATE
========================= */
let posts = [];
let postType = "Complaint";
let currentFilter = "Urgent";

/* =========================
   ELEMENTS
========================= */
const complaintBtn = document.getElementById("complaintBtn");
const suggestionBtn = document.getElementById("suggestionBtn");
const postText = document.getElementById("postText");
const aiPanel = document.getElementById("aiResponse");
const aiBody = aiPanel.querySelector(".ai-body");

/* =========================
   TOGGLE COMPLAINT / SUGGESTION
========================= */
const menuContainer = document.querySelector('.menu');

complaintBtn.onclick = () => {
    postType = "Complaint";
    complaintBtn.classList.add("active");
    suggestionBtn.classList.remove("active");
    menuContainer.classList.remove("suggestion-active");
    postText.placeholder = "Write your complaint here...";
};

suggestionBtn.onclick = () => {
    postType = "Suggestion";
    suggestionBtn.classList.add("active");
    complaintBtn.classList.remove("active");
    menuContainer.classList.add("suggestion-active");
    postText.placeholder = "Write your suggestion here...";
};

/* =========================
   AI CLASSIFICATION
========================= */
function classifyAI(text) {
    text = text.toLowerCase();

    if (text.includes("water") || text.includes("electric") || text.includes("fire") || text.includes("danger")) {
        return {
            level: "Urgent",
            class: "urgent",
            solution: "Immediate attention required. Inform authorities immediately."
        };
    }

    if (text.includes("wifi") || text.includes("food") || text.includes("mess") || text.includes("hostel")) {
        return {
            level: "Normal",
            class: "normal",
            solution: "This can be resolved by contacting the concerned department."
        };
    }

    return {
        level: "Low",
        class: "low",
        solution: "This suggestion is recorded for future improvement."
    };
}

/* =========================
   LIVE AI PREVIEW
========================= */
postText.addEventListener("input", () => {
    const text = postText.value;
    document.getElementById("charCount").innerText = `${text.length} / 300`;

    const preview = document.getElementById("livePriority");
    if (text.length < 10) {
        preview.innerText = "AI Priority: —";
        preview.className = "preview";
        return;
    }

    const ai = classifyAI(text);
    preview.innerText = `AI Priority: ${ai.level}`;
    preview.className = `preview ${ai.class}`;
});

/* =========================
   SUBMIT POST
========================= */
function submitPost() {
    const text = postText.value.trim();
    if (!text) return alert("Please write something!");

    const ai = classifyAI(text);

    aiBody.innerHTML = `
        <div class="ai-row"><strong>Post Type:</strong> ${postType}</div>
        <div class="ai-row">
            <strong>Priority:</strong>
            <span class="ai-badge ai-${ai.class}">${ai.level}</span>
        </div>
        <div class="ai-row ai-solution">
            <strong>AI Suggested Action:</strong><br>${ai.solution}
        </div>
    `;
    aiPanel.classList.add("show");

    posts.push({
        type: postType,
        text,
        ai,
        up: 0,
        down: 0,
        neutral: 0,
        comments: [],
        showComments: false
    });

    postText.value = "";
    renderPosts();
}

/* =========================
   POST REACTIONS
========================= */
function react(index, reaction) {
    posts[index][reaction]++;
    renderPosts();
}

/* =========================
   FILTER TABS
========================= */
function setFilter(type) {
    currentFilter = type;
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle("active", tab.innerText === type);
    });
    renderPosts();
}

/* =========================
   TOGGLE COMMENTS
========================= */
function toggleComments(index) {
    posts[index].showComments = !posts[index].showComments;
    renderPosts();
}

/* =========================
   ADD COMMENT
========================= */
function addComment(index) {
    const input = document.getElementById(`comment-${index}`);
    const text = input.value.trim();
    if (!text) return;

    posts[index].comments.push({
        text,
        up: 0,
        down: 0,
        neutral: 0
    });

    input.value = "";
    renderPosts();
}

/* =========================
   COMMENT REACTIONS
========================= */
function reactComment(pIndex, cIndex, reaction) {
    posts[pIndex].comments[cIndex][reaction]++;
    renderPosts();
}

/* =========================
   RENDER COMMUNITY FEED
========================= */
function renderPosts() {
    const container = document.getElementById("posts");
    container.innerHTML = "";

    posts
        .filter(p => p.ai.level === currentFilter)
        .sort((a, b) => b.up - a.up)
        .forEach((post, pIndex) => {
            container.innerHTML += `
                <div class="post">
                    <strong>${post.type}</strong><br>
                    <span class="tag ${post.ai.class}">${post.ai.level}</span>

                    <p>${post.text}</p>
                    <small><b>AI:</b> ${post.ai.solution}</small>

                    <div class="reactions">
                        <span onclick="react(${pIndex}, 'up')">👍 ${post.up}</span>
                        <span onclick="react(${pIndex}, 'down')">👎 ${post.down}</span>
                        <span onclick="react(${pIndex}, 'neutral')">😐 ${post.neutral}</span>
                        <span onclick="toggleComments(${pIndex})" style="cursor:pointer; color:#3b82f6;">
                            💬 Comment (${post.comments.length})
                        </span>
                    </div>

                    ${
                        post.showComments
                            ? `
                        <div class="comment-section">
                            ${post.comments.map((c, cIndex) => `
                                <div class="reply">
                                    ${c.text}
                                    <div class="reactions">
                                        <span onclick="reactComment(${pIndex}, ${cIndex}, 'up')">👍 ${c.up}</span>
                                        <span onclick="reactComment(${pIndex}, ${cIndex}, 'down')">👎 ${c.down}</span>
                                        <span onclick="reactComment(${pIndex}, ${cIndex}, 'neutral')">😐 ${c.neutral}</span>
                                    </div>
                                </div>
                            `).join("")}

                            <textarea id="comment-${pIndex}" placeholder="Add your comment..."></textarea>
                            <button onclick="addComment(${pIndex})">Post Comment</button>
                        </div>
                        `
                            : ""
                    }
                </div>
            `;
        });
}









