var decimal_places = 2;

$(document).ready(function() {
    handle_simulate();
    handle_restart();
});


function validate_form() {
    var simulated_time = parseFloat($("#simulated_time").val()),
        max_clients = parseFloat($("#max_clients").val()),
        arrivals = [parseFloat($("#arrival_1").val()), parseFloat($("#arrival_2").val()), parseFloat($("#arrival_3").val())],
        services = [parseFloat($("#service_1").val()), parseFloat($("#service_2").val()), parseFloat($("#service_3").val())];

    var check = 0,
        total = 8;

    if(Number.isNaN(simulated_time)) {
        $("#simulated_time").addClass("error");
    } else {
        $("#simulated_time").removeClass("error");
        check++;
    }

    if(Number.isNaN(max_clients)) {
        $("#max_clients").addClass("error");
    } else {
        $("#max_clients").removeClass("error");
        check++;
    }

    for(var i=0; i<arrivals.length; i++) {
        if(Number.isNaN(arrivals[i])) {
            $("#arrival_" + (i+1)).addClass("error");
        } else {
            $("#arrival_" + (i+1)).removeClass("error");
            check++;
        }
    }

    for(var i=0; i<services.length; i++) {
        if(Number.isNaN(services[i])) {
            $("#service_" + (i+1)).addClass("error");
        } else {
            $("#service_" + (i+1)).removeClass("error");
            check++;
        }
    }

    return check == total;
}


function format(number, dp) {
    return !isNaN(+number)? ((+number).toFixed(dp || decimal_places) * 1): number;
}


function handle_simulate() {
    $("#simulate").on("click", function(e) {
        e.preventDefault();

        var check = validate_form();

        if(check) {
            $(".results").show();

            var form = $("#main-form"),
                simulated_time = parseFloat($("#simulated_time").val()),
                max_clients = parseFloat($("#max_clients").val()),
                arrivals = [parseFloat($("#arrival_1").val()), parseFloat($("#arrival_2").val()), parseFloat($("#arrival_3").val())],
                services = [parseFloat($("#service_1").val()), parseFloat($("#service_2").val()), parseFloat($("#service_3").val())],
                results = {};

            results.arrivals = {
                "A": format(simulated_time / arrivals[0]),
                "B": format(simulated_time / arrivals[1]),
                "C": format(simulated_time / arrivals[2])
            };

            results.services = {
                "A": format(simulated_time / services[0]),
                "B": format(simulated_time / services[1]),
                "C": format(simulated_time / services[2])
            };

            results.average_cars = {
                "A": format(results.arrivals["A"] / (results.services["A"] - results.arrivals["A"])),
                "B": format(results.arrivals["B"] / (results.services["B"] - results.arrivals["B"])),
                "C": format(results.arrivals["C"] / (results.services["C"] - results.arrivals["C"]))
            };

            results.spent_time = {
                "A": format(1 / (results.services["A"] - results.arrivals["A"])),
                "B": format(1 / (results.services["B"] - results.arrivals["B"])),
                "C": format(1 / (results.services["C"] - results.arrivals["C"]))
            };

            results.server_occupation = {
                "A": format(results.arrivals["A"] / results.services["A"]),
                "B": format(results.arrivals["B"] / results.services["B"]),
                "C": format(results.arrivals["C"] / results.services["C"])
            };

            results.clients = new Array(max_clients);
            for(var i=0; i<max_clients; i++) {
                results.clients[i] = {
                    "N": i,
                    "P": "P(" + i + ")",
                    "A": format(((1 - (results.arrivals["A"] / results.services["A"])) * Math.pow(results.arrivals["A"] / results.services["A"], i))),
                    "B": format(((1 - (results.arrivals["B"] / results.services["B"])) * Math.pow(results.arrivals["B"] / results.services["B"], i))),
                    "C": format(((1 - (results.arrivals["C"] / results.services["C"])) * Math.pow(results.arrivals["C"] / results.services["C"], i)))
                };
            }

            
            // Show results
            $(".arrivals_services").find("tbody tr td").not(".keep").remove();
            for(var i=0; i<3; i++) {
                var letter = String.fromCharCode(65 + i);
                $(".arrivals_services").find("tbody tr").first().append("<td>" + results.arrivals[letter] + "</td>");
            }
            for(var i=0; i<3; i++) {
                var letter = String.fromCharCode(65 + i);
                $(".arrivals_services").find("tbody tr").last().append("<td>" + results.services[letter] + "</td>");
            }

            $(".plus_data").find("tbody tr td").not(".keep").remove();
            for(var i=0; i<3; i++) {
                var letter = String.fromCharCode(65 + i);
                $(".plus_data").find("tbody tr").first().append("<td>" + results.average_cars[letter] + "</td>");
            }
            for(var i=0; i<3; i++) {
                var letter = String.fromCharCode(65 + i);
                $(".plus_data").find("tbody tr").eq(1).append("<td>" + results.spent_time[letter] + "</td>");
            }
            for(var i=0; i<3; i++) {
                var letter = String.fromCharCode(65 + i);
                $(".plus_data").find("tbody tr").last().append("<td>" + results.server_occupation[letter] + "</td>");
            }

            $("table.max_clients tbody").empty();
            for(i=0; i<max_clients; i++) {
                var tr = "<tr>";
                        tr += "<td>" + results.clients[i]["N"] + "</td>";
                        tr += "<td>" + results.clients[i]["P"] + "</td>";
                        tr += "<td>" + results.clients[i]["A"] + "</td>";
                        tr += "<td>" + results.clients[i]["B"] + "</td>";
                        tr += "<td>" + results.clients[i]["C"] + "</td>";
                    tr += "</tr>";

                $("table.max_clients tbody").append(tr);
            }

            setTimeout(function() {
                $(".results").css({
                    opacity: "1",
                    visibility: "visible"
                });

                $("html, body").animate({ scrollTop: $(document).height() }, 2000);
            }, 500);
        }
    });
}


function handle_restart() {
    $(".buttons #restart").on("click", function(e) {
        e.preventDefault();

        $("#main-form").find("input").val("");

        $(".results").css({
            opacity: "0",
            visibility: "hidden"
        });

        $("html, body").animate({ scrollTop: 0 }, 1000);

        setTimeout(function() {
            $(".arrivals_services").find("tbody tr td").not(".keep").remove();
            $(".plus_data").find("tbody tr td").not(".keep").remove();
            $("table.max_clients tbody").empty();

            $(".results").hide();
        }, 2000);
    });
}