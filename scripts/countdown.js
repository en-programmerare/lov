/* globals

LovnedraknarePresets, config, storageAvailable

 */

(function () {

    let error = false;

    //////////////////////////////////////////////
    //HÄR BÖRJAR KÖRNINGEN
    //////////////////////////////////////////////
    window.addEventListener("load", function () {

        //Ladda in argumenten från URL:en
        let args = parseURLArguments(window.location.href);

        //GroupSettings lagrar inställningen för klass
        //BreakSettings lagrar inställningen för lov
        let groupSettings;
        let breakSetting;

        //Ställ in groupSettings, utifrån URL och förinställningar
        let klassArg = filterURLArgumentsWithKey(args, "klass");
        if (klassArg === undefined) {
            groupSettings = loadStandardSettings();
        } else {
            groupSettings = loadSettings(klassArg.value);
        }

        //Läs  in extraflaggor från URL
        let flagsArg = filterURLArgumentsWithKey(args, "extra");
        let flagBreaks = {
            flagBreaks: [],
            validFlags: []
        };
        if (flagsArg !== undefined) {
            flagBreaks = loadFlagBreaksFromFlagIds(flagsArg.value.split(config.flagsDelimiter), groupSettings.schoolId);
        }
		//Annars kolla standardinställningar
		else {
			if(storageAvailable("localStorage")) {
				let standardFlags = localStorage.getItem(config.localStorageStandardFlags);
				if(standardFlags !== null) {
					flagBreaks = loadFlagBreaksFromFlagIds(standardFlags.split(config.flagsDelimiter), groupSettings.schoolId);
				}
			}
		}
		
        //Ladda in klassens lov och slå ihop skolans och klassens definitioner
        let breaks = consolidateSchoolAndClassBreaks(groupSettings.schoolBreaks, groupSettings.classBreaks, flagBreaks.flagBreaks);

        breaks = createDateObjectsInBreaks(breaks);

        //Ladda in lovinställning från URL
        let lovArg = filterURLArgumentsWithKey(args, "lov");
        if (lovArg === undefined) {
            breakSetting = getStandardBreakValue(breaks);
        } else {
            breakSetting = lovArg.value;
        }

        //Ställ in det lov som ska räknas ner till enligt URL och förinställningar
        let correctBreak = getCountdownBreak(breaks, breakSetting);

        //Skapa händelselyssnare
        setupEventListeners();

        //Om inget lov hittades, meddela detta.
        if (correctBreak.id === config.invalidBreakId) {
            alert("Inget lov hittades. Det verkar inte finnas några framtida lov i denna klass");

            setInformation(config.invalidBreakId, config.invalidBreakId, config.invalidBreakId, "");
            setToastVisible(true, config.informationToastDivId);
            return;
        }

        //Ställ in nedräkningsdatum
        let countdownDate = correctBreak.start.getTime();
        let countdownMessage = LovnedraknareFunctions.getBreakProperties(correctBreak.id).countdownFinished;

        //Ställ in snygg bakgrund o.s.v
        applyStyleSheets(correctBreak);

        //Skriv in informationen i popup-rutan
        setInformation(groupSettings.schoolName, groupSettings.className, groupSettings.fullId, flagBreaks.validFlags.toString());

        //Starta nedräkningen :)
        count(countdownDate, countdownMessage);

        setTimeout(function () {
            count(countdownDate, countdownMessage);
            setInterval(count, 1000, countdownDate, countdownMessage);
        }, 1000 - new Date().getMilliseconds());

        //Kolla om användaren är inne för första gången, och i så fall, visa info
        performFirstVisitOperations();

    });

    //Tar en url och returnerar en lista med key/value par som motsvarar URL:ens argument
    function parseURLArguments(url) {
        if (!url.includes("?"))
            return [];

        const argumentText = url.substring(url.indexOf("?") + 1);
        let args = [];

        argumentText.split("&").forEach(function (argument) {
            let keyValuePair = argument.split("=");
            args.push({
                key: keyValuePair[0],
                value: keyValuePair[1]
            });
        });
        return args;
    }

    //Returnerar det värde som har en viss nyckel i en argumentlista
    function filterURLArgumentsWithKey(args, key) {
        return args.find(function (arg) {
            return arg.key === key;
        });
    }

    //Räkna ner till countdownDate med texten finishedText när det är klart
    function count(countdownDate, finishedText) {
        now = new Date().getTime();
        let distance = countdownDate - now;
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        //lägg in animation här...
        if (distance < 0) {
            document.getElementById(config.countdownDivId).setScriptEscapedText(finishedText);
        } else {
            document.getElementById(config.countdownDivId).setScriptEscapedText(days + "d " + hours + "t " + minutes + "m " + seconds + "s");
        }
    }

    //Ladda klassinställningar med ID, klarar även standard och anpassad
    function loadSettings(id) {
        console.log("Initialise load settings for " + id);
        if (id === undefined) {
            return loadStandardSettings();
        }

        switch (id) {
        case config.customClassId:
            return loadCustomSettings();
        case config.standardClassId:
            return loadStandardSettings();
        default:
            if (id.includes(config.delimiter))
                return loadClassSettings(id);
            else {
                errorOccured();
                return loadStandardSettings();
            }
        }
    }

    //Ladda ett klass-id
    function loadClassSettings(id) {
        console.log("Load class settings: " + id);
        let klassId = id.split(config.delimiter)[0];
        let schoolId = id.split(config.delimiter)[1];

        if (!LovnedraknareFunctions.schoolExists(schoolId) || !LovnedraknareFunctions.classExists(schoolId, klassId)) {
            errorOccured();
            return loadStandardSettings();
        }

        let school = LovnedraknareFunctions.getSchoolFromId(schoolId);

        let klass = LovnedraknareFunctions.getClassFromSchoolAndClassId(schoolId, klassId);

        return {
            schoolName: school.name,
            schoolId: school.id,
            classId: klass.id,
            className: klass.name,
            fullId: id,
            schoolBreaks: school.breaks,
            classBreaks: klass.breaks
        };

    }

    //Ladda anpassade lovinställningar
    function loadCustomSettings() {
        console.log("Load custom settings");
        alert("Kommer snart! Under tiden får du se standardinställningarna.");
        return loadStandardSettings();
    }

    //Ladda standardinställningar, används som fallback
    function loadStandardSettings() {
        console.log("Load standard settings");
        if (storageAvailable("localStorage")) {
            let classId = localStorage.getItem(config.localStorageStandardClass);
            if (classId !== null) {
                if (LovnedraknareFunctions.classIdExists(classId)) {
                    return loadClassSettings(localStorage.getItem(config.localStorageStandardClass));
                }
            }
        }
        return loadClassSettings(config.standard);
    }

    //Slår ihop skolans och klassens lovdefinitioner med extra lovdefinitioner
    function consolidateSchoolAndClassBreaks(schoolBreaks, classBreaks, flagBreaks) {
        let consolidatedBreaks = [];

        classBreaks.forEach(function (classBreak) {
            let correspondingSchoolBreak = schoolBreaks.find(function (schoolBreak) {
                return classBreak.id === schoolBreak.id;
            });

            if (correspondingSchoolBreak === undefined) {
                return;
            }

            let consolidatedBreak = deepCopy(correspondingSchoolBreak);

            for (let property in classBreak) {
                if (property !== "id") {
                    consolidatedBreak[property] = classBreak[property];
                }
            }

            consolidatedBreaks.push(consolidatedBreak);
        });
		
		//Läs in extraflaggor, ersätter vanliga loven
        flagBreaks.forEach(function (flagBreak) {
            let correspondingSchoolBreak = schoolBreaks.find(function (toTest) {
                return toTest.id === flagBreak.id;
            });

            if (correspondingSchoolBreak === undefined) {
                return;
            }

            let consolidatedBreak = deepCopy(correspondingSchoolBreak);

            for (let property in flagBreak) {
                if (property !== "id") {
                    consolidatedBreak[property] = flagBreak[property];
                }
            }

            let index = consolidatedBreaks.findIndex(function (testBreak) {
                return consolidatedBreak.id === testBreak.id;
            });
            index = index === -1 ? consolidatedBreaks.length + 1 : index;
            consolidatedBreaks.splice(index, 1, consolidatedBreak);
        });

        return consolidatedBreaks;
    }

    //Gör om datumsträngarna i lovlistan till datumobjekt
    function createDateObjectsInBreaks(breaks) {
        breaks.forEach(function (lov) {
            lov.start = new Date(lov.startDate + "T" + lov.startTime);
            lov.end = new Date(lov.endDate + "T" + lov.endTime);
        });
        return breaks;
    }

    //Kolla vilket lov som ska användas om URL ej anger något (från förinställningar)
    function getStandardBreakValue(checkWithBreaksList) {
        if (storageAvailable("localStorage")) {
            let standard = localStorage.getItem(config.localStorageStandardBreak);
            if (standard !== null) {
                if (checkWithBreaksList.some(function (check) {
                        return check.id === standard;
                    })) {
                    return standard;
                }
            }
        }
        return config.nextBreakId;
    }

    //Returnera endast ett lov från listan break, som ska räknas ner till enligt breakSetting
    function getCountdownBreak(breaks, breakSetting) {
        console.log("Searching for break " + breakSetting);

        if (breakSetting === config.nextBreakId) {

            let now = new Date().getTime();

            let closest = {
                id: config.invalidBreakId,
                elemClass: config.invalidBreakId,
                backgroundClass: config.invalidBreakId,
                start: new Date("2300-01-01"),
                end: new Date("2300-12-01"),
                title: "Ogiltligt lov"
            };

            breaks.forEach(function (lov) {
                if (lov.end.getTime() > now && closest.start.getTime() > lov.start.getTime()) {
                    closest = lov;
                }
            });

            console.log("Loaded break " + closest.id);
            return closest;

        } else {
            let correctBreak = breaks.find(function (check) {
                return check.id === breakSetting;
            });

            if (correctBreak === undefined) {
                return getCountdownBreak(breaks, config.nextBreakId);
            } else {
                console.log("Loaded break " + correctBreak.id);
                return correctBreak;
            }
        }
    }

    //Hanterar att ett fel uppstod
    function errorOccured() {
        error = true;
        /*
        ATT GÖRA!
        Vettig felhantering
         */
    }

    //Ställ in informationen i popuprutan
    function setInformation(school, group, id, flags) {
        document.getElementById(config.informationSchoolOutputId).setScriptEscapedText(school);
        document.getElementById(config.informationClassOutputId).setScriptEscapedText(group);
        document.getElementById(config.informationIdOutputId).setScriptEscapedText(id);
        if (flags.length > 0)
            document.getElementById(config.informationFlagsOutputId).setScriptEscapedText("med extra val: " + flags);
    }

    //Skapa en djup kopia av ett objekt (koppla loss referenser)
    function deepCopy(object) {
        return JSON.parse(JSON.stringify(object));
    }

    //Kolla om användaren är på sidan för första gången och visa i så fall info
    function performFirstVisitOperations() {
        if (!storageAvailable("localStorage")) {}
        else {
            if (localStorage.getItem(config.localStorageHasVisited) === null) {
                localStorage.setItem(config.localStorageHasVisited, "true");

                setToastVisible(true, config.informationToastDivId);
            }
        }
    }

    //Lägger på rätt CSS för lovet och ställer in titeln.
    function applyStyleSheets(correctBreak) {
        let properties = LovnedraknareFunctions.getBreakProperties(correctBreak.id);

        document.getElementById("countdown").classList.add(properties.elemClass);
        document.body.classList.add(properties.backgroundClass);

        document.title = properties.title;
    }

    //Skapar händelselyssnare
    function setupEventListeners() {
        document.body.addEventListener("click", screenClicked);
    }

    ////////////////////////////////////////////
    //När skärmen klickas på
    ////////////////////////////////////////////
    function screenClicked(event) {
        //Visa/dölj info
        if (!isParentOf(document.querySelector(".toast"), event.target))
            toggleToastsVisible(config.informationToastDivId);
    }

    //Sätter en toastruta med id som på eller av
    function setToastVisible(on, id) {
        for (let toast of document.querySelectorAll(`#${id}.toast`)) {
            if (on)
                toast.classList.remove("inactive");
            else
                toast.classList.add("inactive");
        }
    }

    //Växlar toastrutan id på och av
    function toggleToastsVisible(id) {
        for (let toast of document.querySelectorAll(`#${id}.toast`)) {
            if (toast.matches(".inactive"))
                toast.classList.remove("inactive");
            else
                toast.classList.add("inactive");
        }
    }

    //Kollar om ett DOM-element är förälder till ett annat.
    function isParentOf(parent, child) {
        let node = child;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    function loadFlagBreaksFromFlagIds(flagIds, schoolId) {
        let flagBreaks = [];
        let validFlags = [];

        flagIds.forEach(function (flagId) {

            //Se om flaggan finns
            if (LovnedraknareFunctions.getFlagExistsForSchool(flagId, schoolId)) {
                let flag = LovnedraknareFunctions.getFlagForSchool(flagId, schoolId);
                console.log("Loaded flag " + flag.id);
                validFlags.push(flag.name);

                //Om den finns, för varje lov
                flag.breaks.forEach(function (lov) {

                    //Kolla om ett sådant lov redan definierats i listan
                    if (!flagBreaks.some(function (flagBreak) {
                            return flagBreak.id === lov.id
                        })) {
                        //Om det är odefinierat, lägg till det
                        flagBreaks.push(lov);
                    }
                });
            }
			else {
				console.log("Invalid flag " + flagId);
			}
        });
        return {
            flagBreaks: flagBreaks,
            validFlags: validFlags
        };
    }

})();
