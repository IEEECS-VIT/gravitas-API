angular
  .module('EventsApp', [])
  .controller('FormCtrl', function($scope, $http, $timeout) {
    $scope.eventTypes = ["Bioxyn", "Circuitrix", "School", "Applied", "Builtrix", "Online", "Workshop", "Premium", "Bits", "Robomania", "Manage", "Quiz"];
    $scope.chapterNames = ["Society of Automotive Engineers India-VIT", "Students for the Exploration and Development of Space-VIT", "International Society of Automation", "The Instrument Society of India Students' Chapter",
      "Indian Society for Technical Education Students Chapter", "IETE Students' Chapter", "Association for Computing Machinery", "Computer Society of India", "Google Developers Group Club",
      "Institution Electrical & Electronics Engineering Students' Chapter", "IEEE Women in Engineering", "American Society of Civil Engineers", "CompBio Discussion Group-India", "VIT Materials Advantage",
      "American Society of Mechanical Engineers", "Engineering in Medicine & biology Society", "IEEE Professional Communication Society", "The Institution of Engineering and Technology (F)", "IEEE Computer Society",
      "Institution of Engineers India Students' Chapter", "IEEE - Electron Devices Society", "IEEE Power and Energy Society", "Indian Institute of Chemical Engineers", "Society of Manufacturing Engineers",
      "Oikos International- Vellore Chapter", "IEEE-Robotics & Automation Society", "American Institute of Chemical Engineers", "Optical Society of America", "IEEE Nuclear and Plasma Sciences and Society VIT Student Chapter", "CODECHEF",
      "Association of Energy Engineers", "IEEE Signal Processing Society", "IEEE-Microwave Theory and Techniques Society"
    ];
    $scope.clubNames = ["Youth Red Cross Association", "Debate Society", "Dance club", "Environment & Energy Protection Club", "Music Club", "Health Club", "Dramatics club", "RoboVITics", "National Service Scheme", "Entrepreneurs cell Club",
      "Quiz Club", "The Hindu Education plus Club", "VIT Animation Club", "Trekking Club", "Creativity club", "VIT Film Society", "Photographic Club", "Fine Arts Club", "Students’ Association of Bio-Engineering Science and Technology",
      "Technology and Gaming Club", "VIT Spartans", "FEP - SI", "Kalvi we nurture tomorrow", "Juvenile Care", "Uddeshya", "Cool the World", "Make A Difference", "Tamil Literary Association", "English Literary Association",
      "Telugu Literary Association (Sahiti)", "Hindi Literary Association", "Kannada Kasthuri (KLA)", "Year Book", "TEDxVIT", "The Electronics Club", "Centre for Social Entrepreneurship Development", "VIT Culinary Club", "Ayuda",
      "Rotaract Club", "Toastmasters International Chapter", "Anokha", "Becoming I Foundation", "Innovator's Quest", "Nature Lover’s Club", "VIT Community Radio", "Deccan Chronicle Club", "Fifth Pillar",
      "International Association of Students in Economic and Commercial Sciences", "Lions Club of Vellore Galaxy", "Mozilla Firefox", "iOS Developer Community by Apple University Program"
    ];
    $scope.schoolNames = ["CBST", "CDMM", "CNBT", "CNR", "O/o-IR", "O/o-SR", "O/o-VC", "SAS", "SBST", "SCALE", "SCOPE", "SELECT", "SENSE", "SITE", "SMBS", "SMEC", "SSL", "TIFAC", "VITBS", "VSPARC"];
    $scope.collNames = $scope.chapterNames;
    $scope.collNames = $scope.collNames.concat($scope.clubNames);

    function init() {
      $scope.formdata = {
        team: "false",
        coordinators: [{
          name: "",
          regno: "",
          phone: "",
          email: "",
          room: ""
        }],
        event: {
          org: {
            coll: null
          }
        },
        finance: {
          prize: {
            total: 0,
            breakdown: [{
              amount: 0
            }]
          },
          sponsorship: {
            breakdown: null
          }
        }
      };
      $scope.formdata.event.org.coll = [{
        name: ""
      }, {
        name: ""
      }];
      $scope.formdata.finance.sponsorship.breakdown = [{
        source: "",
        sponsorship_type: "",
        amount: 0
      }];
      $scope.formdata.guest = [{
        name: "",
        travel: {
          amount: 0,
          from: ""
        },
        stay: {
          duration: 0
        },
        food: {
          units: 0
        }
      }];
      $scope.stat = "";
      $scope.org = "Individual";
    }

    function dup() {
      var temp = $scope.formdata.event.org.coll;
      for (var i = 0; i < temp.length; i++) {
        for (var j = i + 1; j < temp.length; j++) {
          if (temp[i].name == temp[j].name) {
            toast("The collaboration contains duplicate entry! Please correct that and retry submitting the form.", 4000);
            return true;
          }
        }
      }
    }
    init();
    $scope.totalPrize = function() {
      var temp = 0;
      for (var i = 0; i < $scope.formdata.finance.prize.breakdown.length; i++) {
        temp += $scope.formdata.finance.prize.breakdown[i].amount;
      }
      $scope.formdata.finance.prize.total = temp;
    }
    $scope.addColl = function() {
      $scope.formdata.event.org.coll.push({
        name: ""
      });
    };
    $scope.delColl = function(v) {
      if ($scope.formdata.event.org.coll.length == 2) {
        toast("A collaboration requires atleast 2 clubs(chapters).");
      } else {
        $scope.formdata.event.org.coll.splice(v, 1);
      }
    };

    $scope.addBreak = function() {
      if ($scope.formdata.finance.prize.breakdown.length == 3) {
        toast("There can be maximum of 3 Prizes", 4000);
      } else {
        $scope.formdata.finance.prize.breakdown.push({
          amount: 0
        });
        toast("Prize Breakdown Added!", 3500);
      }
    }

    $scope.delBreak = function(v) {
      if ($scope.formdata.finance.prize.breakdown.length != 1) {
        $scope.formdata.finance.prize.breakdown.splice(v, 1);
      } else {
        toast("Atleast one prize money breakdown is required.", 4000);
      }
      $scope.totalPrize();
    };

    $scope.addCoord = function() {
      if ($scope.formdata.coordinators.length == 3) {
        toast("An event can have max of 3 coordinators.", 4000);
      } else {
        $scope.formdata.coordinators.push({
          name: "",
          regno: "",
          phone: "",
          email: "",
          room: ""
        });
        toast("Coordinator field added!", 4000);
      }
    };

    $scope.delCoord = function(n) {
      if ($scope.formdata.coordinators.length == 1) {
        toast("An event needs atleast 1 coordinator.", 4000);
      } else {
        $scope.formdata.coordinators.splice(n, 1);
      }
    }

    toast = function(text, time) {
      time = typeof(time) !== 'undefined' ? time : 3500;
      var t = document.getElementsByClassName('message-container').length;
      var toastElement = document.createElement('div');
      toastElement.setAttribute('class', 'message-container');
      var toastBox = document.createElement('div');
      toastBox.setAttribute('class', 'message-box');
      toastBox.innerText = text;
      toastElement.appendChild(toastBox);
      toastElement.style.setProperty("top", (10 + t * 50).toString() + "px");
      document.body.appendChild(toastElement);
      $timeout(function() {
        document.body.removeChild(toastElement);
      }, time);
    }

    $scope.addSpon = function() {
      $scope.formdata.finance.sponsorship.breakdown.push({
        source: "",
        sponsorship_type: "",
        amount: 0
      });
    };

    $scope.delSpon = function(v) {
      $scope.formdata.finance.sponsorship.breakdown.splice(v, 1);
    };

    $scope.addGuest = function() {
      var obj = {
        name: "",
        travel: {
          amount: 0,
          from: ""
        },
        stay: {
          duration: 0
        },
        food: {
          units: 0
        }
      };
      $scope.formdata.guest.push(obj);
    };

    $scope.delGuest = function(v) {
      $scope.formdata.guest.splice(v, 1);
    };

    $scope.sub = function() {
     console.log("sub() : called");
      //  Converting array of objects to array items.(ng-repeat doesnt allow duplicate array items.)
      var temp = [];
      for (var i = 0; i < $scope.formdata.finance.prize.breakdown; i++) {
        temp.push(parseInt($scope.formdata.finance.prize.breakdown[i].amount));
      }
      $scope.formdata.finance.prize.breakdown = temp;
      //    Radio button can't take boolean values as models.
      if ($scope.formdata.team == "false") {
        $scope.formdata.team = false;
      } else {
        $scope.formdata.team = true;
      }

      //  check for duplicates in collaboration
      if ($scope.formdata.event.org.hasOwnProperty('coll')) {
        if (dup()) {
          return
        }
      }

      if ($scope.org == "Individual") {
        formdata.event.org = ['Individual'];
      }

      $scope.hideAlert = false;
      $scope.alertMessage = "Submitting Form ...";

      var data = {
        "coordinators": $scope.formdata.coordinators,
        "faculty": $scope.formdata.faculty,
        "event": {
          "name": $scope.formdata.event.name,
          "event_type": $scope.formdata.event.type,
          "org": $scope.formdata.event.org,
          "summary": $scope.formdata.event.summary,
          "description": $scope.formdata.event.description,
        },
        "finance": {
          "fees": $scope.formdata.finance.fees,
          "prize": {
            "total": $scope.formdata.finance.prize.total,
            "breakdown": $scope.formdata.finance.prize.breakdown
          },
          "sponsorship": {
            "total": $scope.formdata.finance.sponsorship.total,
            "breakdown": $scope.formdata.finance.sponsorship.breakdown
          },
          "income": $scope.formdata.finance.income,
          "budget": {
            "mementos": {
              "units": $scope.formdata.finance.budget.mementos.units,
              "cost": $scope.formdata.finance.budget.mementos.cost
            },
            "purchase": $scope.formdata.finance.budget.purchase,
            "tags": {
              "units": $scope.formdata.finance.budget.tags.units,
              "cost": $scope.formdata.finance.budget.tags.cost
            },
            "certificates": {
              "coordinator": $scope.formdata.finance.budget.certificates.coordinator,
              "participant": $scope.formdata.finance.budget.certificates.participant,
              "winner": $scope.formdata.finance.budget.certificates.winner,
              "total": $scope.formdata.finance.budget.certificates.total,
              "cost": $scope.formdata.finance.budget.certificates.cost
            },
            "travel": $scope.formdata.finance.budget.travel,
            "food": $scope.formdata.finance.budget.food,
            "stay": $scope.formdata.finance.budget.stay
          },
          "expenditure": $scope.formdata.finance.expenditure,
          "profit": $scope.formdata.finance.profit
        },
        "guest": $scope.formdata.guest,
        "team": $scope.formdata.team,
      };
      $http.post("/api/event/", data).then(
        function(response) {
          // Success
          console.log("Success");
          console.log(JSON.stringify(response));


          $scope.formdata = {};
          $scope.eventsForm.$setPristine();
          $scope.eventsForm.$setUntouched();
          $scope.org = {};
          init();
        },
        function(response) {
          // Faliure
          console.log("Faliure");
          console.log(JSON.stringify(response));
          toast("An error occured.", 7000);
        });
    }
  });
