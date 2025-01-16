import {setCookieWithExpireHour,getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/cookie.js";
import {postJSON} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/url.js";
import {addCSSInHead,addJSInHead} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';
   
   
await addCSSInHead("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");
   
const url="https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/auth/users";
   
const client_id="981593361501-t6aa598ahgqq8149kst14me2cu2ihkeo.apps.googleusercontent.com";
   
// Panggil fungsi untuk menambahkan elemen
appendGoogleSignin(client_id,url);
   
   
// Buat fungsi untuk memanggil gsi js dan menambahkan elemen div ke dalam DOM
async function appendGoogleSignin(client_id, url) {
    try {
        // Memuat script Google Sign-In
        await addJSInHead("https://accounts.google.com/gsi/client");
        // Menginisialisasi Google Sign-In dan menetapkan gSignIn sebagai callback
        google.accounts.id.initialize({
            client_id: client_id,
            callback:  (response) => gSignIn(response, url), // Menggunakan gSignIn sebagai callback untuk Google Sign-In
        });
        // Memunculkan pop-up Google Sign-In
        google.accounts.id.prompt();
        console.log('Google Sign-In open successfully!');
    } catch (error) {
        console.error('Failed to load Google Sign-In script:', error);
    }
}
   
async function gSignIn(response, url) {
    try {
        const gtoken = { token: response.credential };
        await postJSON(url, "login", getCookie("login"), gtoken, responsePostFunction);
    } catch (error) {
        console.error("Network or JSON parsing error:", error);
        Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "An error occurred while trying to log in. Please try again.",
        });
    }
}
   
function responsePostFunction(response) {
    if (response.status === 200 && response.data) {
        console.log(response.data);
        setCookieWithExpireHour('login',response.data.token,18);
        redirect("/qr");
    } else {
        console.error("Login failed:", response.data?.message || "Unknown error");
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: response.data?.message || "Anda belum terdaftar dengan login google, silahkan tap atau scan qr dahulu untuk pendaftaran.",
        }).then(() => {
            redirect("/login");
        });
    }
}