const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<!-- Project 1: NavTruck -->[\s\S]*?(?=<h3>Service Cue)/;

const replaceStr = `<!-- Project 1: NavTruck -->
        <div class="new-port-item">
          <div class="new-port-content">
            <div class="new-port-logo">
              <img src="images/port-1-logo.png" alt="nav truck">
            </div>
            <h3>NavTruck &mdash; Smart Co-Pilot for Drivers</h3>
            <p>Safer, compliant, and optimised routes for every truck journey. Real-time hazard alerts, weigh station data, and driver-hours compliance built in.</p>
            <a href="#" class="new-port-btn">Explore NavTruck Story</a>
          </div>
          <div class="new-port-image custom-port-mockup">
            <img src="images/portfolia/app-features.png" alt="NavTruck App Main" class="mockup-base">
            <img src="images/portfolia/km-info.png" alt="NavTruck Info" class="mockup-float-1">
            <img src="images/portfolia/next-turn.png" alt="NavTruck Turn" class="mockup-float-2">
          </div>
        </div>

        <!-- Project 2: Service Cue -->
        <div class="new-port-item reverse">
          <div class="new-port-content">
            <div class="new-port-logo">
              <img src="images/port-2-logo.png" alt="service cue">
            </div>
            `;

if (regex.test(html)) {
  html = html.replace(regex, replaceStr);
  fs.writeFileSync('index.html', html);
  console.log("Fixed successfully");
} else {
  console.log("Regex not found.");
}
