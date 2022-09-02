/* globals

LovnedraknarePresets, storageAvailable, config, LovnedraknareFunctions

 */

"use strict";

(function () {

    ///////////////////////////////////////////////////////////////////////////////////////
    //HÄR BÖRJAR KODEN KÖRAS
    ///////////////////////////////////////////////////////////////////////////////////////

    //Ändras vid loadOperations
    let storedFlagSettings = "";

    window.addEventListener("load", function () {
        //Kolla att replaceChildren är implementerad i webbläsaren.
        if (typeof Element.prototype.replaceChildren === "undefined")
            alert("Din webbläsare är för gammal! Vissa saker funkar nog inte som de ska.");

        setupEventListeners();
        loadSchoolsIntoSchoolSelection();

        applyLocalStorageSettings();

    });

    //Laddar in skolorna i LovnedraknarePresets till skolväljaren
    function loadSchoolsIntoSchoolSelection() {
        let schoolSelectionElem = document.getElementById(config.schoolSelectionId);
        schoolSelectionElem.replaceChildren();

        let defaultOption = document.createElement("OPTION");
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.id = "defaultSchoolSelectionOption";
        defaultOption.value = "invalid";
        defaultOption.innerText = "Skola...";

        schoolSelectionElem.appendChild(defaultOption);

        let schools = LovnedraknarePresets.schools.sort(function (a, b) {
            return a.name.localeCompare(b.name, "sv");
        });

        schools.forEach(function (school) {

            let option = document.createElement("OPTION");
            option.value = school.id;
            option.innerText = school.name;

            schoolSelectionElem.appendChild(option);
        });
    }

    //Laddar in klasserna för skolan med angivet id till klassväljaren
    function loadClassesIntoClassSelection(schoolId) {
        document.getElementById(config.classSelectionId).replaceChildren();
        let school = LovnedraknarePresets.schools.find(function (school) {
            return school.id === schoolId;
        });

        let classes = school.classes.sort(function (a, b) {
            return a.name.localeCompare(b.name, "sv");
        });
        classes.forEach(function (klass) {
            let option = document.createElement("OPTION");
            option.value = klass.id;
            option.innerText = klass.name;

            document.getElementById(config.classSelectionId).appendChild(option);
        });

    }

    //Laddar in loven för en angiven klass (fullt id) till lovväljaren
    function loadBreaksIntoBreakSelection(klassId) {
        let klass = LovnedraknareFunctions.getClassFromId(klassId);

        let breakSelectionElem = document.getElementById(config.breakSelectionId);

        breakSelectionElem.replaceChildren();

        let standardOption = document.createElement("option");
        standardOption.value = "nasta";
        standardOption.innerText = "Närmaste lov";
        breakSelectionElem.appendChild(standardOption);

        klass.breaks.forEach(function (lov) {
            let preBreak = LovnedraknarePresets.breaks.find(function (predefinedBreak) {
                return predefinedBreak.id === lov.id;
            });

            let option = document.createElement("option");
            option.value = preBreak.id;
            option.innerText = preBreak.name.charAt(0).toUpperCase() + preBreak.name.substring(1);

            breakSelectionElem.appendChild(option);
        });
    }

    //Skapar alla händelselyssnare
    function setupEventListeners() {
        let schoolSelectionElem = document.getElementById(config.schoolSelectionId);
        let classSelectionElem = document.getElementById(config.classSelectionId);
        let breakSelectionElem = document.getElementById(config.breakSelectionId);
        let applyButtonElem = document.getElementById(config.applyButtonId);
        let shareButtonElem = document.getElementById(config.shareButtonId);

        schoolSelectionElem.addEventListener("change", schoolSelectionChanged);
        classSelectionElem.addEventListener("change", classSelectionChanged);
        classSelectionElem.addEventListener("dblclick", classSelectionDoubleClicked);
        breakSelectionElem.addEventListener("change", breakSelectionChanged);
        applyButtonElem.addEventListener("click", applyButtonPressed);
        shareButtonElem.addEventListener("click", shareButtonPressed);

    }
    ///////////////////////////////////////////////////////
    //NÄR EN SKOLA HAR VALTS
    ///////////////////////////////////////////////////////
    function schoolSelectionChanged() {

        let schoolSelectionElem = document.getElementById(config.schoolSelectionId);
        let classSelectionElem = document.getElementById(config.classSelectionId);
        let breakSelectionElem = document.getElementById(config.breakSelectionId);

        //Kontrollera att en option är vald
        if (schoolSelectionElem.value !== undefined) {
            //Kolla att skolan som valt faktiskt finns
            if (LovnedraknareFunctions.schoolExists(schoolSelectionElem.value)) {

                //Om det är rätt, slå på klassväljaren och ladda in skolans klasser
                setClassSelectionEnabled(true);
                loadClassesIntoClassSelection(schoolSelectionElem.value);
            }
            //Om nåt har gått fel, slå av klassväljaren
            else {
                setClassSelectionEnabled(false);
            }
        } else {
            setClassSelectionEnabled(false);
        }

        //Uppdatera även classSelection
        classSelectionElem.dispatchEvent(new Event("change"););

        //Slå av och på klassväljaren
        function setClassSelectionEnabled(on) {
            classSelectionElem.disabled = !on;

            if (!on) {
                classSelectionElem.replaceChildren();
            }
        }
    }

    ///////////////////////////////////////////////////////
    //NÄR EN KLASS HAR VALTS
    ///////////////////////////////////////////////////////

    function classSelectionChanged() {

        let schoolSelectionElem = document.getElementById(config.schoolSelectionId);
        let classSelectionElem = document.getElementById(config.classSelectionId);
        let breakSelectionElem = document.getElementById(config.breakSelectionId);

        //Kontrollera att en option är vald
        if (classSelectionElem.value !== undefined) {
            //Kolla att klassen som valt faktiskt finns
            if (LovnedraknareFunctions.classExists(schoolSelectionElem.value, classSelectionElem.value)) {

                //Om det är rätt, slå på lovväljaren och ladda in skolans klasser
                setBreakSelectionEnabled(true);
                loadBreaksIntoBreakSelection(LovnedraknareFunctions.assembleClassId(schoolSelectionElem.value, classSelectionElem.value));
            }
            //Om nåt har gått fel, slå av lovväljaren
            else {
                setBreakSelectionEnabled(false);
            }
        } else {
            setBreakSelectionEnabled(false);
        }

        //Uppdatera även breakSelection
        breakSelectionElem.dispatchEvent(new Event("change"););

        //Slå av och på lovväljaren
        function setBreakSelectionEnabled(on) {

            breakSelectionElem.disabled = !on;

            if (!on) {
                breakSelectionElem.replaceChildren();
            }
        }
    }

    ///////////////////////////////////////////////////////
    //NÄR ETT LOV HAR VALTS
    ///////////////////////////////////////////////////////
    function breakSelectionChanged() {
        toggleApplyButton(isSelectionCorrect());
        toggleShareButton(isSelectionCorrect());

        function toggleApplyButton(on) {
            document.getElementById(config.applyButtonId).disabled = !on;
        }
        function toggleShareButton(on) {
            document.getElementById(config.shareButtonId).disabled = !on;

            document.getElementById(config.shareOutputId).innerText = "";
        }

    }

    ///////////////////////////////////////////////////////
    //NÄR EN KLASS HAR DUBBELKLICKATS PÅ
    ///////////////////////////////////////////////////////
    function classSelectionDoubleClicked() {
        let answer = prompt("Extrainställningar", storedFlagSettings);
        if (answer !== null && storageAvailable("localStorage")) {
            localStorage.setItem(config.localStorageStandardFlags, answer);
            storedFlagSettings = answer;
        }

        if (answer === "") {
            localStorage.removeItem(config.localStorageStandardFlags);
        }
    }

    function isSelectionCorrect() {
        let schoolSelection = document.getElementById(config.schoolSelectionId).value;
        let classSelection = document.getElementById(config.classSelectionId).value;
        let breakSelection = document.getElementById(config.breakSelectionId).value;

        if (schoolSelection === undefined || !LovnedraknareFunctions.schoolExists(schoolSelection)) {
            return false;
        }
        if (classSelection === undefined || !LovnedraknareFunctions.classExists(schoolSelection, classSelection)) {
            return false;
        }
        if (breakSelection === undefined || !LovnedraknareFunctions.breakExistsForClass(breakSelection, LovnedraknareFunctions.assembleClassId(schoolSelection, classSelection))) {
            return false;
        }
        return true;
    }

    function applyButtonPressed() {
        if (isSelectionCorrect()) {

            let schoolSelection = document.getElementById(config.schoolSelectionId).value;
            let classSelection = document.getElementById(config.classSelectionId).value;
            let breakSelection = document.getElementById(config.breakSelectionId).value;

            if (storageAvailable("localStorage")) {
                localStorage.setItem(config.localStorageStandardClass, LovnedraknareFunctions.assembleClassId(schoolSelection, classSelection));
                localStorage.setItem(config.localStorageStandardBreak, breakSelection);

                window.location.assign("./");
            } else {
                window.location.assign(getUrlFromSelection());
            }

        } else {
            alert("Dina val verkar inte vara korrekta. Det beror förmodligen på en bugg (som kan ha rymt från danstävlingen) eller att du har lekt med CTRL+Skift+I.");
        }
    }

    function shareButtonPressed() {
        let url = getUrlFromSelection();

        if (url === "invalid") {
            alert("Dina val är felaktiga");
            return;
        }

        let textField = document.createElement("input");
        textField.type = "text";
        textField.value = url;

        textField.select();
        textField.setSelectionRange(0, 99999); //för mobiltelefoner

        navigator.clipboard.writeText(textField.value);

        document.getElementById(config.shareOutputId).innerHTML = "Länk&nbsp;kopierad&nbsp;till&nbsp;urklipp!";

    }

    function getUrlFromSelection() {
        if (isSelectionCorrect()) {
            let schoolSelection = document.getElementById(config.schoolSelectionId).value;
            let classSelection = document.getElementById(config.classSelectionId).value;
            let breakSelection = document.getElementById(config.breakSelectionId).value;

            let url = window.location.href;
            url = url.substring(0, url.lastIndexOf("/"));

            url += `?${config.urlKeyClass}=${LovnedraknareFunctions.assembleClassId(schoolSelection, classSelection)}`;
            url += `&${config.urlKeyBreak}=${breakSelection}`;

            if (storedFlagSettings.length > 0) {
                url += `&extra=${storedFlagSettings}`;
            }
            return url;
        } else {
            return "invalid";
        }
    }

    function applyLocalStorageSettings() {
        if (storageAvailable("localStorage")) {
            let classId = localStorage.getItem(config.localStorageStandardClass);
            let breakId = localStorage.getItem(config.localStorageStandardBreak);
            let flagSettings = localStorage.getItem(config.localStorageStandardFlags);

            let schoolSelectionElem = document.getElementById(config.schoolSelectionId);
            let classSelectionElem = document.getElementById(config.classSelectionId);
            let breakSelectionElem = document.getElementById(config.breakSelectionId);

            if (classId !== null && breakId !== null) {
                schoolSelectionElem.value = LovnedraknareFunctions.getSchoolFromClassId(classId).id;
                schoolSelectionElem.dispatchEvent(new Event("change"));

                classSelectionElem.value = LovnedraknareFunctions.getClassFromId(classId).id;
                classSelectionElem.dispatchEvent(new Event("change"));

                breakSelectionElem.value = breakId;
                breakSelectionElem.dispatchEvent(new Event("change"));

            }

            if (flagSettings !== null) {
                storedFlagSettings = flagSettings;
            }
        }
    }

})();
