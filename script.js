// 1. Supabase ma'lumotlarini o'zgaruvchiga olamiz
const supabaseUrl = 'https://xhoopiedolojpdkhypfn.supabase.co';
const supabaseKey = 'sb_publishable_3huAanMDccDDQ_2IL6PlNw_zlVYGeQx';

// 2. Mijozni yaratamiz (window.supabase orqali chaqiramiz)
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
let postType = 0;
// simple toast helper (auto‑hides in 1s)
function showToast(msg, duration = 1000) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('visible');
    clearTimeout(t._hide);
    t._hide = setTimeout(() => t.classList.remove('visible'), duration);
}

searchButton.addEventListener('click', async () => {
    const name = searchInput.value.trim();
    displaySearchedPosts(name);
});
// 3. Ulanishni tekshirish uchun kichik test
async function testConnection() {
    try {
        const { data, error } = await _supabase.from('posts').select('*');
        
        if (error) {
            console.error("Ulanishda xato bor:", error.message);
        } else {
            console.log("G'alaba! Bazadan ma'lumot keldi:", data);
        }
    } catch (err) {
        console.error("Kutilmagan xato:", err);
    }
}

async function displayPosts() {
    showToast("Maqolalar yuklanmoqda...");
    const { data: posts, error } = await _supabase.from('posts').select('*');

    if (error) {
        console.error("Xato:", error.message);
        return;
    }

    const container = document.getElementById('post-container');
    container.innerHTML = ''; // Oldingi matnlarni tozalash

    posts.forEach(post => {
        // Har bir maqola uchun HTML yasaymiz
        let postHTML = `<article class="post-card">`
        if (post.image_url) {
             postHTML += `
             <img src="${post.image_url}" alt="${post.title}">`
        }
        postHTML += `
                <h1>${post.title}</h1>
                <p>${post.content}</p>
            </article>
        `;
        container.innerHTML += postHTML; // Sahifaga qo'shish
    });
}

async function displayContacts() {
    showToast("Kontaktlar yuklanmoqda...");
    const { data: Contacts, error } = await _supabase.from('Contacts').select('*');

    if (error) {
        console.error("Xato:", error.message);
        return;
    }

    const container = document.getElementById('contact-container');
    container.innerHTML = ''; // Oldingi matnlarni tozalash

    Contacts.forEach(Contact => {
        // Har bir kontakt uchun HTML yasaymiz
        let ContactHTML = `<article class="contact-card">`
        if (Contact.image) {
             ContactHTML += `
             <a href="${Contact.url}"><img src="${Contact.image}" alt="${Contact.app}"></a>`
        }
        ContactHTML += `
                <h1><a href="${Contact.url}">${Contact.app}</a></h1>
            </article>
        `;
        container.innerHTML += ContactHTML; // Sahifaga qo'shish
    });
}

async function displaySearchedPosts(name) {
    const { data: posts, error } = await _supabase.from('posts').select('*');

    if (error) {
        console.error("Xato:", error.message);
        return;
    }

    const container = document.getElementById('post-container');
    container.innerHTML = ''; // Oldingi matnlarni tozalash
    let post1 = posts.filter(post => post.title.toLowerCase().includes(name.toLowerCase()));
    let post2 = posts.filter(post => post.content.toLowerCase().includes(name.toLowerCase()) && !post1.includes(post));
    post1.forEach(post => {
        // alert("Maqola qidirilmoqda: " + name);
        showToast("Maqola qidirilmoqda: " + name);
        // Har bir maqola uchun HTML yasaymiz
        let postHTML = `<article class="post-card">`
        if (post.image_url) {
             postHTML += `
             <img src="${post.image_url}" alt="${post.title}">`
        }
        postHTML += `
                <h1>${post.title}</h1>
                <p>${post.content}</p>
            </article>
        `;
        container.innerHTML += postHTML; // Sahifaga qo'shish
    });

    post2.forEach(post => {
        // Har bir maqola uchun HTML yasaymiz
        let postHTML = `<article class="post-card">`
        if (post.image_url) {
             postHTML += `
             <img src="${post.image_url}" alt="${post.title}">`
        }
        postHTML += `
                <h1>${post.title}</h1>
                <p>${post.content}</p>
            </article>
        `;
        container.innerHTML += postHTML; // Sahifaga qo'shish
    });
}

const About = document.getElementById('about');

function showhideAbout(){
    if (About.style.display === 'none')
        About.style.display = 'flex';
    else
        About.style.display = 'none';
}
const log = document.getElementById('login');

function showhideLogin(){
    if (log.style.display === 'none')
        log.style.display = 'flex';
    else
        log.style.display = 'none';
}
function login(){

}
showhideAbout();
showhideLogin()
displayContacts();
displayPosts();