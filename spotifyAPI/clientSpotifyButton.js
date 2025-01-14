document.addEventListener("DOMContentLoaded", function () {
    const spotifyAuthSongs = document.getElementById('spotifyAuthSongs');
    
    function requestPageAuthorization() {
        localStorage.setItem("client_id", process.env.CLIENT_ID);
        
        window.location.href = 'http://localhost:3030/auth/spotify';
    }

    spotifyAuthSongs.addEventListener("click", requestPageAuthorization);
});
