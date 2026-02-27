// 1. Supabase ma'lumotlarini o'zgaruvchiga olamiz
const supabaseUrl = 'https://xhoopiedolojpdkhypfn.supabase.co';
const supabaseKey = 'sb_publishable_3huAanMDccDDQ_2IL6PlNw_zlVYGeQx';

// 2. Mijozni yaratamiz (window.supabase orqali chaqiramiz)
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

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

testConnection();
displayPosts();