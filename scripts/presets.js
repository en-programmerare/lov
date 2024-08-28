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
                    startDate: "2024-10-28",
                    startTime: "16:00",
                    endDate: "2024-11-07",
                    endTime: "00:00"
                }, 
                {
                    id: "jul",
                    startDate: "2024-12-21",
                    startTime: "13:00",
                    endDate: "2025-01-10",
                    endTime: "00:00"
                }, 
                {
                    id: "sport",
                    startDate: "2025-02-24",
                    startTime: "16:00",
                    endDate: "2025-03-06",
                    endTime: "00:00"
                }, 
                {
                    id: "pask",
                    startDate: "2025-04-06",
                    startTime: "16:00",
                    endDate: "2025-04-17",
                    endTime: "00:00"
                }, 
                {
                    id: "sommar",
                    startDate: "2025-06-09",
                    startTime: "12:00",
                    endDate: "2025-08-10",
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
                            id: "sommar"
                        }
                    ]
                }
            ] 
        },
        
        
        
        
        {
            id: "ostragrund",
            name: "Östra grundskolan",
            image: "images/schools/standard.jpg",
            invisible: false,
            breaks: [
                {
                    id: "sommar",
                    startDate: "2025-06-09",
                    startTime: "12:00",
                    endDate: "2025-08-10",
                    endTime: "00:00"
                },
                {
                    id: "host",
                    startDate: "2024-10-25",
                    startTime: "16:00",
                    endDate: "2024-11-04",
                    endTime: "00:00"
                }, 
                {
                    id: "jul",
                    startDate: "2024-12-19",
                    startTime: "13:00",
                    endDate: "2025-01-08",
                    endTime: "00:00"
                }, 
                {
                    id: "sport",
                    startDate: "2025-02-21",
                    startTime: "16:00",
                    endDate: "2025-03-03",
                    endTime: "00:00"
                }, 
                {
                    id: "pask",
                    startDate: "2025-04-11",
                    startTime: "16:00",
                    endDate: "2025-04-22",
                    endTime: "00:00"
                }
                
            ],
            
            
            classes: [
                {
                    name: "9B",
                    id: "9b",
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
                            id: "sommar"
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
