// Ex�cute un appel AJAX GET
// Prend en param�tres l'URL cible et la fonction callback appel�e en cas de succ�s
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la r�ponse de la requ�te
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur r�seau avec l'URL " + url);
    });
    req.send(null);
}

function afficher(reponse) {
    console.log(reponse);
}

//ajaxGet("http://localhost/javascript-web-srv/data/langages.txt", afficher);