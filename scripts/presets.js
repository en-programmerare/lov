const LovnedraknarePresets = {
   schools: [
      {
         id: "ostra",
         name: "Östra gymnasiet",
         image: "images/schools/ostra.jpg",
         breaks: [
            {
               id: "host",
               startDate: "2022-10-28",
               startTime: "16:00",
               endDate: "2022-11-07",
               endTime: "00:00"
            },
            {
               id: "jul",
               startDate: "2022-12-21",
               startTime: "13:00",
               endDate: "2023-01-10",
               endTime: "00:00"
            },
            {
               id: "sport",
               startDate: "2023-02-24",
               startTime: "16:00",
               endDate: "2023-03-06",
               endTime: "00:00"
            },
            {
               id: "pask",
               startDate: "2023-04-06",
               startTime: "16:00",
               endDate: "2023-04-17",
               endTime: "00:00"
            },
            {
               id: "sommar",
               startDate: "2023-06-12",
               startTime: "10:00",
               endDate: "2023-08-10",
               endTime: "00:00"
            },
            {
               id: "student",
               startDate: "2023-06-12",
               startTime: "10:00",
               endDate: "2023-08-10",
               endTime: "00:00"
            }
         ],
         classes: [
            {
               name: "TETE20",
               id: "tete20",
               breaks: [
                  {
                     id: "host",
                     startTime: "12:35"
                  },
                  {
                     id: "jul"
                  },
                  {
                     id: "sport",
                     startTime: "12:35"
                  },
                  {
                     id: "pask",
                     startTime: "15:30"
                  },
                  {
                     id: "student"
                  }
               ]
            },
            {
               name: "NANASA20",
               id: "nanab20",
               breaks: [
                  {
                     id: "host",
                     startTime: "14:15"
                  },
                  {
                     id: "jul"
                  },
                  {
                     id: "sport",
                     startTime: "14:15"
                  },
                  {
                     id: "pask",
                     startTime: "16:55"
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