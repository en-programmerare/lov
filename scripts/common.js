/* globals
LovnedraknarePresets
 */

/*
Konfigurera saker här!
 */
const config = {
    schoolSelectionId: "schoolSelection", //DOM-ID för skolväljaren
    classSelectionId: "classSelection", //DOM-ID för klassväljaren
    breakSelectionId: "breakSelection", //DOM-ID för lovväljaren
    applyButtonId: "applyButton", //DOM-ID för verkställknappen
    shareButtonId: "shareButton", //DOM-ID för dela-url knappen
    countdownDivId: "countdown", //DOM-ID för nedräkningsbehållaren
    shareOutputId: "shareOutput", //DOM-ID för utdata för delning


    delimiter: "@", //Avgränsaren i url mellan <klass><skola>
    flagsDelimiter: ",", //Avgränsaren i flaggorna
    standard: "tete20@ostra", //standard som används om ingen annan nedräkning anges


    localStorageStandardClass: "lovnedraknarenStandard", //nyckel för localStorage, standardklass
    localStorageStandardBreak: "lovnedraknarenStandardLov", //nyckel för localStorage, standardlov
    localStorageHasVisited: "lovnedraknarenVisited", //nyckel för local storage, om första besök
	localStorageStandardFlags: "lovnedraknarenFlags", //nyckel för local storage, om standardflaggor

    urlKeyClass: "klass", //för att specificera klass i url ?klass=tetees20@ostra
    urlKeyBreak: "lov", //för att specificera lov i url ?lov=sommar

    nextBreakId: "nasta", //för att specificera nästa lov i url o.d ?lov=nasta
    customClassId: "anpassad", //för att specificera att anpassad klass används ?klass=anpassad
    standardClassId: "standard", //för att specificera att standardklass används ?klass=standard
    invalidBreakId: "invalid", //indikerar att inget giltligt lov hittats

    informationToastDivId: "properties", //DOM-ID för infotoast
    informationSchoolOutputId: "schoolInformationOutput", //DOM-ID för skolinfo output
    informationClassOutputId: "classInformationOutput", //DOM-ID för klassinfo output
    informationIdOutputId: "idInformationOutput", //DOM-ID för klass-ID-info output
    informationFlagsOutputId: "flagsInformationOutput" //DOM-ID för extraflaggor-info output
};

const LovnedraknareFunctions = {
    /*
    Fullt klass-ID specificerar skola och klass
    Enkelt klass-ID specificerar endast klass, och förutsätter att man känner till skolan.
     */

    //Returnerar referens till skolan med ett visst id
    getSchoolFromId: function (id) {
        return LovnedraknarePresets.schools.find(function (school) {
            return school.id === id;
        });
    },

    //Returnerar referens till klassen med ett visst fullt id
    getClassFromId: function (id) {
        let school = this.getSchoolFromId(id.split(config.delimiter)[1]);

        if (school === undefined)
            return undefined;

        return getClassFromSchoolReferenceAndId(school, id.split(config.delimiter)[0]);

        //Inre funktion
        function getClassFromSchoolReferenceAndId(school, id) {
            return school.classes.find(function (klass) {
                return klass.id === id;
            });
        }
    },

    //Kontrollera om klassen med ett visst fullt id finns
    classIdExists: function (id) {
        return this.getClassFromId(id) !== undefined;
    },

    //Kontrollera om skolan-id har en klass vid namn klass-id ()
    classExists: function (schoolId, classId) {
        return this.classIdExists(this.assembleClassId(schoolId, classId));
    },

    //Få referens till en klass med enkelt id som finns i skolan med visst id
    getClassFromSchoolAndClassId: function (schoolId, classId) {
        return this.getClassFromId(this.assembleClassId(schoolId, classId));
    },

    //Bygg fullt klass-id av skol-id och enkelt klass-id
    assembleClassId: function (schoolId, klassId) {
        return klassId + config.delimiter + schoolId;
    },

    getSchoolFromClassId: function (id) {
        return this.getSchoolFromId(id.split(config.delimiter)[1]);
    },

    //Kollar om skolan med ett visst ID finns
    schoolExists: function (schoolId) {
        return LovnedraknarePresets.schools.some(function (school) {
            return school.id === schoolId;
        });
    },

    breakExistsForClass: function (breakId, classId) {
        if (breakId === "nasta")
            return true;

        return this.getClassFromId(classId).breaks.find(function (lov) {
            return lov.id === breakId;
        });
    },

    getBreakProperties: function (breakId) {
        return LovnedraknarePresets.breaks.find(function (check) {
            return breakId === check.id;
        });
    },

    getFlagExistsForSchool: function (flagId, schoolId) {
        if (!this.schoolExists(schoolId))
            return false;
        if (this.getSchoolFromId(schoolId).flags === undefined)
            return false;
        return this.getSchoolFromId(schoolId).flags.some(function (flag) {
            return flag.id === flagId;
        });
    },

    getFlagForSchool: function (flagId, schoolId) {
        return this.getSchoolFromId(schoolId).flags.find(function (flag) {
            return flag.id === flagId;
        });
    }
};

/*
Hämtad från MDN docs.
Kollar om local- / session-storage är tillgängligt
 */
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === "QuotaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        (storage && storage.length !== 0);
    }
}

window.addEventListener("load", function () {

    console.log("%cInte ens här slipper man undan comic sans", "font-family: 'Comic sans MS', mono;");
});

Element.prototype.setScriptEscapedText = function(text) {
	this.innerText = text.replace(/[\<\>\(\)\"\'`]/gm, "");
}