document.addEventListener("DOMContentLoaded", function () {
    // Function to move container to center and display charts
    function moveToCenter(element, charts) {
        resetAllTopics(); // Reset all other topics first

        element.style.position = "fixed";
        element.style.top = "50%";
        element.style.left = "50%";
        element.style.transform = "translate(-50%, -50%) scale(1.1)";
        element.style.zIndex = "100";
        element.style.width = "60%";
        element.style.background = "rgba(255, 255, 255, 0.9)";
        element.style.color = "black";
        element.style.padding = "20px";
        element.style.borderRadius = "10px";
        element.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
        element.style.textAlign = "center";

        // Clear previous charts and add new ones
        element.innerHTML += '<div class="chart-container"></div>';
        let chartContainer = element.querySelector(".chart-container");
        chartContainer.innerHTML = charts.map(id => `<canvas id="${id}"></canvas>`).join("");

        // Generate charts
        createCharts(charts);
    }

    // Function to reset all topics when clicking outside
    function resetAllTopics() {
        document.querySelectorAll(".topic").forEach(topic => {
            topic.style.position = "static";
            topic.style.transform = "none";
            topic.style.zIndex = "1";
            topic.style.width = "30%";
            topic.style.background = "rgba(255, 255, 255, 0.2)";
            topic.style.color = "white";
            topic.style.padding = "20px";
            topic.style.borderRadius = "10px";
            topic.style.boxShadow = "none";
            let chartContainer = topic.querySelector(".chart-container");
            if (chartContainer) chartContainer.remove();
        });
    }

    // Event listeners for each container
    document.getElementById("licensed-driver").addEventListener("click", function () {
        moveToCenter(this, ["genderChart", "topStatesChart", "ageChart"]);
    });

    document.getElementById("vehicle-registration").addEventListener("click", function () {
        moveToCenter(this, ["autoChart", "busesTrucksChart", "motorcycleChart"]);
    });

    document.getElementById("traffic-violation").addEventListener("click", function () {
        moveToCenter(this, ["subAgenciesChart", "violationsChart", "vehicleTypesChart"]);
    });

    // Create charts function
    function createCharts(chartIds) {
        const chartConfigs = {
            "genderChart": ["/gender_distribution", "pie", "Gender Distribution", ["#FF6384", "#36A2EB"]],
            "topStatesChart": ["/top10_states", "bar", "Top 10 States", "#FF6384"],
            "ageChart": ["/age_distribution", "line", "Age Distribution", "#36A2EB"],
            "autoChart": ["/top10_autos", "bar", "Top 10 Auto Registrations", "#FF9F40"],
            "busesTrucksChart": ["/total_buses_trucks_2010_2020", "doughnut", "Buses vs Trucks", ["#FFCD56", "#4BC0C0"]],
            "motorcycleChart": ["/top10_motorcycles_2020", "bar", "Top 10 Motorcycle Registrations", "#9966FF"],
            "subAgenciesChart": ["/top5_sub_agencies", "bar", "Top 5 Sub Agencies", "#FF6384"],
            "violationsChart": ["/top10_common_violations", "bar", "Top 10 Violations", "#4BC0C0"],
            "vehicleTypesChart": ["/top5_vehicle_types_brands", "doughnut", "Top 10 Vehicle Types", ["#FF6384", "#36A2EB", "#FFCD56", "#4BC0C0", "#9966FF"]]
        };
        
        chartIds.forEach(id => {
            if (chartConfigs[id]) {
                let [url, type, label, colors] = chartConfigs[id];
                createChart(id, url, type, label, colors);
            }
        });
    }

    // Function to create individual charts
    function createChart(canvasId, url, chartType, labelTitle, backgroundColor) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById(canvasId).outerHTML = `<p class="text-danger">${data.error}</p>`;
                    return;
                }
                new Chart(document.getElementById(canvasId), {
                    type: chartType,
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: labelTitle,
                            data: data.values,
                            backgroundColor: backgroundColor
                        }]
                    }
                });
            });
    }

    // Reset topics when clicking outside
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".topic")) {
            resetAllTopics();
        }
    });
});