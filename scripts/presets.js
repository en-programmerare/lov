const LovnedraknarePresets = {
    schools: [
        {
            id: "standard",
            name: "Standard",
            image: "images/schools/standard.jpg",
            invisible: true,
            breaks: [
                {
                    id: "host",
                    startDate: "2023-10-28",
                    startTime: "16:00",
                    endDate: "2023-11-07",
                    endTime: "00:00"
                }, 
                {
                    id: "jul",
                    startDate: "2023-12-21",
                    startTime: "13:00",
                    endDate: "2024-01-10",
                    endTime: "00:00"
                }, 
                {
                    id: "sport",
                    startDate: "2024-02-24",
                    startTime: "16:00",
                    endDate: "2024-03-06",
                    endTime: "00:00"
                }, 
                {
                    id: "pask",
                    startDate: "2024-04-06",
                    startTime: "16:00",
                    endDate: "2024-04-17",
                    endTime: "00:00"
                }, 
                {
                    id: "sommar",
                    startDate: "2024-06-09",
                    startTime: "12:00",
                    endDate: "2024-08-10",
                    endTime: "00:00"
                }
            ],
            
            
            classes: [
                {
                    name: "Standard",
                    id: "generic",
                    breaks: [
                        {
                            id: "host"
                        }, 
                        {
                            id: "jul"
                        }, 
                        {
                            id: "sport"
                        }, 
                        {
                            id: "pask"
                        }, 
                        {
                            id: "student"
                        }
                    ]
                }
            ] 
        }
    ],
    
    
    breaks: [
        {
            id: "host",
            name: "höstlov",
            elemClass: "host",
            backgroundClass: "hostBakgrund",
            teaser: "Snart är det höstlov!",
            countdownFinished: "Nu är det höstlov!",
            title: "Höstlovsnedräknaren"
        },
        {
            id: "jul",
            name: "jullov",
            elemClass: "jul",
            backgroundClass: "julBakgrund",
            teaser: "Snart är det jullov!",
            countdownFinished: "Nu är det jullov!",
            title: "Jullovsnedräknaren"
        },
        {
            id: "sport",
            name: "sportlov",
            elemClass: "sport",
            backgroundClass: "sportBakgrund",
            teaser: "Snart är det sportlov!",
            countdownFinished: "Nu är det sportlov!",
            title: "Sportlovsnedräknaren"
        },
        {
            id: "pask",
            name: "påsklov",
            elemClass: "pask",
            backgroundClass: "paskBakgrund",
            teaser: "Snart är det påsklov!",
            countdownFinished: "Nu är det påsklov!",
            title: "Påsklovsnedräknaren"
        },
        {
            id: "sommar",
            name: "sommarlov",
            elemClass: "sommar",
            backgroundClass: "sommarBakgrund",
            teaser: "Snart är det sommarlov!",
            countdownFinished: "Nu är det sommarlov!",
            title: "Sommarlovsnedräknaren"
        },
        {
            id: "student",
            name: "student",
            elemClass: "student",
            backgroundClass: "studentBakgrund",
            teaser: "Snart tar vi studenten!",
            countdownFinished: "Nu har vi tagit studenten!",
            title: "Studentnedräknaren"
        }
    ]
};
