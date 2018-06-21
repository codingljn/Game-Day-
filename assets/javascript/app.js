$(document).ready(function () {

    var datesArray = [];
    length = 2;

    var date = $("#datepicker").datepicker();

    $("#datepicker").change(function () {
        $("#scheduleTable td").remove();

        var gameDates = $("#datepicker").val();

        var d = new Date(gameDates);


        for (i = 0; i <= length; i++) {
            d.setDate(d.getDate() + 1);
            var gameDate = d.getDate();
            var gameMonth = d.getMonth() + 1;
            if (gameDate < 10) {
                gameDate = '0' + gameDate;
            }
            if (gameMonth < 10) {
                gameMonth = '0' + gameMonth;
            }
            var gameYear = d.getFullYear();
            var gameDates = gameYear + "" + gameMonth + "" + gameDate;
            datesArray.push(gameDates);
        }



        for (i = 0; i < datesArray.length; i++) {
            $.ajax({
                url: "https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/daily_game_schedule.json?fordate=" + datesArray[i],
                method: "GET",
                dataType: 'json',
                headers: {
                    "Authorization": "Basic " + btoa("frankie710" + ":" + "casebootcampproject1")
                }
            })
                .then(function (response) {
                    var results = response.dailygameschedule;
                    //console.log(results);
                    for (i = 0; i < results.gameentry.length; i++) {
                        var MLBawayteam = results.gameentry[i].awayTeam.Abbreviation;
                        var MLBhometeam = results.gameentry[i].homeTeam.Abbreviation;
                        var MLBlocation = results.gameentry[i].location;
                        var MLBtime = results.gameentry[i].time;
                        var MLBdate = results.gameentry[i].date;
                        //console.log(MLBawayteam);
                        //console.log(MLBhometeam);
                        //console.log(MLBlocation);
                        //console.log(MLBdate);
                        //console.log(MLBtime);
                        $('tbody.gameInformation').append("<tr><td>" + MLBdate + "</td><td>" + MLBtime + "</td><td>" + MLBawayteam + "</td><td>" + MLBhometeam + "</td><td>" + MLBlocation + "</td></tr>");


                        //gameDayInfo.push({ "away": MLBawayteam, "home": MLBhometeam, "local": MLBlocation, "gameTime": MLBtime });
                        //rows += gameDayInfo[i] + "</td><td>"
                        //
                    }
                });
        }

        datesArray = [];

    });

    function convertDate(x) {
        var p = x.split("-");
        return +(parseInt(p[2]) + (parseInt(p[1]) * 1000) + parseInt(p[0]));
    }

    //function convertTime(x) {
        //var p = x.split(":");
        //return +(p[1] + p[0] * 1000);
    //}

    function sortByDate() {
        var tbody = document.querySelector("#scheduleTable tbody");

        var rows = [].slice.call(tbody.querySelectorAll("#scheduleTable tr"));

        rows.sort(function (a, b) {
            return convertDate(a.cells[0].innerHTML) - convertDate(b.cells[0].innerHTML);
        });

        rows.forEach(function (v) {
            $("#scheduleTable tbody").append(v);
        });
    }

    //function sortByTime() {
        //var tbody = document.querySelector("#scheduleTable tbody");

        //var rows = [].slice.call(tbody.querySelectorAll("#scheduleTable tr"));

        //rows.sort(function (a, b) {
            //return convertTime(a.cells[1].innerHTML) - convertTime(b.cells[1].innerHTML);
        //});

        //rows.forEach(function (v) {
            //$("#scheduleTable tbody").append(v);
        //});
    //}

    $("#gameDates").on("click", sortByDate);
    //$("#gameTimes").on("click", sortByDate);

    function resetFunct(){
        querySelectorAll("#scheduleTable tr").remove();
    }



});
