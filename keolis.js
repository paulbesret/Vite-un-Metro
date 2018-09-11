(function () {
    if (typeof Object.defineProperty === 'function') {
        try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e) { }
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
        for (var i = this.length; i;) {
            var o = this[--i];
            this[i] = [].concat(f.call(o, o, i), o);
        }
        this.sort(function (a, b) {
            for (var i = 0, len = a.length; i < len; ++i) {
                if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        });
        for (var i = this.length; i;) {
            this[--i] = this[i][this[i].length - 1];
        }
        return this;
    }
})();

var keolisElement = document.getElementById("test");
// Acc�s aux informations publiques sur le r�seaux Keolis
ajaxGet("https://data.explore.star.fr/api/records/1.0/search//?dataset=tco-metro-circulation-passages-tr&lang=fr&rows=4000&start=0", function (reponse) {
    var keolisData = JSON.parse(reponse);
    var inputDestination = "La Poterie";
    var inputArret = "Charles de Gaulle";
    var passages = keolisData.records
    var passagesArray = []
    var currentHour = new Date().getHours() + ":" + new Date().getMinutes();
    var prochainPassage;


    passages.forEach(function (passage) {
        var heurePassage = new Date(passage.fields.arrivee).getHours() + ":" + new Date(passage.fields.arrivee).getMinutes()

        passagesArray.push({
            ligne: passage.fields.nomcourtligne,
            destination: passage.fields.destination,
            arret: passage.fields.nomarret,
            arrivee: heurePassage
        });
    })

    passagesArray.sortBy(function () { return [this.arrivee] });

    passagesArray.forEach(function (passage) {
        if (passage.destination == inputDestination && passage.arret == inputArret) {
            if (prochainPassage == null) {
                if (passage.arrivee >= currentHour) {
                    prochainPassage = {
                        ligne: passage.ligne,
                        destination: passage.destination,
                        arret: passage.arret,
                        arrivee: passage.arrivee
                    }
                }
            }
        }
    })

    if (prochainPassage != null) {
        result = "Prochain metro pour la station " + inputArret + " en direction de " + inputDestination + " arrivera a " + prochainPassage.arrivee;
    } else {
        result = "Le metro est ferme a cette heure";
    }

    var ligne = document.createElement("p");
    ligne.textContent = result;
    keolisElement.appendChild(ligne);
});