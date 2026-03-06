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



// authentication UI toggle and handler

async function signOut() {
    const { error } = await _supabase.auth.signOut();
    
    if (error) {
        console.error("Chiqishda xato:", error.message);
    } else {
        alert("Siz tizimdan chiqdingiz!");
    }
}

function autoheight(element){
    element.style.height = "10px";
    element.style.height = (element.scrollHeight) + "px";
}

let isLoginMode = true;

function toggleMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const mainBtn = document.getElementById('main-btn');
    const confirmGroup = document.getElementById('confirm-group');
    const toggleLink = document.querySelector('#toggle-text a');

    if (isLoginMode) {
        title.innerText = "Kirish";
        mainBtn.innerText = "Kirish";
        confirmGroup.style.display = "none";
        toggleLink.innerText = "Ro'yxatdan o'tish";
    } else {
        title.innerText = "Ro'yxatdan o'tish";
        mainBtn.innerText = "Ro'yxatdan o'tish";
        confirmGroup.style.display = "block";
        toggleLink.innerText = "Kirishga qaytish";
    }
}
const addpost = document.getElementById("addpost");
addpost.style.display = "none";

async function handleAuth() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirm-password').value.trim();

    if (!email || !password) {
        showToast("E-mail va parolni kiriting");
        return;
    }
    if (!isLoginMode && password !== confirm) {
        showToast("Parollar mos emas");
        return;
    }

    if (isLoginMode) {
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) showToast(error.message);
        else 
            {
                showToast("Kirish muvaffaqiyatli");
            }
        
    } else {
        const { data, error } = await _supabase.auth.signUp({ email, password });
        if (error) showToast(error.message);
        else showToast("Ro'yxatdan o'tish muvaffaqiyatli");
    }
}
// post malumotlari
const postheader = document.getElementById('post-header');
const posttext = document.getElementById('post-text');
// rasm yuklash
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('post-image');
let image="";

fileInput.addEventListener('change', function() {
    const file = this.files[0]; // Tanlangan birinchi faylni olish

    if (file) {
        const reader = new FileReader(); // Faylni o'qish uchun obyekt

        reader.onload = function(e) {
            preview.src = e.target.result; // Rasmni URL ko'rinishida yuklash
            preview.style.display = 'block'; // Rasmni ko'rinadigan qilish
            preview.style.objectFit = 'cover'; // Rasmni ko'rinadigan qilish
        }

        reader.readAsDataURL(file); // Faylni o'qishni boshlash
    }
});

// Images For MyBlog
async function uploadImage() {
    const file = fileInput.files[0];
    if(postheader.value=="" || posttext=="")
        {
            showToast("Bo'sh maydonlarni to'ldiring!");
            return;
        }
        if(!document.getElementById("insimage").checked){
            image = "";
            post();
            return;
        }
    if (!file) {
        alert("Iltimos, avval rasm tanlang!");
        return;
    }
    showToast("rasmni serverga yuklash!");
    // Fayl nomi takrorlanmasligi uchun vaqt belgisini qo'shamiz
    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await _supabase.storage
        .from('Images For MyBlog') // Bucket nomi
        .upload(fileName, file);

    if (error) {
        console.error("Yuklashda xato:", error.message);
        alert("Xatolik yuz berdi!");
    } else {
        console.log("Muvaffaqiyatli yuklandi:", data);
        
        // Yuklangan rasmning URL manzilini olish
        const { data: publicUrlData } = _supabase.storage
            .from('Images For MyBlog')
            .getPublicUrl(fileName);
        
        image = publicUrlData.publicUrl;
        console.log("Rasm URL manzili:", image);
        alert("Rasm muvaffaqiyatli yuklandi!");
        post();
    }
}

//   Maqola joylash >>>
async function post() {
    // 1. Ma'lumotlarni bazaga yuborish
    showToast(postheader.value + ' ' + posttext.value);
    const { data, error } = await _supabase
        .from('posts')
        .insert([
            { 
                title: postheader.value, 
                content: posttext.value, 
                image_url: image,
                type: document.getElementById("post-type").checked
            }
        ]);

    if (error) {
        console.error("Xatolik yuz berdi:", error.message);
        showToast("Maqolani joylashda xato!");
    } else {
        console.log("Muvaffaqiyatli joylandi:", data);
        showToast("G'alaba! Maqola serverga joylandi.");
        
        // Sahifani yangilash (yangi maqola ko'rinishi uchun)
        window.location.reload();
    }
}
let showtype = 0;
_supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    console.log("Foydalanuvchi tizimda:", session.user.email);
    // Masalan: Admin panelni ko'rsatish
    authContainer.style.display = 'none'
    document.getElementById('aut').innerText = "Maqola Yaratish";
    showtype = 1;
    
    
    // UUID tekshiruvi (Aynan siz ekanligingizni bilish uchun)
    if (session.user.id === '8af31309-2532-400c-a93e-a479548a879e') {
        console.log("Xush kelibsiz, Admin!");
        addpost.style.display = "flex";
    }
  } else {
    console.log("Foydalanuvchi tizimda emas");
    // Masalan: Login formasini ko'rsatish
    showToast('Siz mehmon sifatida kirdingiz, boshqa sherlarni o\'qish uchun ro\'yxatdan o\'ting.',2500);
    showtype = 0;
    addpost.style.display = "none";
    document.getElementById('aut').innerText = "Kirish";
  }
  reload();
});

const About = document.getElementById('about');
const authContainer = document.getElementById('auth-container');

function showhideAbout(){
    showToast(' login showing');
    if (About.style.display === 'none')
        About.style.display = 'flex';
    else
        About.style.display = 'none';
}

function showhideLogin(){
    if(showtype === 1)
    {   if (addpost.style.display === 'none')
        addpost.style.display = 'flex';
    else
        addpost.style.display = 'none';
    }
    else{
        if (authContainer.style.display === 'none')
        authContainer.style.display = 'flex';
    else
        authContainer.style.display = 'none';
    }
}
function showhidePost(){
    showToast('post showing');
    if (addpost.style.display === 'none')
        addpost.style.display = 'flex';
    else
        addpost.style.display = 'none';
}
const inimage = document.getElementsByClassName("inimage");

function showhideinimage(inimagedisplay){
    for (const element of inimage) {
        if (inimagedisplay)
            element.style.display = "block";
        else
            element.style.display = "none"
    }
}
showhideinimage(false)
showhideAbout();
reload();

function reload(){
    displayContacts();
    displayPosts();
}